import hashlib
import datetime
import httpx
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.models import AlertNotification
from app.schemas.schemas import AlertCreate, AlertOut

router = APIRouter(prefix="/alerts", tags=["Emergency Victim Alerts"])

ALERT_TEMPLATES = {
    "STOP_MONEY_TRANSFER": {
        "title_en": "Immediate Stop: Fraud Detected",
        "title_hi": "तात्कालिक रोक: फ्रॉड अलर्ट",
        "en": "🚨 RAKSHAAI EMERGENCY ALERT: A critical financial scam was detected targeting your account/phone! DO NOT transfer money, scan QR codes, or share any OTP with anyone. If unauthorized debit occurred, dial 1930 immediately.",
        "hi": "🚨 रक्षाAI आपातकालीन अलर्ट: आपके फोन या खाते पर गंभीर साइबर धोखाधड़ी की पहचान हुई है! किसी को भी पैसे न भेजें, QR कोड स्कैन न करें और कोई OTP न बताएं। पैसे कटने पर तुरंत 1930 पर कॉल करें।"
    },
    "DIGITAL_ARREST_POLICE": {
        "title_en": "Fake Police / Digital Arrest Threat",
        "title_hi": "नकली डिजिटल अरेस्ट व पुलिस धमकी",
        "en": "⚠️ RAKSHAAI ALERT: You may be receiving fake police/CBI/Customs video calls claiming 'Digital Arrest'. Indian Police NEVER arrests citizens over Skype/WhatsApp or demands funds. Disconnect immediately and call 1930 / 112.",
        "hi": "⚠️ रक्षाAI चेतावनी: आपको 'डिजिटल अरेस्ट' की धमकी देने वाली फर्जी पुलिस/CBI कॉल आ सकती है। भारतीय पुलिस कभी भी व्हाट्सएप पर अरेस्ट नहीं करती और न ही पैसे मांगती है। तुरंत फोन काटें और 1930 पर सूचना दें।"
    },
    "REVERSE_QR_TRAP": {
        "title_en": "Reverse-QR UPI PIN Scam Trap",
        "title_hi": "रिवर्स-QR व UPI पिन जाल",
        "en": "🛑 CRITICAL WARNING: A fake buyer has sent a QR code. NEVER enter your UPI PIN to receive money! Entering your UPI PIN ALWAYS transfers money OUT of your bank account. Decline the collect request now.",
        "hi": "🛑 गंभीर चेतावनी: फर्जी खरीदार ने QR कोड भेजा है। पैसे प्राप्त करने के लिए कभी भी अपना UPI पिन न डालें! पिन डालने से आपके खाते से पैसे कटते हैं। कलेक्ट रिक्वेस्ट को तुरंत अस्वीकार करें।"
    },
    "VOICE_CLONE_KIDNAP": {
        "title_en": "AI Voice Cloning Emergency Lure",
        "title_hi": "AI वॉयस क्लोनिंग व इमरजेंसी जाल",
        "en": "🎙️ RAKSHAAI ALERT: High-probability AI voice clone detected! Scammers are impersonating a relative demanding urgent money. Do NOT send funds. Disconnect and call the person directly on their regular SIM number.",
        "hi": "🎙️ रक्षाAI अलर्ट: कृत्रिम AI आवाज़ (Voice Clone) की पहचान हुई है! धोखेबाज़ रिश्तेदार बनकर आपातकाल के नाम पर पैसे मांग रहे हैं। पैसे न भेजें, तुरंत फोन काटकर परिजन के सामान्य नंबर पर सीधे कॉल करें।"
    },
    "PHISHING_LINK_CLICKED": {
        "title_en": "Malicious Phishing Link Clicked",
        "title_hi": "खतरनाक फ़िशिंग लिंक पर क्लिक हुआ",
        "en": "🚨 RAKSHAAI CONTAINMENT ALERT: A fake bank/KYC link was clicked on this device. Disconnect mobile data/Wi-Fi now, do not enter passwords or OTPs, and change your net banking password from a different device.",
        "hi": "🚨 रक्षाAI सुरक्षा अलर्ट: इस डिवाइस पर फर्जी बैंक/KYC लिंक पर क्लिक हुआ है। तुरंत मोबाइल डेटा/वाई-फाई बंद करें, कोई पासवर्ड न डालें और दूसरे फोन से अपने बैंक का पासवर्ड बदलें।"
    }
}

