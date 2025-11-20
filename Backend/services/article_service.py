from db.connection import db
from bson import ObjectId, Binary
from utils.image_validator import validate_image_bytes
from datetime import datetime

class ArticleService:

    @staticmethod
    async def fetch_article(article_id: str):
        try:
            article = await db.articles.find_one({
                "_id": ObjectId(article_id),
                "is_deleted": False
            })
            return article
        except Exception:
            return None

    @staticmethod
    async def update_article(data, image_bytes: bytes):
        update_fields = {}

        if data.article_title is not None:
            update_fields["article_title"] = data.article_title

        if data.article_preview is not None:
            update_fields["article_preview"] = data.article_preview

        if data.article_content is not None:
            update_fields["article_content"] = data.article_content

        if data.article_tag is not None:
            update_fields["article_tag"] = data.article_tag

        if image_bytes is not None:
            if not validate_image_bytes(image_bytes):
                return "invalid_image"
            update_fields["article_image"] = Binary(image_bytes)

        update_fields["updated_at"] = datetime.utcnow()

        try:
            result = await db.articles.update_one(
                {"_id": ObjectId(data.article_id)},
                {"$set": update_fields}
            )
            return result.modified_count > 0
        except Exception:
            return False
