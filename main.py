from fastapi import FastAPI

# Upload API
from api.upload import router as upload_router

# Chat API (NEW)
from api.chat import router as chat_router

app = FastAPI(
    title="AI Software Architecture Reviewer",
    version="1.0"
)

# Routers
app.include_router(upload_router)
app.include_router(chat_router)

# Home route
@app.get("/")
def home():
    return {
        "message": "Backend Running Successfully 🚀",
        "status": "OK"
    }