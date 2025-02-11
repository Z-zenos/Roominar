from sqlmodel import Session, text

from backend.core.constants import EventStatusCode
from backend.models.user import User
from backend.schemas.event import SearchEventsQueryParams


async def listing_recommendation_events(
    db: Session, user: User, query_params: SearchEventsQueryParams
):
    # Ensure safe default values
    page = max(query_params.page or 1, 1)
    per_page = min(max(query_params.per_page or 10, 1), 100)

    filters = []
    if query_params.keyword:
        filters.append("e.name ILIKE '%' || :keyword || '%'")
    if query_params.start_at_from:
        filters.append("e.start_at >= :start_at_from")
    if query_params.start_at_to:
        filters.append("e.start_at <= :start_at_to")
    if query_params.job_type_codes:
        filters.append("(t.job_type_codes && :job_type_codes)")  # Array overlap
    if query_params.industry_codes:
        filters.append("(t.industry_codes && :industry_codes)")
    if query_params.is_online:
        filters.append("e.is_online = :is_online")
    if query_params.is_offline:
        filters.append("e.is_offline = :is_offline")

    if query_params.is_apply_ongoing:
        filters.append(
            "e.application_start_at <= now() AND e.application_end_at >= now()"
        )

    if query_params.is_apply_ended:
        filters.append("e.application_end_at < now()")

    if query_params.is_today:
        filters.append("DATE(e.start_at) = DATE(now())")

    if query_params.city_codes:
        filters.append("e.organize_city_code = ANY(:city_codes)")

    if query_params.tags:
        filters.append("ta.tag_id = ANY(:tags)")

    filters = " AND ".join(filters)
    if filters:
        filters = " AND " + filters

    # ✅ **Total Count Query (Fix)**
    count_statement = text(
        f"""
        WITH event_tags AS (
            SELECT ta.entity_id AS event_id, array_agg(ta.tag_id) AS tag_ids
            FROM tag_associations ta
            WHERE ta.entity_code = 'EVENT'
            GROUP BY ta.entity_id
        ),

        user_interactions AS (
            SELECT
                t.industry_codes AS industry_codes,
                t.job_type_codes AS job_type_codes,
                et.tag_ids AS tag_ids,
                CASE
                    WHEN EXISTS (
                        SELECT 1 FROM survey_response_results srr WHERE srr.application_id = a.id
                    )
                    THEN 8 ELSE 7
                END AS score
            FROM applications a
            JOIN events e ON e.id = a.event_id
            LEFT JOIN targets t ON t.id = e.target_id
            LEFT JOIN event_tags et ON et.event_id = e.id
            WHERE a.user_id = :user_id

            UNION ALL

            SELECT
                t.industry_codes AS industry_codes,
                t.job_type_codes AS job_type_codes,
                et.tag_ids AS tag_ids,
                5 AS score
            FROM bookmarks b
            JOIN events e ON e.id = b.event_id
            LEFT JOIN targets t ON t.id = e.target_id
            LEFT JOIN event_tags et ON et.event_id = e.id
            WHERE b.user_id = :user_id

            UNION ALL

            SELECT
                ARRAY[u.industry_code]::varchar[] AS industry_codes,
                ARRAY[u.job_type_code]::varchar[] AS job_type_codes,
                array_agg(ta.tag_id) AS tag_ids,
                3 AS score
            FROM users u
            LEFT JOIN tag_associations ta ON ta.entity_id = u.id AND ta.entity_code = 'USER'
            WHERE u.id = :user_id
            GROUP BY u.id
        ),

        total_scores AS (
            SELECT
                unnest(ui.industry_codes) AS code,
                SUM(ui.score) AS score
            FROM user_interactions ui
            WHERE ui.industry_codes IS NOT NULL
            GROUP BY code

            UNION ALL

            SELECT
                unnest(ui.job_type_codes) AS code,
                SUM(ui.score) AS score
            FROM user_interactions ui
            WHERE ui.job_type_codes IS NOT NULL
            GROUP BY code

            UNION ALL

            SELECT
                unnest(ui.tag_ids::varchar[]) AS code,
                SUM(ui.score) AS score
            FROM user_interactions ui
            WHERE ui.tag_ids IS NOT NULL
            GROUP BY code
        )

        SELECT COUNT(*)
        FROM events e
        LEFT JOIN targets t ON e.target_id = t.id
        LEFT JOIN event_tags et ON e.id = et.event_id
        WHERE e.status = :status
        AND NOT EXISTS (
            SELECT 1 FROM applications a WHERE a.event_id = e.id AND a.user_id = :user_id
        )
        AND NOT EXISTS (
            SELECT 1 FROM bookmarks b WHERE b.event_id = e.id AND b.user_id = :user_id
        )
        AND EXISTS (
            SELECT 1 FROM total_scores ts
            WHERE ts.code = ANY(t.industry_codes)
                OR ts.code = ANY(t.job_type_codes)
                OR ts.code = ANY(et.tag_ids::varchar[])
        )
        {filters};
        """
    )

    # ✅ **Recommendation Query (With Filters)**
    statement = text(
        f"""
        WITH event_tags AS (
            SELECT ta.entity_id AS event_id, array_agg(ta.tag_id) AS tag_ids
            FROM tag_associations ta
            WHERE ta.entity_code = 'EVENT'
            GROUP BY ta.entity_id
        ),

        user_interactions AS (
            SELECT
                t.industry_codes AS industry_codes,
                t.job_type_codes AS job_type_codes,
                et.tag_ids AS tag_ids,
                CASE WHEN EXISTS (
                    SELECT 1 FROM survey_response_results srr WHERE srr.application_id = a.id
                ) THEN 8 ELSE 7 END AS score
            FROM applications a
            JOIN events e ON e.id = a.event_id
            LEFT JOIN targets t ON t.id = e.target_id
            LEFT JOIN event_tags et ON et.event_id = e.id
            WHERE a.user_id = :user_id

            UNION ALL

            SELECT
                t.industry_codes AS industry_codes,
                t.job_type_codes AS job_type_codes,
                et.tag_ids AS tag_ids,
                5 AS score
            FROM bookmarks b
            JOIN events e ON e.id = b.event_id
            LEFT JOIN targets t ON t.id = e.target_id
            LEFT JOIN event_tags et ON et.event_id = e.id
            WHERE b.user_id = :user_id

            UNION ALL

            SELECT
                ARRAY[u.industry_code]::varchar[] AS industry_codes,
                ARRAY[u.job_type_code]::varchar[] AS job_type_codes,
                array_agg(ta.tag_id) AS tag_ids,
                3 AS score
            FROM users u
            LEFT JOIN tag_associations ta ON ta.entity_id = u.id AND ta.entity_code = 'USER'
            WHERE u.id = :user_id
            GROUP BY u.id
        ),

        total_scores AS (
            SELECT unnest(ui.industry_codes) AS code, SUM(ui.score) AS score
            FROM user_interactions ui
            WHERE ui.industry_codes IS NOT NULL
            GROUP BY code

            UNION ALL

            SELECT unnest(ui.job_type_codes) AS code, SUM(ui.score) AS score
            FROM user_interactions ui
            WHERE ui.job_type_codes IS NOT NULL
            GROUP BY code

            UNION ALL

            SELECT unnest(ui.tag_ids::VARCHAR[]) AS code, SUM(ui.score) AS score
            FROM user_interactions ui
            WHERE ui.tag_ids IS NOT NULL
            GROUP BY code
        ),

        scored_events AS (
            SELECT
                e.id,
                e.name,
                e.slug,
                e.start_at,
                e.end_at,
                e.total_ticket_number,
                e.application_start_at,
                e.application_end_at,
                e.cover_image_url,
                e.published_at,
                o.name AS organization_name,
                COALESCE((
                    SELECT SUM(ts.score)
                    FROM total_scores ts
                    WHERE ts.code = ANY(t.industry_codes)
                        OR ts.code = ANY(t.job_type_codes)
                        OR ts.code = ANY(et.tag_ids::varchar[])
                ), 0) AS total_score
            FROM events e
            JOIN organizations o ON e.organization_id = o.id
            LEFT JOIN targets t ON e.target_id = t.id
            LEFT JOIN event_tags et ON e.id = et.event_id
            WHERE e.status = :status
            AND NOT EXISTS (
                SELECT 1 FROM applications a WHERE a.event_id = e.id AND a.user_id = :user_id
            )
            AND NOT EXISTS (
                SELECT 1 FROM bookmarks b WHERE b.event_id = e.id AND b.user_id = :user_id
            )
            {filters}
        )

        SELECT * FROM scored_events
        WHERE total_score > 0
        ORDER BY total_score DESC
        LIMIT :per_page OFFSET (:page - 1) * :per_page;
        """
    )

    params = {
        "status": EventStatusCode.PUBLIC,
        "user_id": user.id,
        "keyword": query_params.keyword,
        "start_at_from": query_params.start_at_from,
        "start_at_to": query_params.start_at_to,
        "job_type_codes": query_params.job_type_codes or [],
        "industry_codes": query_params.industry_codes or [],
        "is_online": query_params.is_online,
        "is_offline": query_params.is_offline,
        "is_today": query_params.is_today,
        "city_codes": query_params.city_codes or [],
        "tags": query_params.tags or [],
        "page": page,
        "per_page": per_page,
    }

    # Execute both queries
    total_count = db.exec(count_statement, params=params).scalar() or 0
    events = db.exec(statement, params=params).mappings().all() or []

    # ✅ Return paginated results & total count
    return {"total": total_count, "events": events}
