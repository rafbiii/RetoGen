from fastapi import Response

def set_session_token(response: Response, token: str):
    response.set_cookie(
        key="session",
        value=token,
        httponly=True,
        secure=False,
        samesite="Lax",
        max_age=3600
    )
