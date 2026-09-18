import pytest
from fastapi.testclient import TestClient
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app

client = TestClient(app)

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["platform"] == "RakshaAI 2.0"
    assert data["status"] == "OPERATIONAL"
    assert data["national_cyber_helpline"] == "1930"

def test_link_analysis_phishing():
    payload = {"url": "https://sbi-online-kyc-update-secure.top/login"}
    response = client.post("/api/analyze/link", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_level"] in ["HIGH", "CRITICAL"]
    assert data["confidence"] in ["MEDIUM", "HIGH"]
    assert len(data["signals"]) > 0
    assert len(data["safety_guidance"]["immediate_actions"]) > 0
    assert len(data["solution_timeline"]["now"]) > 0

def test_message_analysis_scam():
    payload = {
        "message": "Bhai emergency hai, hospital mein hoon. Abhi turant 20000 rupees bhej do.",
        "platform": "whatsapp",
        "sender_claim": "Friend"
    }
    response = client.post("/api/analyze/message", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_level"] in ["HIGH", "CRITICAL"]
    assert any("Money Request" in s["indicator"] or "Coercion" in s["indicator"] for s in data["signals"])

def test_payment_analysis_reverse_qr():
    payload = {
        "upi_id": "support-refund@oksbi",
        "amount": 20000,
        "message_context": "Scan this QR code and enter PIN to receive 20000 refund"
    }
    response = client.post("/api/analyze/payment", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_level"] == "CRITICAL"
    assert any("REVERSE QR" in s["indicator"] for s in data["signals"])

def test_emergency_link_flow():
    payload = {
        "url": "https://fake-lottery-gift.xyz",
        "info_entered": ["Password", "OTP"],
        "money_lost": "YES",
        "amount_lost": 15000.0,
        "transaction_id": "TXN981726"
    }
    response = client.post("/api/emergency/link-click", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_level"] == "CRITICAL"
    assert data["national_helpline"] == "1930"
    assert len(data["solution_timeline"]["now"]) > 0

def test_incidents_and_evidence():
    # 1. Create incident
    inc_payload = {
        "title": "Voice Deepfake Emergency Test",
        "incident_type": "voice_scam",
        "platform": "Phone Call",
        "financial_loss": False,
        "description": "Received suspicious call imitating my cousin demanding funds.",
        "suspect_phone": "+91 99999 11111"
    }
    inc_res = client.post("/api/incidents", json=inc_payload)
    assert inc_res.status_code == 200
    incident = inc_res.json()
    assert incident["incident_code"].startswith("RA2-2026-")

    # 2. Add evidence
    ev_payload = {
        "incident_id": incident["id"],
        "title": "Voice Call Recording",
        "evidence_type": "audio_recording",
        "sha256_hash": "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890"
    }
    ev_res = client.post("/api/evidence", json=ev_payload)
    assert ev_res.status_code == 200
    evidence = ev_res.json()
    assert evidence["evidence_id"].startswith("RA2-2026-")

    # 3. Generate report
    rep_payload = {
        "incident_id": incident["id"],
        "user_statement": "I received this synthetic voice call on Sept 18."
    }
    rep_res = client.post("/api/reports/generate", json=rep_payload)
    assert rep_res.status_code == 200
    report = rep_res.json()
    assert "1930" in report["complaint_text"]

def test_user_auth():
    import uuid
    unique_email = f"user_{uuid.uuid4().hex[:6]}@example.com"
    reg_payload = {
        "email": unique_email,
        "password": "SecurePassword123!",
        "full_name": "Rohan Sharma",
        "phone": "+91 98765 43210"
    }
    reg_res = client.post("/api/auth/register", json=reg_payload)
    assert reg_res.status_code == 200
    reg_data = reg_res.json()
    assert "access_token" in reg_data
    assert reg_data["user"]["email"] == unique_email

    # Test login
    login_payload = {
        "email": unique_email,
        "password": "SecurePassword123!"
    }
    login_res = client.post("/api/auth/login", json=login_payload)
    assert login_res.status_code == 200
    login_data = login_res.json()
    assert "access_token" in login_data

def test_alert_dispatch():
    # 1. Test templates
    tmpl_res = client.get("/api/alerts/templates")
    assert tmpl_res.status_code == 200
    templates = tmpl_res.json()
    assert "STOP_MONEY_TRANSFER" in templates
    assert "DIGITAL_ARREST_POLICE" in templates

    # 2. Test dispatch
    dispatch_payload = {
        "recipient_name": "Father",
        "recipient_phone": "+91 98765 00000",
        "alert_type": "CRITICAL_FRAUD_STOP",
        "channel": "WhatsApp / SMS",
        "risk_level": "CRITICAL",
        "message_content": "🚨 RAKSHAAI EMERGENCY ALERT: High-risk financial scam detected. Do not transfer money!"
    }
    disp_res = client.post("/api/alerts/dispatch", json=dispatch_payload)
    assert disp_res.status_code == 200
    alert = disp_res.json()
    assert alert["status"] == "DELIVERED"
    assert len(alert["dispatch_hash"]) == 64

    # 3. Test history
    hist_res = client.get("/api/alerts/history")
    assert hist_res.status_code == 200
    history = hist_res.json()
    assert len(history) > 0
    assert any(h["recipient_phone"] == "+91 98765 00000" for h in history)

def test_device_guard():
    # 1. Test status
    status_res = client.get("/api/device-guard/status")
    assert status_res.status_code == 200
    status = status_res.json()
    assert status["device_status"] == "PROTECTED"
    assert "remote_screen_guard" in status["active_shields"]
    assert "phishing_web_guard" in status["active_shields"]

    # 2. Test URL scan
    url_res = client.post("/api/device-guard/scan-url", json={"url": "http://sbi-kyc-update-portal.com/login"})
    assert url_res.status_code == 200
    url_data = url_res.json()
    assert url_data["is_dangerous"] is True
    assert url_data["severity"] in ["HIGH", "CRITICAL"]
    assert len(url_data["reasons_hi"]) > 0

    # 3. Test App Inspect (AnyDesk)
    app_res = client.post("/api/device-guard/inspect-app", json={"app_name": "AnyDesk"})
    assert app_res.status_code == 200
    app_data = app_res.json()
    assert app_data["is_hazardous"] is True
    assert "ANYDESK" in app_data["classification"].upper()
    assert len(app_data["removal_instructions_hi"]) > 0

    # 4. Test Lockdown
    lock_res = client.post("/api/device-guard/lockdown", json={"reason": "Test lockdown"})
    assert lock_res.status_code == 200
    lock_data = lock_res.json()
    assert lock_data["lockdown_mode"] is True
    assert len(lock_data["safeguards_engaged_hi"]) > 0

