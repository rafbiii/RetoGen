from fastapi import FastAPI
from routes.auth import auth as AuthRouter

app = FastAPI(title="Simple FastAPI + MongoDB Login")

app.include_router(AuthRouter, prefix="/auth", tags=["Auth"])

@app.get("/")
def root():
    return {"message": "API siap digunakan"}