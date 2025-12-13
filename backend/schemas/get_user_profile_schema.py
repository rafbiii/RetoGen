from pydantic import BaseModel, EmailStr

class GetUserProfileRequest(BaseModel):
    token: str
    user_email: EmailStr