from dotenv import load_dotenv
import os

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:password@localhost:5432/trapeye_db")
SECRET_KEY = os.getenv("SECRET_KEY", "trapeye-secret-key")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# ML Model paths
ML_MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "ml_models")
PHISHING_MODEL_PATH = os.path.join(ML_MODELS_DIR, "phishing_model.pkl")
FAKE_NEWS_MODEL_PATH = os.path.join(ML_MODELS_DIR, "fake_news_model.pkl")
FAKE_NEWS_VECTORIZER_PATH = os.path.join(ML_MODELS_DIR, "fake_news_vectorizer.pkl")

# API URLs
NEWS_API_BASE_URL = "https://newsapi.org/v2"
PHISHTANK_API_URL = "https://checkurl.phishtank.com/checkurl/"

# Scheduler config
NEWS_FETCH_INTERVAL_MINUTES = 10

# CORS
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
