from datetime import date
from typing import Optional

from sqlmodel import SQLModel, Field

class Fridge(SQLModel):
    id: Optional[int] = Field(default=None, primary_key=True)
    ean: str
    name: str
    brand: str
    price: float
    weight: float
    weight_unit: str
    image: str
    expiration_date: Optional[date] = Field(default=None, index=True)


class FridgeItem(Fridge, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class AddFridgeItem(Fridge):
    pass

class Groceries(SQLModel):
    id: Optional[int] = Field(default=None, primary_key=True)
    ean: str
    name: str
    brand: str
    price: float 
    weight: float
    weight_unit: str
    image: str
    expiration_date: Optional[date] = Field(default=None, index=True)

class GroceryItem(Groceries, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)

class AddGroceryItem(Groceries):
    pass