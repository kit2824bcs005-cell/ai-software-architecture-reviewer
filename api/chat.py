from fastapi import APIRouter

from models.chat_model import ChatRequest
from rag.embeddings import model
from services.reg_service import generate_ai_response
from core.logger import logger

router = APIRouter(
    prefix="/api",
    tags=["Chat"]
)


@router.post("/chat")
async def chat(request: ChatRequest):

    logger.info(f"Chat request: {request.question}")

    result = generate_ai_response(
        question=request.question,
        model=model
    )

    return {
        "success": True,
        "question": request.question,
        **result
    }