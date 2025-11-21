from pydantic import BaseModel, field_validator
from typing import Literal
import base64
import re

class AddArticle(BaseModel):
    token: str
    article_title: str
    article_preview: str
    article_content: str
    article_tag: Literal["office", "budget", "gaming", "flagship"]
    article_image: str

    @field_validator("article_title")
    def validate_title(cls, v):
        if not (10 <= len(v) <= 64):
            raise ValueError("Judul harus 10–64 karakter.")
        return v

    @field_validator("article_preview")
    def validate_preview(cls, v):
        if not (20 <= len(v) <= 160):
            raise ValueError("Preview harus 20–160 karakter.")
        return v

    @field_validator("article_content")
    def validate_content(cls, v):
        if len(v) < 50:
            raise ValueError("Konten minimal 50 karakter.")
        return v

    @field_validator("article_image")
    def validate_image(cls, v):
        try:
            base64.b64decode(v)
        except Exception:
            raise ValueError("Format gambar harus Base64 yang valid.")
        return v
