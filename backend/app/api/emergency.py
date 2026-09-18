from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.schemas import EmergencyLinkClickRequest, EmergencyResponse
from app.solution_engine.engine import solution_engine

router = APIRouter(prefix="/emergency", tags=["Emergency Triage"])

@router.get("/helplines")
def get_helpline_info():
    return {
        "india_cyber_fraud_helpline": "1930",
        "official_portal": "https://cybercrime.gov.in",
        "emergency_police": "112",
        "women_safety_cyber": "1091",
        "rbi_sachet_portal": "https://sachet.rbi.org.in",
        "disclaimer": "RakshaAI 2.0 provides immediate triage assistance and evidence preservation guidance. It does not replace official police FIRs or statutory emergency services."
    }

@router.post("/link-click", response_model=EmergencyResponse)
def handle_link_click_emergency(payload: EmergencyLinkClickRequest, db: Session = Depends(get_db)):
    entered_sensitive = any(item.lower() not in ["nothing", "none", ""] for item in payload.info_entered)
    money_lost_yes = payload.money_lost.upper() == "YES"

    if money_lost_yes:
        risk_level = "CRITICAL"
        alert = "🚨 FINANCIAL THEFT EMERGENCY: Activate Golden Hour Protocol Immediately!"
        steps = [
            "CALL 1930 IMMEDIATELY: Dial the National Cyber Fraud Reporting Helpline (1930) to trigger an immediate inter-bank transaction freeze.",
            "FREEZE BANKING & UPI: Open your legitimate banking app or call your bank's emergency phone number to freeze net banking and UPI access.",
            "PRESERVE UTR / TRANSACTION ID: Copy your bank debit SMS details, recipient UPI VPA, and time of transfer.",
            "DO NOT PANIC: Speed within the first 2-3 hours is vital to recovering intercepted funds before cash-out.",
            "FILE FORMAL REPORT: Draft a full dossier using RakshaAI's Report Generator and submit to cybercrime.gov.in."
        ]
        timeline = solution_engine.generate_solution("financial", financial_loss=True, amount=payload.amount_lost or 0.0)

    elif entered_sensitive:
        risk_level = "HIGH"
        alert = "⚠️ CREDENTIAL COMPROMISE DETECTED: Secure Your Accounts Immediately"
        steps = [
            "CHANGE PASSWORDS IMMEDIATELY: From a clean device or separate browser, log into the authentic service and reset passwords.",
            "TERMINATE ACTIVE SESSIONS: Check account security settings and click 'Log out of all devices/sessions'.",
            "ENABLE TWO-FACTOR AUTH (2FA): Switch to app-based 2FA (Google Authenticator / Microsoft Authenticator) instead of SMS OTP.",
            "MONITOR FINANCIAL STATEMENTS: Inspect bank accounts and credit cards for test micro-charges (e.g. ₹1 or ₹2).",
            "PRESERVE PHISHING URL: Save the exact link and screenshot to RakshaAI Evidence Locker."
        ]
        timeline = solution_engine.generate_solution("link", financial_loss=False)

    else:
        risk_level = "MODERATE"
        alert = "🟡 PASSIVE VISIT CONTAINED: No Immediate Credential Leak Reported"
        steps = [
            "CLOSE THE TAB: Close the suspicious website tab immediately.",
            "CHECK DOWNLOADS: Inspect your browser Downloads folder. If an .apk, .exe, or .zip downloaded automatically, delete it without running!",
            "CLEAR CACHE: Clear browser history and temporary site data to remove tracking cookies.",
            "RUN SCAN: Run a standard device scan using your device's built-in antivirus (Microsoft Defender / Play Protect)."
        ]
        timeline = solution_engine.generate_solution("link", financial_loss=False)

    incident_draft = {
        "title": f"Emergency Triage: Link Clicked ({payload.url or 'Suspicious Web Link'})",
        "incident_type": "phishing_link" if not money_lost_yes else "cyber_financial_fraud",
        "financial_loss": money_lost_yes,
        "amount_lost": payload.amount_lost or 0.0,
        "suspect_url": payload.url,
        "transaction_id": payload.transaction_id,
        "description": f"User clicked link '{payload.url}'. Information entered: {', '.join(payload.info_entered)}. Money lost: {payload.money_lost}."
    }

    return EmergencyResponse(
        status="emergency_triaged",
        risk_level=risk_level,
        immediate_alert=alert,
        safety_steps=steps,
        solution_timeline=timeline,
        incident_draft=incident_draft
    )
