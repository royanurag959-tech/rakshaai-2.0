import uuid
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Incident
from app.schemas.schemas import IncidentCreate, IncidentOut

router = APIRouter(prefix="/incidents", tags=["Incidents"])

def _calculate_readiness(incident: Incident) -> int:
    score = 1 # base entry
    if incident.description and len(incident.description) > 20:
        score += 1
    if incident.platform:
        score += 1
    if incident.suspect_phone or incident.suspect_url or incident.suspect_upi:
        score += 1
    if incident.transaction_id or (incident.financial_loss and incident.amount_lost > 0):
        score += 1
    if incident.timeline and len(incident.timeline) >= 2:
        score += 1
    return min(6, score)

@router.post("", response_model=IncidentOut)
def create_incident(payload: IncidentCreate, db: Session = Depends(get_db)):
    random_hex = uuid.uuid4().hex[:5].upper()
    code = f"RA2-2026-{random_hex}"
    
    # Initialize timeline
    now_str = datetime.datetime.now().strftime("%I:%M %p")
    initial_timeline = payload.timeline or [
        {"time": now_str, "event": "Incident record created in RakshaAI 2.0", "type": "system"}
    ]

    incident = Incident(
        incident_code=code,
        user_id=1,
        title=payload.title,
        incident_type=payload.incident_type,
        platform=payload.platform,
        financial_loss=payload.financial_loss,
        amount_lost=payload.amount_lost or 0.0,
        transaction_id=payload.transaction_id,
        suspect_upi=payload.suspect_upi,
        suspect_phone=payload.suspect_phone,
        suspect_url=payload.suspect_url,
        description=payload.description,
        timeline=initial_timeline,
        readiness_checklist={
            "original_media": True,
            "screenshot": True if payload.incident_type in ["whatsapp", "screenshot", "payment"] else False,
            "transaction_proof": bool(payload.transaction_id),
            "phone_or_url": bool(payload.suspect_phone or payload.suspect_url or payload.suspect_upi),
            "timestamp": True,
            "incident_narrative": bool(payload.description)
        }
    )
    incident.readiness_score = _calculate_readiness(incident)
    
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return incident

@router.get("", response_model=list[IncidentOut])
def get_incidents(db: Session = Depends(get_db)):
    return db.query(Incident).order_by(Incident.created_at.desc()).all()

@router.get("/{incident_id}", response_model=IncidentOut)
def get_incident(incident_id: int, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident

@router.post("/{incident_id}/timeline")
def add_timeline_event(incident_id: int, event_text: str, event_time: str = None, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    time_val = event_time or datetime.datetime.now().strftime("%I:%M %p")
    updated_timeline = list(incident.timeline or [])
    updated_timeline.append({"time": time_val, "event": event_text, "type": "user_action"})
    incident.timeline = updated_timeline
    incident.readiness_score = _calculate_readiness(incident)
    db.commit()
    db.refresh(incident)
    return incident
