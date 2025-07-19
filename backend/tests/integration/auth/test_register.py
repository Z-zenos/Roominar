from fastapi.testclient import TestClient


def test_register_user(client: TestClient):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@example.com",
            "password": "12345678",
            "first_name": "Test",
            "last_name": "User",
            "confirm_password": "12345678",
        },
    )
    result = response.json()
    assert response.status_code == 200
    assert result["email"] == "test@example.com"
    assert result["expire_at"] is not None
