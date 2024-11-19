from datetime import datetime

from sqlmodel import Session, func, select

from backend.core.config import settings
from backend.core.constants import ApplicationStatusCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.mails.mail import Email
from backend.models.application import Application
from backend.models.event import Event
from backend.models.organization import Organization
from backend.models.survey_response_result import SurveyResponseResult
from backend.models.ticket import Ticket
from backend.models.user import User
from backend.schemas.application import CreateApplicationRequest
from backend.utils.database import save


async def create_application(
    db: Session,
    request: CreateApplicationRequest,
    current_user: User,
    event_id: int,
):
    try:
        # VERIFY APPLICATION
        event = db.exec(
            select(Event).where(
                Event.id == event_id, Event.application_end_at >= datetime.now()
            )
        ).one_or_none()

        if not event:
            raise BadRequestException(
                ErrorCode.ERR_EVENT_NO_LONGER_OPEN_APPLY,
                ErrorMessage.ERR_EVENT_NO_LONGER_OPEN_APPLY,
            )

        application = db.exec(
            select(Application).where(
                Application.event_id == event_id,
                Application.email == request.email,
                Application.ticket_id == request.ticket_id,
                Application.canceled_at.is_(None),
            )
        ).one_or_none()

        if application:
            raise BadRequestException(
                ErrorCode.ERR_APPLICATION_ALREADY_EXISTED,
                ErrorMessage.ERR_APPLICATION_ALREADY_EXISTED,
            )

        remain_ticket_number = db.scalar(
            select(func.greatest((Ticket.quantity - func.count(Application.id)), 0))
            .outerjoin(Application, Application.ticket_id == Ticket.id)
            .where(Ticket.id == request.ticket_id, Application.canceled_at.is_(None))
            .group_by(Ticket.id)
        )

        if remain_ticket_number == 0:
            raise BadRequestException(
                ErrorCode.ERR_TICKET_SOLD_OUT,
                ErrorMessage.ERR_TICKET_SOLD_OUT,
            )

        # CREATE NEW APPLICATION
        application = Application(
            event_id=event_id,
            event_name=event.name,
            user_id=current_user.id,
            email=request.email,
            first_name=request.first_name,
            last_name=request.last_name,
            workplace_name=request.workplace_name,
            phone=request.phone,
            ticket_id=request.ticket_id,
            status=ApplicationStatusCode.CONFIRMED,
        )

        save(db, application)

        if len(request.survey_response_results) > 0:
            survey_response_results = []

            survey_response_results.extend(
                [
                    SurveyResponseResult(
                        event_id=event_id,
                        application_id=application.id,
                        email=application.email,
                        question_id=srr.question_id,
                        answers_ids=srr.answers_ids,
                        answer_text=srr.answer_text,
                    )
                    for srr in request.survey_response_results
                ]
            )

            db.bulk_insert_mappings(SurveyResponseResult, survey_response_results)
            db.flush()
            db.commit()

    except Exception as e:
        db.rollback()
        raise e

    try:
        organization = db.exec(
            select(Organization).where(Organization.id == event.organization_id)
        ).first()

        # organization_emails = db.exec(
        #     select(User.email).where(
        #         User.organization_id == event.organization_id,
        #         User.deleted_at.is_(None),
        #     )
        # ).all()

        ticket = db.get(Ticket, request.ticket_id)
        audience_context = {
            "username": current_user.first_name + current_user.last_name,
            "event_name": event.name,
            "ticket_name": ticket.name,
            "ticket_url": ticket.access_link_url,
            "organization_name": organization.name,
            "contact_email": organization.contact_email,
            "datetime": f"{event.start_at}, {event.end_at}",
            "address": event.organize_address,
            "meeting_tool": event.meeting_tool_code,
            "detail_event_url": f"{settings.AUD_FRONTEND_URL}/events/{event.slug}",
            "mypage_url": f"{settings.AUD_FRONTEND_URL}/mypage",
            "message": event.comment,
        }
        # organizer_context = {
        #     "name_org_company": organization.name,
        #     "name_aud_company": current_user.company_name,
        #     "event_name": event.name,
        #     "ticket_name": ticket.name,
        #     "list_apply_event_url": f"{settings.FRONTEND_ORG_URL}/applications",
        #     "event_detail_url": f"{settings.FRONTEND_AUD_URL}/events/{event.slug}",
        # }
        # Add the meeting_tool_code to the context

        mailer = Email()
        await mailer.send_aud_email(
            request.email,
            "apply_event_success.html",
            "Thanks to apply our event.",
            audience_context,
        )

        # mailer.send_bulk_organization_email(
        #     organization_emails,
        #     "to_organizer_event_apply_success.html",
        #     organizer_context,
        # )

        return application.id

    except Exception as e:
        raise e
