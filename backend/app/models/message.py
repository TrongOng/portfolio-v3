from typing import TYPE_CHECKING
from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
    func,
    DateTime,
    ForeignKey,
)
from sqlalchemy.orm import relationship
from app.db.base_class import Base


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    name = Column(String)
    email = Column(String)
    message = Column(String)
    is_open = Column(Boolean)
    is_favorite = Column(Boolean)
    created_at = Column(DateTime(timezone=True), default=func.now())
