from pydantic import BaseModel, EmailStr

class ReportUserRequest(BaseModel):
    token: str
    reported_user_email: EmailStr
    description: str