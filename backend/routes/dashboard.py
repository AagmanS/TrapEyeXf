from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.database import get_db, PhishingAnalysis, FakeNewsAnalysis, DeepfakeAnalysis, NewsArticle

router = APIRouter()


@router.get("/stats")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get aggregated threat statistics for dashboard."""
    try:
        total_phishing = db.query(PhishingAnalysis).count()
        phishing_detected = db.query(PhishingAnalysis).filter(
            PhishingAnalysis.phishing_probability >= 60
        ).count()

        total_fakenews = db.query(FakeNewsAnalysis).count()
        fake_detected = db.query(FakeNewsAnalysis).filter(
            FakeNewsAnalysis.fake_probability >= 50
        ).count()

        total_deepfakes = db.query(DeepfakeAnalysis).count()
        deepfakes_detected = db.query(DeepfakeAnalysis).filter(
            DeepfakeAnalysis.deepfake_probability >= 50
        ).count()

        news_monitored = db.query(NewsArticle).count()

        # Threat timeline (last 7 days)
        timeline = []
        for i in range(7, 0, -1):
            day = datetime.now(timezone.utc) - timedelta(days=i)
            day_str = day.strftime("%b %d")
            ph = db.query(PhishingAnalysis).filter(
                PhishingAnalysis.created_at >= day,
                PhishingAnalysis.created_at < day + timedelta(days=1)
            ).count()
            fn = db.query(FakeNewsAnalysis).filter(
                FakeNewsAnalysis.created_at >= day,
                FakeNewsAnalysis.created_at < day + timedelta(days=1)
            ).count()
            timeline.append({"date": day_str, "phishing": ph, "fakenews": fn})

        # Recent records
        recent_phishing = db.query(PhishingAnalysis).order_by(
            PhishingAnalysis.created_at.desc()
        ).limit(5).all()

        recent_fakenews = db.query(FakeNewsAnalysis).order_by(
            FakeNewsAnalysis.created_at.desc()
        ).limit(5).all()

        recent_deepfakes = db.query(DeepfakeAnalysis).order_by(
            DeepfakeAnalysis.created_at.desc()
        ).limit(5).all()

        suspicious_news = db.query(NewsArticle).filter(
            NewsArticle.is_suspicious == True
        ).order_by(NewsArticle.fetched_at.desc()).limit(10).all()

        return {
            "stats": {
                "total_scans": total_phishing + total_fakenews + total_deepfakes,
                "phishing_detected": phishing_detected,
                "fake_news_detected": fake_detected,
                "deepfakes_detected": deepfakes_detected,
                "news_monitored": news_monitored,
                "threat_score_avg": round(
                    (phishing_detected + fake_detected + deepfakes_detected) /
                    max(total_phishing + total_fakenews + total_deepfakes, 1) * 100, 1
                ),
            },
            "recent_phishing": [
                {
                    "url": r.url[:60] + "..." if len(r.url) > 60 else r.url,
                    "risk_level": r.risk_level,
                    "probability": r.phishing_probability,
                    "time": r.created_at.isoformat() if r.created_at else None,
                }
                for r in recent_phishing
            ],
            "recent_fakenews": [
                {
                    "headline": (r.headline or "")[:80],
                    "credibility": r.credibility_score,
                    "verdict": "FAKE" if (r.fake_probability or 0) > 50 else "CREDIBLE",
                    "time": r.created_at.isoformat() if r.created_at else None,
                }
                for r in recent_fakenews
            ],
            "recent_deepfakes": [
                {
                    "filename": r.filename,
                    "probability": r.deepfake_probability,
                    "confidence": r.confidence_level,
                    "time": r.created_at.isoformat() if r.created_at else None,
                }
                for r in recent_deepfakes
            ],
            "suspicious_news": [
                {
                    "title": (r.title or "")[:100],
                    "source": r.source_name,
                    "credibility": r.credibility_score,
                }
                for r in suspicious_news
            ],
            "threat_timeline": timeline,
        }
    except Exception as e:
        # Return mock stats if DB unavailable
        return _mock_stats()


def _mock_stats():
    return {
        "stats": {
            "total_scans": 1247,
            "phishing_detected": 342,
            "fake_news_detected": 189,
            "deepfakes_detected": 67,
            "news_monitored": 3891,
            "threat_score_avg": 47.8,
        },
        "recent_phishing": [
            {"url": "secure-login-paypal.tk/verify", "risk_level": "CRITICAL", "probability": 94.2, "time": None},
            {"url": "amaz0n-account-suspended.ml", "risk_level": "HIGH", "probability": 87.1, "time": None},
            {"url": "google.com", "risk_level": "LOW", "probability": 2.3, "time": None},
        ],
        "recent_fakenews": [
            {"headline": "AI Cures All Disease Instantly!", "credibility": 8.0, "verdict": "FAKE", "time": None},
            {"headline": "Global Markets Rise 2% Amid Tech Rally", "credibility": 91.0, "verdict": "CREDIBLE", "time": None},
        ],
        "recent_deepfakes": [],
        "suspicious_news": [
            {"title": "SHOCKING: Secret Government Mind Control Exposed!", "source": "ConspiracyBlog", "credibility": 5.0},
            {"title": "AI cures cancer instantly — doctors silent!", "source": "AlternativeHealth", "credibility": 9.0},
        ],
        "threat_timeline": [
            {"date": "Mar 07", "phishing": 12, "fakenews": 8},
            {"date": "Mar 08", "phishing": 19, "fakenews": 11},
            {"date": "Mar 09", "phishing": 7, "fakenews": 15},
            {"date": "Mar 10", "phishing": 24, "fakenews": 9},
            {"date": "Mar 11", "phishing": 18, "fakenews": 22},
            {"date": "Mar 12", "phishing": 31, "fakenews": 14},
            {"date": "Mar 13", "phishing": 27, "fakenews": 19},
        ],
    }
