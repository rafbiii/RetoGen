from pydantic import BaseModel
from typing import Optional, Literal

class EditArticleUpdateRequest(BaseModel):
    token: str
    article_id: str

    article_title: Optional[str] = None
    article_preview: Optional[str] = None
    article_content: Optional[str] = None
    article_tag: Optional[Literal["office", "budget", "gaming", "flagship"]] = None
    article_image: Optional[str] = None  # base64
