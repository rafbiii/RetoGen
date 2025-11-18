from core.security import verify_password, hash_password, create_token
from db.connection import db
from core.exceptions import NotFound, Unauthorized
from datetime import datetime

class AuthService:
    @staticmethod
    async def register(data):
        existing_email = await db.users.find_one({"email": data.email})
        if existing_email:
            raise Unauthorized("Email already registered")

        existing_username = await db.users.find_one({"username": data.username})
        if existing_username:
            raise Unauthorized("Username already taken")
        
        hashed_pw = hash_password(data.password)

        now = datetime.utcnow()

        new_user = {
            "username": data.username,
            "fullname": data.fullname,
            "email": data.email,
            "password": hashed_pw,
            "created_at": now,
            "updated_at": now,
        }

        await db.users.insert_one(new_user)
        return {"message": "Register success"}

    async def login(data):
        try:
            try:
                users = await db.users.find_one({"email": data.email})
            except Exception:
                return {
                    "confirmation": "backend error"
                }

            if not users:
                return {
                    "confirmation": "email doesn't exists"
                }

            if not verify_password(data.password, users["password"]):
                return {
                    "confirmation": "password incorrect"
                }

            token = create_token({"email": users["email"]})

            return {
                "confirmation": "login successful",
                "token": token
            }

        except Exception:
            return {
                "confirmation": "backend error"
            }
