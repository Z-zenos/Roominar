from datetime import datetime, timedelta, timezone

from sqlmodel import Session, text

from backend.models.user import User
from backend.schemas.organization import TrackUserActionsQueryParams


async def track_user_actions(
    db: Session, organizer: User, query_params: TrackUserActionsQueryParams
):
    now = datetime.now(timezone.utc)
    time_filters = {
        "LAST_7_DAYS": now - timedelta(days=7),
        "LAST_30_DAYS": now - timedelta(days=30),
        "LAST_90_DAYS": now - timedelta(days=90),
        "DAILY": now - timedelta(days=1),
        "HOURLY": now - timedelta(hours=1),
        "WEEKLY": now - timedelta(weeks=1),
        "MONTHLY": now.replace(day=1),
        "QUARTERLY": now.replace(month=((now.month - 1) // 3) * 3 + 1, day=1),
        "YEARLY": now.replace(month=1, day=1),
    }
    start_time = time_filters.get(query_params.time_range)

    group_by_mapping = {
        "LAST_7_DAYS": "DATE(action_at)",
        "LAST_30_DAYS": "DATE(action_at)",
        "LAST_90_DAYS": "DATE_TRUNC('week', action_at)",
        "DAILY": "DATE(action_at)",
        "HOURLY": "DATE(action_at), EXTRACT(HOUR FROM action_at)",
        "WEEKLY": "DATE_TRUNC('week', action_at)",
        "MONTHLY": "DATE_TRUNC('month', action_at)",
        "QUARTERLY": "DATE_TRUNC('quarter', action_at)",
        "YEARLY": "DATE_TRUNC('year', action_at)",
    }

    filters = ["action_at >= :start_time", "organization_id = :organization_id"]
    params = {"start_time": start_time, "organization_id": organizer.organization_id}

    if query_params.action_type:
        filters.append("action_type = :action_type")
        params["action_type"] = query_params.action_type

    if query_params.event_id:
        filters.append("event_id = :event_id")
        params["event_id"] = query_params.event_id

    query = text(
        f"""
            SELECT
                {group_by_mapping[query_params.group_by]} AS time_period,
                action_type,
                COUNT(id) AS count
            FROM user_actions
            WHERE {" AND ".join(filters)}
            GROUP BY time_period, action_type
        """
    )

    user_actions = db.exec(query, params=params).mappings().all()

    return user_actions
