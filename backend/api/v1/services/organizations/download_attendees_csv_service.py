import io

import pandas as pd
from sqlmodel import Session, func, select

from backend.api.v1.services.organizations.listing_attendees_service import (
    _build_filters_sort,
    _get_attendees,
)
from backend.models.application import Application
from backend.models.check_in import CheckIn
from backend.models.event import Event
from backend.models.transaction import Transaction
from backend.models.user import User
from backend.schemas.organization import DownloadAttendeesRequest

csv_headers = {
    "id": "User ID",
    "user_name": "User Name",
    "email": "Email",
    "event_id": "Event ID",
    "event_name": "Event Name",
    "job_type_code": "Job Type",
    "industry_code": "Industry",
    "workplace_name": "Workplace",
    "phone": "Phone",
    "applied_at": "Applied At",
    "checked_in_at": "Checked In At",
    "application_id": "Application ID",
    "transaction_status": "Transaction Status",
    "check_in_id": "Check In ID",
}


async def download_attendees_csv(
    db: Session, organizer: User, request: DownloadAttendeesRequest
):
    try:
        if request.with_filter:
            filters, sort_by = _build_filters_sort(organizer, request)
            attendees = await _get_attendees(db, filters, sort_by, request)
        else:
            query = (
                select(
                    User.id,
                    func.concat(User.first_name, " ", User.last_name).label(
                        "user_name"
                    ),
                    Application.email,
                    Event.id.label("event_id"),
                    Event.name.label("event_name"),
                    Application.job_type_code,
                    Application.industry_code,
                    Application.workplace_name,
                    Application.phone,
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
                .where(Event.organization_id == organizer.id, User.deleted_at.is_(None))
                .order_by(Application.created_at.desc())
            )

            attendees = db.exec(query).mappings().all()

        df = pd.DataFrame(attendees, columns=csv_headers.keys())
        df["applied_at"] = df["applied_at"].dt.strftime("%Y-%m-%d %H:%M:%S")
        df["checked_in_at"] = df["checked_in_at"].dt.strftime("%Y-%m-%d %H:%M:%S")
        df.rename(columns=csv_headers, inplace=True)

        stream = io.StringIO()
        df.to_csv(stream, index=False)
        return stream

    except Exception as e:
        raise e
