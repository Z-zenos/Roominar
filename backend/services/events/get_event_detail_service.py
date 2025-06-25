from sqlmodel import Session, and_, case, func, select

from backend.core.constants import EventStatusCode, TagAssociationEntityCode
from backend.core.simple_cache import CacheKeys, cached_response
from backend.models.bookmark import Bookmark
from backend.models.event import Event
from backend.models.organization import Organization
from backend.models.speaker import Speaker
from backend.models.tag import Tag
from backend.models.tag_association import TagAssociation
from backend.models.target import Target
from backend.models.ticket import Ticket
from backend.models.ticket_inventory import TicketInventory
from backend.models.user import User
from backend.utils.database import transaction_scope


@cached_response(
    cache_key=CacheKeys.EVENTS_DETAIL,
    ttl=300,  # 5 minutes
    include_user=True,
    include_params=True,
)
def get_event_detail(db: Session, user: User | None, slug: str):
    """Get detailed event information by slug"""

    with transaction_scope() as session:
        # Event tags subquery
        EventTag = (
            select(
                Event.id.label("event_id"),
                func.json_agg(
                    func.json_build_object(
                        "id", Tag.id, "name", Tag.name, "image_url", Tag.image_url
                    )
                ).label("tags"),
            )
            .select_from(Event)
            .join(TagAssociation, Event.id == TagAssociation.entity_id)
            .join(Tag, Tag.id == TagAssociation.tag_id)
            .where(TagAssociation.entity_code == TagAssociationEntityCode.EVENT)
            .group_by(Event.id)
            .cte()
        )

        # Speakers subquery
        EventSpeaker = (
            select(
                Event.id.label("event_id"),
                func.json_agg(
                    func.json_build_object(
                        "id",
                        Speaker.id,
                        "name",
                        Speaker.name,
                        "bio",
                        Speaker.bio,
                        "avatar_url",
                        Speaker.avatar_url,
                        "position",
                        Speaker.position,
                        "organization_name",
                        Speaker.organization_name,
                    )
                ).label("speakers"),
            )
            .select_from(Event)
            .join(Speaker, Event.id == Speaker.event_id)
            .group_by(Event.id)
            .cte()
        )

        # Tickets subquery
        EventTicket = (
            select(
                Event.id.label("event_id"),
                func.json_agg(
                    func.json_build_object(
                        "id",
                        Ticket.id,
                        "name",
                        Ticket.name,
                        "price",
                        Ticket.price,
                        "total_quantity",
                        TicketInventory.total_quantity,
                        "sold_quantity",
                        TicketInventory.sold_quantity,
                        "check_in_start_at",
                        Ticket.check_in_start_at,
                        "check_in_end_at",
                        Ticket.check_in_end_at,
                        "sale_start_at",
                        Ticket.sale_start_at,
                        "sale_end_at",
                        Ticket.sale_end_at,
                    )
                ).label("tickets"),
            )
            .select_from(Event)
            .join(Ticket, Event.id == Ticket.event_id)
            .join(TicketInventory, Ticket.id == TicketInventory.ticket_id)
            .group_by(Event.id)
            .cte()
        )

        # Event sold tickets subquery
        SoldTicketsNumber = (
            select(
                TicketInventory.event_id,
                func.sum(TicketInventory.sold_quantity).label("sold_tickets_number"),
            )
            .select_from(TicketInventory)
            .group_by(TicketInventory.event_id)
            .cte()
        )

        # Bookmark count subquery
        BookmarkCount = (
            select(
                Bookmark.event_id,
                func.count(Bookmark.id).label("bookmark_count"),
            )
            .select_from(Bookmark)
            .group_by(Bookmark.event_id)
            .cte()
        )

        # Main query
        query = (
            select(
                Event.__table__.columns,
                Organization.name.label("organization_name"),
                Organization.logo_url.label("organization_logo_url"),
                Organization.slug.label("organization_slug"),
                Target.title.label("target_title"),
                Target.job_type_names.label("target_job_type_names"),
                Target.industry_names.label("target_industry_names"),
                case(
                    (
                        EventTag.c.tags.isnot(None),
                        EventTag.c.tags,
                    ),
                    else_=func.json_build_array(),
                ).label("tags"),
                case(
                    (
                        EventSpeaker.c.speakers.isnot(None),
                        EventSpeaker.c.speakers,
                    ),
                    else_=func.json_build_array(),
                ).label("speakers"),
                case(
                    (
                        EventTicket.c.tickets.isnot(None),
                        EventTicket.c.tickets,
                    ),
                    else_=func.json_build_array(),
                ).label("tickets"),
                SoldTicketsNumber.c.sold_tickets_number,
                BookmarkCount.c.bookmark_count,
            )
            .join(Organization, Event.organization_id == Organization.id)
            .outerjoin(Target, Event.target_id == Target.id)
            .outerjoin(EventTag, Event.id == EventTag.c.event_id)
            .outerjoin(EventSpeaker, Event.id == EventSpeaker.c.event_id)
            .outerjoin(EventTicket, Event.id == EventTicket.c.event_id)
            .outerjoin(SoldTicketsNumber, Event.id == SoldTicketsNumber.c.event_id)
            .outerjoin(BookmarkCount, Event.id == BookmarkCount.c.event_id)
            .where(
                Event.slug == slug,
                Event.published_at.isnot(None),
                Event.status == EventStatusCode.PUBLIC,
            )
        )

        # Add bookmark status if user is provided
        if user:
            query = query.add_columns(
                case(
                    (
                        user and Bookmark.user_id == user.id,
                        True,
                    ),
                    else_=False,
                ).label("is_bookmarked")
            ).outerjoin(
                Bookmark,
                and_(Event.id == Bookmark.event_id, Bookmark.user_id == user.id),
            )

        event = session.exec(query).mappings().first()

        if not event:
            return None

        return dict(event)
