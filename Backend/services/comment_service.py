from db.connection import db
from datetime import datetime
from bson import ObjectId

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
    
    @staticmethod
    async def delete_comment_and_children(comment_id: str):
        try:
            oid = ObjectId(comment_id)

            # Hapus komentar utama
            await db.comments.delete_one({"_id": oid})

            # Hapus semua child comment (level 1)
            await db.comments.delete_many({"parent_comment_id": comment_id})

            return True
        except:
            return False