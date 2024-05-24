from typing import Any, Dict, Optional, Union

from sqlalchemy.orm import Session

from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase
from app.models.message import Message
from app.schemas.message import MessageCreate, MessageUpdate
from fastapi.encoders import jsonable_encoder
from fastapi import HTTPException

from app import crud


class CRUDUser(CRUDBase[Message, MessageCreate, MessageUpdate]):
    pass

message = CRUDUser(Message)