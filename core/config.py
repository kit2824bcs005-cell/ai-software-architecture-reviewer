import os

class Settings:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    CHROMA_DB_PATH = "vectorstore"
    MODEL_NAME = "gpt-4o-mini"

settings = Settings()