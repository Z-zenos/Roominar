import json
from datetime import datetime

from sqlmodel import Session, case, func, select

from backend.core.constants import EventStatusCode, UserActionTypeCode
from backend.core.redis_client import redis_client
from backend.models.event import Event
from backend.models.user import User
from backend.models.user_action import UserAction
from backend.schemas.organization import ListingAttendeesRankingQueryParams

CACHE_EXPIRE_SECONDS = 60  # 1 phút

# Mapping điểm cho từng loại hành động
ACTION_SCORES = {
    UserActionTypeCode.PURCHASE_TICKET: 20,
    UserActionTypeCode.CHECK_IN: 15,
    UserActionTypeCode.CANCEL_TICKET: -10,
    UserActionTypeCode.ANSWER_APPLICATION_SURVEY: 10,
    UserActionTypeCode.RATE: 5,
    UserActionTypeCode.SHARE: 2,
    UserActionTypeCode.BOOKMARK: 1,
    # Các hành động khác mặc định là 0 điểm
}


async def listing_attendees_ranking(
    db: Session, organizer: User, query_params: ListingAttendeesRankingQueryParams
) -> list[dict]:
    cache_key = (
        f"attendees_ranking:{organizer.organization_id}:"
        f"{query_params.event_id}:{query_params.month}:{query_params.year}:"
        f"{query_params.keyword}:{query_params.page}:{query_params.per_page}"
    )
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)

    event_stmt = select(Event.id).where(
        Event.organization_id == organizer.organization_id,
        Event.status == EventStatusCode.PUBLIC,
    )
    if query_params.event_id:
        event_stmt = event_stmt.where(Event.id == query_params.event_id)

    filters = [UserAction.event_id.in_(event_stmt)]

    # Time filter (month/year)
    if query_params.month and query_params.year:
        start_date = datetime(query_params.year, query_params.month, 1)
        if query_params.month == 12:
            end_date = datetime(query_params.year + 1, 1, 1)
        else:
            end_date = datetime(query_params.year, query_params.month + 1, 1)
        filters.append(UserAction.created_at >= start_date)
        filters.append(UserAction.created_at < end_date)

    # Score mapping
    score_case = case(
        *(
            ((UserAction.action_type == action_type, score))
            for action_type, score in ACTION_SCORES.items()
        ),
        else_=0,
    )

    # Base query
    query = (
        select(
            User.id,
            func.concat(User.first_name, " ", User.last_name).label("full_name"),
            User.email,
            User.avatar_url,
            func.sum(score_case).label("total_score"),
        )
        .join(UserAction, User.id == UserAction.user_id)
        .where(*filters)
        .group_by(User.id, User.first_name, User.last_name, User.email, User.avatar_url)
        .having(func.sum(score_case) > 10)
    )

    # Keyword filter
    if query_params.keyword:
        keyword = f"%{query_params.keyword.lower()}%"
        query = query.where(
            func.lower(User.first_name + " " + User.last_name).ilike(keyword)
            | func.lower(User.email).ilike(keyword)
        )

    query = (
        query.order_by(func.sum(score_case).desc())
        .offset((query_params.page - 1) * query_params.per_page)
        .limit(query_params.per_page)
    )

    result = db.exec(query).mappings().all()
    result = [dict(row) for row in result]

    redis_client.setex(
        cache_key,
        CACHE_EXPIRE_SECONDS,
        json.dumps(result),
    )
    return result
