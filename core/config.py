import os
from dotenv import load_dotenv

# Ensure the .env file is loaded using an absolute path relative to this file
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
dotenv_path = os.path.join(backend_dir, ".env")

load_dotenv(dotenv_path=dotenv_path, override=True)

class Settings:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    CHROMA_DB_PATH = "vectorstore"
    MODEL_NAME = os.getenv("MODEL_NAME", "gpt-4o-mini")

settings = Settings()