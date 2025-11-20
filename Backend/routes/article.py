from fastapi import APIRouter
from schemas.edit_article_get_schema import EditArticleGetRequest
from schemas.edit_article_update_schema import EditArticleUpdateRequest
from schemas.view_article_schema import ViewArticleRequest
from services.article_service import ArticleService
from services.auth_service import AuthService
from utils.base64_utils import base64_to_bytes, bytes_to_base64
from schemas.delete_article_schema import DeleteArticleRequest
from bson import ObjectId
from db.connection import db

router = APIRouter()

# STEP 1: Fetch article for editing
@router.post("/edit/get")
async def edit_get_article(req: EditArticleGetRequest):

    article = await ArticleService.fetch_article(req.article_id)
    if article is None:
        return {"confirmation": "backend error"}

    payload = await AuthService.verify_token(req.token)
    if payload is None:
        return {"confirmation": "token invalid"}

    if not await AuthService.is_admin(payload):
        return {"confirmation": "not admin"}

    image_base64 = None
    if article.get("article_image"):
        image_base64 = bytes_to_base64(bytes(article["article_image"]))

    return {
        "confirmation": "successful",
        "article_id": str(article["_id"]),
        "article_title": article["article_title"],
        "article_preview": article["article_preview"],
        "article_content": article["article_content"],
        "article_tag": article["article_tag"],
        "article_image": image_base64
    }

# STEP 2: Update article
@router.post("/edit/update")
async def edit_update_article(req: EditArticleUpdateRequest):

    article = await ArticleService.fetch_article(req.article_id)
    if article is None:
        return {"confirmation": "backend error"}

    image_bytes = None
    if req.article_image:
        try:
            image_bytes = base64_to_bytes(req.article_image)
        except:
            return {"confirmation": "invalid image format"}

    result = await ArticleService.update_article(req, image_bytes)

    if result == "invalid_image":
        return {"confirmation": "invalid image format"}

    if not result:
        return {"confirmation": "backend error"}

    return {
        "confirmation": "successful: article edited",
        "article_id": req.article_id
    }

@router.post("/view")
async def view_article(req: ViewArticleRequest):

    # STEP 1 — cek database bisa diakses
    article = await ArticleService.fetch_article(req.article_id)
    if article is None:
        return {"confirmation": "backend error"}

    # STEP 2 — verifikasi token
    payload = await AuthService.verify_token(req.token)
    if payload is None:
        return {"confirmation": "token invalid"}

    # STEP 3 — tentukan userclass
    is_admin = await AuthService.is_admin(payload)
    userclass = "admin" if is_admin else "user"

    # STEP 4 — convert image binary → base64
    image_base64 = None
    if article.get("article_image"):
        try:
            image_base64 = bytes_to_base64(bytes(article["article_image"]))
        except:
            image_base64 = None

    # STEP 5 — kirim response
    return {
        "confirmation": "successful",
        "userclass": userclass,
        "article_title": article["article_title"],
        "article_content": article["article_content"],
        "article_tag": article["article_tag"],
        "article_image": image_base64
    }


@router.post("/delete")
async def delete_article(req: DeleteArticleRequest):
    # STEP 1 — cek valid ObjectId
    from bson import ObjectId, errors
    try:
        article_oid = ObjectId(req.article_id)
    except errors.InvalidId:
        return {"confirmation": "backend error"}

    # STEP 2 — cek database
    article = await ArticleService.fetch_article(req.article_id)
    if article is None:
        return {"confirmation": "backend error"}

    # STEP 3 — verifikasi token
    payload = await AuthService.verify_token(req.token)
    if payload is None:
        return {"confirmation": "token invalid"}

    # STEP 4 — cek admin
    if not await AuthService.is_admin(payload):
        return {"confirmation": "not admin"}

    # STEP 5 — soft delete
    try:
        result = await db.articles.update_one(
            {"_id": article_oid},
            {"$set": {"is_deleted": True}}
        )
    except:
        return {"confirmation": "backend error"}

    if result.modified_count == 0:
        return {"confirmation": "backend error"}

    return {"confirmation": "successful: article deleted"}
