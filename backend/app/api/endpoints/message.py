from typing import Any, List, Tuple, Optional
from math import ceil
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

# get all messages descending order (lastest to last)
@router.get("", response_model=Tuple[List[schemas.Message], int])
def get_desc_messages(
    db: Session = Depends(deps.get_db),
    page: int = 1,  # default to the first page
    items_per_page: int = 50,  # default number of items per page
    current_user: models.User = Depends(deps.get_current_user),
) -> Tuple[List[models.Message], int]:
    """
    Retrieve paginated messages in descending order.
    """
    # Calculate skip value based on page number and items per page
    skip = (page - 1) * items_per_page
    
    # Fetch messages for the current page
    messages = crud.message.get_multi_sorted(db, skip=skip, limit=items_per_page)
    
    # Calculate total count of messages
    total_count = db.query(models.Message).count()

    # Calculate total number of pages
    total_pages = ceil(total_count / items_per_page)

    # Check if current page is greater than total pages
    if page > total_pages:
        # Return an empty list of messages and total count as 0
        return [], total_count
    
    return messages, total_count

# get message by title and email
@router.get("/search", response_model=Tuple[List[schemas.Message], int])
def search_messages(
    *,
    db: Session = Depends(deps.get_db),
    search: Optional[str] = None,
    page: int = 1,  # default to the first page
    items_per_page: int = 50,  # default number of items per page
    current_user: models.User = Depends(deps.get_current_user),
) -> Tuple[List[schemas.Message], int]:
    
    # Calculate skip value based on page number and items per page
    skip = (page - 1) * items_per_page

    # Fetch filtered and sorted messages with pagination
    messages = crud.message.get_multi_sorted_search(db, skip=skip, limit=items_per_page, search=search)

    # Calculate total count of messages that match the search criteria
    total_count = crud.message.count_filtered_messages(db, search=search)

    # Calculate total number of pages
    total_pages = ceil(total_count / items_per_page)

    # Check if current page is greater than total pages
    if page > total_pages:
        # Return an empty list of messages and total count as 0
        return [], total_count
    
    return messages, total_count
    

# get message
@router.get("/{message_id}", response_model=schemas.Message)
def get_message(
    *,
    db: Session = Depends(deps.get_db),
    message_id: int,
    current_user: models.User = Depends(deps.get_current_user),
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

# Delete messages by IDs
@router.delete("", response_model=List[schemas.Message])
def delete_multi_messages(
    *,
    db: Session = Depends(deps.get_db),
    message_ids: schemas.DeleteMessagesRequest,
) -> List[models.Message]:
    deleted_messages = crud.message.delete_multi_messages(db=db, ids=message_ids.message_ids)
    if not deleted_messages:
        raise HTTPException(
            status_code=404,
            detail="No messages found for deletion",
        )
    return deleted_messages