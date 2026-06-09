from fastapi import APIRouter, UploadFile, File
import os

from services.reg_service import process_pdf

router = APIRouter()

UPLOAD_FOLDER = "data"


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    result = process_pdf(file_path)

    return {
        "status": "success",
        "message": "PDF processed successfully",
        "filename": file.filename,
        **result
    }