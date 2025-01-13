from sqlmodel import Session, and_, case, func, select

from backend.core.constants import FollowEntityCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.answer import Answer
from backend.models.application import Application
from backend.models.bookmark import Bookmark
from backend.models.check_in import CheckIn
from backend.models.event import Event
from backend.models.follow import Follow
from backend.models.question import Question
from backend.models.survey_response_result import SurveyResponseResult
from backend.models.ticket import Ticket
from backend.models.transaction import Transaction
from backend.models.transaction_item import TransactionItem
from backend.models.user import User


async def get_attendee_detail(db: Session, organizer: User, attendee_id: int):
    query = (
        select(
            User.id,
            func.concat(User.first_name, " ", User.last_name).label("user_name"),
            User.email,
            User.phone,
            User.job_type_code,
            User.industry_code,
            User.workplace_name,
            User.avatar_url,
            case(
                (
                    func.max(Follow.id).isnot(None),
                    True,
                ),
                else_=False,
            ).label("is_followed"),
            func.count(Application.id).label("applied_event_number"),
        )
        .outerjoin(
            Follow,
            and_(
                Follow.follower_id == User.id,
                Follow.entity_code == FollowEntityCode.ORGANIZATION,
            ),
        )
        .outerjoin(Application, Application.user_id == User.id)
        .join(Event, Event.id == Application.event_id)
        .where(User.id == attendee_id, Event.organization_id == organizer.id)
        .group_by(User.id)
    )

    attendee = db.exec(query).mappings().one_or_none()

    if not attendee:
        raise BadRequestException(
            ErrorCode.ERR_ATTENDEE_NOT_FOUND,
            ErrorMessage.ERR_ATTENDEE_NOT_FOUND,
        )

    attendee = dict(attendee)
    attendee["applied_events"] = await _get_applied_events(db, attendee_id)
    return attendee


async def _get_applied_events(db: Session, attendee_id: int):
    AnswersAgg = (
        select(
            SurveyResponseResult.id.label("srr_id"),
            func.array_agg(Answer.answer).label("answers"),
        )
        .join(
            Answer, Answer.id == func.any(SurveyResponseResult.answers_ids)
        )  # Using `ANY` for array matching
        .group_by(SurveyResponseResult.id)
        .subquery()
    )

    AttendeeSurveyResponseResult = (
        select(
            Event.id.label("event_id"),
            func.json_agg(
                func.json_build_object(
                    "question",
                    Question.question,
                    "question_type",
                    Question.type_code,
                    "answers",
                    AnswersAgg.c.answers,
                    "answer_text",
                    SurveyResponseResult.answer_text,
                )
            ).label("survey_response_results"),
        )
        .select_from(SurveyResponseResult)
        .join(Event, Event.id == SurveyResponseResult.event_id)
        .join(Question, Question.id == SurveyResponseResult.question_id)
        .join(Application, Application.id == SurveyResponseResult.application_id)
        .join(AnswersAgg, AnswersAgg.c.srr_id == SurveyResponseResult.id)
        .where(Application.user_id == attendee_id)
        .group_by(Event.id)
        .subquery()
    )

    transaction_histories = (
        db.exec(
            select(
                func.max(Application.event_id).label("event_id"),
                Transaction.id,
                Transaction.status.label("transaction_status"),
                Transaction.total_amount,
                Transaction.created_at.label("purchased_at"),
                Transaction.quantity,
                func.json_agg(
                    func.json_build_object(
                        "id",
                        TransactionItem.id,
                        "ticket_name",
                        Ticket.name,
                        "ticket_id",
                        Ticket.id,
                        "ticket_price",
                        Ticket.price,
                        "ticket_type",
                        Ticket.type,
                        "event_access_link_url",
                        Ticket.access_link_url,
                        "amount",
                        TransactionItem.amount,
                        "note",
                        TransactionItem.note,
                    )
                ).label("ticket_transaction_items"),
            )
            .select_from(Transaction)
            .join(Application, Application.id == Transaction.application_id)
            .join(TransactionItem, TransactionItem.transaction_id == Transaction.id)
            .join(Ticket, Ticket.id == TransactionItem.ticket_id)
            .where(Application.user_id == attendee_id)
            .group_by(Transaction.id)
        )
        .mappings()
        .all()
    )

    query = (
        select(
            Event.id,
            Application.id.label("application_id"),
            Application.created_at.label("applied_at"),
            Event.name,
            Event.start_at,
            Event.end_at,
            Event.application_start_at,
            Event.application_end_at,
            Event.cover_image_url,
            CheckIn.id.label("check_in_id"),
            CheckIn.created_at.label("checked_in_at"),
            Bookmark.id.label("is_bookmarked"),
            case(
                (
                    AttendeeSurveyResponseResult.c.survey_response_results.is_(None),
                    [],
                ),
                else_=AttendeeSurveyResponseResult.c.survey_response_results,
            ).label("survey_response_results"),
        )
        .join(Application, Application.event_id == Event.id)
        .outerjoin(CheckIn, CheckIn.application_id == Application.id)
        .outerjoin(
            Bookmark, and_(Bookmark.event_id == Event.id, Bookmark.event_id == Event.id)
        )
        .outerjoin(
            AttendeeSurveyResponseResult,
            AttendeeSurveyResponseResult.c.event_id == Event.id,
        )
        .where(Application.user_id == attendee_id)
        .order_by(Application.created_at.desc())
    )

    applied_events = db.exec(query).mappings().all()
    applied_events = [dict(event) for event in applied_events]
    for event in applied_events:
        event["transaction_histories"] = [
            {
                "id": transaction["id"],
                "transaction_status": transaction["transaction_status"],
                "total_amount": transaction["total_amount"],
                "purchased_at": transaction["purchased_at"],
                "quantity": transaction["quantity"],
                "ticket_transaction_items": transaction["ticket_transaction_items"],
            }
            for transaction in transaction_histories
            if transaction["event_id"] == event["id"]
        ]

    return applied_events
