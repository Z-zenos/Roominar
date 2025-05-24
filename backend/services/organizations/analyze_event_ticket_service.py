from datetime import datetime, timedelta

from sqlmodel import Session, case, func, select

from backend.core.constants import TransactionStatusCode
from backend.core.error_code import ErrorCode, ErrorMessage
from backend.core.exception import BadRequestException
from backend.models.check_in import CheckIn
from backend.models.event import Event
from backend.models.ticket import Ticket
from backend.models.ticket_inventory import TicketInventory
from backend.models.transaction_item import TransactionItem
from backend.models.user import User
from backend.schemas.organization import FilterAnalyzeEventTicketsQueryParams


async def analyze_event_tickets(
    db: Session,
    organizer: User,
    slug: str,
    query_params: FilterAnalyzeEventTicketsQueryParams,
):
    event = db.exec(
        select(Event).where(
            Event.slug == slug, Event.organization_id == organizer.organization_id
        )
    ).one_or_none()

    if not event:
        raise BadRequestException(
            ErrorCode.ERR_EVENT_NOT_FOUND, ErrorMessage.ERR_EVENT_NOT_FOUND
        )

    tickets = (
        db.exec(
            select(Ticket.id, Ticket.sales_start_at).where(Ticket.event_id == event.id)
        )
        .mappings()
        .all()
    )

    if len(tickets) == 0:
        raise ValueError("Event not found or no tickets available")

    tickets = [dict(ticket) for ticket in tickets]

    overview = await _get_event_ticket_statistics_overview(db, event.id)
    ticket_granularity = await _analyze_ticket_granularity(db, event.id, query_params)
    analyze_advanced = await _analyze_event_advanced(
        db,
        event.id,
        tickets_start_at_map={
            ticket["id"]: ticket["sales_start_at"]
            for ticket in tickets
            if ticket["sales_start_at"] is not None
        },
    )

    return {
        "overview": overview,
        "ticket_granularity": ticket_granularity,
        "analyze_advanced": analyze_advanced,
    }


async def _get_event_ticket_statistics_overview(db: Session, event_id: int) -> dict:
    # --- Aggregate Inventory by Event ---
    inventory_agg = db.exec(
        select(
            func.sum(TicketInventory.available_quantity),
            func.sum(TicketInventory.sold_quantity),
            func.sum(TicketInventory.canceled_quantity),
        ).where(TicketInventory.event_id == event_id)
    ).one_or_none()

    available_qty = inventory_agg[0] or 0
    sold_qty = inventory_agg[1] or 0
    canceled_qty = inventory_agg[2] or 0
    total_qty = available_qty + sold_qty + canceled_qty

    # --- Aggregate TransactionItem by Event ---
    transaction_agg = db.exec(
        select(
            func.sum(TransactionItem.amount).label("gross_revenue"),
            func.sum(
                TransactionItem.amount
                - func.coalesce(TransactionItem.refunded_amount, 0)
            ).label("net_revenue"),
        )
        .outerjoin(Ticket, Ticket.id == TransactionItem.ticket_id)
        .where(
            Ticket.event_id == event_id,
            TransactionItem.status != TransactionStatusCode.PENDING,
        )
    ).one_or_none()

    gross_revenue = float(transaction_agg[0] or 0)
    net_revenue = float(transaction_agg[1] or 0)

    # --- Count Check-ins ---
    checkin_count = (
        db.scalar(select(func.count(CheckIn.id)).where(CheckIn.event_id == event_id))
        or 0
    )

    checkin_rate = (checkin_count / sold_qty * 100) if sold_qty else 0.0
    cancel_rate = (canceled_qty / sold_qty * 100) if sold_qty else 0.0

    # --- Ticket-wise breakdown ---
    ticket_stats = db.exec(
        select(
            Ticket.id,
            Ticket.name,
            Ticket.price,
            TicketInventory.sold_quantity,
            TicketInventory.canceled_quantity,
            TicketInventory.available_quantity,
            func.sum(TransactionItem.amount).label("gross_revenue"),
            func.sum(
                TransactionItem.amount
                - func.coalesce(TransactionItem.refunded_amount, 0)
            ).label("net_revenue"),
        )
        .join(TicketInventory, TicketInventory.ticket_id == Ticket.id)
        .outerjoin(TransactionItem, TransactionItem.ticket_id == Ticket.id)
        .where(
            Ticket.event_id == event_id,
            TransactionItem.status != TransactionStatusCode.PENDING,
        )
        .group_by(
            Ticket.id,
            Ticket.name,
            Ticket.price,
            TicketInventory.sold_quantity,
            TicketInventory.canceled_quantity,
            TicketInventory.available_quantity,
        )
    ).all()

    ticket_details = [
        {
            "ticket_id": t[0],
            "ticket_name": t[1],
            "price": float(t[2] or 0),
            "sold_quantity": t[3] or 0,
            "canceled_quantity": t[4] or 0,
            "available_quantity": t[5] or 0,
            "gross_revenue": float(t[6] or 0),
            "net_revenue": float(t[7] or 0),
        }
        for t in ticket_stats
    ]

    return {
        "total_tickets": total_qty,
        "total_sold_tickets": sold_qty,
        "total_canceled_tickets": canceled_qty,
        "total_available_tickets": available_qty,
        "total_gross_revenue": gross_revenue,
        "total_net_revenue": net_revenue,
        "total_checkins": checkin_count,
        "checkin_rate": round(checkin_rate, 2),
        "cancel_rate": round(cancel_rate, 2),
        "tickets": ticket_details,
    }


