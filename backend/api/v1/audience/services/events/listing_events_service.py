from collections import defaultdict
from datetime import datetime

from pydantic import BaseModel
from sqlalchemy import Date
from sqlmodel import Session, and_, asc, case, desc, func, or_, select

from backend.models.application import Application
from backend.models.bookmark import Bookmark
from backend.models.event import Event
from backend.models.event_tag import EventTag
from backend.models.organization import Organization
from backend.models.target import Target
from backend.models.user import User
from backend.schemas.event import EventSortByCriteria, FilteringEventsQueryParams


def listing_events(
    db: Session,
    user: User | None,
    query_params: FilteringEventsQueryParams,
):
    filters = _build_filters(db, user, query_params)

    query = (
        select(
            Event.id,
            Event.slug,
            Organization.display_name.label("organization_display_name"),
            Organization.name.label("organization_name"),
            Event.name,
            Event.start_at,
            Event.end_at,
            Event.application_number,
            Event.application_start_at,
            Event.application_end_at,
            Event.cover_image_url,
            Event.organize_prefecture_code,
            Event.organize_place_name,
            Event.organize_address,
            Event.is_online,
            Event.is_offline,
            Event.meeting_tool_code,
            func.count(Application.id).label("applied_number"),
            case(
                (
                    user and Bookmark.user_id == user.id,
                    True,
                ),
                else_=False,
            ).label("is_bookmarked"),
        )
        .join(Organization, Event.organization_id == Organization.id)
        .join(Target, Event.target_id == Target.id)
        .outerjoin(
            Application,
            and_(Application.event_id == Event.id, Application.deleted_at.is_(None)),
        )
        .outerjoin(EventTag, EventTag.event_id == Event.id)
        .group_by(
            Event.id,
            case(
                (
                    user and Bookmark.user_id == user.id,
                    True,
                ),
                else_=False,
            ).label("is_bookmarked"),
            Organization.display_name.label("organization_display_name"),
            Organization.name.label("organization_name"),
        )
    )

    if user:
        query = query.outerjoin(
            Bookmark, and_(Event.id == Bookmark.event_id, Bookmark.user_id == user.id)
        )

    query = (
        query.where(and_(*filters["conditions"]))
        .order_by(
            asc(filters["sort_by"])
            if query_params.sort_by == EventSortByCriteria.application_end_at
            else desc(filters["sort_by"])
        )
        .limit(query_params.per_page)
        .offset((query_params.page - 1) * query_params.per_page)
    )
    events = db.exec(query).mappings().all()
    total = count_events(db, filters)
    return events, total


def count_events(
    db: Session,
    filters: list,
):
    query = (
        select(func.count(Event.id.distinct()))
        .join(Organization, Event.organization_id == Organization.id)
        .join(Target, Event.target_id == Target.id)
        .outerjoin(EventTag, Event.id == EventTag.event_id)
        .where(and_(*filters["conditions"]))
    )
    total = db.scalars(query).one()

    return total


def _get_targets(db: Session, user: User, Model: BaseModel):
    targets_query = (
        select(
            Target.industry_codes,
            Target.employee_size_codes,
            Target.job_type_codes,
            Target.revenue_codes,
            Target.position_codes,
        )
        .join(Event, Event.target_id == Target.id)
        .join(Model, and_(Model.event_id == Event.id, Model.user_id == user.id))
        .limit(10)
        .order_by(Model.created_at.desc())
    )

    targets = db.exec(targets_query).mappings().all()

    return targets


def _build_recommendation_targets(targets_list: list):
    """
    Create targets set from application, bookmark and user targets
    """
    targets = defaultdict(lambda: {"values": [], "points": []})
    for item in targets_list:
        for key, value in item.items():
            if value is not None:
                for v in value:
                    if v in targets[key]["values"]:
                        index = targets[key]["values"].index(v)
                        targets[key]["points"][index] += 1
                    else:
                        targets[key]["values"].append(v)
                        targets[key]["points"].append(1)
    return dict(targets)


