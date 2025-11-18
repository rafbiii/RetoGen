from fastapi import FastAPI
from routes import auth
import uvicorn

app = FastAPI(title="Updated Backend Template")

app.include_router(auth.router, prefix="/auth", tags=["Auth"])

@app.get("/")
def root():
    return {"message": "API Ready"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)