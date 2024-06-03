from typing import Any, Dict, Optional, Union, List, Tuple
from sqlalchemy.exc import IntegrityError

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.message import Message
from app.schemas.message import MessageCreate, MessageUpdate
from fastapi.encoders import jsonable_encoder
from fastapi import HTTPException

from app import crud


class CRUDUser(CRUDBase[Message, MessageCreate, MessageUpdate]):
    def get_multi_messages(self, db: Session, *, skip: int = 0, limit: int = 50
        ) -> List[Message]:
        return db.query(self.model).offset(skip).limit(limit).all()
        
    def get_multi_sorted(self, db: Session, *, skip: int = 0, limit: int = 50
        ) -> List[Message]:
        return db.query(self.model).order_by(self.model.created_at.desc()).offset(skip).limit(limit).all()
    
    def apply_filters(self, query, title: Optional[str] = None, name: Optional[str] = None, email: Optional[str] = None):
        if title:
            query = query.filter(Message.title.ilike(f"%{title}%"))
        if name:
            query = query.filter(Message.name.ilike(f"%{name}%"))
        if email:
            query = query.filter(Message.email.ilike(f"%{email}%"))
        return query

    def get_multi_sorted_search(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 50,
        title: Optional[str] = None,
        name: Optional[str] = None,
        email: Optional[str] = None
    ) -> List[Message]:
        query = db.query(Message)
        query = self.apply_filters(query, title, name, email)
        messages = query.order_by(Message.created_at.desc()).offset(skip).limit(limit).all()
        return messages

    def count_filtered_messages(
        self,
        db: Session,
        *,
        title: Optional[str] = None,
        name: Optional[str] = None,
        email: Optional[str] = None
    ) -> int:
        query = db.query(Message)
        query = self.apply_filters(query, title, name, email)
        total_count = query.count()
        return total_count

    def delete_multi_messages(self, db: Session, *, ids: List[int]):
        # fetch relevant messages using in_
        messages = db.query(self.model).filter(self.model.id.in_(ids)).all()

        if not messages:
            return []

        # delete messages in bulk
        for message in messages:
            db.delete(message)
        db.commit()

        return messages

message = CRUDUser(Message)