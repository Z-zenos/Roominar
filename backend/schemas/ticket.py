from pydantic import BaseModel


class TicketItem(BaseModel):
    id: int
    name: str
    remain: int
    quantity: int
