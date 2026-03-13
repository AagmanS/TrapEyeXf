from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from config.settings import ALLOWED_ORIGINS, ENVIRONMENT
from models.database import create_tables
from routes import phishing, fakenews, deepfake, news_monitor, dashboard

app = FastAPI(
    title="TrapEye API",
    description="AI-Powered Cybersecurity Platform — Scam & Threat Detection Engine",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.on_event("startup")
async def startup_event():
    """Initialize database tables on startup."""
    try:
        create_tables()
        print("✅ Database tables initialized")
    except Exception as e:
        print(f"⚠️  Database initialization warning: {e}")
        print("   Continuing without database (API will use mock data)")


# Routes
app.include_router(phishing.router, prefix="/api/phishing", tags=["Phishing Detection"])
app.include_router(fakenews.router, prefix="/api/fakenews", tags=["Fake News Detection"])
app.include_router(deepfake.router, prefix="/api/deepfake", tags=["Deepfake Detection"])
app.include_router(news_monitor.router, prefix="/api/news", tags=["News Monitor"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])


@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "platform": "TrapEye",
        "version": "1.0.0",
        "environment": ENVIRONMENT,
        "modules": ["phishing", "fakenews", "deepfake", "news_monitor"],
    }


@app.get("/")
async def root():
    return {
        "message": "TrapEye AI Cybersecurity Platform",
        "docs": "/api/docs",
        "health": "/api/health",
    }
