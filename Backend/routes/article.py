from fastapi import APIRouter
from schemas.edit_article_get_schema import EditArticleGetRequest
from schemas.edit_article_update_schema import EditArticleUpdateRequest
from schemas.view_article_schema import ViewArticleRequest
from schemas.verification_schema import VerificationRequest
from services.article_service import ArticleService
from services.auth_service import AuthService
from utils.base64_utils import base64_to_bytes, bytes_to_base64
from schemas.delete_article_schema import DeleteArticleRequest
from bson import ObjectId
from db.connection import db
from schemas.add_article_schema import AddArticle
from schemas.main_page_schema import MainPageRequest

router = APIRouter()

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
    article = await ArticleService.fetch_article(req.article_id)
    if article is None:
        return {"confirmation": "backend error"}

    payload = await AuthService.verify_token(req.token)
    if payload is None:
        return {"confirmation": "token invalid"}

    is_admin = await AuthService.is_admin(payload)
    userclass = "admin" if is_admin else "user"

    image_base64 = None
    if article.get("article_image"):
        try:
            image_base64 = bytes_to_base64(bytes(article["article_image"]))
        except:
            image_base64 = None

    return {
        "confirmation": "article fetch successful",
        "userclass": userclass,
        "article_title": article["article_title"],
        "article_content": article["article_content"],
        "article_tag": article["article_tag"],
        "article_image": image_base64
    }


@router.post("/delete")
async def delete_article(req: DeleteArticleRequest):
    from bson import ObjectId, errors
    try:
        article_oid = ObjectId(req.article_id)
    except errors.InvalidId:
        return {"confirmation": "backend error"}

    article = await ArticleService.fetch_article(req.article_id)
    if article is None:
        return {"confirmation": "backend error"}

    payload = await AuthService.verify_token(req.token)
    if payload is None:
        return {"confirmation": "token invalid"}

    if not await AuthService.is_admin(payload):
        return {"confirmation": "not admin"}

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
            "article_image": a.get("article_image").decode("latin1") if a.get("article_image") else None
        })

    return {
        "confirmation": "fetch data successful",
        "username": username,
        "list_article": list_article
    }


@router.post("/verification")
async def verification(req : VerificationRequest):
    payload = await AuthService.verify_token(req.token)
    if payload is None:
        return {"confirmation": "token invalid"}

    user_email = payload.get("email")
    if user_email is None:
        return {"confirmation": "token invalid"}

    user = await db.users.find_one({"email": user_email})
    if not user:
        return {"confirmation": "backend error"}
    
    if user.get("role") != "admin":
        return {"confirmation": "not admin"}
    
    return {
        "confirmation": "successful"
    }


@router.post("/add")
async def add_article(req: AddArticle):

    payload = await AuthService.verify_token(req.token)
    if payload is None:
        return {"confirmation": "token invalid"}

    user_email = payload.get("email")
    if user_email is None:
        return {"confirmation": "token invalid"}

    user = await db.users.find_one({"email": user_email})
    if not user:
        return {"confirmation": "token invalid"}
    
    if user.get("role") != "admin":
        return {"confirmation": "not admin"}

    author_id = str(user["_id"])

    if not (10 <= len(req.article_title) <= 64):
        return {"confirmation": "Title must be 10-64 characters long."}

    if not (20 <= len(req.article_preview) <= 160):
        return {"confirmation": "Preview must be 20-160 characters long."}

    if len(req.article_content) < 50:
        return {"confirmation": "Content must be at least 50 characters long."}

    try:
        image_bytes = base64_to_bytes(req.article_image)
    except Exception:
        return {"confirmation": "Image format must be valid Base64."}
    
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
        "confirmation": "success: article added",
    }
