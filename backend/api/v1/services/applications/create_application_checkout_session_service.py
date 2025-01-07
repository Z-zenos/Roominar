import json
from uuid import uuid4

import stripe
from sqlmodel import Session

import backend.api.v1.services.applications as applications_service
from backend.core.config import settings
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
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
        result = applications_service.validate_application_tickets(
            db, current_user.id, create_application_request
        )
        event = result["event"]
        tickets = result["tickets"]

        total_amount = 0
        line_items = []
        # Create a unique reference for the transaction
        transaction_reference = f"{current_user.id}-{event_id}-{uuid4()}"

        for ticket in tickets:
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
