from sqlmodel import Session, text

from backend.core.constants import EventStatusCode
from backend.models.user import User
from backend.schemas.event import SearchEventsQueryParams


async def listing_recommendation_events(
    db: Session, user: User, query_params: SearchEventsQueryParams
):
    filters = ""
    if query_params.keyword:
        filters += "AND e.name ILIKE '%' || :keyword || '%'"
    if query_params.job_type_codes:
        filters += "AND a.job_type_code = ANY(:job_type_codes)"
    if query_params.industry_codes:
        filters += "AND a.industry_code = ANY(:industry_codes)"
    if query_params.start_at_from:
        filters += "AND e.start_at >= :start_at_from"
    if query_params.start_at_to:
        filters += "AND e.start_at <= :start_at_to"

    statement = text(
        f"""
        WITH user_preferences AS (
            SELECT
                a.user_id,
                a.industry_code,
                a.job_type_code
            FROM applications a
            WHERE a.user_id = :user_id
        ),
        event_scores AS (
            SELECT
                e.id,
                e.slug,
                o.name AS organization_name,
                e.name,
                e.start_at,
                e.end_at,
                e.total_ticket_number,
                e.application_start_at,
                e.application_end_at,
                e.cover_image_url,
                e.organize_city_code,
                e.organize_address,
                e.is_online,
                e.is_offline,
                e.published_at,
                e.meeting_tool_code,
                COUNT(DISTINCT b.user_id) * 5 AS bookmark_score,
                COUNT(DISTINCT a.user_id) * 7 AS application_score,
                COUNT(DISTINCT s.email) * 6 AS survey_score,
                COUNT(DISTINCT f.following_id) * 1 AS follow_score,
                COUNT(DISTINCT ta.tag_id) * 3 AS tag_score
            FROM events e
            LEFT JOIN organizations o ON e.organization_id = o.id
            LEFT JOIN bookmarks b ON e.id = b.event_id
            LEFT JOIN applications a ON e.id = a.event_id
            LEFT JOIN survey_response_results s ON e.id = s.event_id
            LEFT JOIN
                follows f
                ON (f.following_id = e.organization_id AND f.entity_code = 'ORGANIZATION')
            LEFT JOIN tag_associations ta ON ta.entity_id = e.id
            LEFT JOIN user_preferences up
                ON (a.industry_code = up.industry_code OR
                a.job_type_code = up.job_type_code)
            WHERE
                e.status = :status
                {filters}
            GROUP BY e.id, o.name
        )
        SELECT
            es.*,
            (es.application_score + es.bookmark_score +
            es.survey_score + es.follow_score + es.tag_score) AS total_score
        FROM event_scores es
        ORDER BY total_score DESC
        LIMIT 10
        """
    )

    params = {
        "status": EventStatusCode.PUBLIC,
        "user_id": user.id,
        "keyword": query_params.keyword,
        "job_type_codes": query_params.job_type_codes,
        "industry_codes": query_params.industry_codes,
        "start_at_from": query_params.start_at_from,
        "start_at_to": query_params.start_at_to,
    }

    events = db.exec(statement, params=params).mappings().all() or []

    return events
