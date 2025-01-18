from sqlmodel import Session, and_, case, exists, func, select, update

from backend.api.v1.services.surveys.get_survey_detail_service import get_survey_detail
from backend.api.v1.services.tags.get_event_tags_service import get_event_tags
from backend.core.constants import FollowEntityCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models import Bookmark, Event, Organization, Ticket, User
from backend.models.follow import Follow
from backend.models.ticket_inventory import TicketInventory
from backend.utils.database import fetch_one


async def get_event_detail(db: Session, current_user: User, slug: str):
    event = fetch_one(db, select(Event).where(Event.slug == slug))

    if not event:
        raise BadRequestException(
            ErrorCode.ERR_EVENT_NOT_FOUND, ErrorMessage.ERR_EVENT_NOT_FOUND
        )

    OrganizationEventFollowCount = (
        select(
            Organization.id,
            func.count(Event.id.distinct()).label("organization_event_number"),
            func.count(Follow.follower_id.distinct()).label(
                "organization_follower_number"
            ),
        )
        .outerjoin(Event, Event.organization_id == Organization.id)
        .outerjoin(
            Follow,
            and_(
                Follow.following_id == Organization.id,
                Follow.entity_code == FollowEntityCode.ORGANIZATION,
            ),
        )
        .where(Event.published_at.isnot(None))
        .group_by(Organization.id)
        .subquery()
    )

    SoldTicketsNumber = (
        select(
            Event.id,
            func.sum(TicketInventory.sold_quantity).label("sold_tickets_number"),
        )
        .join(TicketInventory, TicketInventory.event_id == Event.id)
        .group_by(Event.id)
        .subquery()
    )

    query = (
        select(
            *Event.__table__.columns,
            Organization.name.label("organization_name"),
            Organization.address.label("organization_address"),
            Organization.hp_url.label("organization_url"),
            Organization.contact_email.label("organization_contact_email"),
            Organization.contact_url.label("organization_contact_url"),
            Organization.avatar_url.label("organization_avatar_url"),
            Organization.description.label("organization_description"),
            OrganizationEventFollowCount.c.organization_event_number,
            OrganizationEventFollowCount.c.organization_follower_number,
            SoldTicketsNumber.c.sold_tickets_number,
        )
        .where(
            Event.slug == slug,
            Event.published_at.isnot(None),
        )
        .join(Organization, Event.organization_id == Organization.id)
        .join(
            OrganizationEventFollowCount,
            OrganizationEventFollowCount.c.id == Organization.id,
        )
        .join(SoldTicketsNumber, SoldTicketsNumber.c.id == Event.id)
    )

    if current_user:
        query = query.add_columns(
            case(
                (
                    current_user and Follow.follower_id == current_user.id,
                    True,
                ),
                else_=False,
            ).label("is_organization_followed"),
        ).outerjoin(
            Follow,
            and_(
                Follow.following_id == Organization.id,
                Follow.follower_id == (current_user.id if current_user else None),
            ),
        )

    event = db.exec(query).mappings().one_or_none()
    event = dict(event)

    event.update(
        {
            "survey": (
                get_survey_detail(db, event["survey_id"])
                if event["survey_id"]
                else None
            ),
            "tickets": _get_tickets(db, event["id"]),
            "organization_contact_url": event["organization_contact_url"],
            "tags": get_event_tags(db, event["id"]),
        }
    )

    if current_user:
        is_bookmarked = db.exec(
            select(
                exists().where(
                    Bookmark.user_id == current_user.id,
                    Bookmark.event_id == event["id"],
                )
            )
        ).first()
        event["is_bookmarked"] = is_bookmarked

    try:
        db.exec(
            update(Event)
            .where(Event.id == event["id"])
            .values(view_number=event["view_number"] + 1)
        )
        db.commit()
        event["view_number"] += 1
        return event

    except Exception as e:
        db.rollback()
        raise e


def _get_tickets(db: Session, event_id: int):
    tickets = (
        db.exec(
            select(
                Ticket.id,
                Ticket.name,
                TicketInventory.available_quantity,
                Ticket.quantity,
                Ticket.description,
                Ticket.price,
                Ticket.expired_at,
                Ticket.type,
                Ticket.status,
                Ticket.sales_start_at,
                Ticket.sales_end_at,
                Ticket.delivery_method,
                Ticket.is_refundable,
            )
            .where(
                Ticket.event_id == event_id,
            )
            .join(TicketInventory, TicketInventory.ticket_id == Ticket.id)
            .order_by(Ticket.id)
        )
        .mappings()
        .all()
    )

    return tickets
