from datetime import datetime

from sqlmodel import Session, func, select

from backend.core.constants import TransactionStatusCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.application import Application
from backend.models.event import Event
from backend.models.survey_response_result import SurveyResponseResult
from backend.models.ticket import Ticket
from backend.models.transaction import Transaction
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
        # CHECK IF EVENT IS STILL OPEN FOR APPLY
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

        tickets = db.exec(
            select(
                Ticket.__table__.columns,
                func.greatest(
                    Ticket.quantity - func.sum(Transaction.quantity), 0
                ).label("remain_quantity"),
            )
            .outerjoin(Transaction, Transaction.ticket_id == Ticket.id)
            .where(
                Ticket.id.in_([ticket.id for ticket in request.tickets]),
                Transaction.status == TransactionStatusCode.PURCHASED,
            )
            .group_by(Ticket.id)
        ).all()

        for ticket in tickets:
            if next(
                (
                    request_ticket
                    for request_ticket in request.tickets
                    if request_ticket.id == ticket.id
                    and request_ticket.quantity > ticket.remain_quantity
                ),
                None,
            ):
                raise BadRequestException(
                    ErrorCode.ERR_TICKET_SOLD_OUT, ErrorMessage.ERR_TICKET_SOLD_OUT
                )

        application = db.exec(
            select(Application).where(
                Application.event_id == event_id,
                Application.user_id == current_user.id,
            )
        ).one_or_none()

        if application and (
            application.successful_purchased_ticket_number
            + sum(map(lambda ticket: ticket.quantity, request.tickets))
            > event.max_ticket_number_per_account
        ):
            raise BadRequestException(
                ErrorCode.ERR_MAXIMUM_TICKETS_PER_APPLICATION_REACHED,
                ErrorMessage.ERR_MAXIMUM_TICKETS_PER_APPLICATION_REACHED,
            )

        # CREATE NEW APPLICATION
        if not application:
            application = Application(
                event_id=event_id,
                user_id=current_user.id,
                email=request.email,
                first_name=request.first_name,
                last_name=request.last_name,
                workplace_name=request.workplace_name,
                phone=request.phone,
                industry_code=request.industry_code,
                job_type_code=request.job_type_code,
            )

            save(db, application)

        if len(request.tickets) > 0:
            transactions = []

            transactions.extend(
                [
                    Transaction(
                        application_id=application.id,
                        ticket_id=ticket.id,
                        quantity=ticket.quantity,
                        status=(
                            TransactionStatusCode.PURCHASED
                            if event.max_ticket_number_per_account == 1
                            else TransactionStatusCode.PENDING
                        ),
                        total_amount=ticket.quantity
                        * next(t.price for t in tickets if t.id == ticket.id),
                    )
                    for ticket in request.tickets
                ]
            )

            db.bulk_insert_mappings(Transaction, transactions)

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
