import hashlib
import hmac

from backend.core.config import settings


def generate_checksum(
    qr_code_id: str, user_id: int, event_id: int, secret_key: str
) -> str:
    payload = f"{qr_code_id}:{user_id}:{event_id}".encode()
    return hmac.new(secret_key.encode(), payload, hashlib.sha256).hexdigest()


def verify_qr_checksum(
    qr_code_id: str, user_id: int, event_id: int, checksum: str
) -> bool:
    secret = settings.QR_CHECKIN_SECRET_KEY.encode()
    payload = f"{qr_code_id}:{user_id}:{event_id}".encode()
    expected = hmac.new(secret, payload, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, checksum)