async def _analyze_ticket_granularity(
    db: Session,
    event_id: int,
    query_params: FilterAnalyzeEventTicketsQueryParams,
):
    granularity = query_params.granularity

    time_bucket = _get_time_bucket(granularity, TransactionItem.created_at)

    revenue_query = (
        select(
            time_bucket.label("time"),
            func.count(TransactionItem.id).label("tickets_sold"),
            func.sum(TransactionItem.amount).label("revenue_gross"),
            func.sum(
                TransactionItem.amount
                - func.coalesce(TransactionItem.refunded_amount, 0)
            ).label("revenue_net"),
        )
        .join(Ticket, Ticket.id == TransactionItem.ticket_id)
        .where(
            Ticket.event_id == event_id,
            TransactionItem.status != TransactionStatusCode.PENDING,
            # TransactionItem.created_at >= start_date,
            # TransactionItem.created_at <= end_date,
        )
        .group_by("time")
        .order_by("time")
    )
    ticket_stats = db.exec(revenue_query).all()

    ticket_stats_by_time = []
    for row in ticket_stats:
        ticket_stats_by_time.append(
            {
                "time": row.time,
                "tickets_sold": int(row.tickets_sold or 0),
                "revenue_gross": float(row.revenue_gross or 0),
                "revenue_net": float(row.revenue_net or 0),
            }
        )

    # === 2. Xu hướng tăng/giảm vé, doanh thu ===
    if len(ticket_stats_by_time) >= 2:
        prev = ticket_stats_by_time[-2]
        curr = ticket_stats_by_time[-1]
        revenue_trend_percent = _calc_trend(curr["revenue_net"], prev["revenue_net"])
        ticket_trend_percent = _calc_trend(curr["tickets_sold"], prev["tickets_sold"])
    else:
        revenue_trend_percent = None
        ticket_trend_percent = None

    # === 3. Lượt check-in === #
    checkin_bucket = _get_time_bucket(granularity, CheckIn.created_at)

    checkin_query = (
        select(
            checkin_bucket.label("time"),
            func.count(CheckIn.id).label("checkins"),
        )
        .where(
            CheckIn.event_id == event_id,
            # CheckIn.created_at >= start_date,
            # CheckIn.created_at <= end_date,
        )
        .group_by("time")
        .order_by("time")
    )
    checkin_stats = db.exec(checkin_query).all()

    checkin_stats_by_time = []
    for row in checkin_stats:
        checkin_stats_by_time.append(
            {
                "time": row.time,
                "checkins": int(row.checkins or 0),
            }
        )

    return {
        "ticket_stats_by_time": ticket_stats_by_time,
        "checkin_stats_by_time": checkin_stats_by_time,
        "revenue_trend_percent": revenue_trend_percent,
        "ticket_trend_percent": ticket_trend_percent,
    }


