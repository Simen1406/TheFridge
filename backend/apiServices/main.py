
import os, sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
from db.connector import initialize_db, get_db_connection, read_food_table



app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
"""
@app.on_event("startup")
def startup_event():
    initialize_db()
    print("Database initialized on startup")"""

@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/food_items")
def get_food_items():
    food_items = read_food_table()
    return {"food_items": food_items}


        
    
    