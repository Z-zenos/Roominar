from sqlmodel import select

from backend.background_tasks.notification_tasks import push_apply_event_notification
from backend.celery import app
from backend.core.constants import (
    CurrencyCode,
    PaymentMethodCode,
    TransactionStatusCode,
    UserActionTypeCode,
)
from backend.db.database import SessionLocal
from backend.models.event import Event
from backend.models.ticket import Ticket
from backend.models.ticket_inventory import TicketInventory
from backend.models.transaction import Transaction
from backend.models.transaction_item import TransactionItem
from backend.models.user import User
from backend.models.user_action import UserAction
from backend.utils.database import save


@app.task(bind=True, max_retries=3, default_retry_delay=5)
def process_free_application(
    self,
    event_id: int,
    user_id: int,
    application_id: int,
    ticket_ids: list[int],
    total_requested_quantity: int,
):
    db = SessionLocal()

    try:
        user = db.get(User, user_id)
        organizer_id = db.exec(
            select(User.id)
            .join(Event, Event.organization_id == User.organization_id)
            .where(Event.id == event_id)
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
        transaction = Transaction(
            event_id=event_id,
            application_id=application_id,
            quantity=total_requested_quantity,
            total_amount=0,
            status=TransactionStatusCode.SUCCESS,
            payment_method_code=PaymentMethodCode.FREE,
            currency=CurrencyCode.VND,
            exchange_rate=1.0,
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
                    - total_requested_quantity,
                    "sold_quantity": ticket["sold_quantity"] + total_requested_quantity,
                    "ticket_id": ticket["id"],
                    "event_id": event_id,
                }
            )

            for _ in range(total_requested_quantity):
                new_transaction_items.append(
                    TransactionItem(
                        transaction_id=transaction.id,
                        ticket_id=ticket["id"],
                        amount=0,
                        status=TransactionStatusCode.SUCCESS,
                        user_id=user.id,
                    )
                )

        user_action = UserAction(
            user_id=user_id,
            event_id=event_id,
            action_type=UserActionTypeCode.PURCHASE_TICKET,
        )

        db.add(user_action)
        db.bulk_update_mappings(TicketInventory, update_ticket_inventories)
        db.bulk_save_objects(new_transaction_items)
        db.commit()

        push_apply_event_notification.delay(
            event_id=event_id,
            sender_id=user.id,
            receiver_id=organizer_id,
            ticket_id=tickets[0].id,
        )

        return {
            "transaction_id": transaction.id,
            "user_id": user.id,
            "status": TransactionStatusCode.SUCCESS,
        }

    except Exception as e:
        print(e)
        db.rollback()
        self.retry(exc=e)
        raise e
    finally:
        db.close()
