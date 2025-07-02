from sqlmodel import Session, text

from backend.models.user import User


async def get_organization_dashboard(db: Session, organizer: User):
    query = text(
        """
        WITH event_counts AS (
            SELECT
                COUNT(*) AS total_events,
                jsonb_agg(
                    jsonb_build_object(
                        'id', id,
                        'name', name,
                        'slug', slug,
                        'cover_image_url', cover_image_url
                    )
                ) AS ongoing_events
            FROM events
            WHERE
                organization_id = :org_id AND status != 'DRAFT'
                AND NOW() BETWEEN events.application_start_at AND events.end_at
        ),
        revenue_counts AS (
            SELECT
                COALESCE(SUM(total_amount), 0) AS total_revenue,
                COUNT(*) FILTER (
                    WHERE transactions.created_at::date = now()::date
                ) AS today_revenue_count
            FROM transactions
            JOIN events ON transactions.event_id = events.id
            WHERE
                events.organization_id = :org_id AND
                transactions.status = 'SUCCESS' AND
                events.status != 'DRAFT'
        ),
        ticket_counts AS (
            SELECT
                COALESCE(SUM(ticket_inventories.sold_quantity), 0) AS total_tickets_sold,
                COUNT(*) FILTER (
                    WHERE ticket_inventories.created_at::date = now()::date
                ) AS today_ticket_count
            FROM ticket_inventories
            JOIN events ON ticket_inventories.event_id = events.id
            WHERE events.organization_id = :org_id AND events.status != 'DRAFT'
            GROUP BY events.organization_id
        ),
        actual_attendees AS (
            SELECT
                COUNT(ticket_id) AS total_actual_attendees
            FROM check_ins
            JOIN events ON check_ins.event_id = events.id
            WHERE events.organization_id = :org_id AND events.status != 'DRAFT'
            GROUP BY events.organization_id
        )
        SELECT
            ec.total_events,
            ec.ongoing_events,
            0 as total_visitors,
            rc.total_revenue,
            0 as total_members,
            tc.total_tickets_sold,
            aa.total_actual_attendees,
            rc.today_revenue_count,
            tc.today_ticket_count
        FROM event_counts ec
        JOIN ticket_counts tc ON true
        JOIN revenue_counts rc ON true
        LEFT JOIN actual_attendees aa ON true
        """
    )

    dashboard = db.exec(
        query, params={"org_id": organizer.organization_id}
    ).one_or_none()

    if not dashboard:
        return {
            "total_events": 0,
            "ongoing_events": [],
            "total_visitors": 0,
            "total_revenue": 0,
            "total_members": 0,
            "total_tickets_sold": 0,
            "total_actual_attendees": 0,
            "today_revenue_count": 0,
            "today_ticket_count": 0,
        }

    return dashboard
