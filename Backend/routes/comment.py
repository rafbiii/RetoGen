from fastapi import APIRouter
from schemas.add_comment_schema import AddCommentRequest
from services.comment_service import CommentService
from services.article_service import ArticleService
from services.auth_service import AuthService
from db.connection import db
from bson import ObjectId
from utils.base64_utils import bytes_to_base64
from schemas.comment_delete_schema import DeleteCommentRequest
from services.rating_service import RatingService
from db.connection import db

router = APIRouter()

@router.post("/add")
async def add_comment(req: AddCommentRequest):

    # --- VALIDATE COMMENT CONTENT LENGTH ---
    if not (1 <= len(req.comment_content) <= 8192):
        return {"confirmation": "backend error"}

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
    # 1) CEK ARTICLE EXISTS *SEBELUM APA PUN*
    # ========================================================
    article = await ArticleService.fetch_article(req.article_id)
    if article is None:
        return {"confirmation": "backend error"}

    # ========================================================
    # 2) VALIDASI PARENT COMMENT (Jika diisi)
    # ========================================================
    if req.parent_comment_id not in (None, "", "null"):

        try:
            parent = await db.comments.find_one(
                {"_id": ObjectId(req.parent_comment_id)}
            )
        except:
            parent = None

        if parent is None:
            # ❗ Parent tidak ditemukan → JANGAN INSERT KOMENTAR
            return {"confirmation": "backend error"}

    # ========================================================
    # 3) INSERT COMMENT (hanya setelah semua valid)
    # ========================================================
    new_comment_id = await CommentService.add_comment(
        article_id=req.article_id,
        parent_comment_id=req.parent_comment_id if req.parent_comment_id else None,
        owner_id=owner_id,
        comment_content=req.comment_content
    )

    if not new_comment_id:
        return {"confirmation": "backend error"}

    # ========================================================
    # 4) LANJUT FETCH ULANG & KEMBALIKAN RESPONSE FULL
    # (sama seperti sebelumnya)
    # ========================================================

    userclass = "admin" if user.get("role") == "admin" else "user"

    # convert image
    image_base64 = None
    if article.get("article_image"):
        try:
            image_base64 = bytes_to_base64(bytes(article["article_image"]))
        except:
            image_base64 = None

    # fetch comments
    comments_raw = await CommentService.get_comments(req.article_id)
    if comments_raw is None:
        return {"confirmation": "backend error"}

    comments = []
    for c in comments_raw:
        try:
            u = await db.users.find_one({"_id": ObjectId(c["owner_id"])})
        except:
            u = None

        comments.append({
            "comment_id": str(c["_id"]),
            "parent_comment_id": c.get("parent_comment_id"),
            "owner": u["username"] if u else "Unknown",
            "comment_content": c["comment_content"]
        })

    # fetch ratings
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

@router.post("/delete")
async def delete_comment(req: DeleteCommentRequest):

    # =====================================================
    # 0) DB ACCESS CHECK
    # =====================================================
    try:
        comment = await db.comments.find_one({"_id": ObjectId(req.comment_id)})
    except:
        return {"confirmation": "backend error"}

    if comment is None:
        return {"confirmation": "backend error"}

    article_id = str(comment["article_id"])

    # =====================================================
    # 1) VERIFY TOKEN
    # =====================================================
    payload = await AuthService.verify_token(req.token)
    if payload is None:
        return {"confirmation": "token invalid"}

    # =====================================================
    # 2) GET USER
    # =====================================================
    try:
        user = await db.users.find_one({"email": payload.get("email")})
    except:
        return {"confirmation": "backend error"}

    if not user:
        return {"confirmation": "token invalid"}

    # Only owner can delete
    if str(user["_id"]) != str(comment["owner_id"]):
        return {"confirmation": "backend error"}

    # =====================================================
    # 3) DELETE COMMENT + CHILDREN
    # =====================================================
    deleted = await CommentService.delete_comment_and_children(req.comment_id)
    if not deleted:
        return {"confirmation": "backend error"}

    # =====================================================
    # 4) RE-FETCH ARTICLE + COMMENTS + RATINGS
    # =====================================================
    article = await ArticleService.fetch_article(article_id)
    if article is None:
        return {"confirmation": "backend error"}

    userclass = "admin" if user.get("role") == "admin" else "user"

    # Convert image
    image_base64 = None
    if article.get("article_image"):
        try:
            image_base64 = bytes_to_base64(bytes(article["article_image"]))
        except:
            image_base64 = None

    # Fetch comments
    comments_raw = await CommentService.get_comments(article_id)
    if comments_raw is None:
        return {"confirmation": "backend error"}

    comments = []
    for c in comments_raw:
        try:
            u = await db.users.find_one({"_id": ObjectId(c["owner_id"])})
        except:
            u = None

        comments.append({
            "comment_id": str(c["_id"]),
            "parent_comment_id": c.get("parent_comment_id"),
            "owner": u["username"] if u else "Unknown",
            "comment_content": c["comment_content"]
        })

    # Fetch ratings
    ratings_raw = await RatingService.get_ratings(article_id)
    if ratings_raw is None:
        return {"confirmation": "backend error"}

    ratings = []
    for r in ratings_raw:
        ratings.append({
            "rating_id": str(r["_id"]),
            "owner": r["owner"],  # username
            "rating_value": r["rating_value"]
        })

    # =====================================================
    # 5) FINAL SUCCESS RESPONSE
    # =====================================================
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
