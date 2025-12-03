from pydantic import BaseModel

class DeleteArticleRequest(BaseModel):
    token: str
    article_id: str
