from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from datetime import datetime


# ─── Phishing ────────────────────────────────────────────────────────────────
class URLAnalysisRequest(BaseModel):
    url: str


class URLAnalysisResponse(BaseModel):
    url: str
    risk_level: str
    phishing_probability: float
    reasons: List[str]
    features: dict
    phishtank_listed: bool
    scan_time: datetime


# ─── Fake News ────────────────────────────────────────────────────────────────
class FakeNewsRequest(BaseModel):
    headline: str
    article_text: Optional[str] = ""
    source_url: Optional[str] = ""


class FakeNewsResponse(BaseModel):
    headline: str
    credibility_score: float
    fake_probability: float
    ml_classification: str
    gemini_reasoning: str
    language_flags: List[str]
    overall_verdict: str
    scan_time: datetime


# ─── Deepfake ────────────────────────────────────────────────────────────────
class DeepfakeResponse(BaseModel):
    filename: str
    media_type: str
    deepfake_probability: float
    confidence_level: str
    gemini_analysis: str
    authenticity_score: float
    frames_analyzed: int
    scan_time: datetime


# ─── News Monitor ─────────────────────────────────────────────────────────────
class NewsArticleOut(BaseModel):
    id: int
    title: str
    description: Optional[str]
    source_name: str
    source_url: Optional[str]
    published_at: Optional[datetime]
    credibility_score: Optional[float]
    is_suspicious: bool
    category: Optional[str]

    class Config:
        from_attributes = True


class NewsMonitorResponse(BaseModel):
    articles: List[NewsArticleOut]
    total: int
    suspicious_count: int
    last_updated: datetime


# ─── Dashboard ────────────────────────────────────────────────────────────────
class ThreatStats(BaseModel):
    total_scans: int
    phishing_detected: int
    fake_news_detected: int
    deepfakes_detected: int
    news_monitored: int
    threat_score_avg: float


class DashboardResponse(BaseModel):
    stats: ThreatStats
    recent_phishing: List[dict]
    recent_fakenews: List[dict]
    recent_deepfakes: List[dict]
    suspicious_news: List[dict]
    threat_timeline: List[dict]
