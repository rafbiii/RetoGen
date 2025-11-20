from pydantic import BaseModel
from typing import Optional

class EditArticleRequest(BaseModel):
    token: Optional[str] = None
    article_id: str
    article_title: Optional[str] = None
    article_preview: Optional[str] = None
    article_content: Optional[str] = None
    article_tag: Optional[str] = None
    article_image: Optional[str] = None  # base64 string
