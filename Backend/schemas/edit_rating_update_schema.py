from pydantic import BaseModel

class EditRatingUpdateRequest(BaseModel):
    token: str
    article_id: str
    rating_id: str
    rating_value: int
