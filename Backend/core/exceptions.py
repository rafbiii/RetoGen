from fastapi import HTTPException

def NotFound(msg="Data not found"):
    raise HTTPException(status_code=404, detail=msg)

def BadRequest(msg="Bad request"):
    raise HTTPException(status_code=400, detail=msg)

def Unauthorized(msg="Unauthorized"):
    raise HTTPException(status_code=401, detail=msg)
