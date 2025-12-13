from fastapi import APIRouter
from schemas.get_user_profile_schema import GetUserProfileRequest
from schemas.report_user_schema import ReportUserRequest
from services.report_user_service import ReportUserService
from services.auth_service import AuthService
from db.connection import db
from bson import ObjectId

router = APIRouter()


# ============================
#   GET USER PROFILE
# ============================
@router.post("/get_user_profile")
async def get_user_profile(req: GetUserProfileRequest):

    # --- Cek koneksi DB ---
    try:
        await db.command("ping")
    except Exception as e:
        print("GET_USER_PROFILE DB ERROR:", e)
        return {"confirmation": "backend error"}

    # --- Verifikasi token ---
    payload = await AuthService.verify_token(req.token)
    if payload is None:
        return {"confirmation": "token invalid"}

    # --- Ambil user target ---
    try:
        user = await db.user.find_one({"email": req.user_email})
    except Exception as e:
        print("GET_USER_PROFILE FIND USER ERROR:", e)
        return {"confirmation": "backend error"}

    if not user:
        return {"confirmation": "user not found"}

    created_at = user.get("created_at")
    if created_at:
        try:
            created_at = created_at.isoformat()
        except:
            pass

    return {
        "confirmation": "successful",
        "user": {
            "user_email": user.get("email", ""),
            "username": user.get("username", ""),
            "fullname": user.get("fullname", ""),
            "role": user.get("role", "user"),
            "created_at": created_at
        }
    }


# ============================
#         REPORT USER
# ============================
@router.post("/report_user")
async def report_user(req: ReportUserRequest):

    # --- Cek koneksi DB ---
    try:
        await db.command("ping")
    except Exception as e:
        print("REPORT_USER DB ERROR:", e)
        return {"confirmation": "backend error"}

    # --- Verifikasi token ---
    payload = await AuthService.verify_token(req.token)
    if payload is None:
        return {"confirmation": "token invalid"}

    reporter_email = payload.get("email")
    if reporter_email is None:
        return {"confirmation": "token invalid"}

    # --- Tidak boleh report diri sendiri ---
    if reporter_email == req.reported_user_email:
        return {"confirmation": "cannot report self"}

    # --- Ambil user yang dilaporkan ---
    try:
        reported_user = await db.user.find_one({"email": req.reported_user_email})
    except Exception as e:
        print("REPORT_USER FIND USER ERROR:", e)
        return {"confirmation": "backend error"}

    if not reported_user:
        return {"confirmation": "user not found"}

    reported_user_oid = reported_user.get("_id")   # ini adalah ObjectId asli

    # --- Simpan report ---
    save_ok = await ReportUserService.save_report(
        reported_user_oid, 
        req.description
    )
    if not save_ok:
        return {"confirmation": "backend error"}

    # --- Increment report_count ---
    incr_ok = await ReportUserService.increment_report_count(str(reported_user_oid))
    if not incr_ok:
        return {"confirmation": "backend error"}

    return {"confirmation": "successful: user reported"}