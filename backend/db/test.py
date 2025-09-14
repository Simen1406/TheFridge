import sqlite3
from datetime import datetime

def get_database_connection():
    """Create and return a database connection"""
    return sqlite3.connect('sql.db')

def initialize_database():
    """Initialize the database and create tables"""
    try:
        sqliteConnection = get_database_connection()
        cursor = sqliteConnection.cursor()
        print("Database created and Successfully Connected to SQLite")

        # Create table
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
        
        sqliteConnection.commit()
        print("Table created successfully")
        
        cursor.close()
        sqliteConnection.close()
        
    except sqlite3.Error as error:
        print("Error while initializing database:", error)

def check_item_exists(barcode):
    """Check if an item with the given barcode exists in the database"""
    try:
        connection = get_database_connection()
        cursor = connection.cursor()
        
        cursor.execute("SELECT * FROM food WHERE barcode = ?", (barcode,))
        item = cursor.fetchone()
        
        cursor.close()
        connection.close()
        
        return item
        
    except sqlite3.Error as error:
        print("Error checking if item exists:", error)
        return None

def insert_new_item(name, qty, barcode, category=None):
    """Insert a new item into the database"""
    try:
        connection = get_database_connection()
        cursor = connection.cursor()
        
        cursor.execute('''
            INSERT INTO food (name, qty, barcode, category)
            VALUES (?, ?, ?, ?)
        ''', (name, qty, barcode, category))
        
        connection.commit()
        item_id = cursor.lastrowid
        
        cursor.close()
        connection.close()
        
        print(f"New item '{name}' added successfully with ID: {item_id}")
        return item_id
        
    except sqlite3.Error as error:
        print("Error inserting new item:", error)
        return None

def update_existing_item(barcode, qty_to_add=1, new_name=None, new_category=None):
    """Update an existing item's quantity and optionally other fields"""
    try:
        connection = get_database_connection()
        cursor = connection.cursor()
        
        # First, get current item details
        current_item = check_item_exists(barcode)
        if not current_item:
            print("Item not found for update")
            return False
        
        # Update quantity (add to existing quantity)
        current_qty = current_item[2]  # qty is at index 2
        new_qty = current_qty + qty_to_add
        
        # Prepare update query based on what fields to update
        if new_name and new_category:
            cursor.execute('''
                UPDATE food 
                SET qty = ?, name = ?, category = ?
                WHERE barcode = ?
            ''', (new_qty, new_name, new_category, barcode))
        elif new_name:
            cursor.execute('''
                UPDATE food 
                SET qty = ?, name = ?
                WHERE barcode = ?
            ''', (new_qty, new_name, barcode))
        elif new_category:
            cursor.execute('''
                UPDATE food 
                SET qty = ?, category = ?
                WHERE barcode = ?
            ''', (new_qty, new_category, barcode))
        else:
            cursor.execute('''
                UPDATE food 
                SET qty = ?
                WHERE barcode = ?
            ''', (new_qty, barcode))
        
        connection.commit()
        
        cursor.close()
        connection.close()
        
        print(f"Item with barcode '{barcode}' updated. Quantity changed from {current_qty} to {new_qty}")
        return True
        
    except sqlite3.Error as error:
        print("Error updating existing item:", error)
        return False

def handle_barcode_scan(barcode, name=None, qty=1, category=None):
    """
    Main function to handle barcode scanning
    - If item exists: update quantity
    - If item is new: insert new item (requires name)
    """
    try:
        existing_item = check_item_exists(barcode)
        
        if existing_item:
            # Item exists, update quantity
            print(f"Item found: {existing_item[1]} (Current qty: {existing_item[2]})")
            success = update_existing_item(barcode, qty)
            return {"status": "updated", "success": success, "item": existing_item}
        else:
            # New item, requires name
            if not name:
                print("New item detected but no name provided. Please provide item name.")
                return {"status": "new_item_needs_name", "success": False, "barcode": barcode}
            
            item_id = insert_new_item(name, qty, barcode, category)
            success = item_id is not None
            return {"status": "inserted", "success": success, "item_id": item_id}
            
    except Exception as error:
        print("Error handling barcode scan:", error)
        return {"status": "error", "success": False, "error": str(error)}

def get_all_items():
    """Get all items from the database"""
    try:
        connection = get_database_connection()
        cursor = connection.cursor()
        
        cursor.execute("SELECT * FROM food ORDER BY added_date DESC")
        items = cursor.fetchall()
        
        cursor.close()
        connection.close()
        
        return items
        
    except sqlite3.Error as error:
        print("Error fetching items:", error)
        return []

# Initialize database when module is imported
if __name__ == "__main__":
    initialize_database()
    
    # Example usage:
    print("\n--- Example Usage ---")
    
    # Simulate scanning a new item
    result1 = handle_barcode_scan("1234567890", name="Apple", qty=5, category="Fruit")
    print("Result 1:", result1)
    
    # Simulate scanning the same item again (should update quantity)
    result2 = handle_barcode_scan("1234567890", qty=3)
    print("Result 2:", result2)
    
    # Show all items
    print("\nAll items in database:")
    items = get_all_items()
    for item in items:
        print(f"ID: {item[0]}, Name: {item[1]}, Qty: {item[2]}, Barcode: {item[3]}, Date: {item[4]}, Category: {item[5]}")

# Legacy code (keeping for compatibility)
try:
    sqliteConnection = sqlite3.connect('sql.db')
    cursor = sqliteConnection.cursor()
    print("Database created and Successfully Connected to SQLite")

    #
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

    #fetch and print result
    result = cursor.fetchall()
    print("SQLite Database Version is: ", result)

    cursor.close()

except sqlite3.Error as error:
    print("Error while connecting to sqlite", error)

finally:
    if sqliteConnection:
        sqliteConnection.close()
        print("The SQLite connection is closed")