from db.connection import db
from datetime import datetime
from bson import ObjectId

class RatingService:

    @staticmethod
    async def add_rating(article_id, owner_id, rating_value):
        try:
            data = {
                "article_id": article_id,
                "owner_id": owner_id,
                "rating_value": rating_value,
                "created_at": datetime.utcnow()
            }
            result = await db.rating.insert_one(data)
            return str(result.inserted_id)
        except:
            return None


    @staticmethod
    async def get_rating_by_user(article_id, owner_id):
        try:
            return await db.rating.find_one({
                "article_id": article_id,
                "owner_id": owner_id
            })
        except:
            return None



    @staticmethod
    async def get_ratings(article_id):
        try:
            return await db.rating.find({"article_id": article_id}).to_list(None)
        except:
            return None

    @staticmethod
    async def fetch_article(article_id):
        try:
            return await db.articles.find_one({"_id": ObjectId(article_id)})
        except:
            return None

    @staticmethod
    async def get_comments(article_id):
        try:
            return await db.comments.find({"article_id": article_id}).to_list(None)
        except:
            return None
        
    @staticmethod
    async def get_rating_by_id(rating_id):
        try:
            from bson import ObjectId
            return await db.rating.find_one({"_id": ObjectId(rating_id)})
        except:
            return None
        
    @staticmethod
    async def update_rating(rating_id, new_value):
        try:
            from bson import ObjectId
            result = await db.rating.update_one(
                {"_id": ObjectId(rating_id)},
                {"$set": {"rating_value": new_value}}
            )
            return result.modified_count == 1
        except:
            return False


