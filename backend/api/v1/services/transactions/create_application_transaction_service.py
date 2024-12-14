# import stripe
import stripe
import stripe.error
from fastapi import HTTPException
from sqlmodel import Session

from backend.core.config import settings
from backend.models.user import User
from backend.schemas.application import CreateApplicationRequest


async def create_application_transaction(
    db: Session, current_user: User, request: CreateApplicationRequest
):
    payload = await request.body()
    sig = request.headers.get("stripe-signature")

    try:
        event = stripe.Webhook.construct_event(
            payload, sig, settings.STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        # Invalid payload
        raise HTTPException(status_code=400, detail=f"Webhook Error: {e}")
    except stripe.error as e:
        # Invalid signature
        raise HTTPException(status_code=400, detail=f"Webhook Error: {e}")

    # Handle the event
    if event["type"] == "payment_intent.succeeded":
        payment_intent = event["data"]["object"]
        # Then define and call a function to handle the event payment_intent.succeeded
        print(payment_intent)
    else:
        print(f"Unhandled event type {event['type']}")
