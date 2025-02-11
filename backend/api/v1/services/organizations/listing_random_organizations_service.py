from sqlmodel import Session, and_, distinct, func, literal, select

from backend.core.constants import FollowEntityCode, TagAssociationEntityCode
from backend.models.event import Event
from backend.models.follow import Follow
from backend.models.organization import Organization
from backend.models.tag import Tag
from backend.models.tag_association import TagAssociation
from backend.models.user import User


async def listing_random_organizations(db: Session, user: User):
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
            func.count(distinct(Event.id)).label("event_number"),
            func.count(distinct(Follow.follower_id)).label("follower_number"),
        )
        .select_from(Organization)
        .outerjoin(Event, Event.organization_id == Organization.id)
        .outerjoin(
            Follow,
            and_(
                Follow.following_id == Organization.id,
                Follow.entity_code == FollowEntityCode.ORGANIZATION,
            ),
        )
        .where(Event.published_at.isnot(None))
    )

    if user:
        OrganizationEventFollowCount = OrganizationEventFollowCount.add_columns(
            func.bool_or(Follow.follower_id == user.id).label("is_followed")
        )
    else:
        OrganizationEventFollowCount = OrganizationEventFollowCount.add_columns(
            literal("false").label("is_followed")
        )

    OrganizationEventFollowCount = OrganizationEventFollowCount.group_by(
        Organization.id
    ).subquery()

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
                OrganizationEventFollowCount.c.is_followed,
            )
            .outerjoin(OrganizationTag, OrganizationTag.c.id == Organization.id)
            .outerjoin(
                OrganizationEventFollowCount,
                OrganizationEventFollowCount.c.id == Organization.id,
            )
            .order_by(func.random())
            .limit(5)
        )
        .mappings()
        .all()
    )

    return organizations
