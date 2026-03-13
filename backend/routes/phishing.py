from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timezone
import json
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.schemas import URLAnalysisRequest, URLAnalysisResponse
from models.database import get_db, PhishingAnalysis
from services.phishing_service import analyze_url

router = APIRouter()


@router.post("/analyze", response_model=URLAnalysisResponse)
async def analyze_phishing(request: URLAnalysisRequest, db: Session = Depends(get_db)):
    """Analyze a URL for phishing threats."""
    try:
        result = await analyze_url(request.url)

        # Save to database
        try:
            record = PhishingAnalysis(
                url=result["url"],
                risk_level=result["risk_level"],
                phishing_probability=result["phishing_probability"],
                reasons=json.dumps(result["reasons"]),
                url_length=result["features"]["url_length"],
                num_dots=result["features"]["num_dots"],
                has_ip=result["features"]["has_ip"],
                has_https=result["features"]["has_https"],
                suspicious_keywords=json.dumps(result["features"]["suspicious_keywords"]),
                phishtank_listed=result["phishtank_listed"],
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
    """Get recent phishing analysis history."""
    try:
        records = db.query(PhishingAnalysis).order_by(
            PhishingAnalysis.created_at.desc()
        ).limit(limit).all()

        return [
            {
                "id": r.id,
                "url": r.url,
                "risk_level": r.risk_level,
                "phishing_probability": r.phishing_probability,
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in records
        ]
    except Exception:
        return []
