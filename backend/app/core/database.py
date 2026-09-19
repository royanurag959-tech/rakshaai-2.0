import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

logger = logging.getLogger("rakshaai.database")

def create_db_engine():
    db_url = settings.DATABASE_URL
    
    # Handle Heroku / Supabase / Neon postgres:// vs postgresql:// prefix
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
        
    connect_args = {"check_same_thread": False} if "sqlite" in db_url else {}
    
    try:
        eng = create_engine(
            db_url,
            connect_args=connect_args,
            pool_pre_ping=True
        )
        # Verify connection
        with eng.connect() as conn:
            pass
        print(f"[RakshaAI DB] Connected successfully to: {db_url.split('@')[-1] if '@' in db_url else db_url}")
        return eng
    except Exception as e:
        print(f"[RakshaAI DB] Warning: Could not connect to {db_url} ({e}). Falling back to local SQLite.")
        fallback_url = "sqlite:///./rakshaai.db"
        return create_engine(fallback_url, connect_args={"check_same_thread": False})

engine = create_db_engine()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
