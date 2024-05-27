from typing import Any, List, Tuple
from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps
from app.core.config import settings

from fastapi.templating import Jinja2Templates


router = APIRouter()
templates = Jinja2Templates(directory="app/templates")


# create message from non-user
@router.post("", response_model=schemas.Message)
def create_message(
    *,
    db: Session = Depends(deps.get_db),
    message_in: schemas.MessageCreate,
) -> models.Message:
    message = crud.message.create(db, obj_in=message_in)
    return message

# get all messages
@router.get("", response_model=Tuple[List[schemas.Message], int])
def get_messages(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 50,
) -> Tuple[List[models.Message], int]:
    """
    Retrieve all messages.
    """
    messages = crud.message.get_multi(db, skip=skip, limit=limit)
    total_count = db.query(models.Message).count() # Total count of emails
    return messages, total_count

# get message
@router.get("/{message_id}", response_model=schemas.Message)
def get_message(
    *,
    db: Session = Depends(deps.get_db),
    message_id: int,
) -> models.Message:
    message = crud.message.get(db, id=message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    return message

# update message is open
@router.put("/is_open/{message_id}", response_model=schemas.Message)
def update_isOpen(
    *,
    db: Session = Depends(deps.get_db),
    message_id: int,
) -> models.Message:
    """
    Update is open.
    """
    message = crud.message.get(db, id=message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    message_update_data = {"is_open": True}
    message_update = crud.message.update(db, db_obj=message, obj_in=message_update_data)
    
    return message_update

# update message is favorited
@router.put("/is_favorite/{message_id}", response_model=schemas.Message)
def update_isFavorite(
    *,
    db: Session = Depends(deps.get_db),
    message_id: int,
) -> models.Message:
    """
    Update is open.
    """
    message = crud.message.get(db, id=message_id)
    if not message:
        raise HTTPException(status_code=404, detail="Message not found")
    
    if message.is_favorite:
        status = False
    else:
        status = True

    message_update_data = {"is_favorite": status}
    message_update = crud.message.update(db, db_obj=message, obj_in=message_update_data)
    
    return message_update

# delete message by id (admin)
@router.delete("/{message_id}", response_model=schemas.Message)
def delete_user(
    *,
    db: Session = Depends(deps.get_db),
    message_id: int,
    current_user: models.User = Depends(deps.get_current_active_superuser),
) -> Any:
    message = crud.user.get(db, id=message_id)
    if not message:
        raise HTTPException(
            status_code=404,
            detail="Message not found",
        )

    crud.message.remove(db, id=message_id)
    return message
