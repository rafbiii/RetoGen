from fastapi import APIRouter
from schemas.edit_article_schema import EditArticleRequest
from services.auth_service import AuthService
from services.article_service import ArticleService
from utils.base64_utils import base64_to_bytes, bytes_to_base64
from schemas.add_article_schema import AddArticle
from db.connection import db
from schemas.main_page_schema import MainPageRequest


router = APIRouter(prefix="/article")

@router.post("/edit/get")
async def edit_get_article(req: EditArticleRequest):

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

@router.post("/edit/update")
async def edit_update_article(req: EditArticleRequest):

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

@router.post("/add")
async def add_article(req: AddArticle):

    payload = await AuthService.verify_token(req.token)
    if payload is None:
        return {"confirmation": "token invalid"}

    user_email = payload.get("email")
    if user_email is None:
        return {"confirmation": "token missing email"}

    user = await db.users.find_one({"email": user_email})
    if not user:
        return {"confirmation": "user not found"}
    
    if user.get("role") != "admin":
        return {"confirmation": "not admin"}

    author_id = str(user["_id"])

    try:
        image_bytes = base64_to_bytes(req.article_image)
    except:
        return {"confirmation": "invalid image format"}

    article_id = await ArticleService.add_article(
        req.article_title,
        req.article_preview,
        req.article_content,
        req.article_tag,
        image_bytes,
        author_id 
    )

    if article_id is None:
        return {"confirmation": "backend error"}

    return {
        "confirmation": "successful: article created",
        "article_id": article_id
    }
    
@router.post("/main_page")
async def main_page(req: MainPageRequest):

    payload = await AuthService.verify_token(req.token)
    if payload is None:
        return {"confirmation": "token invalid"}

    user_email = payload.get("email")
    user = await db.users.find_one({"email": user_email})

    if not user:
        return {"confirmation": "token invalid"}

    username = user.get("username", "")

    try:
        cursor = db.articles.find({"is_deleted": False})
        articles = await cursor.to_list(length=None)
    except Exception as e:
        print("MAIN PAGE ERROR:", e)
        return {"confirmation": "backend error"}

    list_article = []
    for a in articles:
        list_article.append({
            "article_id": a.get("article_id"),
            "article_title": a.get("article_title"),
            "article_preview": a.get("article_preview"),
            "article_tag": a.get("article_tag"),
            # convert binary to base64 agar bisa dikirim ke frontend
            "article_image": a.get("article_image").decode("latin1") if a.get("article_image") else None
        })

    return {
        "confirmation": "fetch data successful",
        "username": username,
        "list_article": list_article
    }