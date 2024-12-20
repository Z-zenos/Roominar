import json
from uuid import uuid4

import stripe
from fastapi import HTTPException, Request
from sqlmodel import Session, func, select

from backend.core.config import settings
from backend.core.constants import IndustryCode, JobTypeCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.application import Application
from backend.models.event import Event
from backend.models.survey_response_result import SurveyResponseResult
from backend.models.ticket import Ticket
from backend.models.transaction import Transaction, TransactionStatusCode
from backend.utils.database import save

stripe.api_key = settings.STRIPE_SECRET_KEY


async def handle_application_transaction(db: Session, request: Request):
    payload = await request.body()
    sig = request.headers.get("stripe-signature")

    try:
        # Verify the Stripe event
        event = stripe.Webhook.construct_event(
            payload, sig, settings.STRIPE_WEBHOOK_SECRET
        )

        session = event["data"]["object"]
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

        # Fetch the event
        event = db.exec(select(Event).where(Event.id == event_id)).one_or_none()
        if not event:
            raise BadRequestException(
                ErrorCode.ERR_EVENT_NOT_FOUND, ErrorMessage.ERR_EVENT_NOT_FOUND
            )

        # Create Application
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
            event["type"] == "checkout.session.completed"
            or event["type"] == "payment_intent.succeeded"
        ):
            # Create Transactions for each ticket in the session
            new_transactions = []
            for ticket_data in tickets:
                ticket_id = int(ticket_data["id"])
                requested_quantity = int(ticket_data["quantity"])
                ticket = db.exec(
                    select(Ticket).where(Ticket.id == ticket_id)
                ).one_or_none()

                if not ticket:
                    raise BadRequestException(
                        ErrorCode.ERR_INVALID_TICKET, ErrorMessage.ERR_INVALID_TICKET
                    )

                # Verify ticket availability
                ticket_transactions = (
                    db.scalar(
                        select(func.sum(Transaction.quantity)).where(
                            Transaction.ticket_id == ticket_id,
                            Transaction.status == TransactionStatusCode.SUCCESS,
                        )
                    )
                    or 0
                )

                remaining_quantity = max(ticket.quantity - ticket_transactions, 0)
                if requested_quantity > remaining_quantity:
                    raise BadRequestException(
                        ErrorCode.ERR_TICKET_SOLD_OUT, ErrorMessage.ERR_TICKET_SOLD_OUT
                    )

                # Create the transaction
                new_transactions.append(
                    Transaction(
                        application_id=application.id,
                        ticket_id=ticket_id,
                        quantity=requested_quantity,
                        total_amount=ticket.price * requested_quantity,
                        status=TransactionStatusCode.SUCCESS,
                        stripe_payment_intent_id=session["payment_intent"],
                        stripe_checkout_session_id=session["id"],
                        reference=f"{transaction_reference}-{uuid4()}",
                    )
                )

            db.bulk_save_objects(new_transactions)
            db.commit()

            return {"status": "success"}

        elif event["type"] == "payment_intent.payment_failed":
            new_transactions = []
            for ticket_data in tickets:
                new_transactions.append(
                    Transaction(
                        application_id=application.id,
                        ticket_id=ticket_id,
                        quantity=requested_quantity,
                        total_amount=ticket.price * requested_quantity,
                        status=TransactionStatusCode.FAILED,
                        stripe_payment_intent_id=session["payment_intent"],
                        stripe_checkout_session_id=session["id"],
                        reference=f"{transaction_reference}-{uuid4()}",
                    )
                )

            db.bulk_save_objects(new_transactions)
            db.commit()

    except (ValueError, stripe.SignatureVerificationError):
        raise HTTPException(status_code=400, detail="Invalid Stripe webhook signature")
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
