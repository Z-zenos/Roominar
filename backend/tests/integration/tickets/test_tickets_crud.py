from fastapi.testclient import TestClient


def test_create_ticket(
    authenticated_organizer_client: TestClient, create_ticket_payload
):
    create_response = authenticated_organizer_client.post(
        "/api/v1/tickets/", json=create_ticket_payload
    )
    create_response_json = create_response.json()
    assert create_response.status_code == 201

    ticket_id = create_response_json["data"]["id"]
    get_response = authenticated_organizer_client.get(f"/api/v1/tickets/{ticket_id}")
    ticket_data = get_response.json()["data"]
    assert get_response.status_code == 200
    assert ticket_data["name"] == create_ticket_payload["name"]
    assert ticket_data["quantity"] == create_ticket_payload["quantity"]
    assert ticket_data["description"] == create_ticket_payload["description"]
    assert ticket_data["price"] == create_ticket_payload["price"]
    assert ticket_data["sales_start_at"] == create_ticket_payload["sales_start_at"]
    assert ticket_data["sales_end_at"] == create_ticket_payload["sales_end_at"]
    assert ticket_data["expired_at"] == create_ticket_payload["expired_at"]
    assert ticket_data["type"] == create_ticket_payload["type"]
    assert ticket_data["delivery_method"] == create_ticket_payload["delivery_method"]
    assert ticket_data["access_link_url"] == create_ticket_payload["access_link_url"]
    assert ticket_data["updatedAt"] is None


# @pytest.mark.api
# @pytest.mark.integration
# def test_update_property(
#     test_client, property_payload, update_property_payload, property_endpoint
# ):
#     create_response = test_client.post(property_endpoint, json=property_payload)
#     create_response_json = create_response.json()
#     assert create_response.status_code == 201

#     # Get the created property id
#     property_id = create_response_json["data"]["id"]
#     update_response = test_client.patch(
#         f"{property_endpoint}{property_id}", json=update_property_payload
#     )
#     property_data = update_response.json()["data"]
#     assert update_response.status_code == 202
#     assert property_data["rental_income"] == update_property_payload["rental_income"]
#     assert property_data["property_name"] == update_property_payload["property_name"]
#     assert (
#         property_data["purchase_price"] == property_payload["purchase_price"]
#     )  # Check purchase price is not updated
#     assert (
#         property_data["renovation_cost"] == property_payload["renovation_cost"]
#     )  # Check renovation cost is not updated

#     assert property_data["updatedAt"] is not None


# @pytest.mark.api
# @pytest.mark.integration
# def test_delete_property(test_client, property_payload, property_endpoint):
#     create_response = test_client.post(property_endpoint, json=property_payload)
#     create_response_json = create_response.json()
#     assert create_response.status_code == 201

#     # Get the created property id
#     property_id = create_response_json["data"]["id"]

#     # Delete the property
#     delete_response = test_client.delete(f"/api/v1/property/{property_id}")
#     assert delete_response.status_code == 202

#     # Get the deleted property
#     get_response = test_client.get(f"/api/v1/property/{property_id}")
#     assert get_response.status_code == 404
#     assert get_response.json()["detail"] == "Property not found."
