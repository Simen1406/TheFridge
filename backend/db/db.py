import os
from dotenv import load_dotenv

from sqlmodel import create_engine, SQLModel, Session

load_dotenv(".env.local")

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL or not DATABASE_URL.strip():
    raise ValueError(
        "DATABASE_URL is missing in backend/.env.local. "
        "Example: DATABASE_URL=sqlite:///./db/fridge.db"
    )

engine = create_engine(DATABASE_URL, echo=True)

def init_db():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
