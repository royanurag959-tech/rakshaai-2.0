import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "RakshaAI 2.0"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "rakshaai-super-secret-security-key-2026-production")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./rakshaai.db")
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "uploads")
    
    # Official National Cyber Crime Helpline
    NATIONAL_CYBER_HELPLINE: str = "1930"
    NATIONAL_PORTAL_URL: str = "https://cybercrime.gov.in"

    class Config:
        case_sensitive = True

settings = Settings()
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
