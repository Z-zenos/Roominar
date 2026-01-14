import pytest

from backend.core.constants import (
    RefundMethodCode,
    TicketCancellationPolicyCode,
    TicketDeliveryMethodCode,
    TicketTypeCode,
)


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
        "cancellation_policy_code": TicketCancellationPolicyCode.NO_REFUND,
        "cancelable_before_at": "2025-07-19",
        "refund_method_code": RefundMethodCode.ORIGINAL_PAYMENT_METHOD,
        "cancelation_fee": 10,
        "refund_percentage": 10,
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
        "delivery_method": TicketDeliveryMethodCode.OFFLINE,
        "access_link_url": "https://test.com",
        "cancellation_policy_code": TicketCancellationPolicyCode.PARTIAL_REFUND,
        "cancelable_before_at": "2025-07-19",
        "refund_method_code": RefundMethodCode.BANK_TRANSFER,
        "cancelation_fee": 10,
        "refund_percentage": 10,
    }
