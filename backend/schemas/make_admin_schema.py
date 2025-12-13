from pydantic import BaseModel

class MakeAdminRequest(BaseModel):
    token: str
    user_id: str
