from pydantic import BaseModel

class GetUserDetailsRequest(BaseModel):
    token: str
    user_id: str
