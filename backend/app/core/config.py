import os
from pathlib import Path
from pydantic_settings import BaseSettings
from dotenv import load_dotenv

# Load environment variables from .env file
ROOT_DIR = Path(__file__).parent.parent.parent
load_dotenv(ROOT_DIR / '.env')

class Settings(BaseSettings):
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "AI Navigator"
    
    # MongoDB settings
    MONGO_URL: str = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
    DB_NAME: str = os.environ.get("DB_NAME", "ai_navigator")
    
    # JWT settings
    SECRET_KEY: str = os.environ.get("SECRET_KEY", "your-secret-key-for-jwt")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # CORS settings
    CORS_ORIGINS: list = [
        "*",
        "http://localhost:12001",
        "https://work-2-jrkdyssrjriraefd.prod-runtime.all-hands.dev"
    ]
    
    class Config:
        case_sensitive = True

settings = Settings()