from datetime import date

from sqlmodel import Session, select
from db.db import engine
from models.models import FridgeItem
#create some mock data for testing api and frontend

mock_fridge_items = [
    FridgeItem(
        ean="7038010001001",
        name="milk",
        brand="TINE",
        price=24.9,
        weight=1.0,
        weight_unit="l",
        image="https://example.com/images/milk.jpg",
        expiration_date=date(2026, 3, 15),
    ),
    FridgeItem(
        ean="7038010002008",
        name="eggs",
        brand="Prior",
        price=49.9,
        weight=12.0,
        weight_unit="pcs",
        image="https://example.com/images/eggs.jpg",
        expiration_date=date(2026, 3, 20),
    ),
    FridgeItem(
        ean="7038010003005",
        name="cheese",
        brand="Norvegia",
        price=69.9,
        weight=500.0,
        weight_unit="g",
        image="https://example.com/images/cheese.jpg",
        expiration_date=date(2026, 3, 25),
    ),
]

def insert_mock_data(table_name: str):
    with Session(engine) as session:
        items = session.exec(select(FridgeItem)).all()
        lst_items = list(items)
        if len(lst_items) > 0:
            print(f"{table_name} table already has data, skipping mock data insertion")
            return
        
        else:
            for item in mock_fridge_items:
                session.add(item)
            session.commit()
            print(f"Inserted {len(mock_fridge_items)} mock data into the {table_name} table")

if __name__ == "__main__":
    insert_mock_data(table_name="fridge_items")
