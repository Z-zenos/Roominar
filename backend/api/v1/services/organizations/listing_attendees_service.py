from sqlmodel import Date, Session, String, func, or_, select

from backend.core.constants import AttendeeSortByCode
from backend.models.application import Application
from backend.models.check_in import CheckIn
from backend.models.event import Event
from backend.models.transaction import Transaction
from backend.models.user import User
from backend.schemas.organization import ListingAttendeesQueryParams


async def listing_attendees(
    db: Session, organizer: User, query_params: ListingAttendeesQueryParams
):
    filters, sort_by = _build_filters_sort(organizer, query_params)
    events = await _get_attendees(db, filters, sort_by, query_params)
    total = await count_attendees(db, filters)

    return events, total


async def count_attendees(db: Session, filters: list):
    query = (
        select(func.count(Application.id))
        .select_from(User)
        .join(Application, Application.user_id == User.id)
        .join(Event, Event.id == Application.event_id)
        .where(*filters)
    )

    total = db.scalar(query) or 0
    return total


async def _get_attendees(
    db: Session,
    filters: list,
    sort_by: AttendeeSortByCode,
    query_params: ListingAttendeesQueryParams,
):
    query = (
        select(
            User.id,
            func.concat(User.first_name, " ", User.last_name).label("user_name"),
            Application.email,
            Event.id.label("event_id"),
            Event.name.label("event_name"),
            Application.job_type_code,
            Application.industry_code,
            Application.workplace_name,
            Application.phone,
            User.avatar_url,
            Application.created_at.label("applied_at"),
            CheckIn.created_at.label("checked_in_at"),
            Application.id.label("application_id"),
            Transaction.status.label("transaction_status"),
            CheckIn.id.label("check_in_id"),
        )
        .join(Application, Application.user_id == User.id)
        .outerjoin(CheckIn, CheckIn.application_id == Application.id)
        .join(Event, Event.id == Application.event_id)
        .join(Transaction, Transaction.application_id == Application.id)
        .where(*filters)
        .limit(query_params.per_page)
        .offset(query_params.per_page * (query_params.page - 1))
        .order_by(sort_by)
    )

    attendees = db.exec(query).mappings().all()
    return attendees


def _build_filters_sort(organizer: User, query_params: ListingAttendeesQueryParams):
    filters = [Event.organization_id == organizer.id, User.deleted_at.is_(None)]
    sort_by = Application.created_at.desc()
    if query_params.keyword:
        filters.append(
            or_(
                func.concat(User.first_name, " ", User.last_name).contains(
                    f"%{query_params.keyword}%"
                ),
                Event.name.contains(query_params.keyword),
                Application.phone.contains(query_params.keyword),
                Application.email.contains(query_params.keyword),
                Event.id.cast(String).contains(query_params.keyword),
            )
        )

    if query_params.apply_at_from:
        filters.append(
            Application.created_at.cast(Date) >= query_params.apply_at_from.date()
        )

    if query_params.apply_at_to:
        filters.append(
            Application.created_at.cast(Date) <= query_params.apply_at_to.date()
        )

    if query_params.is_checked_in:
        filters.append(Application.check_in_at.isnot(None))

    if query_params.job_type_code:
        filters.append(Application.job_type_code == query_params.job_type_code)

    if query_params.industry_code:
        filters.append(Application.industry_code == query_params.industry_code)

    if query_params.sort_by == AttendeeSortByCode.NAME:
        sort_by = User.first_name.asc()

    return filters, sort_by
