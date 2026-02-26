from re import search

from fastapi import FastAPI, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from api_endpoints.db_endpoints import router as kassalapp_router

from mockData.fridgeItems import insert_mock_data
from db.db import init_db, get_session
from models.models import FridgeItem, AddFridgeItem
from services.kassalappAPI.kassalapp import search_and_clean_products


#app entrypoint
app = FastAPI()
app.include_router(kassalapp_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://localhost:8080", "http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/ping")
async def pong():
    return {"ping": "pong!"}


@app.get("/item_search")
def product_search(
    search: str = Query(..., min_length=1, description = "eg. laktosefri lettmelk 1l"),
    filter: str = Query(None, description="optional filter for sorting results, eg. price_asc, price_desc"),
):
    return search_and_clean_products(search=search, filter=filter)