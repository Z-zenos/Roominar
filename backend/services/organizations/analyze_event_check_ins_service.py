from datetime import timedelta

from sqlmodel import Session, func, select

from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.check_in import CheckIn
from backend.models.event import Event
from backend.models.ticket import Ticket
from backend.models.ticket_inventory import TicketInventory
from backend.models.user import User


async def analyze_event_check_ins(db: Session, organizer: User, slug: str):
    try:
        event_id = db.exec(
            select(Event.id).where(
                Event.slug == slug, Event.organization_id == organizer.organization_id
            )
        ).one_or_none()

        if not event_id:
            raise BadRequestException(
                ErrorCode.ERR_EVENT_NOT_FOUND,
                ErrorMessage.ERR_EVENT_NOT_FOUND,
            )

        # Tổng số vé đã bán
        total_sold_tickets = (
            db.scalar(
                select(func.sum(TicketInventory.sold_quantity))
                .join(Ticket, Ticket.id == TicketInventory.ticket_id)
                .where(TicketInventory.event_id == event_id)
            )
            or 0
        )

        # Tổng số lượt check-in
        total_check_ins = (
            db.scalar(
                select(func.count(CheckIn.id)).where(CheckIn.event_id == event_id)
            )
            or 0
        )

        # Tỷ lệ check-in
        check_in_rate = (
            (total_check_ins / total_sold_tickets) if total_sold_tickets else 0
        )

        # Thống kê check-in theo loại vé
        check_in_by_ticket_type = db.exec(
            select(Ticket.type, func.count(CheckIn.id))
            .select_from(CheckIn)
            .join(Ticket, Ticket.id == CheckIn.ticket_id)
            .where(CheckIn.event_id == event_id)
            .group_by(Ticket.type)
        ).all()

        # Thống kê check-in theo từng phút (có thể thiếu phút không có check-in)
        check_ins_raw = db.exec(
            select(
                func.date_trunc("minute", CheckIn.created_at).label("interval"),
                func.count(CheckIn.id),
            )
            .where(CheckIn.event_id == event_id)
            .group_by(func.date_trunc("minute", CheckIn.created_at))
            .order_by("interval")
        ).all()

        # Lấy thời gian bắt đầu và kết thúc check-in
        start_end = db.exec(
            select(
                func.min(CheckIn.created_at),
                func.max(CheckIn.created_at),
            ).where(CheckIn.event_id == event_id)
        ).one()

        check_in_by_minute = []
        if start_end[0] and start_end[1]:
            start_time, end_time = start_end
            minute = start_time.replace(second=0, microsecond=0)
            end_time = end_time.replace(second=0, microsecond=0)
            check_ins_dict = {
                row[0].replace(second=0, microsecond=0): row[1] for row in check_ins_raw
            }

            while minute <= end_time:
                count = check_ins_dict.get(minute, 0)
                check_in_by_minute.append(
                    {"minute": minute.isoformat(), "count": count}
                )
                minute += timedelta(minutes=1)

        return {
            "total_sold_tickets": total_sold_tickets,
            "total_check_ins": total_check_ins,
            "check_in_rate": round(check_in_rate, 2),
            "check_in_by_ticket_type": [
                {"type": row[0], "count": row[1]} for row in check_in_by_ticket_type
            ],
            "check_in_by_minute": check_in_by_minute,
        }
    except Exception as e:
        db.rollback()
        raise e
