from datetime import datetime

from sqlalchemy import func
from sqlmodel import Session, select

from backend.core.config import settings
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.mails.mail import Email
from backend.models.application import Application
from backend.models.event import Event, EventMeetingToolCode
from backend.models.organization import Organization
from backend.models.question_answer_result import QuestionAnswerResult
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
                Application.deleted_at.is_(None),
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
            .where(Ticket.id == request.ticket_id, Application.deleted_at.is_(None))
            .group_by(Ticket.id)
        )

        if remain_ticket_number == 0:
            raise BadRequestException(
                ErrorCode.ERR_TICKET_SOLD_OUT,
                ErrorMessage.ERR_TICKET_SOLD_OUT,
            )

        application_order_number = db.scalar(
            select(func.count(Application.id))
            .where(Application.event_id == event_id)
            .group_by(Application.event_id)
        )

        if application_order_number is None:
            application_order_number = 1
        else:
            application_order_number = int(application_order_number) + 1

        event_id_str = f"{event_id:06d}"
        app_order_num_str = f"{application_order_number:07d}"
        display_id = event_id_str + app_order_num_str

        application = Application(
            event_id=event_id,
            event_name=event.name,
            user_id=current_user.id,
            email=request.email,
            first_name=request.first_name,
            last_name=request.last_name,
            workplace_name=request.workplace_name,
            phone=request.phone,
            industry_code=request.industry_code,
            job_type_code=request.job_type_code,
            ticket_id=request.ticket_id,
            display_id=display_id,
        )

        save(db, application)

        if request.question_results:
            question_results = []
            for question_result in request.question_results:
                result = QuestionAnswerResult(
                    event_id=event_id,
                    application_id=application.id,
                    question_id=question_result.question_id,
                    answers_ids=question_result.answers_ids,
                )
                question_results.append(result)

            db.bulk_insert_mappings(QuestionAnswerResult, question_results)
            db.flush()
            db.commit()

    except Exception as e:
        db.rollback()
        raise e

    try:
        organization = db.exec(
            select(Organization).where(Organization.id == event.organization_id)
        ).first()
        organization_emails = db.exec(
            select(User.email).where(
                User.organization_id == event.organization_id, User.deleted_at.is_(None)
            )
        ).all()
        ticket_name = db.exec(
            select(Ticket.name).where(Ticket.id == request.ticket_id)
        ).first()

        meeting_tool_display = {
            EventMeetingToolCode.Zoom: "Zoom",
            EventMeetingToolCode.Meet: "Meet",
            EventMeetingToolCode.Discord: "Discord",
            EventMeetingToolCode.Other: "その他",
            EventMeetingToolCode.ContactLater: "後日連絡",
        }
        ticket = db.get(Ticket, application.ticket_id)
        audience_context = {
            "username": current_user.first_name_kanji + current_user.last_name_kanji,
            "event_name": event.name,
            "ticket_name": ticket.name,
            "ticket_url": "",
            "organization_name": organization.display_name,
            "contact_email": organization.contact_email,
            "datetime": f"{event.start_at}, {event.end_at}",
            "address": event.organize_address,
            "detail_event_url": f"{settings.FRONTEND_AUD_URL}/events/{event.slug}",
            "mypage_url": f"{settings.FRONTEND_AUD_URL}/mypage",
            "message": event.comment,
        }
        organizer_context = {
            "name_org_company": organization.name,
            "name_aud_company": current_user.company_name,
            "event_name": event.name,
            "ticket_name": ticket_name,
            "list_apply_event_url": f"{settings.FRONTEND_ORG_URL}/applications",
            "event_detail_url": f"{settings.FRONTEND_AUD_URL}/events/{event.slug}",
        }
        # Add the meeting_tool_code to the context
        meeting_tool_code = event.meeting_tool_code
        meeting_tool_display_value = meeting_tool_display.get(meeting_tool_code, "後日連絡")

        if meeting_tool_code != EventMeetingToolCode.ContactLater:
            online_meeting = (
                f"オンライン会場（{meeting_tool_display_value}）：{event.meeting_url}"
            )
        else:
            online_meeting = "オンライン会場：視聴用URLに関しては開催日が近づいてまいりましたら主催者より改めてメールでご連絡致しま"

        audience_context["online_meeting"] = online_meeting

        mailer = Email()
        mailer.send_email(
            request.apply_email,
            "to_audience_event_apply_success.html",
            "イベント申込みを受付いたしました",
            audience_context,
        )

        mailer.send_bulk_organization_email(
            organization_emails,
            "to_organizer_event_apply_success.html",
            "【ehaco！】主催イベントへの参加申込みがありました！",
            organizer_context,
        )

        return application.id

    except Exception as e:
        raise e
