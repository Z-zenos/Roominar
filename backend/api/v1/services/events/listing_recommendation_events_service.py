from sqlmodel import Session, text

from backend.models.user import User
from backend.schemas.event import SearchEventsQueryParams


async def listing_recommendation_events(
    db: Session, user: User, query_params: SearchEventsQueryParams
):
    statement = text(
        """
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
                e.id AS event_id,
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
            WHERE e.start_at BETWEEN :start_at_from AND :start_at_to
            AND (:name IS NULL OR e.name ILIKE '%' || :name || '%')
            AND (:job_type_codes IS NULL OR a.job_type_code = ANY(:job_type_codes))
            AND (:industry_codes IS NULL OR a.industry_code = ANY(:industry_codes))
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
        "user_id": user.id,
        "start_at_from": query_params.start_at_from,
        "start_at_to": query_params.start_at_to,
        "name": query_params.keyword,
        "job_type_codes": query_params.job_type_codes,
        "industry_codes": query_params.industry_codes,
    }

    events = db.exec(statement, params=params).mappings().all()

    return events
