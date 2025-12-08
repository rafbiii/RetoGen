from db.connection import db
from bson import ObjectId

class ReportArticleService:

    @staticmethod
    async def add_report(article_id: str, description: str):
        """Tambahkan report artikel dan update report_count"""
        try:
            # simpan report di report_article
            data = {
                "article_id": ObjectId(article_id),
                "description": description
            }
            result = await db.report_article.insert_one(data)

            # update report_count di article
            await db.article.update_one(
                {"_id": ObjectId(article_id)},
                {"$inc": {"report_count": 1}}
            )

            return str(result.inserted_id)
        except:
            return None
