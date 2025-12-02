from fastapi import APIRouter
from schemas.add_rating_schema import AddRatingSchema
from services.auth_service import AuthService
from services.rating_service import RatingService
from schemas.edit_rating_get_schema import EditRatingGetRequest
from schemas.edit_rating_update_schema import EditRatingUpdateRequest
from db.connection import db
from bson import ObjectId
from utils.base64_utils import bytes_to_base64

router = APIRouter()

@router.post("/add")
async def add_rating(req: AddRatingSchema):

    # 1) VALIDATE RATING
    if not (1 <= req.rating_value <= 5):
        return {"confirmation": "backend error"}

    # 2) VERIFY TOKEN
    payload = await AuthService.verify_token(req.token)
    if payload is None:
        return {"confirmation": "token invalid"}

    # 3) FIND USER
    user = await db.users.find_one({"email": payload.get("email")})
    if not user:
        return {"confirmation": "token invalid"}

    # gunakan username sebagai owner
    owner_id = str(user["_id"])
    owner_username = user["username"]


    # 4) CHECK ARTICLE
    article = await RatingService.fetch_article(req.article_id)
    if article is None:
        return {"confirmation": "backend error"}

    if article.get("is_deleted") == True:
        return {"confirmation": "backend error"}
    
    # 5) CHECK EXISTING RATING
    already = await RatingService.get_rating_by_user(
        article_id=req.article_id,
        owner_id=owner_id
    )

    if already:
        return {"confirmation": "already rated"}

    # 6) INSERT RATING
    new_rating_id = await RatingService.add_rating(
        article_id=req.article_id,
        owner_id=owner_id,
        rating_value=req.rating_value
    )


    if not new_rating_id:
        return {"confirmation": "backend error"}

    # 7) USER CLASS
    userclass = "admin" if user.get("role") == "admin" else "user"

    # 8) Convert image → base64
    image_base64 = None
    if article.get("article_image"):
        try:
            image_base64 = bytes_to_base64(bytes(article["article_image"]))
        except:
            image_base64 = None

    # 9) Fetch comments
    comments_raw = await RatingService.get_comments(req.article_id)
    if comments_raw is None:
        return {"confirmation": "backend error"}

    comments = []
    for c in comments_raw:
        user = await db.users.find_one({"_id": ObjectId(c["owner_id"])})
        username = user["username"] if user else "Unknown"

        comments.append({
            "comment_id": str(c["_id"]),
            "parent_comment_id": c.get("parent_comment_id"),
            "owner": username,
            "comment_content": c["comment_content"]
        })

    # 10) Fetch ratings
    ratings_raw = await RatingService.get_ratings(req.article_id)
    if ratings_raw is None:
        return {"confirmation": "backend error"}

    ratings = []
    for r in ratings_raw:
        user_owner = await db.users.find_one({"_id": ObjectId(r["owner_id"])})
        username_owner = user_owner["username"] if user_owner else "Unknown"

        ratings.append({
            "rating_id": str(r["_id"]),
            "owner": username_owner,       # ← tampilkan username
            "rating_value": r["rating_value"]
        })



    # 11) RETURN SUCCESS
    return {
        "confirmation": "successful",
        "userclass": userclass,
        "article_title": article["article_title"],
        "article_content": article["article_content"],
        "article_tag": article["article_tag"],
        "article_image": image_base64,
        "comments": comments,
        "ratings": ratings
    }

@router.post("/edit/get")
async def edit_rating_get(req: EditRatingGetRequest):
    payload = await AuthService.verify_token(req.token)
    if payload is None:
        return {"confirmation": "token invalid"}

    user_email = payload.get("email")
    user = await db.users.find_one({"email": user_email})
    if not user:
        return {"confirmation": "token invalid"}

    try:
        rating = await db.rating.find_one({
            "_id": ObjectId(req.rating_id),
            "article_id": req.article_id,
            "owner_id": user["_id"]
        })

        if not rating:
            return {"confirmation": "backend error"}

        # Convert ObjectId to string
        rating_data = {
            "rating_id": str(rating["_id"]),
            "article_id": rating["article_id"],
            "owner_id": str(rating["owner_id"]),
            "rating_value": rating["rating_value"]
        }


        return {
            "confirmation": "successful",
            "rating": rating_data
        }

    except Exception as e:
        print("ERR:", e)
        return {"confirmation": "backend error"}


@router.post("/edit/update")
async def edit_rating_update(req: EditRatingUpdateRequest):

    # VALIDATE RANGE
    if not (1 <= req.rating_value <= 10):
        return {"confirmation": "backend error"}

    # VERIFY TOKEN
    payload = await AuthService.verify_token(req.token)
    if payload is None:
        return {"confirmation": "token invalid"}

    # GET USER
    user = await db.users.find_one({"email": payload.get("email")})
    if not user:
        return {"confirmation": "token invalid"}

    # FETCH RATING
    rating = await RatingService.get_rating_by_id(req.rating_id)
    if rating is None:
        return {"confirmation": "backend error"}

    # CHECK OWNER → FIXED
    if str(rating["owner_id"]) != str(user["_id"]):
        return {"confirmation": "backend error"}

    # UPDATE VALUE IF CHANGED
    if req.rating_value != rating["rating_value"]:
        updated = await RatingService.update_rating(req.rating_id, req.rating_value)
        if not updated:
            return {"confirmation": "backend error"}

    # FETCH ARTICLE
    article = await RatingService.fetch_article(req.article_id)
    if not article:
        return {"confirmation": "backend error"}

    userclass = "admin" if user.get("role") == "admin" else "user"

    # IMAGE CONVERT
    try:
        image_base64 = bytes_to_base64(bytes(article["article_image"])) if article.get("article_image") else None
    except:
        image_base64 = None

    # FETCH COMMENTS
    comments_raw = await RatingService.get_comments(req.article_id)
    comments = []
    for c in comments_raw:
        u = await db.users.find_one({"_id": ObjectId(c["owner_id"])})
        comments.append({
            "comment_id": str(c["_id"]),
            "parent_comment_id": c.get("parent_comment_id"),
            "owner": u["username"] if u else "Unknown",
            "comment_content": c["comment_content"]
        })

    # FETCH RATINGS → FIXED owner_id → username
    ratings_raw = await RatingService.get_ratings(req.article_id)
    ratings = []
    for r in ratings_raw:
        u = await db.users.find_one({"_id": r["owner_id"]})
        ratings.append({
            "rating_id": str(r["_id"]),
            "owner": u["username"] if u else "Unknown",
            "rating_value": r["rating_value"]
        })

    return {
        "confirmation": "successful",
        "userclass": userclass,
        "article_title": article["article_title"],
        "article_content": article["article_content"],
        "article_tag": article["article_tag"],
        "article_image": image_base64,
        "comments": comments,
        "ratings": ratings,
    }