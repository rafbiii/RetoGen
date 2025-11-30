from fastapi import APIRouter
from schemas.add_comment_schema import AddCommentRequest
from services.comment_service import CommentService
from services.article_service import ArticleService
from services.auth_service import AuthService
from db.connection import db
from bson import ObjectId
from utils.base64_utils import bytes_to_base64

router = APIRouter()

@router.post("/add")
async def add_comment(req: AddCommentRequest):

    # --- VALIDATE COMMENT LENGTH ---
    if not (1 <= len(req.comment_content) <= 8192):
        return {"confirmation": "backend error"}  # sesuai setup, tidak ada pesan lain

    # --- VERIFY TOKEN ---
    payload = await AuthService.verify_token(req.token)
    if payload is None:
        return {"confirmation": "token invalid"}

    # --- GET USER ---
    try:
        user = await db.users.find_one({"email": payload.get("email")})
    except:
        return {"confirmation": "backend error"}

    if not user:
        return {"confirmation": "token invalid"}

    owner_id = str(user["_id"])

    # ========================================================
    # 0) CEK ARTICLE EXISTS *SEBELUM INSERT COMMENT*
    # ========================================================
    article = await ArticleService.fetch_article(req.article_id)
    if article is None:
        return {"confirmation": "backend error"}

    # --- INSERT COMMENT (setelah yakin article valid) ---
    new_comment_id = await CommentService.add_comment(
        article_id=req.article_id,
        parent_comment_id=req.parent_comment_id if req.parent_comment_id else None,
        owner_id=owner_id,
        comment_content=req.comment_content
    )

    if not new_comment_id:
        return {"confirmation": "backend error"}

    # --- DETERMINE USERCLASS ---
    userclass = "admin" if user.get("role") == "admin" else "user"

    # --- FORMAT IMAGE ---
    image_base64 = None
    if article.get("article_image"):
        try:
            image_base64 = bytes_to_base64(bytes(article["article_image"]))
        except:
            image_base64 = None

    # --- FETCH COMMENTS ---
    comments_raw = await CommentService.get_comments(req.article_id)
    if comments_raw is None:
        return {"confirmation": "backend error"}

    comments = []
    for c in comments_raw:
        try:
            owner = await db.users.find_one({"_id": ObjectId(c["owner_id"])})
        except:
            owner = None

        comments.append({
            "comment_id": str(c["_id"]),
            "parent_comment_id": c.get("parent_comment_id"),
            "owner": owner["username"] if owner else "Unknown",
            "comment_content": c["comment_content"]
        })

    # --- FETCH RATINGS ---
    ratings_raw = await ArticleService.get_ratings(req.article_id)
    if ratings_raw is None:
        return {"confirmation": "backend error"}

    ratings = []
    for r in ratings_raw:
        try:
            owner = await db.users.find_one({"_id": ObjectId(r["owner_id"])})
        except:
            owner = None

        ratings.append({
            "rating_id": str(r["_id"]),
            "owner": owner["username"] if owner else "Unknown",
            "rating_value": r["rating_value"]
        })

    # --- FINAL RESPONSE ---
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

