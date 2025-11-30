from datetime import datetime

def comment_document():
    return {
        "comment_id": None,
        "article_id": None,
        "owner": None,                   # username pemilik komentar
        "parent_comment_id": None,       # reply ke komentar mana
        "comment_content": None,
        "created_at": datetime.utcnow()
    }
