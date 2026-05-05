from fastapi import FastAPI
from database import engine
import models
from routes import requests, admin

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="CCID Legal Submission API")

app.include_router(requests.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "CCID Court Notice API v1 Active"}
