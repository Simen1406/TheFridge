import sys
import sqlite3
from connector import get_db_connection


conn = get_db_connection()
cursor = conn.cursor()

def insert_sample_data():
    food_items = [
        ("milk", 1, "123", "dairy"),
        ("bread", 1, "456", "bakery"),
        ("eggs", 1, "789", "dairy"),
    ]

    cursor.executemany("INSERT INTO food (name, qty, barcode, category) VALUES (?, ?, ?, ?)", food_items)
    print("Sample data inserted:")
    cursor.execute("SELECT * FROM food")
    for row in cursor.fetchall():
        print(row)

    conn.commit()
    cursor.close()  # Close cursor before closing connection
    conn.close()

def delete_food_rows():
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("DELETE FROM food")
        rows_deleted = cursor.rowcount
        conn.commit()
        print(f"Successfully deleted {rows_deleted} rows from the food table")

    except sqlite3.Error as error:
        print(f"Error deleting data: {error}")

    finally:
        cursor.close()
        conn.close()


def check_new_insertions():
    conn = get_db_connection()
    cursor = conn.cursor()

    """
    Check if there are any rows in the food table that match the barcode of the new insertion.
    if not create a new insertion and if the barcode already exists, update the qty by 1
    """

insert_sample_data()
