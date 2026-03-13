from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from config.settings import DATABASE_URL

engine = create_engine(DATABASE_URL, pool_pre_ping=True, pool_recycle=300)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class PhishingAnalysis(Base):
    __tablename__ = "phishing_analyses"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(2048), nullable=False)
    risk_level = Column(String(20))  # LOW, MEDIUM, HIGH, CRITICAL
    phishing_probability = Column(Float)
    reasons = Column(Text)  # JSON string
    url_length = Column(Integer)
    num_dots = Column(Integer)
    has_ip = Column(Boolean)
    has_https = Column(Boolean)
    suspicious_keywords = Column(Text)
    domain_age_days = Column(Integer)
    phishtank_listed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class FakeNewsAnalysis(Base):
    __tablename__ = "fakenews_analyses"

    id = Column(Integer, primary_key=True, index=True)
    headline = Column(Text)
    article_text = Column(Text)
    source_url = Column(String(2048))
    credibility_score = Column(Float)
    fake_probability = Column(Float)
    ml_classification = Column(String(20))
    gemini_reasoning = Column(Text)
    language_flags = Column(Text)  # JSON
    created_at = Column(DateTime, default=datetime.utcnow)


class DeepfakeAnalysis(Base):
    __tablename__ = "deepfake_analyses"

    id = Column(Integer, primary_key=True, index=True)
    media_type = Column(String(10))  # image, video
    filename = Column(String(512))
    deepfake_probability = Column(Float)
    confidence_level = Column(String(20))  # Low, Medium, High
    gemini_analysis = Column(Text)
    frames_analyzed = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)


class NewsArticle(Base):
    __tablename__ = "news_articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(Text)
    description = Column(Text)
    content = Column(Text)
    source_name = Column(String(256))
    source_url = Column(String(2048))
    published_at = Column(DateTime)
    credibility_score = Column(Float, nullable=True)
    is_suspicious = Column(Boolean, default=False)
    category = Column(String(50))
    fetched_at = Column(DateTime, default=datetime.utcnow)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    Base.metadata.create_all(bind=engine)
