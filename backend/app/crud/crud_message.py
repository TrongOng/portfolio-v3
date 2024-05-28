from typing import Any, Dict, Optional, Union, List

from sqlalchemy.orm import Session

from app.crud.base import CRUDBase
from app.models.message import Message
from app.schemas.message import MessageCreate, MessageUpdate
from fastapi.encoders import jsonable_encoder
from fastapi import HTTPException

from app import crud


class CRUDUser(CRUDBase[Message, MessageCreate, MessageUpdate]):
    def get_multi_messages(
            self, db:Session, *, skip: int = 0, limit: int = 50
    ) -> List[Message]:
        return db.query(self.model).offset(skip).limit(limit).all()
        
    def get_multi_sorted(
        self, db: Session, *, skip: int = 0, limit: int = 50
    ) -> List[Message]:
        return db.query(self.model).order_by(self.model.created_at.desc()).offset(skip).limit(limit).all()

        

message = CRUDUser(Message)