from fastapi import APIRouter
from schemas.add_rating_schema import AddRatingSchema
from services.auth_service import AuthService
from services.rating_service import RatingService
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
    owner = user["username"]

    # 4) CHECK ARTICLE
    article = await RatingService.fetch_article(req.article_id)
    if article is None:
        return {"confirmation": "backend error"}

    if article.get("is_deleted") == True:
        return {"confirmation": "backend error"}
    
    # 5) CHECK EXISTING RATING
    already = await RatingService.get_rating_by_user(
        article_id=req.article_id,
        owner=owner
    )
    if already:
        return {"confirmation": "already rated"}

    # 6) INSERT RATING
    new_rating_id = await RatingService.add_rating(
        article_id=req.article_id,
        owner=owner,
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
        ratings.append({
            "rating_id": str(r["_id"]),
            "owner": r["owner"],  # username
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
