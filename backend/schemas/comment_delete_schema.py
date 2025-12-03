from pydantic import BaseModel

class DeleteCommentRequest(BaseModel):
    token: str
    comment_id: str
