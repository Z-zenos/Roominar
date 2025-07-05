from sqlmodel import Session, and_, case, exists, func, select, update

from backend.core.constants import (
    FollowEntityCode,
    RoleCode,
    TransactionStatusCode,
    UserActionTypeCode,
)
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models import Bookmark, Event, Organization, Ticket, User
from backend.models.follow import Follow
from backend.models.ticket_inventory import TicketInventory
from backend.models.transaction_item import TransactionItem
from backend.models.user_action import UserAction
from backend.services.surveys.get_survey_detail_service import get_survey_detail
from backend.services.tags.get_event_tags_service import get_event_tags
from backend.utils.database import fetch_one


async def get_event_detail(db: Session, user: User, slug: str):
    try:
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
                Organization.slug.label("organization_slug"),
                OrganizationEventFollowCount.c.organization_event_number,
                OrganizationEventFollowCount.c.organization_follower_number,
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
        )

        if user:
            query = query.add_columns(
                case(
                    (
                        user and Follow.follower_id == user.id,
                        True,
                    ),
                    else_=False,
                ).label("is_organization_followed"),
            ).outerjoin(
                Follow,
                and_(
                    Follow.following_id == Organization.id,
                    Follow.follower_id == (user.id if user else None),
                ),
            )

        event = db.exec(query).mappings().one_or_none()
        event = dict(event)

        event.update(
            {
                "sold_tickets_number": event["sold_ticket_count"],
                "survey": (
                    get_survey_detail(db, event["survey_id"])
                    if event["survey_id"]
                    else None
                ),
                "tickets": _get_tickets(db, user, event["id"]),
                "organization_contact_url": event["organization_contact_url"],
                "tags": get_event_tags(db, event["id"]),
            }
        )

        if user and user.role_code == RoleCode.AUDIENCE:
            is_bookmarked = db.exec(
                select(
                    exists().where(
                        Bookmark.user_id == user.id,
                        Bookmark.event_id == event["id"],
                    )
                )
            ).one_or_none()
            event["is_bookmarked"] = is_bookmarked

            db.exec(
                update(Event)
                .where(Event.id == event["id"])
                .values(view_count=event["view_count"] + 1)
            )
            db.add(
                UserAction(
                    user_id=user.id,
                    event_id=event["id"],
                    organization_id=event["organization_id"],
                    action_type=UserActionTypeCode.VIEW,
                )
            )
            db.commit()
            event["view_count"] += 1
        return event

    except Exception as e:
        db.rollback()
        raise e


def _get_tickets(db: Session, user: User, event_id: int):
    query = (
        select(
            Ticket.id,
            Ticket.name,
            TicketInventory.available_quantity,
            TicketInventory.sold_quantity,
            Ticket.quantity,
            Ticket.description,
            Ticket.price,
            Ticket.expired_at,
            Ticket.type,
            Ticket.status,
            Ticket.sales_start_at,
            Ticket.sales_end_at,
            Ticket.delivery_method,
            Ticket.cancellation_policy_code,
            Ticket.cancellation_policy_extra_description,
        )
        .where(
            Ticket.event_id == event_id,
        )
        .join(TicketInventory, TicketInventory.ticket_id == Ticket.id)
        .order_by(Ticket.id)
    )

    if user:
        query = query.add_columns(
            case(
                (
                    user.id
                    and TransactionItem.status == TransactionStatusCode.CANCELED,
                    False,
                ),
                else_=True,
            ).label("purchaseble"),
        ).outerjoin(
            TransactionItem,
            and_(
                TransactionItem.ticket_id == Ticket.id,
                TransactionItem.user_id == user.id,
            ),
        )
    else:
        query = query.add_columns(
            case(
                (TicketInventory.available_quantity > 0, True),
                else_=False,
            ).label("purchaseble"),
        )

    tickets = db.exec(query).mappings().all()

    return tickets
