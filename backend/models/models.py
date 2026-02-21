from sqlmodel import SQLModel, Field

class FridgeItem(SQLModel):
    name: str
    category: str
    quantity: int
    unit: str
    expiration_date: str


class Item(SQLModel, table=True):
    id: int = Field(nullable=False, primary_key=True)

class AddItem(SQLModel):
    pass