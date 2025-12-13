from pydantic import BaseModel
from typing import Optional

class GetUserDetailsRequest(BaseModel):
    token: str
    user_email: Optional[str] = None
