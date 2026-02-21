from sqlmodel import SQLModel, Field

class Fridge(SQLModel):
    name: str
    category: str
    quantity: int
    unit: str
    expiration_date: str


class FridgeItem(Fridge, table=True):
    id: int = Field(nullable=False, primary_key=True)

class AddItem(Fridge):
    pass