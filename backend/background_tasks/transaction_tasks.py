from uuid import uuid4

from sqlmodel import delete, select, update

from backend.background_tasks.notification_tasks import push_apply_event_notification
from backend.celery import app
from backend.core.constants import (
    PaymentMethodCode,
    RoleCode,
    TransactionStatusCode,
    UserActionTypeCode,
)
from backend.core.firebase import get_firebase_app
from backend.db.database import SessionLocal
from backend.models.application import Application
from backend.models.event import Event
from backend.models.ticket import Ticket
from backend.models.ticket_inventory import TicketInventory
from backend.models.transaction import Transaction
from backend.models.transaction_item import TransactionItem
from backend.models.user import User
from backend.models.user_action import UserAction
from backend.services.qrcode.qrcode_service import QrcodeService
from backend.utils.logger import logger


@app.task(bind=True, max_retries=3, default_retry_delay=5)
def process_transaction(
    self,
    event_id: int,
    user_id: int,
    application_id: int,
    transaction_id: int,
    ticket_ids: list[int],
    total_requested_quantity: int,
    payment_method_code: PaymentMethodCode,
    payment_extra: dict = None,
):
    db = SessionLocal()
    get_firebase_app()
    qr_service = QrcodeService()

    try:
        event = db.get(Event, event_id)
        organizer = db.exec(
            select(User).where(
                User.organization_id == event.organization_id,
                User.role_code == RoleCode.ORGANIZER,
            )
        ).one_or_none()

        user = db.get(User, user_id)

        tickets = (
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

        transaction = db.get(Transaction, transaction_id)
        if payment_method_code == PaymentMethodCode.FREE:
            db.exec(
                update(Transaction)
                .where(Transaction.id == transaction_id)
                .values(
                    status=TransactionStatusCode.SUCCESS,
                )
            )
        else:
            db.exec(
                update(Transaction)
                .where(Transaction.id == transaction_id)
                .values(
                    status=TransactionStatusCode.SUCCESS,
                    stripe_payment_intent_id=payment_extra["stripe_payment_intent_id"],  # type: ignore
                )
            )

        update_ticket_inventories = []
        total_purchase_amount = 0

        transaction_items = db.exec(
            select(TransactionItem).where(
                TransactionItem.transaction_id == transaction_id
            )
        ).all()

        update_transaction_items = []
        for transaction_item in transaction_items:
            qr_code_id = str(uuid4())
            qr_data = qr_service.generate_qr_data(
                qr_code_id=qr_code_id,
                user_id=user_id,
                event_id=event_id,
            )
            qr_img = qr_service.generate_qr_image(qr_data)
            filename = f"qr_{qr_code_id}"
            qr_url = qr_service.upload_qr_to_cloudinary(qr_img, filename)
            update_transaction_items.append(
                {
                    "id": transaction_item.id,
                    "status": TransactionStatusCode.SUCCESS,
                    "qr_code_id": qr_code_id,
                    "qr_code_url": qr_url,
                }
            )

        for ticket in tickets:
            ticket = dict(ticket)
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
            total_purchase_amount += ticket["price"]

        user_action = UserAction(
            user_id=user_id,
            event_id=event_id,
            organization_id=organizer.id,
            action_type=UserActionTypeCode.PURCHASE_TICKET,
        )

        db.add(user_action)
        db.bulk_update_mappings(TicketInventory, update_ticket_inventories)
        db.bulk_update_mappings(TransactionItem, update_transaction_items)
        db.exec(
            update(Event)
            .where(Event.id == event_id)
            .values(
                sold_ticket_count=Event.sold_ticket_count + total_requested_quantity
            )
        )
        db.exec(
            update(User)
            .where(User.id == user_id)
            .values(
                point=user.point - total_purchase_amount,
            )
        )
        db.commit()

        logger.info(
            f"User {user_id} applied for event {event_id} with application ID {application_id}"
        )

        push_apply_event_notification.delay(
            event_id=event_id,
            sender_id=user_id,
            receiver_id=organizer.id,
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
        db.exec(
            delete(TransactionItem).where(
                TransactionItem.transaction_id == transaction_id
            )
        )
        db.exec(delete(Transaction).where(Transaction.id == transaction_id))
        db.exec(delete(Application).where(Application.id == application_id))
        db.commit()

        self.retry(exc=e)
        raise e
    finally:
        db.close()
