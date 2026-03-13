from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from sqlalchemy.orm import Session
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from models.schemas import DeepfakeResponse
from models.database import get_db, DeepfakeAnalysis
from services.deepfake_service import analyze_media

router = APIRouter()

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/mpeg", "video/quicktime", "video/webm"}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB


@router.post("/analyze", response_model=DeepfakeResponse)
async def analyze_deepfake(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """Analyze an image or video for deepfake indicators."""
    content_type = file.content_type or "application/octet-stream"

    if content_type not in ALLOWED_IMAGE_TYPES and content_type not in ALLOWED_VIDEO_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {content_type}. Upload JPEG, PNG, WebP, MP4, or WebM."
        )

    file_bytes = await file.read()

    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail="File too large. Maximum size is 50MB.")

    if len(file_bytes) < 100:
        raise HTTPException(status_code=400, detail="File appears to be empty or corrupted.")

    try:
        result = await analyze_media(file_bytes, file.filename or "upload", content_type)

        # Save to database
        try:
            record = DeepfakeAnalysis(
                media_type=result["media_type"],
                filename=result["filename"],
                deepfake_probability=result["deepfake_probability"],
                confidence_level=result["confidence_level"],
                gemini_analysis=result["gemini_analysis"],
                frames_analyzed=result["frames_analyzed"],
            )
            db.add(record)
            db.commit()
        except Exception:
            db.rollback()

        return result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history")
async def get_history(limit: int = 20, db: Session = Depends(get_db)):
    """Get recent deepfake analysis history."""
    try:
        records = db.query(DeepfakeAnalysis).order_by(
            DeepfakeAnalysis.created_at.desc()
        ).limit(limit).all()

        return [
            {
                "id": r.id,
                "filename": r.filename,
                "media_type": r.media_type,
                "deepfake_probability": r.deepfake_probability,
                "confidence_level": r.confidence_level,
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in records
        ]
    except Exception:
        return []
