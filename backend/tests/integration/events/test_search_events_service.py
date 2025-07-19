from datetime import datetime, timedelta

import pytest

from backend.core.constants import OrganizationTypeCode, ORGStatusCode
from backend.models.event import Event
from backend.models.organization import Organization
from backend.schemas.event import SearchEventsQueryParams
from backend.services.events.search_events_service import search_events


@pytest.fixture
def seed_event(session):
    org = Organization(
        name="Test Org",
        slug="test-org",
        hp_url="https://test.org",
        city_code="TST",
        contact_email="test@test.org",
        status=ORGStatusCode.APPROVED,
        type=OrganizationTypeCode.BUSINESS,
    )
    session.add(org)
    session.commit()

    event = Event(
        name="Test Event",
        slug="test-event",
        organization_id=org.id,
        published_at=datetime.utcnow(),
        start_at=datetime.utcnow() + timedelta(days=10),
        end_at=datetime.utcnow() + timedelta(days=11),
        status="PUBLIC",
    )
    session.add(event)
    session.commit()
    return event


def test_search_events_basic(session, seed_event):
    params = SearchEventsQueryParams(
        keyword="Test",
        per_page=10,
        page=1,
    )
    user = None
    print("params", params)
    results, total = search_events(session, user, params)
    assert total >= 1
    assert any("Test Event" in e["name"] for e in results)
