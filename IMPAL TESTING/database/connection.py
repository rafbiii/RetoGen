from pymongo import MongoClient

MONGO_URL = "mongodb://localhost:27017"

client = MongoClient(MONGO_URL)
db = client["JakiRetogen"]

def get_db_status():
    return {
        "status": "MongoDB tersambung ✅",
        "databases": client.list_database_names()
    }
