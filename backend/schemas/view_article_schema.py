from pydantic import BaseModel

class ViewArticleRequest(BaseModel):
    token: str
    article_id: str
