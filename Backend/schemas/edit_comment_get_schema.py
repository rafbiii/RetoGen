from pydantic import BaseModel

class EditCommentGetRequest(BaseModel):
    token: str
    comment_id: str
