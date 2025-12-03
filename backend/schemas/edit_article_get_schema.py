# schemas/edit_article_get_schema.py
from pydantic import BaseModel

class EditArticleGetRequest(BaseModel):
    token: str
    article_id: str
    comment_id: str
