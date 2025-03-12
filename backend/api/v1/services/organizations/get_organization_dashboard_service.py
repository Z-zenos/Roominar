from sqlmodel import Session, text

from backend.models.user import User


async def get_organization_dashboard(db: Session, organizer: User):
    query = text(
        """
        WITH event_counts AS (
            SELECT
                COUNT(*) AS total_events,
                COUNT(*) FILTER (
                    WHERE NOW() BETWEEN events.start_at AND events.end_at
                ) AS ongoing_events
            FROM events
            WHERE organization_id = :org_id AND status = 'PUBLIC'
        ),
        revenue_counts AS (
            SELECT COALESCE(SUM(total_amount), 0) AS total_revenue
            FROM transactions
            JOIN events ON transactions.event_id = events.id
            WHERE
                events.organization_id = :org_id AND
                transactions.status = 'SUCCESS' AND
                events.status = 'PUBLIC'
        ),
        ticket_counts AS (
            SELECT
                COALESCE(SUM(ticket_inventories.sold_quantity), 0) AS total_tickets_sold
            FROM ticket_inventories
            JOIN events ON ticket_inventories.event_id = events.id
            WHERE events.organization_id = :org_id AND events.status = 'PUBLIC'
            GROUP BY events.organization_id
        ),
        actual_attendees AS (
            SELECT
                COUNT(ticket_id) AS actual_attendees
            FROM check_ins
            JOIN events ON check_ins.event_id = events.id
            WHERE events.organization_id = :org_id AND events.status = 'PUBLIC'
            GROUP BY events.organization_id
        )
        SELECT
            ec.total_events,
            ec.ongoing_events,
            0 as total_visitors,
            rc.total_revenue,
            0 as total_members,
            tc.total_tickets_sold,
            aa.actual_attendees
        FROM event_counts ec
        JOIN ticket_counts tc ON true
        JOIN revenue_counts rc ON true
        JOIN actual_attendees aa ON true
        """
    )

    dashboard = db.exec(
        query, params={"org_id": organizer.organization_id}
    ).one_or_none()
    return dashboard
