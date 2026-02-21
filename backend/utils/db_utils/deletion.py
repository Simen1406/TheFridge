import os

DATABASE_URL = os.getenv("DATABASE_URL")
def delete_table(table_name: str):
    from backend.db.db import engine
    with engine.connect() as connection:
        connection.execute(f"DROP TABLE IF EXISTS {table_name}")
        connection.commit()