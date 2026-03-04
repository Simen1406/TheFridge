from re import search

from fastapi import FastAPI, Depends, Query
from fastapi.responses import HTMLResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from api_endpoints.db_endpoints import router as db_router
from api_endpoints.kassalapp_endpoints import router as kassalapp_router

#app entrypoint
app = FastAPI()
app.include_router(db_router)
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


