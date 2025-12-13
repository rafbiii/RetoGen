from pydantic import BaseModel, Field

class AddReportArticleSchema(BaseModel):
    token: str
    article_id: str
    description: str = Field(..., min_length=1)
