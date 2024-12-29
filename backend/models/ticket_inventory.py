from sqlmodel import Field

from backend.models.base_model import BaseModel


class TicketInventory(BaseModel, table=True):
    __tablename__: str = "ticket_inventories"

    ticket_id: int = Field(foreign_key="tickets.id")
    event_id: int = Field(foreign_key="events.id")
    available_quantity: int = Field(default=0)  # Số lượng vé còn lại
    reserved_quantity: int = Field(
        default=0
    )  # Số lượng vé đang được giữ (đặt trước nhưng chưa thanh toán)
    sold_quantity: int = Field(default=0)  # Số lượng vé đã bán