async def _analyze_event_advanced(
    db: Session,
    event_id: int,
    tickets_start_at_map: dict[int, datetime],  # {ticket_id: start_time}
):
    results = {}

    # === 1. Doanh thu theo loại vé === #
    revenue_query = (
        select(
            Ticket.id.label("ticket_id"),
            Ticket.name.label("ticket_name"),
            Ticket.type.label("ticket_type"),
            func.count(TransactionItem.id).label("tickets_sold"),
            func.sum(TransactionItem.amount).label("revenue_gross"),
            func.sum(
                TransactionItem.amount
                - func.coalesce(TransactionItem.refunded_amount, 0)
            ).label("revenue_net"),
        )
        .outerjoin(TransactionItem, TransactionItem.ticket_id == Ticket.id)
        .where(
            Ticket.event_id == event_id,
            TransactionItem.status != TransactionStatusCode.PENDING,
        )
        .group_by(Ticket.id)
    )
    revenue_rows = db.exec(revenue_query).all()
    results["revenue_by_ticket_type"] = [
        {
            "ticket_id": r.ticket_id,
            "ticket_name": r.ticket_name,
            "ticket_type": r.ticket_type,
            "tickets_sold": int(r.tickets_sold or 0),
            "revenue_gross": float(r.revenue_gross or 0),
            "revenue_net": float(r.revenue_net or 0),
        }
        for r in revenue_rows
    ]

    # === 2. Khung giờ mua vé nhiều nhất === #
    hour_query = (
        select(
            func.to_char(TransactionItem.created_at, "HH24").label("hour"),
            func.count().label("count"),
        )
        .join(Ticket, Ticket.id == TransactionItem.ticket_id)
        .where(
            Ticket.event_id == event_id,
            TransactionItem.status == TransactionStatusCode.SUCCESS,
        )
        .group_by("hour")
        .order_by("hour")
    )
    hour_rows = db.exec(hour_query).all()
    results["top_ticket_purchase_hours"] = [
        {"hour": int(row.hour), "count": int(row.count)} for row in hour_rows
    ]

    # === 3. Khung giờ check-in nhiều nhất === #
    checkin_hour_query = (
        select(
            func.to_char(CheckIn.created_at, "HH24").label("hour"),
            func.count().label("count"),
        )
        .where(CheckIn.event_id == event_id)
        .group_by("hour")
        .order_by("hour")
    )
    checkin_hour_rows = db.exec(checkin_hour_query).all()
    results["top_checkin_hours"] = [
        {"hour": int(row.hour), "count": int(row.count)} for row in checkin_hour_rows
    ]

    # === 4. Tốc độ bán vé: trong 1h, 1 ngày, 1 tuần sau khi mở === #
    sales_speed_result = []

    for ticket_id, start_time in tickets_start_at_map.items():
        subquery = select(
            func.sum(
                case(
                    (
                        TransactionItem.created_at <= start_time + timedelta(hours=1),
                        1,
                    ),
                    else_=0,
                )
            ).label("in_1h"),
            func.sum(
                case(
                    (
                        TransactionItem.created_at <= start_time + timedelta(days=1),
                        1,
                    ),
                    else_=0,
                )
            ).label("in_1d"),
            func.sum(
                case(
                    (
                        TransactionItem.created_at <= start_time + timedelta(days=7),
                        1,
                    ),
                    else_=0,
                )
            ).label("in_1w"),
            func.count().label("total"),
        ).where(
            TransactionItem.ticket_id == ticket_id,
            TransactionItem.status == TransactionStatusCode.SUCCESS,
        )

        row = db.exec(subquery).first()
        sales_speed_result.append(
            {
                "ticket_id": ticket_id,
                "in_1h": int(row.in_1h or 0),
                "in_1d": int(row.in_1d or 0),
                "in_1w": int(row.in_1w or 0),
                "total": int(row.total or 0),
            }
        )

    results["sales_speed"] = sales_speed_result

    # === 5. Thời gian từ mở bán → hết vé === #
    sold_out_result = []
    for ticket_id, start_time in tickets_start_at_map.items():
        first_sell_time = (
            select(TransactionItem.created_at)
            .where(
                TransactionItem.ticket_id == ticket_id,
                TransactionItem.status == TransactionStatusCode.SUCCESS,
            )
            .order_by(TransactionItem.created_at.desc())
            .limit(1)
        )
        last_time = db.exec(first_sell_time).first()
        if last_time:
            diff = last_time - start_time
            sold_out_result.append(
                {
                    "ticket_id": ticket_id,
                    "time_to_sold_out_in_hours": round(diff.total_seconds() / 3600, 2),
                }
            )
    results["time_to_sold_out"] = sold_out_result

    # === 6. Tỉ lệ mua nhưng không check-in === #
    sub = (
        select(
            TransactionItem.id.label("ti_id"),
            TransactionItem.ticket_id,
            func.count(CheckIn.id).label("checkin_count"),
        )
        .join(Ticket, Ticket.id == TransactionItem.ticket_id)
        .outerjoin(CheckIn, CheckIn.transaction_item_id == TransactionItem.id)
        .where(
            Ticket.event_id == event_id,
            TransactionItem.status == TransactionStatusCode.SUCCESS,
        )
        .group_by(TransactionItem.id)
    )
    rows = db.exec(sub).all()
    total = len(rows)
    no_checkin = sum(1 for r in rows if r.checkin_count == 0)
    results["no_checkin_rate"] = (
        round((no_checkin / total * 100), 2) if total > 0 else None
    )

    return results


def _get_time_bucket(granularity: str, model_field):
    if granularity == "daily":
        return func.to_char(model_field, "YYYY-MM-DD")
    elif granularity == "weekly":
        # Lấy theo format: "2024-W23"
        return func.concat(
            func.to_char(model_field, "IYYY"),  # ISO year
            "-W",
            func.to_char(model_field, "IW"),  # ISO week number
        )
    elif granularity == "monthly":
        return func.to_char(model_field, "YYYY-MM")
    else:
        raise ValueError("Invalid granularity")


def _calc_trend(curr_val, prev_val):
    if prev_val == 0:
        return None
    return round((curr_val - prev_val) / prev_val * 100, 2)
