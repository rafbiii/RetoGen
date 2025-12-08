from pydantic import BaseModel

class GetAllUsersRequest(BaseModel):
    token: str