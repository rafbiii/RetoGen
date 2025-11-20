from core.security import verify_password, hash_password, create_token, decode_token
from db.connection import db
from datetime import datetime

class AuthService:

    @staticmethod
    async def register(data):
        existing_email = await db.users.find_one({"email": data.email})
        if existing_email:
            return {"confirmation": "email already registered"}

        existing_username = await db.users.find_one({"username": data.username})
        if existing_username:
            return {"confirmation": "username already taken"}
        
        hashed_pw = hash_password(data.password)
        now = datetime.utcnow()

        new_user = {
            "username": data.username,
            "fullname": data.fullname,
            "email": data.email,
            "password": hashed_pw,
            "role": "user",  # default
            "created_at": now,
            "updated_at": now,
        }

        await db.users.insert_one(new_user)
        return {"confirmation": "register successful"}

    @staticmethod
    async def login(data):
        try:
            users = await db.users.find_one({"email": data.email})
        except Exception:
            return {"confirmation": "backend error"}

        if not users:
            return {"confirmation": "email doesn't exist"}

        if not verify_password(data.password, users["password"]):
            return {"confirmation": "password incorrect"}

        token = create_token({"email": users["email"]})
        return {"confirmation": "login successful", "token": token}

    @staticmethod
    async def verify_token(token: str):
        try:
            payload = decode_token(token)
            return payload
        except:
            return None

    @staticmethod
    async def is_admin(payload):
        try:
            email = payload.get("email")
            user = await db.users.find_one({"email": email})
            if not user:
                return False
            return user.get("role") == "admin"
        except:
            return False
