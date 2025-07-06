from sqlmodel import Session

import backend.services.applications as applications_service
from backend.background_tasks.transaction_tasks import process_transaction
from backend.core.constants import CurrencyCode, PaymentMethodCode
from backend.models.application import Application
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
            db, current_user.id, create_application_request, True
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

        transaction = Transaction(
            event_id=event_id,
            application_id=application.id,
            quantity=total_requested_quantity,
            total_amount=0.0,
            status=TransactionStatusCode.PENDING,
            payment_method_code=PaymentMethodCode.FREE,
            currency=CurrencyCode.VND,
            exchange_rate=1.0,
        )
        transaction = save(db, transaction)

        new_transaction_items = []
        for ticket in tickets:
            ticket = dict(ticket)
            for _ in range(total_requested_quantity):
                item = TransactionItem(
                    transaction_id=transaction.id,
                    ticket_id=ticket["id"],
                    amount=0,
                    status=TransactionStatusCode.PENDING,
                    user_id=current_user.id,
                )
                new_transaction_items.append(item)

        db.bulk_save_objects(new_transaction_items)
        db.commit()

        # Use Celery to process the application asynchronously
        process_transaction.delay(
            event_id=event_id,
            user_id=current_user.id,
            application_id=application.id,
            transaction_id=transaction.id,
            ticket_ids=[ticket["id"] for ticket in tickets],
            total_requested_quantity=total_requested_quantity,
            payment_method_code=PaymentMethodCode.FREE,
        )

        return transaction.id

    except Exception as e:
        db.rollback()
        raise e
