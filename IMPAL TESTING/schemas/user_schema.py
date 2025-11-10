from database.connection import db

user_collection = db["User"]

def user_entity(user) -> dict:
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"],
        "name": user["name"],
        "role": user.get("role", "user"),
        "is_active": user.get("is_active", True)
    }
