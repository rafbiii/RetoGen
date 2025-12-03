from pydantic import BaseModel, EmailStr

class users(BaseModel):
    username: str
    fullname: str
    email: EmailStr
    password: str
