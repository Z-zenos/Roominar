from pydantic import BaseModel


class ManualCheckInRequest(BaseModel):
    ticket_id: int | None
    application_id: int | None
    transaction_item_id: int | None


class QRCheckInRequest(BaseModel):
    qr_code_id: str
    event_id: int
    user_id: int
    checksum: str
