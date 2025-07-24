from fastapi.testclient import TestClient

from backend.core.constants import RoleCode
from backend.core.error_code import ErrorCode
from backend.services.auth.token_service import decode_token


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


def test_register_duplicated_email(client: TestClient):
    response = client.post(
        "/api/v1/auth/register",
        json={
            "email": "test@gmail.com",
            "password": "12345678",
            "first_name": "Test",
            "last_name": "User",
            "confirm_password": "12345678",
        },
    )
    result = response.json()
    assert response.status_code == 400
    assert result["error_code"] == ErrorCode.ERR_USER_ALREADY_EXISTED


def test_login_user(client: TestClient):
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "test@gmail.com",
            "password": "12345678",
            "role_code": RoleCode.AUDIENCE,
        },
    )
    result = response.json()
    assert response.status_code == 200
    assert result["token_type"] == "bearer"
    assert result["access_token"] is not None
    assert result["expire_at"] is not None
    assert result["refresh_token"] is not None
    assert result["refresh_expire_at"] is not None

    payload = decode_token(result["access_token"])
    assert payload is not None
    assert payload["sub"] == "test@gmail.com"
    assert payload["role"] == RoleCode.AUDIENCE


def test_login_user_invalid_password(client: TestClient):
    response = client.post(
        "/api/v1/auth/login",
        json={
            "email": "test@gmail.com",
            "password": "123456789",
            "role_code": RoleCode.AUDIENCE,
        },
    )
    response.json()
    assert response.status_code == 401


def test_change_password(authenticated_client: TestClient):
    response = authenticated_client.post(
        "/api/v1/auth/change-password",
        json={
            "current_password": "12345678",
            "new_password": "123456789",
            "confirm_new_password": "123456789",
        },
    )
    response.json()
    assert response.status_code == 200


def test_get_me(authenticated_client: TestClient):
    response = authenticated_client.get("/api/v1/auth/me")
    result = response.json()
    assert response.status_code == 200
    assert result["email"] == "test@gmail.com"
    assert result["role_code"] == RoleCode.AUDIENCE


def test_refresh_token(authenticated_client: TestClient):
    response = authenticated_client.get(
        "/api/v1/auth/refresh-token/"
        + authenticated_client.headers.get("Authorization").split(" ")[1]
    )  # TODO: generate refresh token
    result = response.json()
    assert response.status_code == 200
    assert result["token_type"] == "bearer"
    assert result["access_token"] is not None
    assert result["expire_at"] is not None
    assert result["refresh_token"] is not None
    assert result["refresh_expire_at"] is not None
