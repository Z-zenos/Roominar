from datetime import datetime, timedelta

import pytest
from sqlmodel import Session

from backend.core.constants import EventStatusCode
from backend.models.event import Event


@pytest.fixture(scope="function")
def init_events(db_session: Session):
    events = []
    for i in range(100):
        event = Event(
            name=f"test{i}",
            description=f"test{i}",
            start_at=datetime.now(),
            end_at=datetime.now() + timedelta(days=1),
            status=EventStatusCode.PUBLIC,
            organization_id=1,
            slug=f"test{i}",
            is_online=True,
            is_offline=False,
            organize_city_code="HCM",
            organize_address="123 Nguyen Van Linh, Q9, TP.HCM",
            application_start_at=datetime.now(),
            application_end_at=datetime.now() + timedelta(days=1),
            application_form_url=f"https://test{i}.com",
            max_ticket_number_per_account=10,
            min_ticket_price=100000,
            published_at=datetime.now(),
            total_ticket_number=100,
            cover_image_url=f"https://test{i}.com",
        )
        events.append(event)

    db_session.add_all(events)
    db_session.commit()
