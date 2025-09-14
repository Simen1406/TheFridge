
import os, sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..', 'backend'))
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
from db.connector import initialize_db, get_db_connection, read_food_table



app = FastAPI()

"""@app.on_event("startup")
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

    """initialize_db()  # Ensure DB is initialized

    try:    
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM food")
        rows = cursor.fetchall()    
        food_dict = {}
        for food in rows:
            food_dict[food[0]] = {
                "id": food[0],
                "name": food[1],
                "qty": food[2],
                "barcode": food[3],
                "added_date": food[4],
                "category": food[5],
            }
        return {"food_items": food_dict.values()}

    except sqlite3.Error as e:
        print(f"Database error: {e}")

    finally:
        if conn:
            cursor.close()
            conn.close()"""
        
    
    








"""
DB = "sql.db"

def get_db_conn():
    conn = sqlite3.connect(DB)
    return conn

def init_db():
    con = get_db_conn()
    con.execute
    """