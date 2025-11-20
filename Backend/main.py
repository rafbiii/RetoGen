from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError

from core.API_handlers import validation_exception_handler
from routes import auth, article
import uvicorn

app = FastAPI(title="Updated Backend Template")

# Pasang custom error handler
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.include_router(article.router, prefix="/article", tags=["Article"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])

@app.get("/")
def root():
    return {"message": "API Ready"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)