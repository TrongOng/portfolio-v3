from typing import Any, Dict, Optional, Union, List, Tuple
from sqlalchemy import or_

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

    def apply_filters(self, query, search: Optional[str] = None):
        if search:
            query = query.filter(or_(
                Message.title.ilike(f"%{search}%"),
                Message.name.ilike(f"%{search}%"),
                Message.email.ilike(f"%{search}%")
            ))
        return query

    def get_multi_sorted_search(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 50,
        search: Optional[str] = None,
    ) -> List[Message]:
        query = db.query(Message)
        query = self.apply_filters(query, search)
        messages = query.order_by(Message.created_at.desc()).offset(skip).limit(limit).all()
        return messages

    def count_filtered_messages(
        self,
        db: Session,
        *,
        search: Optional[str] = None,
    ) -> int:
        query = db.query(Message)
        query = self.apply_filters(query, search)
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