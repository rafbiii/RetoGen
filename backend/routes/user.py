from fastapi import APIRouter
from schemas.get_all_users_schema import GetAllUsersRequest
from schemas.get_user_details_schema import GetUserDetailsRequest
from schemas.delete_user_schema import DeleteUserRequest
from services.user_service import UserService
from services.auth_service import AuthService
from bson import ObjectId

router = APIRouter()

@router.post("/get_all")
async def get_all_users(req: GetAllUsersRequest):

    # 1) Verify token
    payload = await AuthService.verify_token(req.token)
    if payload is None:
        return {"confirmation": "token invalid"}

    # 2) Check if admin
    if not await AuthService.is_admin(payload):
        return {"confirmation": "not admin"}

    # 3) Fetch all users
    users_raw = await UserService.get_all_users()
    if users_raw is None:
        return {"confirmation": "backend error"}

    users = []
    for u in users_raw:
        users.append({
            "user_id": str(u["_id"]),
            "username": u.get("username"),
            "email": u.get("email"),
            "fullname": u.get("fullname"),
            "role": u.get("role"),
            "report_count": u.get("report_count", 0),
            "created_at": u.get("created_at")
        })

    return {
        "confirmation": "successful",
        "users": users
    }

@router.post("/get_details")
async def get_user_details(req: GetUserDetailsRequest):

    # 1) Verify token
    payload = await AuthService.verify_token(req.token)
    if payload is None:
        return {"confirmation": "token invalid"}

    # 2) Check if admin
    if not await AuthService.is_admin(payload):
        return {"confirmation": "not admin"}

    # 3) Fetch user by ID
    user = await UserService.get_user_by_id(req.user_id)
    if user is None:
        return {"confirmation": "user not found"}

    # 4) Fetch reports for user
    reports_raw = await UserService.get_reports_for_user(req.user_id)
    if reports_raw is None:
        return {"confirmation": "backend error"}

    reports = []
    for r in reports_raw:
        reports.append({
            "report_id": str(r["_id"]),
            "user_id": str(r["reported_user_id"]),
            "description": r.get("description"),
            "created_at": r.get("created_at")
        })

    # 5) Return response
    return {
        "confirmation": "successful",
        "user": {
            "user_id": str(user["_id"]),
            "username": user.get("username"),
            "email": user.get("email"),
            "fullname": user.get("fullname"),
            "role": user.get("role"),
            "reports": reports,
            "created_at": user.get("created_at"),
            "updated_at": user.get("updated_at")
        }
    }
    
@router.post("/delete")
async def delete_user(req: DeleteUserRequest):

    # 1) Verify token
    payload = await AuthService.verify_token(req.token)
    if payload is None:
        return {"confirmation": "token invalid"}

    # 2) Check if admin
    if not await AuthService.is_admin(payload):
        return {"confirmation": "not admin"}

    # 3) Fetch user
    user = await UserService.get_user_by_id(req.user_id)
    if user is None:
        return {"confirmation": "user not found"}

    # 4) Prevent deleting admin
    if user.get("role") == "admin":
        return {"confirmation": "cannot delete admin"}

    # 5) Delete user and related data
    success = await UserService.delete_user(req.user_id)
    if not success:
        return {"confirmation": "backend error"}

    return {"confirmation": "successful: user deleted"}