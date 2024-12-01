from datetime import datetime

from sqlmodel import Session, and_, func, select

from backend.core.constants import FollowEntityCode, TagAssociationEntityCode
from backend.models.event import Event
from backend.models.follow import Follow
from backend.models.organization import Organization
from backend.models.tag import Tag
from backend.models.tag_association import TagAssociation


async def listing_ongoing_event_organizations(db: Session):
    organizations = (
        db.exec(
            select(
                Organization.id,
                Organization.name,
                Organization.avatar_url,
                Organization.description,
                func.count(Event.id).label("event_number"),
                func.json_agg(
                    func.json_build_object("id", Tag.id, "name", Tag.name)
                ).label("tags"),
                func.count(Follow.follower_id).label("follower_number"),
            )
            .outerjoin(Event, Event.organization_id == Organization.id)
            .outerjoin(
                TagAssociation,
                and_(
                    TagAssociation.entity_id == Organization.id,
                    TagAssociation.entity_code == TagAssociationEntityCode.ORGANIZATION,
                ),
            )
            .outerjoin(
                Follow,
                and_(
                    Follow.following_id == Organization.id,
                    Follow.entity_code == FollowEntityCode.ORGANIZATION,
                ),
            )
            .where(
                Event.application_start_at <= datetime.now(),
                Event.application_end_at > datetime.now(),
                Event.published_at.isnot(None),
            )
            .group_by(Organization.id)
            .limit(10)
        )
        .mappings()
        .all()
    )

    return organizations
