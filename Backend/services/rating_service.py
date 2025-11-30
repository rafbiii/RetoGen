from bson import ObjectId
from datetime import datetime
from db.connection import db
from models.ratings import rating_document

class RatingService:

    @staticmethod
    async def add_rating(user_payload, article_id, rating_value):
        try:
            rating = rating_document()
            rating["rating_id"] = str(ObjectId())
            rating["article_id"] = article_id
            rating["owner"] = user_payload.get("username")  # username
            rating["rating_value"] = rating_value
            rating["created_at"] = datetime.utcnow()

            await db.ratings.insert_one(rating)
            return True

        except Exception as e:
            print("ADD RATING ERROR:", e)
            return False


    @staticmethod
    async def get_ratings(article_id):
        try:
            cursor = db.ratings.find({"article_id": article_id})
            return await cursor.to_list(length=None)
        except:
            return None
