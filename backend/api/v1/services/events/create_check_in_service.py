from sqlmodel import Session

from backend.schemas.check_in import CreateCheckInRequest


def create_check_in(db: Session, event_id: int, request: CreateCheckInRequest):
    pass
