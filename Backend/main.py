from fastapi import FastAPI
from routes.auth import auth as AuthRouter
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Simple FastAPI + MongoDB Login")

app.include_router(AuthRouter, tags=["Auth"])


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "API siap digunakan"}