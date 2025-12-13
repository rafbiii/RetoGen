from db.connection import db
from bson import ObjectId
from services.comment_service import CommentService

class UserService:

    @staticmethod
    async def get_all_users():
        try:
            users_cursor = db.user.find({})
            users = await users_cursor.to_list(length=None)
            return users
        except:
            return None

    @staticmethod
    async def get_user_by_id(user_id: str):
        try:
            user = await db.user.find_one({"_id": ObjectId(user_id)})
            return user
        except:
            return None

    @staticmethod
    async def get_reports_for_user(user_id: str):
        try:
            reports_cursor = db.report_user.find({"reported_user_id": ObjectId(user_id)})
            reports = await reports_cursor.to_list(length=None)
            return reports
        except:
            return None
    
    @staticmethod
    async def delete_user(user_id: str):
        """
        Delete user and all related data:
        - All comments by user (including children)
        - All ratings by user
        - All report_user where reported_user_id = user_id
        - The user itself
        """
        try:
            user_oid = ObjectId(user_id)

            # --- Delete comments including children ---
            user_comments = await db.comment.find({"owner_id": user_id}).to_list(None)
            for c in user_comments:
                await CommentService.delete_comment_and_children(str(c["_id"]))

            # --- Delete ratings ---
            await db.rating.delete_many({"owner_id": user_id})

            # --- Delete report_user where this user is reported ---
            await db.report_user.delete_many({"reported_user_id": user_oid})

            # --- Delete user ---
            result = await db.user.delete_one({"_id": user_oid})
            return result.deleted_count == 1

        except Exception as e:
            print("DELETE USER ERROR:", e)
            return False
        
    @staticmethod
    async def make_admin(user_id: str):
        try:
            result = await db.user.update_one(
                {"_id": ObjectId(user_id)},
                {"$set": {"role": "admin"}}
            )
            return result.modified_count == 1
        except:
            return False

    @staticmethod
    async def get_user_by_email(email: str):
        try:
            return await db.user.find_one({"email": email})
        except:
            return None

