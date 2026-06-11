from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from api.upload import router as upload_router
from api.chat import router as chat_router
from core.config import settings

app = FastAPI(
    title="AI Software Architecture Reviewer",
    version="1.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=200,
        content={
            "success": False,
            "error": "Validation Error: Invalid input parameters."
        }
    )

app.include_router(upload_router)
app.include_router(chat_router)


@app.get("/")
def home():
    return {
        "message": "Backend Running Successfully 🚀",
        "status": "OK"
    }


@app.get("/test-key")
def test_key():
    return {
        "loaded": bool(settings.OPENAI_API_KEY),
        "length": len(settings.OPENAI_API_KEY)
    }