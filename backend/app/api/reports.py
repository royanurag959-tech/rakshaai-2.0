import uuid
import hashlib
import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import Report, Incident, Evidence
from app.schemas.schemas import ReportGenerateRequest, ReportOut

router = APIRouter(prefix="/reports", tags=["Report Generator"])

@router.post("/generate", response_model=ReportOut)
def generate_report(payload: ReportGenerateRequest, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == payload.incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    evidence_items = db.query(Evidence).filter(Evidence.incident_id == incident.id).all()
    evidence_fingerprint = hashlib.sha256(
        f"{incident.incident_code}-{len(evidence_items)}-{datetime.datetime.utcnow().isoformat()}".encode()
    ).hexdigest()

    report_code = f"REP-2026-{uuid.uuid4().hex[:6].upper()}"
    
    # Generate Copy-Ready Formal Complaint Text for 1930 / cybercrime.gov.in
    complaint_lines = [
        "=================================================================",
        "PRELIMINARY CYBERCRIME INCIDENT COMPLAINT DRAFT",
        "Generated via RakshaAI 2.0 Digital Trust & Evidence Platform",
        "=================================================================",
        f"Incident Reference ID: {incident.incident_code}",
        f"Date of Incident: {incident.created_at.strftime('%Y-%m-%d %H:%M:%S UTC')}",
        f"Category / Sub-Category: {incident.incident_type.replace('_', ' ').title()}",
        f"Platform Involved: {incident.platform or 'Digital Communication / Cellular'}",
        "-----------------------------------------------------------------",
        "SUSPECT DETAILS:",
        f" - Suspect Phone / Caller ID : {incident.suspect_phone or 'Not Provided'}",
        f" - Suspect UPI ID / VPA      : {incident.suspect_upi or 'N/A'}",
        f" - Suspect URL / Web Link    : {incident.suspect_url or 'N/A'}",
        "-----------------------------------------------------------------",
        "FINANCIAL TRANSACTION DETAILS:",
        f" - Financial Loss Occurred  : {'YES' if incident.financial_loss else 'NO'}",
        f" - Disputed Amount Lost     : INR ₹{incident.amount_lost:,.2f}" if incident.financial_loss else " - Disputed Amount Lost     : None",
        f" - Bank Transaction UTR / ID: {incident.transaction_id or 'N/A'}",
        "-----------------------------------------------------------------",
        "INCIDENT NARRATIVE & CHRONOLOGY:",
        f"{incident.description or 'The victim was targeted using high-pressure social engineering tactics on digital channels.'}",
        "",
        "CHRONOLOGICAL TIMELINE OF EVENTS:"
    ]

    for item in (incident.timeline or []):
        complaint_lines.append(f" - [{item.get('time', '--:--')}] {item.get('event', '')}")

    complaint_lines.extend([
        "-----------------------------------------------------------------",
        "PRESERVED DIGITAL EVIDENCE & INTEGRITY HASHES:",
    ])

    for ev in evidence_items:
        complaint_lines.append(f" - [{ev.evidence_id}] {ev.title} (SHA-256: {ev.sha256_hash})")

    if payload.user_statement:
        complaint_lines.extend([
            "-----------------------------------------------------------------",
            "USER SWORN STATEMENT:",
            payload.user_statement
        ])

    complaint_lines.extend([
        "=================================================================",
        "LEGAL DISCLAIMER:",
        "This preliminary summary is an organizational and evidence preservation aid",
        "compiled via RakshaAI 2.0. RakshaAI does not exercise statutory police authority",
        "and this document serves as a structured complaint submission package for",
        "the National Cyber Crime Reporting Portal (cybercrime.gov.in) and 1930 Helpline.",
        "================================================================="
    ])

    formatted_complaint = "\n".join(complaint_lines)

    report_data = {
        "incident_code": incident.incident_code,
        "title": incident.title,
        "incident_type": incident.incident_type,
        "platform": incident.platform,
        "amount_lost": incident.amount_lost,
        "transaction_id": incident.transaction_id,
        "suspect_phone": incident.suspect_phone,
        "suspect_upi": incident.suspect_upi,
        "suspect_url": incident.suspect_url,
        "timeline": incident.timeline,
        "evidence_count": len(evidence_items),
        "user_statement": payload.user_statement,
        "fingerprint": evidence_fingerprint
    }

    report = Report(
        report_code=report_code,
        incident_id=incident.id,
        title=f"Incident Dossier: {incident.title}",
        complaint_text=formatted_complaint,
        report_data=report_data,
        evidence_fingerprint=evidence_fingerprint,
        status="generated"
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

@router.get("/{report_id}", response_model=ReportOut)
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report
