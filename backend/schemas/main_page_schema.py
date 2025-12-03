from pydantic import BaseModel

class MainPageRequest(BaseModel):
    token: str