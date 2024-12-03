from datetime import datetime

from sqlmodel import Session, and_, case, func, select

from backend.core.constants import FollowEntityCode, TagAssociationEntityCode
from backend.models.event import Event
from backend.models.follow import Follow
from backend.models.organization import Organization
from backend.models.tag import Tag
from backend.models.tag_association import TagAssociation
from backend.models.user import User


async def listing_ongoing_event_organizations(db: Session, user: User):
    OrganizationTag = (
        select(
            Organization.id,
            func.json_agg(func.json_build_object("id", Tag.id, "name", Tag.name)).label(
                "tags"
            ),
        )
        .outerjoin(
            TagAssociation,
            and_(
                TagAssociation.entity_id == Organization.id,
                TagAssociation.entity_code == TagAssociationEntityCode.ORGANIZATION,
            ),
        )
        .join(Tag, Tag.id == TagAssociation.tag_id)
        .group_by(Organization.id)
        .subquery()
    )

    OrganizationEventFollowCount = (
        select(
            Organization.id,
            func.count(Event.id.distinct()).label("event_number"),
            func.count(Follow.follower_id.distinct()).label("follower_number"),
        )
        .outerjoin(Event, Event.organization_id == Organization.id)
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
        .subquery()
    )

    organizations = (
        db.exec(
            select(
                Organization.id,
                Organization.name,
                Organization.avatar_url,
                Organization.description,
                OrganizationTag.c.tags,
                OrganizationEventFollowCount.c.event_number,
                OrganizationEventFollowCount.c.follower_number,
                case(
                    (
                        user and Follow.follower_id == user.id,
                        True,
                    ),
                    else_=False,
                ).label("is_followed"),
            )
            .outerjoin(
                Follow,
                and_(
                    Follow.following_id == Organization.id,
                    Follow.entity_code == FollowEntityCode.ORGANIZATION,
                ),
            )
            .join(OrganizationTag, OrganizationTag.c.id == Organization.id)
            .join(
                OrganizationEventFollowCount,
                OrganizationEventFollowCount.c.id == Organization.id,
            )
            .limit(10)
        )
        .mappings()
        .all()
    )

    return organizations
