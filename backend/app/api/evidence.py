import uuid
import hashlib
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Evidence, Incident
from app.schemas.schemas import EvidenceCreate, EvidenceOut

router = APIRouter(prefix="/evidence", tags=["Evidence Locker"])

@router.post("", response_model=EvidenceOut)
def create_evidence(payload: EvidenceCreate, db: Session = Depends(get_db)):
    random_hex = uuid.uuid4().hex[:5].upper()
    evidence_code = f"RA2-2026-{random_hex}"
    
    sha = payload.sha256_hash or hashlib.sha256(f"{payload.title}-{evidence_code}".encode()).hexdigest()

    evidence = Evidence(
        evidence_id=evidence_code,
        user_id=1,
        incident_id=payload.incident_id,
        scan_id=payload.scan_id,
        title=payload.title,
        evidence_type=payload.evidence_type,
        file_path=payload.file_path,
        sha256_hash=sha,
        model_version="RakshaAI-v2.0-Production",
        detected_indicators=payload.detected_indicators or [],
        notes=payload.notes,
        is_verified=True
    )
    db.add(evidence)
    db.commit()
    db.refresh(evidence)
    return evidence

@router.get("", response_model=list[EvidenceOut])
def list_evidence(db: Session = Depends(get_db)):
    return db.query(Evidence).order_by(Evidence.created_at.desc()).all()

@router.get("/{evidence_id}", response_model=EvidenceOut)
def get_evidence(evidence_id: str, db: Session = Depends(get_db)):
    evidence = db.query(Evidence).filter(
        (Evidence.evidence_id == evidence_id) | (Evidence.id == int(evidence_id) if evidence_id.isdigit() else False)
    ).first()
    if not evidence:
        raise HTTPException(status_code=404, detail="Evidence record not found")
    return evidence
