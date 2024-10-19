from sqlmodel import Session, select

from backend.models import Target, User


async def listing_target_options(db: Session, organizer: User):
    target_options = (
        db.exec(
            select(Target.id, Target.name).where(
                Target.organization_id == organizer.organization_id
            )
        )
        .mappings()
        .all()
    )

    return target_options
