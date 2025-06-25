from datetime import datetime, timedelta, timezone

from sqlmodel import Float, Session, and_, case, func, or_, select, text

from backend.core.constants import EventStatusCode, UserActionTypeCode
from backend.models.bookmark import Bookmark
from backend.models.event import Event
from backend.models.organization import Organization
from backend.models.user import User
from backend.models.user_action import UserAction
from backend.schemas.event import SearchEventsQueryParams


def listing_trending_events(
    db: Session, user: User | None, query_params: SearchEventsQueryParams
):
    # Base query for eligible events
    base_query = select(Event).where(
        Event.published_at.isnot(None),
        Event.status == EventStatusCode.PUBLIC,
        Event.start_at > datetime.now(timezone.utc),  # Future events only
        or_(
            Event.application_end_at
            > datetime.now(timezone.utc),  # Application ongoing
            Event.application_end_at
            > datetime.now(timezone.utc) - timedelta(days=7),  # Recently ended
        ),
    )

    # Calculate growth score from UserActions (last 3 days vs previous 4 days)
    now = datetime.now(timezone.utc)
    recent_period = now - timedelta(days=3)
    older_period = now - timedelta(days=7)

    # Growth score calculation CTE
    GrowthScore = (
        select(
            UserAction.event_id,
            (
                (
                    func.count(case((UserAction.action_at >= recent_period, 1))).cast(
                        Float
                    )
                    - func.count(case((UserAction.action_at < recent_period, 1))).cast(
                        Float
                    )
                )
                / func.greatest(
                    func.count(case((UserAction.action_at < recent_period, 1))), 1
                )
            ).label("growth_score"),
        )
        .select_from(UserAction)
        .where(
            UserAction.action_type == UserActionTypeCode.VIEW,
            UserAction.action_at >= older_period,
            UserAction.event_id.isnot(None),
        )
        .group_by(UserAction.event_id)
        .cte()
    )

    # Main query with hotness score calculation
    query = (
        select(
            Event.__table__.columns,
            Organization.name.label("organization_name"),
            (
                Event.view_count * 1.0
                + Event.bookmark_count * 2.0
                + Event.sold_ticket_count * 3.0
                + Event.share_count * 2.0
                + func.coalesce(GrowthScore.c.growth_score, 0) * 2.0
                + case(
                    (Event.start_at <= now + timedelta(days=1), 50),
                    (Event.start_at <= now + timedelta(days=3), 30),
                    (Event.start_at <= now + timedelta(days=5), 20),
                    else_=0,
                )
            ).label("hotness_score"),
            # Check if user bookmarked this event
            func.coalesce(
                case((user and Bookmark.user_id == user.id, True), else_=False), False
            ).label("is_bookmarked"),
        )
        .select_from(Event)
        .join(Organization, Event.organization_id == Organization.id)
        .outerjoin(GrowthScore, Event.id == GrowthScore.c.event_id)
        .outerjoin(
            Bookmark,
            and_(
                Event.id == Bookmark.event_id,
                Bookmark.user_id == user.id if user else False,
            ),
        )
        .where(base_query.whereclause)
        .order_by(text("hotness_score DESC"))
        .offset((query_params.page - 1) * query_params.per_page)
        .limit(query_params.per_page)
    )

    # Execute query and format response
    results = db.exec(query).mappings().all()

    # Get total count for pagination
    total_query = select(func.count(Event.id)).where(base_query.whereclause)
    total = db.scalar(total_query) or 0

    return results, total
