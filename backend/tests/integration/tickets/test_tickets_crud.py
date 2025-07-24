import pytest
from fastapi.testclient import TestClient
from starlette.status import (
    HTTP_400_BAD_REQUEST,
    HTTP_401_UNAUTHORIZED,
    HTTP_422_UNPROCESSABLE_ENTITY,
)

from backend.core.error_code import ErrorCode


@pytest.mark.api
@pytest.mark.integration
def test_create_ticket(
    authenticated_organizer_client: TestClient, create_ticket_payload
):
    create_response = authenticated_organizer_client.post(
        "/api/v1/tickets/", json=create_ticket_payload
    )
    result = create_response.json()
    assert result is not None

    get_response = authenticated_organizer_client.get(f"/api/v1/tickets/{result}/draft")
    result = get_response.json()
    assert result["name"] == create_ticket_payload["name"]
    assert result["quantity"] == create_ticket_payload["quantity"]
    assert result["description"] == create_ticket_payload["description"]
    assert result["price"] == create_ticket_payload["price"]
    # assert result["sales_start_at"] == create_ticket_payload["sales_start_at"]
    # assert result["sales_end_at"] == create_ticket_payload["sales_end_at"]
    # assert result["expired_at"] == create_ticket_payload["expired_at"]
    assert result["type"] == create_ticket_payload["type"]
    assert result["delivery_method"] == create_ticket_payload["delivery_method"]
    assert result["access_link_url"] == create_ticket_payload["access_link_url"]
    assert (
        result["cancellation_policy_code"]
        == create_ticket_payload["cancellation_policy_code"]
    )
    # assert (
    #     result["cancelable_before_at"] == create_ticket_payload["cancelable_before_at"]
    # )
    # assert result["refund_method_code"] == create_ticket_payload["refund_method_code"]
    # assert result["cancelation_fee"] == create_ticket_payload["cancelation_fee"]
    # assert result["refund_percentage"] == create_ticket_payload["refund_percentage"]


@pytest.mark.api
@pytest.mark.integration
def test_create_ticket_with_non_authenticated_user(client):
    response = client.post("/api/v1/tickets/", json={})
    assert response.status_code == HTTP_401_UNAUTHORIZED


@pytest.mark.api
@pytest.mark.integration
def test_create_update_ticket(
    authenticated_organizer_client: TestClient,
    create_ticket_payload,
    update_ticket_payload,
):
    create_response = authenticated_organizer_client.post(
        "/api/v1/tickets/",
        json=create_ticket_payload,
    )
    result = create_response.json()
    assert result is not None
    ticket_id = result

    update_response = authenticated_organizer_client.patch(
        f"/api/v1/tickets/{ticket_id}", json=update_ticket_payload
    )
    result = update_response.json()
    assert result is not None

    get_response = authenticated_organizer_client.get(
        f"/api/v1/tickets/{ticket_id}/draft"
    )
    result = get_response.json()
    assert result["name"] != create_ticket_payload["name"]
    assert result["name"] == update_ticket_payload["name"]
    assert result["quantity"] == update_ticket_payload["quantity"]
    assert result["description"] == update_ticket_payload["description"]
    assert result["price"] == update_ticket_payload["price"]
    # assert result["sales_start_at"] == update_ticket_payload["sales_start_at"]
    # assert result["sales_end_at"] == update_ticket_payload["sales_end_at"]
    # assert result["expired_at"] == update_ticket_payload["expired_at"]
    assert result["type"] == update_ticket_payload["type"]
    assert result["delivery_method"] == update_ticket_payload["delivery_method"]
    assert result["access_link_url"] == update_ticket_payload["access_link_url"]
    assert (
        result["cancellation_policy_code"]
        != update_ticket_payload["cancellation_policy_code"]
    )
    # assert (
    #     result["cancelable_before_at"] == update_ticket_payload["cancelable_before_at"]
    # )
    # assert result["refund_method_code"] == update_ticket_payload["refund_method_code"]
    # assert result["cancelation_fee"] == update_ticket_payload["cancelation_fee"]
    # assert result["refund_percentage"] == update_ticket_payload["refund_percentage"]


@pytest.mark.api
@pytest.mark.integration
def test_create_delete_ticket(
    authenticated_organizer_client: TestClient,
    create_ticket_payload,
):
    create_response = authenticated_organizer_client.post(
        "/api/v1/tickets/", json=create_ticket_payload
    )
    result = create_response.json()
    assert result is not None
    ticket_id = result
    delete_response = authenticated_organizer_client.delete(
        f"/api/v1/tickets/{ticket_id}"
    )

    assert delete_response.status_code == 204

    get_response = authenticated_organizer_client.get(
        f"/api/v1/tickets/{ticket_id}/draft"
    )
    result = get_response.json()
    assert result["error_code"] == ErrorCode.ERR_TICKET_NOT_FOUND


@pytest.mark.api
@pytest.mark.integration
def test_get_ticket_not_found(client):
    response = client.get(f"/api/v1/tickets/{10}/draft")
    assert response.status_code == HTTP_400_BAD_REQUEST


@pytest.mark.api
@pytest.mark.integration
def test_create_ticket_wrong_payload(authenticated_organizer_client):
    response = authenticated_organizer_client.post("/api/v1/tickets/", json={})
    assert response.status_code == 422


@pytest.mark.api
@pytest.mark.integration
def test_update_ticket_wrong_payload(authenticated_organizer_client):
    response = authenticated_organizer_client.patch(f"/api/v1/tickets/{1}", json={})
    assert response.status_code == 422


@pytest.mark.api
@pytest.mark.integration
def test_update_not_exist_ticket(authenticated_organizer_client):
    response = authenticated_organizer_client.patch(f"/api/v1/tickets/{10}", json={})
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.api
@pytest.mark.integration
def test_delete_not_exist_ticket(authenticated_organizer_client):
    response = authenticated_organizer_client.delete(f"/api/v1/tickets/{10}")
    assert response.status_code == HTTP_400_BAD_REQUEST


@pytest.mark.api
@pytest.mark.integration
def test_create_ticket_with_not_supported_type(authenticated_organizer_client):
    response = authenticated_organizer_client.post(
        "/api/v1/tickets/", json={"type": "not_supported_type"}
    )
    assert response.status_code == HTTP_422_UNPROCESSABLE_ENTITY


@pytest.mark.api
@pytest.mark.integration
def test_create_ticket_with_fake_token(
    authenticated_organizer_client, create_ticket_payload
):
    authenticated_organizer_client.headers.update(
        {"Authorization": "Bearer fake_token"}
    )
    response = authenticated_organizer_client.post(
        "/api/v1/tickets/", json=create_ticket_payload
    )
    assert response.status_code == HTTP_401_UNAUTHORIZED
