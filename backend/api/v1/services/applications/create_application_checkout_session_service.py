from datetime import datetime

import stripe
from sqlmodel import Session, select

from backend.core.config import settings
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.event import Event
from backend.models.ticket import Ticket
from backend.models.user import User
from backend.schemas.application import CreateApplicationCheckoutSessionRequest
from backend.utils.database import fetch_all


async def create_application_checkout_session(
    db: Session,
    current_user: User,
    create_application_checkout_session_request: CreateApplicationCheckoutSessionRequest,
    event_id: int = None,
):
    # 1. Get currently booked place
    event = db.get(Event, event_id)

    if not event:
        raise BadRequestException(
            ErrorCode.ERR_EVENT_NOT_FOUND, ErrorMessage.ERR_EVENT_NOT_FOUND
        )

    tickets = fetch_all(
        db,
        select(Ticket).where(
            Ticket.id.in_(
                map(
                    lambda ticket: ticket.id,
                    create_application_checkout_session_request.tickets,
                )
            ),
            Ticket.event_id == event_id,
        ),
    )

    for ticket in tickets:
        ticket["requested_quantity"] = next(
            filter(
                lambda ticket: ticket.id == ticket.id,
                create_application_checkout_session_request.tickets,
            )
        ).quantity

    custom_fields = []
    # if has_phone:
    #     custom_fields.append(
    #         {
    #             "key": "phone",
    #             "label": {"custom": "Phone number", "type": "custom"},
    #             "type": "text",
    #             "optional": True,
    #             "text": {"maximum_length": 20},
    #         }
    #     )

    # if has_message:
    #     custom_fields.append(
    #         {
    #             "key": "message",
    #             "label": {
    #                 "custom": "Message for host",
    #                 "type": "custom",
    #             },
    #             "type": "text",
    #             "optional": True,
    #             "text": {"maximum_length": 255},
    #         }
    #     )

    # 2. Create checkout session
    session = stripe.checkout.Session.create(
        line_items=map(
            lambda ticket: {
                "price_data": {
                    "currency": "usd",
                    "product": ticket.id,
                    "product_data": {
                        "name": ticket.name,
                        "description": ticket.description,
                        "metadata": {
                            "price": ticket.price,
                            "requested_quantity": ticket.requested_quantity,
                        },
                    },
                    "unit_amount": ticket.price,
                },
                "quantity": ticket.requested_quantity,
            },
            tickets,
        ),
        custom_fields=custom_fields,
        customer_email=current_user.email,
        metadata={
            "event_id": event.id,
        },
        client_reference_id=f"""
            {current_user.id}{event.id}{int(datetime.now().timestamp())}
            """,
        mode="payment",
        ui_mode="embedded",
        return_url=f"{settings.AUD_FRONTEND_URL}/application/result",
    )

    return session.client_secret
