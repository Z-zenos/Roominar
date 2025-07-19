import pytest

from backend.core.constants import TicketDeliveryMethodCode, TicketTypeCode


@pytest.fixture(scope="function")
def create_ticket_payload():
    """Generate a property payload."""
    return {
        "event_id": 1,
        "name": "Test Ticket",
        "quantity": 1,
        "description": "Test Description",
        "price": 100,
        "sales_start_at": "2025-07-19",
        "sales_end_at": "2025-07-20",
        "expired_at": "2025-07-21",
        "type": TicketTypeCode.DONATION,
        "delivery_method": TicketDeliveryMethodCode.ONLINE,
        "access_link_url": "https://test.com",
    }


@pytest.fixture
def update_ticket_payload():
    """Generate an updated property payload."""
    return {
        "name": "Test Ticket Updated",
        "quantity": 1,
        "description": "Test Description Updated",
        "price": 200,
        "sales_start_at": "2025-07-19",
        "sales_end_at": "2025-07-20",
        "expired_at": "2025-07-21",
        "type": TicketTypeCode.DONATION,
    }
