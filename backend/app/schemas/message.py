from typing import Optional
from pydantic import BaseModel, EmailStr
from datetime import datetime


class MessageBase(BaseModel):
    title: Optional[str] = None
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    message: Optional[str] = None
    is_open: Optional[bool] = None
    is_favorite: Optional[bool] = None


class MessageCreate(BaseModel):
    title: str
    name: str
    email: EmailStr
    message: str
    is_open: bool = False
    is_favorite: bool = False


class MessageUpdate(BaseModel):
    is_open: Optional[bool] = None
    is_favorite: Optional[bool] = None


class MessageUpdateAdmin(BaseModel):
    title: Optional[str] = None
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    message: Optional[str] = None
    is_open: Optional[bool] = None
    is_favorite: Optional[bool] = None


class MessageInDBBase(MessageBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        orm_mode = True

class Message(MessageInDBBase):
    pass

