import os
import shutil
from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.config import settings
from app.models.models import Scan
from app.schemas.schemas import (
    AnalysisResponse, LinkAnalysisRequest, MessageAnalysisRequest,
    SocialAnalysisRequest, PaymentAnalysisRequest
)
from app.providers.audio_provider import audio_provider
from app.providers.video_provider import video_provider
from app.providers.link_provider import link_provider
from app.providers.message_provider import message_provider
from app.providers.social_provider import social_provider
from app.providers.payment_provider import payment_provider
from app.providers.ocr_provider import ocr_provider

router = APIRouter(prefix="/analyze", tags=["Analysis"])

def _persist_scan(db: Session, result: AnalysisResponse, user_id: int = 1, file_path: str = None) -> AnalysisResponse:
    scan = Scan(
        user_id=user_id,
        scan_type=result.scan_type,
        target_summary=result.target_summary,
        file_path=file_path,
        sha256_hash=result.sha256_hash,
        risk_level=result.risk_level,
        risk_score=result.risk_score,
        confidence=result.confidence,
        confidence_score=result.confidence_score,
        visual_risk=result.visual_risk,
        temporal_risk=result.temporal_risk,
        audio_risk=result.audio_risk,
        context_risk=result.context_risk,
        signals=[s.model_dump() for s in result.signals],
        explanations=[e.model_dump() for e in result.explanations],
        safety_guidance=result.safety_guidance.model_dump(),
        solution_timeline=result.solution_timeline.model_dump()
    )
    db.add(scan)
    db.commit()
    db.refresh(scan)
    result.id = scan.id
    result.created_at = scan.created_at
    return result

@router.post("/audio", response_model=AnalysisResponse)
async def analyze_audio(
    file: UploadFile = File(...),
    claimed_identity: str = Form("Unknown"),
    db: Session = Depends(get_db)
):
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty audio file provided")
    
    file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(contents)

    result = audio_provider.analyze(file.filename, contents, claimed_identity=claimed_identity)
    return _persist_scan(db, result, file_path=file_path)

@router.post("/video", response_model=AnalysisResponse)
async def analyze_video(
    file: UploadFile = File(...),
    notes: str = Form(""),
    db: Session = Depends(get_db)
):
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty video file provided")
    
    file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(contents)

    result = video_provider.analyze(file.filename, contents, context_notes=notes)
    return _persist_scan(db, result, file_path=file_path)

@router.post("/link", response_model=AnalysisResponse)
def analyze_link(payload: LinkAnalysisRequest, db: Session = Depends(get_db)):
    if not payload.url:
        raise HTTPException(status_code=400, detail="URL must be provided")
    result = link_provider.analyze(payload.url)
    return _persist_scan(db, result)

@router.post("/message", response_model=AnalysisResponse)
def analyze_message(payload: MessageAnalysisRequest, db: Session = Depends(get_db)):
    if not payload.message:
        raise HTTPException(status_code=400, detail="Message text is required")
    result = message_provider.analyze(payload.message, platform=payload.platform or "generic", sender_claim=payload.sender_claim or "Unknown")
    return _persist_scan(db, result)

@router.post("/screenshot", response_model=AnalysisResponse)
async def analyze_screenshot(
    file: UploadFile = File(...),
    notes: str = Form(""),
    db: Session = Depends(get_db)
):
    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=400, detail="Empty screenshot file provided")
    
    file_path = os.path.join(settings.UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(contents)

    result = ocr_provider.analyze(file.filename, contents, user_notes=notes)
    return _persist_scan(db, result, file_path=file_path)

@router.post("/social", response_model=AnalysisResponse)
def analyze_social(payload: SocialAnalysisRequest, db: Session = Depends(get_db)):
    if not payload.content:
        raise HTTPException(status_code=400, detail="Social post or message content is required")
    result = social_provider.analyze(
        platform=payload.platform,
        content=payload.content,
        sender_profile=payload.sender_profile or "",
        sender_claim=payload.sender_claim or "Unknown"
    )
    return _persist_scan(db, result)

@router.post("/payment", response_model=AnalysisResponse)
def analyze_payment(payload: PaymentAnalysisRequest, db: Session = Depends(get_db)):
    result = payment_provider.analyze(
        upi_id=payload.upi_id or "",
        amount=payload.amount or 0.0,
        message_context=payload.message_context or "",
        qr_data=payload.qr_data or ""
    )
    return _persist_scan(db, result)
