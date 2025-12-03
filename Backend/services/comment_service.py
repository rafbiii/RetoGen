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
            result = await db.comment.insert_one(data)
            return str(result.inserted_id)
        except:
            return None

    @staticmethod
    async def get_comments(article_id):
        try:
            return await db.comment.find({"article_id": article_id}).to_list(None)
        except:
            return None
        
    @staticmethod
    async def edit_comment(article_id: str, comment_id: str, owner_id: str, new_content: str):

        # validate content
        if not (1 <= len(new_content) <= 8192):
            return False

        # pastikan comment milik user
        try:
            comment = await db.comment.find_one({
                "_id": ObjectId(comment_id),
                "article_id": article_id,
                "owner_id": owner_id
            })
        except:
            return False

        if not comment:
            return False

        # update content (walaupun sama)
        try:
            res = await db.comment.update_one(
                {"_id": ObjectId(comment_id)},
                {"$set": {"comment_content": new_content}}
            )

            # MongoDB: modified_count mungkin 0 jika value sama → tetap dianggap sukses
            return res.acknowledged

        except:
            return False
    
    @staticmethod
    async def delete_comment_and_children(comment_id: str):
        try:
            oid = ObjectId(comment_id)

            # Hapus komentar utama
            await db.comment.delete_one({"_id": oid})

            # Hapus semua child comment (level 1)
            await db.comment.delete_many({"parent_comment_id": comment_id})

            return True
        except:
            return False
