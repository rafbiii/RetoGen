from pydantic import BaseModel

class EditCommentRequest(BaseModel):
    token: str
    article_id: str
    comment_id: str
    parent_comment_id: str | None = None
    comment_content: str
