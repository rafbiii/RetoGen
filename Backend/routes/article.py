from fastapi import APIRouter
from schemas.edit_article_get_schema import EditArticleGetRequest
from schemas.edit_article_update_schema import EditArticleUpdateRequest
from services.article_service import ArticleService
from services.auth_service import AuthService
from utils.base64_utils import base64_to_bytes, bytes_to_base64

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
