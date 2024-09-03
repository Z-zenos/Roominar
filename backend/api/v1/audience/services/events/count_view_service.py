from sqlmodel import Session

from backend.models.event import Event
from backend.utils.database import save


def count_view(db: Session, event_id: int):
    try:
        event = db.get(Event, event_id)
        event.view_number += 1
        save(db, event)
        return event.view_number

    except Exception as e:
        db.rollback()
        raise e
