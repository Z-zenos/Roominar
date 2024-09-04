from sqlmodel import Session, select, text

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.event import Event
from backend.models.target import Target


def listing_related_events(db: Session, slug: str):
    targets = (
        db.exec(
            select(Target.industry_codes, Target.job_type_codes)
            .select_from(Event)
            .where(Event.slug == slug)
            .join(Target, Target.id == Event.target_id)
        )
        .mappings()
        .one_or_none()
    )

    if not targets:
        raise BadRequestException(
            ErrorCode.ERR_EVENT_NOT_FOUND, ErrorMessage.ERR_EVENT_NOT_FOUND
        )

    events = (
        db.exec(
            text(
                f"""
                SELECT e.id, e.slug, e.cover_image_url, e.name, e.start_at
                FROM events e
                JOIN targets t ON t.id = e.target_id
                WHERE e.slug != '{slug}'
                ORDER BY (
                    (
                        SELECT COUNT(*)
                        FROM unnest(t.industry_codes) AS industry_code
                        WHERE industry_code = ANY(ARRAY{targets.industry_codes})
                    ) +
                    (
                        SELECT COUNT(*)
                        FROM unnest(t.job_type_codes) AS job_type_code
                        WHERE job_type_code = ANY(ARRAY{targets.job_type_codes})
                    )
                ) DESC
                LIMIT 6;
            """
            )
        )
        .mappings()
        .all()
    )

    return events
