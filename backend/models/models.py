from datetime import date
from typing import Optional

from sqlmodel import SQLModel, Field

class Fridge(SQLModel):
    name: str
    category: str
    quantity: int
    unit: str
    expiration_date: Optional[date] = Field(default=None, index=True)


class FridgeItem(Fridge, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class AddFridgeItem(Fridge):
    pass

class Groceries(SQLModel):
    name: str
    category: str
    quantity: int
    unit: str

class GroceryItem(Groceries, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class AddGroceryItem(Groceries):
    pass