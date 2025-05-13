from sqlmodel import Session, select

from backend.models.speaker import Speaker


async def get_speaker_detail(
    db: Session,
    slug: str,
):
    speaker = (
        db.exec(
            select(
                Speaker.id,
                Speaker.first_name,
                Speaker.last_name,
                Speaker.avatar_url,
                Speaker.industry_code,
                Speaker.job_type_code,
                Speaker.slug,
                Speaker.description,
                Speaker.skills,
                Speaker.facebook_url,
                Speaker.twitter_url,
                Speaker.linkedin_url,
                Speaker.youtube_url,
                Speaker.email,
                Speaker.phone,
            ).where(Speaker.slug == slug)
        )
        .mappings()
        .one_or_none()
    )

    return speaker
