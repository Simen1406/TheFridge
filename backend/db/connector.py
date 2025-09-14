import sqlite3
import os
import sys

sys.path.append("..")

def get_db_connection():
    db_path = os.path.join(os.path.dirname(__file__), 'sql.db')
    return sqlite3.connect(db_path)



def initialize_db():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        print("Database created and Successfully Connected to SQLite")

        cursor.execute('''
            CREATE TABLE IF NOT EXISTS food (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                qty INTEGER NOT NULL,
                barcode TEXT UNIQUE NOT NULL,
                added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                category TEXT
            )
        ''')

        conn.commit()
        print("Table created successfully")

        cursor.close()

    except sqlite3.Error as error:
        print("Error while connecting to sqlite", error)

    finally:
        if conn:
            conn.close()
            print("The SQLite connection is closed")


# add code for insertion handling



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


def read_food_table():
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
        return food_dict
    except sqlite3.Error as e:
        print(f"Database error: {e}")

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

print(read_food_table())