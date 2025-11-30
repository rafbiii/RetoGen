from db.connection import db
from datetime import datetime

class CommentService:

    @staticmethod
    async def add_comment(article_id, parent_comment_id, owner_id, comment_content):
        try:
            data = {
                "article_id": article_id,
                "owner_id": owner_id,
                "parent_comment_id": parent_comment_id,
                "comment_content": comment_content,
                "created_at": datetime.utcnow(),
            }
            result = await db.comments.insert_one(data)
            return str(result.inserted_id)
        except:
            return None

    @staticmethod
    async def get_comments(article_id):
        try:
            return await db.comments.find({"article_id": article_id}).to_list(None)
        except:
            return None
