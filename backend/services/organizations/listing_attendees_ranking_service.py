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

    # Time filters
    def get_period_range(month: int, year: int):
        start_date = datetime(year, month, 1)
        if month == 12:
            end_date = datetime(year + 1, 1, 1)
        else:
            end_date = datetime(year, month + 1, 1)
        return start_date, end_date

    if not (query_params.month and query_params.year):
        raise ValueError("Month and year are required for ranking comparison.")

    current_start, current_end = get_period_range(query_params.month, query_params.year)

    if query_params.month == 1:
        prev_start, prev_end = get_period_range(12, query_params.year - 1)
    else:
        prev_start, prev_end = get_period_range(
            query_params.month - 1, query_params.year
        )

    event_stmt = select(Event.id).where(
        Event.organization_id == organizer.organization_id,
        Event.status == EventStatusCode.PUBLIC,
    )
    if query_params.event_id:
        event_stmt = event_stmt.where(Event.id == query_params.event_id)

    filters = [UserAction.event_id.in_(event_stmt)]

    # Score case
    score_case = case(
        *(
            ((UserAction.action_type == action_type, score))
            for action_type, score in ACTION_SCORES.items()
        ),
        else_=0,
    )

    # Số lần hành động theo loại
    def action_count_case(action_code):
        return func.sum(case((UserAction.action_type == action_code, 1), else_=0))

    # Subquery: Điểm ở kỳ trước để so sánh xếp hạng
    prev_query = (
        select(
            User.id.label("user_id"),
            func.sum(score_case).label("prev_score"),
        )
        .join(UserAction, User.id == UserAction.user_id)
        .where(
            *filters,
            UserAction.created_at >= prev_start,
            UserAction.created_at < prev_end,
        )
        .group_by(User.id)
    ).subquery()

    # Main query: điểm kỳ hiện tại + số lần hành động
    query = (
        select(
            User.id,
            func.concat(User.first_name, " ", User.last_name).label("full_name"),
            User.email,
            User.avatar_url,
            func.sum(score_case).label("total_score"),
            action_count_case(UserActionTypeCode.PURCHASE_TICKET).label(
                "purchase_number"
            ),
            action_count_case(UserActionTypeCode.CHECK_IN).label("checkin_number"),
            action_count_case(UserActionTypeCode.ANSWER_APPLICATION_SURVEY).label(
                "survey_number"
            ),
            prev_query.c.prev_score,
        )
        .join(UserAction, User.id == UserAction.user_id)
        .outerjoin(prev_query, prev_query.c.user_id == User.id)
        .where(
            *filters,
            UserAction.created_at >= current_start,
            UserAction.created_at < current_end,
        )
        .group_by(
            User.id,
            User.first_name,
            User.last_name,
            User.email,
            User.avatar_url,
            prev_query.c.prev_score,
        )
        .having(func.sum(score_case) > 10)
        .order_by(func.sum(score_case).desc())
    )

    all_rows = db.exec(query).mappings().all()
    all_rows = [dict(row) for row in all_rows]

    # Gán thứ hạng hiện tại và trước đó
    current_ranking = {row["id"]: idx for idx, row in enumerate(all_rows)}
    prev_ranking_query = sorted(all_rows, key=lambda x: -(x.get("prev_score") or 0))
    prev_ranking = {row["id"]: idx for idx, row in enumerate(prev_ranking_query)}

    for row in all_rows:
        uid = row["id"]
        prev_rank = prev_ranking.get(uid)
        current_rank = current_ranking[uid]
        if prev_rank is None:
            trend = "new"
        elif prev_rank > current_rank:
            trend = "up"
        elif prev_rank < current_rank:
            trend = "down"
        else:
            trend = "same"
        row["rank_change"] = trend

    # Paging
    start = (query_params.page - 1) * query_params.per_page
    end = start + query_params.per_page
    paginated_result = all_rows[start:end]

    redis_client.setex(cache_key, CACHE_EXPIRE_SECONDS, json.dumps(paginated_result))
    return paginated_result
