from sqlmodel import Session

import backend.api.v1.services.applications as applications_service
from backend.models.application import Application
from backend.models.survey_response_result import SurveyResponseResult
from backend.models.ticket_inventory import TicketInventory
from backend.models.transaction import Transaction, TransactionStatusCode
from backend.models.transaction_item import TransactionItem
from backend.models.user import User
from backend.schemas.application import CreateApplicationRequest
from backend.utils.database import save


async def create_free_application(
    db: Session,
    current_user: User,
    create_application_request: CreateApplicationRequest,
):
    try:
        event_id = create_application_request.event_id
        result = applications_service.validate_application_tickets(
            db, current_user.id, create_application_request
        )
        tickets = result["tickets"]
        total_requested_quantity = result["total_requested_quantity"]
        application = result["application"]

        # Create Application
        if not application:
            application = Application(
                event_id=event_id,
                user_id=current_user.id,
                email=create_application_request.email,
                first_name=create_application_request.first_name,
                last_name=create_application_request.last_name,
                workplace_name=create_application_request.workplace_name,
                phone=create_application_request.phone,
                industry_code=(
                    create_application_request.industry_code
                    if create_application_request.industry_code
                    else None
                ),
                job_type_code=(
                    create_application_request.job_type_code
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

        # Create Transaction
        transaction = Transaction(
            event_id=event_id,
            application_id=application.id,
            quantity=total_requested_quantity,
            total_amount=0,
            status=TransactionStatusCode.SUCCESS,
        )
        transaction = save(db, transaction)

        new_transaction_items = []
        update_ticket_inventories = []
        for ticket in tickets:
            ticket = dict(ticket)

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
                        amount=0,
                    )
                )

        db.bulk_update_mappings(TicketInventory, update_ticket_inventories)
        db.bulk_save_objects(new_transaction_items)
        db.commit()

        return application.id

    except Exception as e:
        db.rollback()
        raise e
