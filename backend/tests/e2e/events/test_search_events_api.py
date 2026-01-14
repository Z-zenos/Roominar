from backend.core.constants import EventStatusCode
from backend.models.event import Event
from backend.models.organization import Organization

# def test_api_search_events(client, db_session):
#     # Seed some events first
#     org = Organization(name="E2E Org")
#     db_session.add(org)
#     db_session.commit()

#     event = Event(
#         name="E2E Event",
#         slug="e2e-event",
#         organization_id=org.id,
#         published_at=datetime.utcnow(),
#         start_at=datetime.utcnow(),
#         end_at=datetime.utcnow(),
#         status=EventStatusCode.PUBLIC,
#     )
#     db_session.add(event)
#     db_session.commit()

#     response = client.get("/api/v1/events", params={"keyword": "E2E"})
#     assert response.status_code == 200
#     data = response.json()
#     assert data["total"] >= 1
#     assert any("E2E" in e["name"] for e in data["items"])
