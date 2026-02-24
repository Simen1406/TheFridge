import os

from sqlmodel import Session, select
from models.models import FridgeItem
from db.db import engine
from utils.db_utils.deletion import delete_all_items, insert_mock_data

DATABASE_URL = os.getenv("DATABASE_URL")

def delete_table(table_name: str):
    from backend.db.db import engine
    with engine.connect() as connection:
        connection.execute(f"DROP TABLE IF EXISTS {table_name}")
        connection.commit()


def delete_item_by_id(item_id: int):
    with Session(engine) as session:
        item = session.get(FridgeItem, item_id)
        if item:
            session.delete(item)
            session.commit()
            print(f"deleted item with id {item_id}")
            return True
        
        print(f"item with id {item_id} not found")
        return False

def delete_all_items(table_name: str):
    with Session(engine) as session:
        items = session.exec(select(FridgeItem)).all()
        for item in items:
            session.delete(item)
        session.commit()
        print(f"deleted all items from {table_name}")

def clear_and_reseed_table(table_name: str):
    delete_all_items(table_name)
    insert_mock_data()


if __name__ == "__main__":
    delete_all_items("fridge_items")
