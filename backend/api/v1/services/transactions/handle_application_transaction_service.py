import json
from uuid import uuid4

import stripe
from fastapi import HTTPException, Request
from sqlmodel import Session

import backend.api.v1.services.applications as applications_service
from backend.core.config import settings
from backend.core.constants import IndustryCode, JobTypeCode
from backend.models.application import Application
from backend.models.survey_response_result import SurveyResponseResult
from backend.models.ticket_inventory import TicketInventory
from backend.models.transaction import Transaction, TransactionStatusCode
from backend.models.transaction_item import TransactionItem
from backend.utils.database import save

stripe.api_key = settings.STRIPE_SECRET_KEY


async def handle_application_transaction(db: Session, request: Request):
    payload = await request.body()
    sig = request.headers.get("stripe-signature")

    try:
        # Verify the Stripe event
        stripe_event = stripe.Webhook.construct_event(
            payload, sig, settings.STRIPE_WEBHOOK_SECRET
        )

        session = stripe_event["data"]["object"]
        # Extract metadata
        metadata = session.get("metadata", {})
        transaction_reference = metadata["transaction_reference"]
        event_id = int(metadata["event_id"])
        user_id = int(metadata["user_id"])
        email = metadata["email"]
        first_name = metadata["first_name"]
        last_name = metadata.get("last_name")
        workplace_name = metadata.get("workplace_name")
        phone = metadata.get("phone")
        industry_code = metadata.get("industry_code")
        job_type_code = metadata.get("job_type_code")
        survey_response_results = json.loads(
            metadata.get("survey_response_results", [])
        )
        tickets = json.loads(metadata.get("tickets", []))

        result = applications_service.validate_application_tickets(
            db,
            user_id,
            {
                "event_id": event_id,
                "tickets": tickets,
            },
        )

        tickets = result["tickets"]
        total_requested_quantity = result["total_requested_quantity"]
        application = result["application"]

        # Create Application
        if not application:
            application = Application(
                event_id=event_id,
                user_id=user_id,
                email=email,
                first_name=first_name,
                last_name=last_name,
                workplace_name=workplace_name,
                phone=phone,
                industry_code=(
                    IndustryCode(industry_code.split(".")[1]) if industry_code else None
                ),
                job_type_code=(
                    JobTypeCode(job_type_code.split(".")[1]) if job_type_code else None
                ),
            )
            application = save(db, application)

            # Create Survey Response Results
            if survey_response_results:
                survey_responses = [
                    SurveyResponseResult(
                        event_id=event_id,
                        application_id=application.id,
                        email=email,
                        question_id=srr["question_id"],
                        answers_ids=srr["answers_ids"],
                        answer_text=srr.get("answer_text"),
                    )
                    for srr in survey_response_results
                ]
                db.bulk_save_objects(survey_responses)

        # Handle checkout session completion
        if (
            stripe_event["type"] == "checkout.session.completed"
            or stripe_event["type"] == "payment_intent.succeeded"
        ):
            # Create Transaction
            transaction = Transaction(
                event_id=event_id,
                application_id=application.id,
                quantity=total_requested_quantity,
                total_amount=sum(
                    ticket["price"] * ticket["requested_quantity"] for ticket in tickets
                ),
                status=TransactionStatusCode.SUCCESS,
                stripe_payment_intent_id=session["payment_intent"],
                stripe_checkout_session_id=session["id"],
                reference=f"{transaction_reference}-{uuid4()}",
            )

            transaction = save(db, transaction)
            new_transaction_items = []
            update_ticket_inventories = []
            for ticket in tickets:
                update_ticket_inventories.append(
                    {
                        "id": ticket["ticket_inventory_id"],
                        "available_quantity": ticket["available_quantity"]
                        - ticket["requested_quantity"],
                        "sold_quantity": ticket["sold_quantity"]
                        + ticket["requested_quantity"],
                        "ticket_id": ticket["id"],
                        "event_id": event_id,
                    }
                )

                for _ in range(ticket["quantity"]):
                    # Create the transaction item
                    new_transaction_items.append(
                        TransactionItem(
                            transaction_id=transaction.id,
                            ticket_id=ticket["id"],
                            amount=ticket["price"],
                        )
                    )

            db.bulk_update_mappings(TicketInventory, update_ticket_inventories)
            db.bulk_save_objects(new_transaction_items)
            db.commit()

            return {"status": "success"}

        elif stripe_event["type"] == "payment_intent.payment_failed":
            # Create Transaction
            transaction = Transaction(
                event_id=event_id,
                application_id=application.id,
                quantity=total_requested_quantity,
                total_amount=sum(
                    ticket["price"] * ticket["requested_quantity"] for ticket in tickets
                ),
                status=TransactionStatusCode.PENDING,
                stripe_payment_intent_id=session["payment_intent"],
                stripe_checkout_session_id=session["id"],
                reference=f"{transaction_reference}-{uuid4()}",
            )

            transaction = save(db, transaction)

    except (ValueError, stripe.SignatureVerificationError):
        raise HTTPException(status_code=400, detail="Invalid Stripe webhook signature")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
