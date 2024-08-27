from sqlmodel import Session, and_, exists, func, select

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models import Bookmark, Event, EventTag, Organization, Tag, User
from backend.models.application import Application
from backend.models.ticket import Ticket


def get_event_detail(db: Session, current_user: User | None, slug: str):
    result = db.exec(
        select(
            Event,
            Organization.name,
            Organization.address,
            Organization.hp_url,
            Organization.contact_email,
            Organization.contact_url,
        )
        .where(Event.slug == slug, Event.public_at.isnot(None))
        .join(Organization, Event.organization_id == Organization.id)
    ).first()

    if not result:
        raise BadRequestException(
            ErrorCode.ERR_EVENT_NOT_FOUND, ErrorMessage.ERR_EVENT_NOT_FOUND
        )

    event_id = result[0].id

    (
        event,
        organization_name,
        organization_address,
        organization_hp_url,
        organization_contact_email,
        organization_contact_url,
    ) = result
    event_detail = event.__dict__

    event_detail.update(
        {
            "organization_name": organization_name,
            "organization_address": organization_address,
            "organization_url": organization_hp_url,
            "organization_contact_email": organization_contact_email,
            "tickets": _get_tickets(db, event_id),
            "organization_contact_url": organization_contact_url,
            "applied_number": _get_applied_event(db, event_id),
            "tags": _get_event_tags(db, event_id),
        }
    )

    if current_user:
        bookmarks = db.exec(
            select(
                exists().where(
                    Bookmark.user_id == current_user.id,
                    Bookmark.event_id == event_id,
                )
            )
        ).first()
        event_detail["is_bookmark"] = bookmarks
    return event_detail


def _get_tickets(db: Session, event_id: int):
    tickets = (
        db.exec(
            select(
                Ticket.id,
                Ticket.name,
                func.greatest((Ticket.quantity - func.count(Application.id)), 0).label(
                    "remain"
                ),
            )
            .outerjoin(
                Application,
                and_(
                    Application.ticket_id == Ticket.id, Application.deleted_at.is_(None)
                ),
            )
            .where(Ticket.event_id == event_id)
            .order_by(Ticket.id)
            .group_by(Ticket.id)
        )
        .mappings()
        .all()
    )

    return tickets


def _get_applied_event(db: Session, event_id: int):
    applied_number = db.scalar(
        select(func.count()).where(
            Application.event_id == event_id, Application.deleted_at.is_(None)
        )
    )
    return applied_number


def _get_event_tags(db: Session, event_id: int):
    event_tags = db.exec(
        select(
            Tag.id,
            Tag.image_url,
            Tag.name,
        )
        .join(EventTag, Tag.id == EventTag.tag_id)
        .where(EventTag.event_id == event_id)
    ).all()

    return event_tags
