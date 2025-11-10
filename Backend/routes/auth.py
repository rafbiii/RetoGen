from fastapi import APIRouter, HTTPException
from database.connection import db
from models.user import User
from schemas.user_schema import user_entity
from schemas.login_schema import LoginUser

auth = APIRouter(prefix="/auth", tags=["Auth"])
user_collection = db["User"]

@auth.post("/register")
async def register_user(user: User):
    existing_user = user_collection.find_one({"username": user.username})
    if existing_user:
        raise HTTPException(status_code=400, detail="Username sudah terdaftar")

    last_user = user_collection.find_one(sort=[("user_id", -1)])
    if last_user:
        last_id_num = int(last_user["user_id"][1:])
        new_id_num = last_id_num + 1
    else:
        new_id_num = 1
    user_id = f"U{new_id_num:03}"

    new_user = {
        "user_id": user_id,
        "username": user.username,
        "email": user.email,
        "password": user.password,
        "name": user.name,
        "role": "user",
        "is_active": True
    }

    result = user_collection.insert_one(new_user)

    return {
        "status": "success",
        "message": "User berhasil diregistrasi",
        "inserted_id": str(result.inserted_id),
        "user_id": user_id
    }

@auth.post("/login")
async def login_user(user: LoginUser):
    existing_user = user_collection.find_one({"email": user.email})

    if not existing_user:
        raise HTTPException(status_code=404, detail="Email tidak ditemukan")

    if user.password != existing_user["password"]:
        raise HTTPException(status_code=401, detail="Password salah")

    if not existing_user.get("is_active", True):
        raise HTTPException(status_code=403, detail="Akun tidak aktif")

    return {
        "status": "success",
        "message": "Login berhasil",
        "user": {
            "user_id": existing_user["user_id"],
            "username": existing_user["username"],
            "email": existing_user["email"],
            "name": existing_user["name"],
            "role": existing_user["role"]
        }
    }
