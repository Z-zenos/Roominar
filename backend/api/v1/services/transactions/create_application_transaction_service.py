# import stripe
from sqlmodel import Session

from backend.models.user import User
from backend.schemas.application import CreateApplicationRequest


async def create_application_transaction(
    db: Session, current_user: User, request: CreateApplicationRequest
):
    request.headers.get("stripe-signature")

    # try:
    #     event = stripe.Webhook.construct_event(request, sig, endpoint_secret)
    # except ValueError as e:
    #     # Invalid payload
    #     raise HTTPException(status_code=400, detail=f"Webhook Error: {e}")
    # except stripe.error.SignatureVerificationError as e:
    #     # Invalid signature
    #     raise HTTPException(status_code=400, detail=f"Webhook Error: {e}")

    # # Handle the checkout.session.completed event
    # if event["type"] == "checkout.session.completed":
    #     session = event["data"]["object"]
    #     await create_booking_checkout(session)
