from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.db.session import SessionLocal
from app import models, crud
import logging

logger = logging.getLogger(__name__)

def delete_message_scheduler() -> None:
    db: Session = SessionLocal()
    try:
        # Calculate the date one month ago
        one_month_ago = datetime.now() - timedelta(days=31, microseconds=0)
        
        # Retrieve messages older than one month
        messages_to_delete = db.query(models.Message).filter(models.Message.created_at <= one_month_ago).all()
        
        # Extract message IDs
        message_ids = [message.id for message in messages_to_delete]
        
        # Delete messages
        crud.message.delete_multi_messages(db=db, ids=message_ids)
        logger.info(f"Deleted {len(message_ids)} messages older than one month.")
        
    except Exception as e:
        logger.error(f"Error deleting messages: {e}")
    finally:
        db.close()