def _build_filters(db: Session, user: User, query_params: FilteringEventsQueryParams):
    """
    Build conditions for WHERE clause in query from filter query params
    and criteria for ORDER BY clause
    """
    filters = [
        Event.public_at.isnot(None),
        Event.application_start_at <= datetime.now(),
        Event.private_flag.is_(False),
    ]
    sort_by = Event.public_at
    recommendation_targets = []

    if user:
        bookmarked_event_targets = _get_targets(db, user, Bookmark)
        application_targets = _get_targets(db, user, Application)
        recommendation_targets = _build_recommendation_targets(
            targets_list=(
                application_targets
                + bookmarked_event_targets
                + [
                    {
                        "industry_codes": [user.industry_code],
                        "employee_size_codes": [user.employee_size_code],
                        "job_type_codes": [user.job_type_code],
                        "position_codes": [user.position_code],
                        "revenue_codes": [user.revenue_code],
                    }
                ]
            )
        )

    if query_params.keyword:
        filters.append(Event.name.contains(query_params.keyword))

    if query_params.is_online is True and query_params.is_offline is False:
        filters.append(Event.is_online == query_params.is_online)

    if query_params.is_offline is True and query_params.is_online is False:
        filters.append(Event.is_offline == query_params.is_offline)

    if query_params.is_offline is True and query_params.is_online is True:
        filters.append(
            and_(
                Event.is_online == query_params.is_online,
                Event.is_offline == query_params.is_offline,
            )
        )

    if query_params.is_being_accepted:
        filters.extend(
            [
                and_(Event.application_start_at <= datetime.now()),
                Event.application_end_at >= datetime.now(),
            ]
        )

    if query_params.is_finished:
        filters.append(Event.application_end_at < datetime.now())

    if query_params.employee_size_codes:
        filters.append(
            or_(
                Target.employee_size_codes.any(code)
                for code in query_params.employee_size_codes
            )
        )

    if query_params.job_type_codes:
        filters.append(
            or_(Target.job_type_codes.any(code) for code in query_params.job_type_codes)
        )

    if query_params.industry_codes:
        filters.append(
            or_(Target.industry_codes.any(code) for code in query_params.industry_codes)
        )

    if query_params.prefecture_codes:
        filters.append(
            Event.organize_prefecture_code.in_(query_params.prefecture_codes)
        )

    if query_params.tags:
        filters.append(EventTag.tag_id.in_(query_params.tags))

    if query_params.beginning_starting_period:
        filters.append(
            Event.start_at.cast(Date) >= query_params.beginning_starting_period.date()
        )

    if query_params.ending_starting_period:
        filters.append(
            Event.start_at.cast(Date) <= query_params.ending_starting_period.date()
        )

    if query_params.sort_by == EventSortByCriteria.public_at:
        filters.append(Event.end_at > datetime.now())

    if query_params.sort_by == EventSortByCriteria.start_at:
        filters.append(Event.start_at >= datetime.now())
        sort_by = Event.start_at

    if query_params.sort_by == EventSortByCriteria.application_end_at:
        filters.append(Event.application_end_at >= datetime.now())
        sort_by = Event.application_end_at

    if (
        query_params.sort_by == EventSortByCriteria.recommendation
        and recommendation_targets
    ):
        conditions = []
        rankings = []

        for type_code, target_data in recommendation_targets.items():
            values = target_data["values"]
            points = target_data["points"]

            if any(values):
                for code, point in zip(values, points):
                    if code:
                        conditions.append(getattr(Target, type_code).any(code))
                        rankings.append(
                            case(
                                (getattr(Target, type_code).any(code), point),
                                else_=0,
                            )
                        )

        filters.extend(
            [
                Event.application_end_at > datetime.now(),
                or_(*conditions),
            ]
        )
        sort_by = sum(rankings[1:], start=rankings[0])

    return {
        "conditions": filters,
        "sort_by": sort_by,
    }
