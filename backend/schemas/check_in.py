from pydantic import BaseModel


class CreateCheckInRequest(BaseModel):
    ticket_id: int | None
    transaction_item_id: int | None
