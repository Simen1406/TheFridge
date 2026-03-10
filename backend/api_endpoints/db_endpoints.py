from fastapi import APIRouter, Depends, Query, FastAPI
from sqlmodel import Session, select

from mockData.groceryItem import insert_mock_groceries
from db.db import get_session, init_db
from mockData.fridgeItems import insert_mock_fridge_items
from models.models import AddFridgeItem, AddGroceryItem, FridgeItem, GroceryItem
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

@router.get("/grocery-items_from_db")
def get_grocery_items(session: Session = Depends(get_session)):
    statement = select(GroceryItem).order_by(GroceryItem.price)   
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

@router.post("/ManualAddGroceryItem")
def add_grocery_item(item: AddGroceryItem, session: Session = Depends(get_session)):
    new_item = GroceryItem.model_validate(item)
    session.add(new_item)
    session.commit()
    session.refresh(new_item)
    return new_item

@router.post("/deleteFridgeItem")
def delete_fridge_item(item_id:int, session: Session = Depends(get_session)):
    success = delete_item_by_id(table_name="fridge_items", item_id=item_id)
    if success:
        return {"message": f"Item with id {item_id} deleted successfully."}
    else:
        return {"message": f"Item with id {item_id} not found."}
    
@router.post("/deleteGroceryItem")
def delete_grocery_item(item_id:int, session: Session = Depends(get_session)):
    success = delete_item_by_id(table_name="grocery_items", item_id=item_id)
    if success:
        return {"message": f"Item with id {item_id} deleted successfully."}
    else:
        return {"message": f"Item with id {item_id} not found."}