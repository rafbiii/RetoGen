from datetime import datetime

def rating_document():
    return {
        "rating_id": None,
        "article_id": None,
        "owner": None,             # username
        "rating_value": None,      # int 1-5
        "created_at": datetime.utcnow()
    }
