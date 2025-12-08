from fastapi import APIRouter
from schemas.add_report_article_schema import AddReportArticleSchema
from services.report_article_service import ReportArticleService
from services.auth_service import AuthService
from bson import ObjectId
from db.connection import db

router = APIRouter()

@router.post("/add")
async def add_report_article(req: AddReportArticleSchema):

    # 1) VALIDATE DESCRIPTION
    if not req.description.strip():
        return {"confirmation": "please fill description"}

    # 2) VERIFY TOKEN
    payload = await AuthService.verify_token(req.token)
    if payload is None:
        return {"confirmation": "token invalid"}

    # 3) VALIDATE article_id
    try:
        ObjectId(req.article_id)
    except:
        return {"confirmation": "invalid article_id"}

    # 4) ADD REPORT
    report_id = await ReportArticleService.add_report(req.article_id, req.description)
    if not report_id:
        return {"confirmation": "backend error"}

    return {"confirmation": "successful: article reported"}
