from uuid import uuid4

from sqlmodel import select

from backend.background_tasks.notification_tasks import push_apply_event_notification
from backend.celery import app
from backend.core.constants import (
    CurrencyCode,
    PaymentMethodCode,
    TransactionStatusCode,
    UserActionTypeCode,
)
from backend.core.firebase import get_firebase_app
from backend.db.database import SessionLocal
from backend.models.event import Event
from backend.models.ticket import Ticket
from backend.models.ticket_inventory import TicketInventory
from backend.models.transaction import Transaction
from backend.models.transaction_item import TransactionItem
from backend.models.user_action import UserAction
from backend.services.qrcode.qrcode_service import QrcodeService
from backend.utils.database import save
from backend.utils.logger import logger


@app.task(bind=True, max_retries=3, default_retry_delay=5)
def process_transaction(
    self,
    event_id: int,
    user_id: int,
    application_id: int,
    ticket_ids: list[int],
    total_requested_quantity: int,
    total_amount: float,
    payment_method_code: PaymentMethodCode,
    payment_extra: dict = None,
):
    db = SessionLocal()
    get_firebase_app()
    qr_service = QrcodeService()

    try:
        organization_id = db.exec(
            select(Event.organization_id).where(Event.id == event_id)
        ).one_or_none()

        tickets = tickets = (
            db.exec(
                select(
                    Ticket.__table__.columns,
                    TicketInventory.available_quantity,
                    TicketInventory.sold_quantity,
                    TicketInventory.id.label("ticket_inventory_id"),
                )
                .join(Event, Event.id == Ticket.event_id)
                .join(TicketInventory, TicketInventory.ticket_id == Ticket.id)
                .where(
                    Ticket.id.in_(ticket_ids),
                    Event.id == event_id,
                )
            )
            .mappings()
            .all()
        )
        if payment_method_code == PaymentMethodCode.FREE:
            transaction = Transaction(
                event_id=event_id,
                application_id=application_id,
                quantity=total_requested_quantity,
                total_amount=total_amount,
                status=TransactionStatusCode.SUCCESS,
                payment_method_code=payment_method_code,
                currency=CurrencyCode.VND,
                exchange_rate=1.0,
            )
        else:
            transaction = Transaction(
                event_id=event_id,
                application_id=application_id,
                quantity=total_requested_quantity,
                total_amount=total_amount,
                status=TransactionStatusCode.SUCCESS,
                payment_method_code=payment_method_code,
                currency=CurrencyCode.VND,
                exchange_rate=1.0,
                **payment_extra,  # type: ignore
            )
        transaction = save(db, transaction)

        new_transaction_items = []
        update_ticket_inventories = []

        for ticket in tickets:
            ticket = dict(ticket)
            print(
                {
                    "id": ticket["ticket_inventory_id"],
                    "available_quantity": ticket["available_quantity"]
                    - total_requested_quantity,
                    "sold_quantity": ticket["sold_quantity"] + total_requested_quantity,
                    "ticket_id": ticket["id"],
                    "event_id": event_id,
                }
            )
            update_ticket_inventories.append(
                {
                    "id": ticket["ticket_inventory_id"],
                    "available_quantity": ticket["available_quantity"]
                    - total_requested_quantity,
                    "sold_quantity": ticket["sold_quantity"] + total_requested_quantity,
                    "ticket_id": ticket["id"],
                    "event_id": event_id,
                }
            )

            for _ in range(total_requested_quantity):
                qr_code_id = str(uuid4())
                qr_data = qr_service.generate_qr_data(
                    qr_code_id=qr_code_id,
                    user_id=user_id,
                    event_id=event_id,
                )
                qr_img = qr_service.generate_qr_image(qr_data)
                filename = f"qr_{qr_code_id}"
                qr_url = qr_service.upload_qr_to_cloudinary(qr_img, filename)

                item = TransactionItem(
                    transaction_id=transaction.id,
                    ticket_id=ticket["id"],
                    amount=ticket["price"],
                    status=TransactionStatusCode.SUCCESS,
                    user_id=user_id,
                    qr_code_id=qr_code_id,
                    qr_code_url=qr_url,
                )
                new_transaction_items.append(item)

        user_action = UserAction(
            user_id=user_id,
            event_id=event_id,
            organization_id=organization_id,
            action_type=UserActionTypeCode.PURCHASE_TICKET,
        )

        db.add(user_action)
        db.bulk_update_mappings(TicketInventory, update_ticket_inventories)
        db.bulk_save_objects(new_transaction_items)
        db.commit()

        logger.info(
            f"User {user_id} applied for event {event_id} with application ID {application_id}"
        )

        push_apply_event_notification.delay(
            event_id=event_id,
            sender_id=user_id,
            receiver_id=organization_id,
            ticket_id=tickets[0].id,
        )

        return {
            "transaction_id": transaction.id,
            "user_id": user_id,
            "status": TransactionStatusCode.SUCCESS,
        }

    except Exception as e:
        print(e)
        db.rollback()
        self.retry(exc=e)
        raise e
    finally:
        db.close()
