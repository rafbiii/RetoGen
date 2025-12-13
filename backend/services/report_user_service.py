from db.connection import db
from bson import ObjectId
from datetime import datetime

class ReportUserService:

    @staticmethod
    async def fetch_user_by_email(email: str):
        """
        Return user document or None on DB error / not found.
        """
        try:
            user = await db.user.find_one({"email": email})
            return user
        except Exception as e:
            print("FETCH USER BY EMAIL ERROR:", e)
            return None

    @staticmethod
    async def save_report(reported_user_id: ObjectId, description: str):
        """
        Save report to report_user collection.
        Return inserted_id as str or None on error.

        Document format:
        {
            _id: ObjectId(...),
            reported_user_id: ObjectId(...),
            description: "<desc>",
            created_at: datetime
        }
        """
        try:
            now = datetime.utcnow()

            doc = {
                "reported_user_id": reported_user_id,  # <-- ObjectId asli
                "description": description,
                "created_at": now
            }

            res = await db.report_user.insert_one(doc)
            if res.inserted_id:
                return str(res.inserted_id)

            return None

        except Exception as e:
            print("SAVE REPORT ERROR:", e)
            return None

    @staticmethod
    async def increment_report_count(user_oid_str: str):
        """
        Increment report_count on users collection using user OID string.
        Returns True on success, False on failure.
        """
        try:
            result = await db.user.update_one(
                {"_id": ObjectId(user_oid_str)},
                {"$inc": {"report_count": 1}}
            )
            return result.modified_count > 0 or result.matched_count > 0
        except Exception as e:
            print("INCREMENT REPORT COUNT ERROR:", e)
            return False