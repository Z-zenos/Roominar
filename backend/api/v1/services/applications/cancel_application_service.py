from datetime import datetime

from sqlmodel import Session, select

from backend.core.config import settings
from backend.core.constants import ApplicationStatusCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.mails.mail import Email
from backend.models.application import Application
from backend.models.event import Event
from backend.models.organization import Organization
from backend.models.ticket import Ticket
from backend.models.user import User
from backend.utils.database import save
from backend.utils.format_start_end_datetime import format_start_end_datetime


async def cancel_application(db: Session, current_user: User, application_id: int):
    application = db.exec(
        select(Application).where(
            Application.id == application_id,
            Application.user_id == current_user.id,
            Application.canceled_at.is_(None),
        )
    ).one_or_none()

    if not application:
        raise BadRequestException(
            ErrorCode.ERR_APPLICATION_NOT_FOUND,
            ErrorMessage.ERR_APPLICATION_NOT_FOUND,
        )

    try:
        application.canceled_at = datetime.now()
        application.status = ApplicationStatusCode.CANCELED
        save(db, application)

        event = db.exec(
            select(Event, Organization)
            .join(Organization, Organization.id == Event.organization_id)
            .where(Event.id == application.event_id)
        ).one_or_none()

        ticket = db.get(Ticket, application.ticket_id)
        context = {
            "username": current_user.first_name_kanji + current_user.last_name_kanji,
            "organization_name": event.organization_name,
            "contact_url": event.contact_url,
            "event_name": event.name,
            "ticket_name": ticket.name,
            "ticket_url": "",
            "datetime": format_start_end_datetime(event.start_at, event.end_at),
            "address": event.organize_address,
            "meeting_tool_code": event.meeting_tool_code,
            "meeting_url": event.meeting_url,
            "detail_event_url": f"{settings.AUD_FRONTEND_URL}/events/{event.slug}",
        }

        mailer = Email()
        await mailer.send_email(
            current_user.email,
            "cancel_event_application_success.html",
            "Cancel Application Success",
            context,
        )

    except Exception as e:
        db.rollback()
        raise e
