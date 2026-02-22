from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from mockData.fridgeItems import insert_mock_data
from db.db import init_db, get_session
from models.models import FridgeItem


#app entrypoint
app = FastAPI()
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

@app.on_event("startup")
def on_startup():
    init_db()
    insert_mock_data(table_name="fridge_items")

@app.get("/ping")
async def pong():
    return {"ping": "pong!"}

@app.get("/fridge-items")
def get_fridge_items(session: Session = Depends(get_session)):
    results = session.exec(select(FridgeItem)).all()
    print(type(results))
    return results