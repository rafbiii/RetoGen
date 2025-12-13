from pydantic import BaseModel

class DeleteUserRequest(BaseModel):
    token: str
    user_id: str