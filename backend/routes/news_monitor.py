from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timezone
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.database import get_db, NewsArticle
from services.news_service import fetch_news, fetch_all_categories

router = APIRouter()
_last_fetch: datetime = None
_cached_articles: list = []


@router.get("/feed")
async def get_news_feed(category: str = "general", limit: int = 20, db: Session = Depends(get_db)):
    """Get real-time news feed with credibility scores."""
    articles = await fetch_news(category, limit)

    # Persist to DB
    try:
        for a in articles[:10]:
            existing = db.query(NewsArticle).filter(
                NewsArticle.title == a["title"]
            ).first()
            if not existing:
                pub_at = None
                if a.get("published_at"):
                    try:
                        from dateutil import parser
                        pub_at = parser.parse(a["published_at"])
                    except Exception:
                        pub_at = datetime.now(timezone.utc)

                record = NewsArticle(
                    title=a["title"],
                    description=a.get("description", ""),
                    content=a.get("content", ""),
                    source_name=a.get("source_name", "Unknown"),
                    source_url=a.get("source_url", ""),
                    published_at=pub_at,
                    credibility_score=a.get("credibility_score"),
                    is_suspicious=a.get("is_suspicious", False),
                    category=a.get("category", category),
                )
                db.add(record)
        db.commit()
    except Exception:
        db.rollback()

    return {
        "articles": articles,
        "total": len(articles),
        "suspicious_count": sum(1 for a in articles if a.get("is_suspicious")),
        "last_updated": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/alerts")
async def get_suspicious_alerts(db: Session = Depends(get_db)):
    """Get suspicious/low-credibility news alerts."""
    try:
        records = db.query(NewsArticle).filter(
            NewsArticle.is_suspicious == True
        ).order_by(NewsArticle.fetched_at.desc()).limit(20).all()

        return [
            {
                "id": r.id,
                "title": r.title,
                "source_name": r.source_name,
                "credibility_score": r.credibility_score,
                "published_at": r.published_at.isoformat() if r.published_at else None,
            }
            for r in records
        ]
    except Exception:
        return []


@router.get("/categories")
async def get_available_categories():
    return {"categories": ["general", "technology", "science", "health", "business", "entertainment"]}
