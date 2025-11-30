from pydantic import BaseModel

class EditRatingGetRequest(BaseModel):
    token: str
    article_id: str
    rating_id: str
