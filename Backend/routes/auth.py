from fastapi import APIRouter, Response
from schemas.login_schema import LoginUser
from schemas.register_schema import RegisterUser
from services.auth_service import AuthService
from utils.token import set_session_token

router = APIRouter()

@router.post("/register")
async def register(data: RegisterUser):
    return await AuthService.register(data)

@router.post("/login")
async def login(data: LoginUser, response: Response):
    result = await AuthService.login(data)
    if result.get("confirmation") == "login successful":
        response.set_cookie(
            key="token",
            value=result["token"],
            httponly=True,
            samesite="Lax"
        )
    return result