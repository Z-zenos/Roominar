from sqlmodel import Session, func, select

from backend.models.speaker import Speaker


async def listing_random_speakers(db: Session):
    speakers = (
        db.exec(
            select(
                Speaker.id,
                Speaker.first_name,
                Speaker.last_name,
                Speaker.avatar_url,
                Speaker.industry_code,
                Speaker.job_type_code,
            )
            .order_by(func.random())
            .limit(4)
        )
        .mappings()
        .all()
    )

    return speakers
