from sqlmodel import Session
from db.db import engine
from models.models import FridgeItem
#create some mock data for testing api and frontend

mock_fridge_items = [
    FridgeItem(name = "milk", category = "dairy", quantity=1, unit="liter", expiration_date="2024-07-01"),
    FridgeItem(name = "eggs", category = "dairy", quantity=12, unit="pieces", expiration_date="2024-07-10"),
    FridgeItem(name = "cheese", category = "dairy", quantity=200, unit="grams", expiration_date="2024-07-15"),
]

def insert_mock_data(table_name: str):
    with Session(engine) as session:
        for item in mock_fridge_items:
            session.add(item)
        session.commit()
        print(f"Inserted {len(mock_fridge_items)} mock data into the {table_name} table")

if __name__ == "__main__":
    insert_mock_data(table_name="fridge_items")