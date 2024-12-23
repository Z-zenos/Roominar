from datetime import datetime

import pytz
from sqlmodel import Session, case, func, select

from backend.core.constants import IndustryCode, JobTypeCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.application import Application
from backend.models.event import Event
from backend.models.survey_response_result import SurveyResponseResult
from backend.models.ticket import Ticket
from backend.models.transaction import Transaction, TransactionStatusCode
from backend.models.user import User
from backend.schemas.application import CreateApplicationRequest
from backend.utils.database import save


async def create_free_application(
    db: Session,
    current_user: User,
    create_application_request: CreateApplicationRequest,
):
    event_id = create_application_request.event_id
    try:
        # CHECK IF EVENT IS STILL OPEN FOR APPLY
        event = db.exec(
            select(Event).where(
                Event.id == event_id, Event.application_end_at >= datetime.now(pytz.utc)
            )
        ).one_or_none()

        if not event:
            raise BadRequestException(
                ErrorCode.ERR_EVENT_NO_LONGER_OPEN_APPLY,
                ErrorMessage.ERR_EVENT_NO_LONGER_OPEN_APPLY,
            )

        tickets = (
            db.exec(
                select(
                    Ticket.__table__.columns,
                    case(
                        (
                            (
                                func.max(Transaction.status)
                                == TransactionStatusCode.SUCCESS
                            ),
                            func.greatest(
                                Ticket.quantity - func.sum(Transaction.quantity), 0
                            ),
                        ),
                        else_=Ticket.quantity,  # Default value if the condition is not met
                    ).label("remain_quantity"),
                )
                .outerjoin(Transaction, Transaction.ticket_id == Ticket.id)
                .join(Event, Event.id == Ticket.event_id)
                .where(
                    Ticket.id.in_(
                        [ticket.id for ticket in create_application_request.tickets]
                    ),
                    Event.id == event_id,
                )
                .group_by(Ticket.id)
            )
            .mappings()
            .all()
        )

        if len(tickets) != len(create_application_request.tickets):
            raise BadRequestException(
                ErrorCode.ERR_INVALID_TICKET, ErrorMessage.ERR_INVALID_TICKET
            )

        for ticket in tickets:
            ticket = dict(ticket)
            if ticket["price"] > 0:
                raise BadRequestException(
                    ErrorCode.ERR_TICKET_NOT_FREE, ErrorMessage.ERR_TICKET_NOT_FREE
                )

            if next(
                (
                    request_ticket
                    for request_ticket in create_application_request.tickets
                    if request_ticket.id == ticket["id"]
                    and request_ticket.quantity > ticket["remain_quantity"]
                ),
                None,
            ):
                raise BadRequestException(
                    ErrorCode.ERR_TICKET_SOLD_OUT, ErrorMessage.ERR_TICKET_SOLD_OUT
                )

        application = db.exec(
            select(
                Application.__table__.columns,
                func.count(Transaction.id).label("purchased_ticket_number"),
            )
            .outerjoin(Transaction, Transaction.application_id == Application.id)
            .where(
                Application.event_id == event_id,
                Application.user_id == current_user.id,
            )
            .where(Transaction.status == TransactionStatusCode.SUCCESS)
            .group_by(Application.id)
        ).one_or_none()

        if application and (
            application.purchased_ticket_number
            + sum(
                map(
                    lambda ticket: ticket.quantity,
                    create_application_request.tickets,
                )
            )
            > event.max_ticket_number_per_account
        ):
            raise BadRequestException(
                ErrorCode.ERR_MAXIMUM_TICKETS_PER_APPLICATION_REACHED,
                ErrorMessage.ERR_MAXIMUM_TICKETS_PER_APPLICATION_REACHED,
            )

        # Create Application
        application = Application(
            event_id=event_id,
            user_id=current_user.id,
            email=create_application_request.email,
            first_name=create_application_request.first_name,
            last_name=create_application_request.last_name,
            workplace_name=create_application_request.workplace_name,
            phone=create_application_request.phone,
            industry_code=(
                IndustryCode(create_application_request.industry_code.split(".")[1])
                if create_application_request.industry_code
                else None
            ),
            job_type_code=(
                JobTypeCode(create_application_request.job_type_code.split(".")[1])
                if create_application_request.job_type_code
                else None
            ),
        )
        application = save(db, application)

        # Create Survey Response Results
        if create_application_request.survey_response_results:
            survey_responses = [
                SurveyResponseResult(
                    event_id=event_id,
                    application_id=application.id,
                    email=create_application_request.email,
                    question_id=srr["question_id"],
                    answers_ids=srr["answers_ids"],
                    answer_text=srr.get("answer_text"),
                )
                for srr in create_application_request.survey_response_results
            ]
            db.bulk_save_objects(survey_responses)

        # Create Transactions for each ticket in the session
        new_transactions = []
        for ticket in tickets:
            ticket_id = int(ticket["id"])
            requested_quantity = int(ticket["quantity"])

            # Create the transaction
            new_transactions.append(
                Transaction(
                    application_id=application.id,
                    ticket_id=ticket_id,
                    quantity=requested_quantity,
                    total_amount=0,
                    status=TransactionStatusCode.SUCCESS,
                )
            )

        db.bulk_save_objects(new_transactions)
        db.commit()

        return application.id

    except Exception as e:
        db.rollback()
        raise e
