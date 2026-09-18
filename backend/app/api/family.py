from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import FamilyMember
from app.schemas.schemas import FamilyMemberCreate, FamilyMemberOut

router = APIRouter(prefix="/family", tags=["Family Shield"])

@router.post("/members", response_model=FamilyMemberOut)
def add_family_member(payload: FamilyMemberCreate, db: Session = Depends(get_db)):
    member = FamilyMember(
        user_id=1,
        name=payload.name,
        relation_type=payload.relationship,
        phone=payload.phone,
        safety_status="safe",
        last_risk_alert="Safe - No pending high-risk signals"
    )
    db.add(member)
    db.commit()
    db.refresh(member)
    return member

@router.get("/members", response_model=list[FamilyMemberOut])
def get_family_members(db: Session = Depends(get_db)):
    members = db.query(FamilyMember).all()
    if not members:
        defaults = [
            FamilyMember(user_id=1, name="Ramesh Sharma (Father)", relation_type="Father", phone="+91 98765 43210", safety_status="safe", last_risk_alert="Active protection enabled"),
            FamilyMember(user_id=1, name="Sunita Sharma (Mother)", relation_type="Mother", phone="+91 98765 43211", safety_status="alert", last_risk_alert="Flagged suspicious WhatsApp OTP request yesterday"),
            FamilyMember(user_id=1, name="Kailash Sharma (Grandfather)", relation_type="Grandparent", phone="+91 98765 43212", safety_status="safe", last_risk_alert="Pushed Voice Clone awareness alert")
        ]
        db.add_all(defaults)
        db.commit()
        members = db.query(FamilyMember).all()
    return members

@router.delete("/members/{member_id}")
def delete_family_member(member_id: int, db: Session = Depends(get_db)):
    member = db.query(FamilyMember).filter(FamilyMember.id == member_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="Family member not found")
    db.delete(member)
    db.commit()
    return {"message": "Family member removed from protection circle"}
