from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from core.api_handlers import validation_exception_handler
from routes import auth, article, comment, rating, report_article
import uvicorn

app = FastAPI(title="Updated Backend Template")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pasang custom error handler
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.include_router(article.router, prefix="/article", tags=["Article"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(comment.router, prefix="/comment", tags=["Comment"])
app.include_router(rating.router, prefix="/rating", tags=["Rating"])
app.include_router(report_article.router, prefix="/report_article", tags=["Report Article"])



@app.get("/")
def root():
    return {"message": "API Ready"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)