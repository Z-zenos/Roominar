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

    if query_params.action_types:
        filters.append("action_type IN :action_types")
        params["action_types"] = tuple(query_params.action_types)

    if query_params.event_id:
        filters.append("event_id = :event_id")
        params["event_id"] = query_params.event_id

    query = text(
        f"""
        WITH ranked_actions AS (
            SELECT
                {group_by_mapping[query_params.group_by]} AS time_period,
                action_type,
                COUNT(id) AS count,
                RANK() OVER (
                    PARTITION BY {group_by_mapping[query_params.group_by]}
                    ORDER BY COUNT(id) DESC
                ) as rank
            FROM user_actions
            WHERE {" AND ".join(filters)}
            GROUP BY time_period, action_type
        )
        SELECT time_period, action_type, count
        FROM ranked_actions
        WHERE rank <= :top_n
        ORDER BY time_period ASC, count DESC;
        """
    )
    params["top_n"] = query_params.top_n

    user_actions = db.exec(query, params=params).mappings().all()

    result_dict = {}
    for row in user_actions:
        time_key = row["time_period"].strftime("%Y-%m-%d")
        action_key = row["action_type"]

        if time_key not in result_dict:
            result_dict[time_key] = {"action_at": time_key, "actions": {}}

        result_dict[time_key]["actions"][action_key] = row["count"]

    all_action_types = set(
        query_params.action_types
        if query_params.action_types
        else [row["action_type"] for row in user_actions]
    )
    for time_key, data in result_dict.items():
        for action in all_action_types:
            action_key = action
            if action_key not in data["actions"]:
                data["actions"][action_key] = 0

    return list(result_dict.values())