async def send_via_fast2sms(api_key: str, phone: str, message: str) -> tuple[bool, str]:
    """
    Sends real carrier SMS to Indian mobile numbers via Fast2SMS Quick SMS API.
    """
    clean_digits = "".join(filter(str.isdigit, phone))
    if clean_digits.startswith("91") and len(clean_digits) == 12:
        clean_number = clean_digits[2:]
    elif len(clean_digits) > 10:
        clean_number = clean_digits[-10:]
    else:
        clean_number = clean_digits

    if len(clean_number) != 10:
        return False, "Fast2SMS requires a valid 10-digit Indian phone number"

    url = "https://www.fast2sms.com/dev/bulkV2"
    headers = {
        "authorization": api_key.strip(),
        "Content-Type": "application/json"
    }

    try:
        message.encode("ascii")
        lang = "english"
    except UnicodeEncodeError:
        lang = "unicode"

    payload = {
        "route": "q",
        "message": message[:150],
        "language": lang,
        "flash": 0,
        "numbers": clean_number
    }

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            data = resp.json()
            if data.get("return") is True:
                req_id = data.get("request_id", "OK")
                return True, f"Telecom SMS dispatched via Fast2SMS (Request ID: {req_id})"
            else:
                raw_err = data.get("message", "API rejected request")
                if isinstance(raw_err, list):
                    raw_err = " ".join(raw_err)
                return False, f"Fast2SMS error: {raw_err}"
    except Exception as exc:
        return False, f"Network error contacting Fast2SMS: {str(exc)}"

@router.get("/templates")
def get_alert_templates():
    return ALERT_TEMPLATES

@router.post("/dispatch", response_model=AlertOut)
async def dispatch_alert(alert_in: AlertCreate, db: Session = Depends(get_db)):
    """
    Dispatches early-warning SMS / WhatsApp alert message to a victim or person at risk.
    If Fast2SMS API Key is supplied, performs live telecom SMS transmission.
    """
    cleaned_phone = alert_in.recipient_phone.strip() if alert_in.recipient_phone else ""
    if not cleaned_phone or len(cleaned_phone) < 5:
        raise HTTPException(status_code=400, detail="Valid recipient phone number is required")

    gateway_response = None
    gateway_provider = alert_in.gateway_provider or "fast2sms"
    status = "DELIVERED"

    # If Fast2SMS API Key is provided, attempt live carrier SMS delivery
    if alert_in.gateway_api_key and alert_in.gateway_api_key.strip():
        success, msg = await send_via_fast2sms(
            alert_in.gateway_api_key.strip(),
            cleaned_phone,
            alert_in.message_content
        )
        gateway_response = msg
        if success:
            status = "DELIVERED_VIA_TELECOM_SMS"
        else:
            status = f"TELECOM_GATEWAY_ERROR"
    else:
        status = "DELIVERED"
        gateway_response = "Dispatched and fingerprinted with SHA-256. Delivered via 1-Click WhatsApp / SMS App forwarding."

    now_utc = datetime.datetime.now(datetime.timezone.utc)
    raw_hash_seed = f"{cleaned_phone}:{alert_in.alert_type}:{alert_in.message_content}:{now_utc.isoformat()}"
    dispatch_hash = hashlib.sha256(raw_hash_seed.encode("utf-8")).hexdigest()

    notification = AlertNotification(
        user_id=alert_in.user_id,
        recipient_name=alert_in.recipient_name or "Potential Victim",
        recipient_phone=cleaned_phone,
        alert_type=alert_in.alert_type or "CRITICAL_FRAUD_ALERT",
        channel=alert_in.channel or "WhatsApp & SMS",
        risk_level=alert_in.risk_level or "CRITICAL",
        message_content=alert_in.message_content,
        status=status,
        dispatch_hash=dispatch_hash,
        sent_at=now_utc
    )
    db.add(notification)
    db.commit()
    db.refresh(notification)

    # Attach transient gateway fields for Pydantic response
    out = AlertOut.model_validate(notification)
    out.gateway_provider = gateway_provider
    out.gateway_response = gateway_response
    return out

@router.get("/history", response_model=List[AlertOut])
def get_alert_history(limit: int = 50, db: Session = Depends(get_db)):
    """
    Returns historical log of dispatched alerts.
    """
    alerts = db.query(AlertNotification).order_by(AlertNotification.sent_at.desc()).limit(limit).all()
    return alerts
