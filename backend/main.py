from fastapi import FastAPI, Depends
from sqlmodel import Session, select

from db.db import init_db, get_session
from models.models import FridgeItem

#app entrypoint
app = FastAPI()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/ping")
async def pong():
    return {"ping": "pong!"}

@app.get("/fridge-items")
def get_fridge_items(session: Session = Depends(get_session)):
    results = session.execute(select(FridgeItem)).all()
    return results