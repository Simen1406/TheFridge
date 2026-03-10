from fastapi import APIRouter, Depends, Query, FastAPI
from sqlmodel import Session, select

from mockData.groceryItem import insert_mock_groceries
from db.db import get_session, init_db
from mockData.fridgeItems import insert_mock_fridge_items
from models.models import AddFridgeItem, FridgeItem
from utils.db_utils.deletion import delete_item_by_id

router = APIRouter()

@router.on_event("startup")
def on_startup():
    init_db()
    insert_mock_groceries(table_name="grocery_items")
    insert_mock_fridge_items(table_name="fridge_items")

@router.get("/fridge-items_from_db")
def get_fridge_items(session: Session = Depends(get_session)):
    statement = select(FridgeItem).order_by(FridgeItem.expiration_date)   
    results = session.exec(statement).all()
    print(type(results))
    return results

@router.post("/ManualAddFridgeItem")
def add_fridge_item(item: AddFridgeItem, session: Session = Depends(get_session)):
    new_item = FridgeItem.model_validate(item)
    session.add(new_item)
    session.commit()
    session.refresh(new_item)
    return new_item

@router.post("/deleteFridgeItem")
def delete_fridge_item(item_id:int, session: Session = Depends(get_session)):
    success = delete_item_by_id(item_id)
    if success:
        return {"message": f"Item with id {item_id} deleted successfully."}
    else:
        return {"message": f"Item with id {item_id} not found."}