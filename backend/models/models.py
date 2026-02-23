from sqlmodel import SQLModel, Field

class Fridge(SQLModel):
    name: str
    category: str
    quantity: int
    unit: str
    expiration_date: str


class FridgeItem(Fridge, table=True):
    id: int = Field(nullable=False, primary_key=True)

class AddFridgeItem(Fridge):
    pass

class Groceries(SQLModel):
    name: str
    category: str
    quantity: int
    unit: str

class GroceryItem(Groceries, table=True):
    id: int = Field(nullable=False, primary_key=True)

class AddGroceryItem(Groceries):
    pass