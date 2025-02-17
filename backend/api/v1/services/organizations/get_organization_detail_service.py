from sqlmodel import Session, and_, distinct, func, literal, select

import backend.api.v1.services.events as events_service
from backend.core.constants import FollowEntityCode, TagAssociationEntityCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.models.event import Event
from backend.models.follow import Follow
from backend.models.organization import Organization
from backend.models.tag import Tag
from backend.models.tag_association import TagAssociation
from backend.models.user import User
from backend.schemas.event import SearchEventsQueryParams


async def get_organization_detail(db: Session, user: User, organization_slug: str):
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
        .where(Organization.slug == organization_slug)
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

    organization = (
        db.exec(
            select(
                Organization.id,
                Organization.name,
                Organization.description,
                Organization.avatar_url,
                Organization.hp_url,
                Organization.city_code,
                Organization.contact_email,
                Organization.address,
                Organization.phone,
                Organization.contact_url,
                Organization.facebook_url,
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
            .where(Organization.slug == organization_slug)
        )
        .mappings()
        .one_or_none()
    )

    if not organization:
        raise ValueError(
            ErrorCode.ERR_ORGANIZATION_NOT_FOUND,
            ErrorMessage.ERR_ORGANIZATION_NOT_FOUND,
        )

    organization = dict(organization)

    query_params = SearchEventsQueryParams().create(organization_id=organization["id"])
    events, total_public_events = await events_service.search_events(
        db,
        user,
        query_params,
    )

    organization.update(
        {
            "events": events,
            "total_public_events": total_public_events,
        }
    )

    return organization
