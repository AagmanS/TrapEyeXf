from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
import json
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.schemas import FakeNewsRequest, FakeNewsResponse
from models.database import get_db, FakeNewsAnalysis
from services.fakenews_service import analyze_fake_news

router = APIRouter()


@router.post("/analyze", response_model=FakeNewsResponse)
async def analyze_news(request: FakeNewsRequest, db: Session = Depends(get_db)):
    """Analyze a news article for credibility."""
    try:
        result = await analyze_fake_news(
            headline=request.headline,
            article_text=request.article_text or "",
            source_url=request.source_url or "",
        )

        # Save to database
        try:
            record = FakeNewsAnalysis(
                headline=result["headline"],
                article_text=request.article_text,
                source_url=request.source_url,
                credibility_score=result["credibility_score"],
                fake_probability=result["fake_probability"],
                ml_classification=result["ml_classification"],
                gemini_reasoning=result["gemini_reasoning"],
                language_flags=json.dumps(result["language_flags"]),
            )
            db.add(record)
            db.commit()
        except Exception:
            db.rollback()

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history")
async def get_history(limit: int = 20, db: Session = Depends(get_db)):
    """Get recent fake news analysis history."""
    try:
        records = db.query(FakeNewsAnalysis).order_by(
            FakeNewsAnalysis.created_at.desc()
        ).limit(limit).all()

        return [
            {
                "id": r.id,
                "headline": r.headline[:100] if r.headline else "",
                "credibility_score": r.credibility_score,
                "fake_probability": r.fake_probability,
                "ml_classification": r.ml_classification,
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in records
        ]
    except Exception:
        return []
