import json
from datetime import datetime
from uuid import uuid4

import pytz
import stripe
from sqlmodel import Session, case, func, select

from backend.core.config import settings
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.application import Application
from backend.models.event import Event
from backend.models.ticket import Ticket
from backend.models.transaction import Transaction, TransactionStatusCode
from backend.models.user import User
from backend.schemas.application import CreateApplicationRequest

stripe.api_key = settings.STRIPE_SECRET_KEY


async def create_application_checkout_session(
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
                .where(
                    Ticket.id.in_(
                        [ticket.id for ticket in create_application_request.tickets]
                    )
                )
                .group_by(Ticket.id)
            )
            .mappings()
            .all()
        )

        application = db.exec(
            select(
                Application.__table__.columns,
                func.count(Transaction.id).label("purchased_ticket_number"),
            )
            .where(
                Application.event_id == event_id,
                Application.user_id == current_user.id,
            )
            .outerjoin(Transaction, Transaction.application_id == Application.id)
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

        total_amount = 0
        line_items = []
        # Create a unique reference for the transaction
        transaction_reference = f"{current_user.id}-{event_id}-{uuid4()}"

        for ticket in tickets:
            ticket = dict(ticket)
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

            ticket["requested_quantity"] = next(
                filter(
                    lambda x: x.id == ticket["id"],
                    create_application_request.tickets,
                )
            ).quantity
            total_amount += ticket["price"] * ticket["requested_quantity"]

            line_items.append(
                {
                    "price_data": {
                        "currency": "usd",
                        "product_data": {
                            "name": ticket["name"],
                            "description": ticket["description"],
                        },
                        "unit_amount": int(ticket["price"] * 100),
                    },
                    "quantity": ticket["requested_quantity"],
                }
            )

        # Create Stripe Checkout Session
        session = stripe.checkout.Session.create(
            line_items=line_items,
            customer_email=current_user.email,
            metadata={
                "transaction_reference": transaction_reference,
                "event_id": event_id,
                "user_id": current_user.id,
                "email": create_application_request.email,
                "first_name": create_application_request.first_name,
                "last_name": create_application_request.last_name,
                "workplace_name": create_application_request.workplace_name,
                "phone": create_application_request.phone,
                "industry_code": create_application_request.industry_code,
                "job_type_code": create_application_request.job_type_code,
                "tickets": json.dumps(
                    [
                        ticket.model_dump()
                        for ticket in create_application_request.tickets
                    ],
                    separators=(",", ":"),
                ),
                "survey_response_results": (
                    json.dumps(
                        [
                            srr.model_dump()
                            for srr in create_application_request.survey_response_results
                        ],
                        separators=(",", ":"),
                    )
                ),
            },
            client_reference_id=transaction_reference,
            mode="payment",
            ui_mode="embedded",
            return_url=f"{settings.AUD_FRONTEND_URL}/events/{event.slug}/apply/result",
        )

        return session.client_secret

    except stripe.StripeError as e:
        print(e)
        db.rollback()
        raise BadRequestException(
            ErrorCode.ERR_STRIPE_ERROR, ErrorMessage.ERR_STRIPE_ERROR
        )

    except Exception as e:
        print(e)
        db.rollback()
        raise e
