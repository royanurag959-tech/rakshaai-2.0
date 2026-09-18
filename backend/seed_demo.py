import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.database import Base, engine, SessionLocal
from app.models.models import User, Scan, Incident, Evidence, Report, FamilyMember
from app.core.security import get_password_hash
import datetime
import hashlib

def seed_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    # Check if already seeded
    if db.query(User).filter(User.email == "demo@rakshaai.io").first():
        print("Demo data already seeded.")
        db.close()
        return

    print("Seeding RakshaAI 2.0 demo data...")

    # 1. User
    user = User(
        email="demo@rakshaai.io",
        hashed_password=get_password_hash("RakshaSecure2026!"),
        full_name="Vikramaditya Roy",
        phone="+91 98110 54321",
        role="user"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # 2. Scans for Scenarios
    # Scan 1: Voice deepfake
    scan1 = Scan(
        user_id=user.id,
        scan_type="audio",
        target_summary="Voice Analysis: urgent_son_distress_call.mp3 (Claimed: Son / Relative)",
        sha256_hash="e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        risk_level="CRITICAL",
        risk_score=88.4,
        confidence="HIGH",
        confidence_score=92.0,
        audio_risk=87.4,
        context_risk=95.0,
        signals=[
            {"indicator": "Spectral Harmonics Analysis", "description": "Frequency cutoff at 8kHz indicating neural vocoder synthesis (HiFi-GAN)", "severity": "CRITICAL"},
            {"indicator": "Prosody & Pitch Micro-variation", "description": "Abnormally flat pitch contours (autotune / vocoder artifact)", "severity": "HIGH"},
            {"indicator": "High-Pressure Coercion / Urgency Detected", "description": "Audio demands immediate ₹20,000 transfer for bail/hospital", "severity": "CRITICAL"}
        ],
        explanations=[
            {"point": "Why was this flagged?", "meaning": "Detected vocoder frequency cutoff and synthetic glottal pulses characteristic of AI voice cloning."},
            {"point": "What does this mean?", "meaning": "This audio was artificially synthesized. Do not send any funds without direct cellular call verification."}
        ],
        safety_guidance={
            "level": "Emergency (Red)",
            "headline": "🚨 CRITICAL THREAT: AI Voice Cloning Impersonation",
            "immediate_actions": [
                "Stop communication immediately. Hang up.",
                "Call your family member on their known cell number directly.",
                "Do NOT transfer any money or approve UPI requests."
            ],
            "avoid_actions": ["Do NOT call back using WhatsApp or the caller's instructions."]
        },
        solution_timeline={
            "now": ["Terminate voice call.", "Call family member directly.", "Preserve recording in Evidence Locker."],
            "next_3h": ["Alert mutual family contacts.", "Report number on carrier spam filter."],
            "next_24h": ["Set a secret Family Safe-Word.", "Make social media voice videos private."],
            "next_7d": ["Review Cyber Safety Academy module on Voice Cloning."]
        }
    )

    # Scan 2: SBI Phishing link
    scan2 = Scan(
        user_id=user.id,
        scan_type="link",
        target_summary="LinkShield: https://sbi-online-kyc-update-secure.top/login",
        risk_level="CRITICAL",
        risk_score=94.0,
        confidence="HIGH",
        confidence_score=95.0,
        signals=[
            {"indicator": "Brand Impersonation / Deceptive Domain", "description": "Domain mimics 'SBI' banking brand without authorization.", "severity": "CRITICAL"},
            {"indicator": "High-Risk TLD Extension", "description": "Domain registered under .top abuse TLD.", "severity": "HIGH"},
            {"indicator": "Scam Keywords Detected", "description": "Contains 'kyc-update' and 'secure' bait terms.", "severity": "HIGH"}
        ],
        explanations=[
            {"point": "Why was this flagged?", "meaning": "Deceptive typosquatting domain designed to steal net banking user ID, password, and OTP."},
            {"point": "What does this mean?", "meaning": "Never open or enter banking details on this link. The real SBI portal is onlinesbi.sbi."}
        ],
        safety_guidance={
            "level": "Emergency (Red)",
            "headline": "🚨 PHISHING LINK: Credential Harvesting Threat",
            "immediate_actions": ["Do not open link.", "Do not input netbanking credentials.", "Block the SMS sender."],
            "avoid_actions": ["Never believe bank accounts can be updated via .top websites."]
        },
        solution_timeline={
            "now": ["Close browser tab immediately.", "Delete any downloaded APK."],
            "next_3h": ["Clear browser cookies and cache.", "Verify account status on authentic banking app."],
            "next_24h": ["Change net banking password if already entered.", "Enable app-based 2FA."],
            "next_7d": ["Report to phishing@sbi.co.in and cybercrime.gov.in."]
        }
    )

    # Scan 3: Telegram Crypto Scheme
    scan3 = Scan(
        user_id=user.id,
        scan_type="message",
        target_summary="Message Scan (Telegram): VIP Guaranteed 500% Daily Profit. Invest ₹5,000...",
        risk_level="HIGH",
        risk_score=84.0,
        confidence="HIGH",
        confidence_score=90.0,
        signals=[
            {"indicator": "High-Yield Ponzi Scheme Lure", "description": "Guaranteed 500% daily returns mathematically impossible in regulated markets.", "severity": "CRITICAL"},
            {"indicator": "Unregulated Channel Recruitment", "description": "Uses Telegram private groups to evade SEBI oversight.", "severity": "HIGH"}
        ],
        explanations=[
            {"point": "Why was this flagged?", "meaning": "Standard high-yield investment fraud (HYIP) targeting retail victims."},
            {"point": "What does this mean?", "meaning": "Any money sent will never be returned. The 'profits' displayed on the screen are entirely fake."}
        ],
        safety_guidance={
            "level": "Immediate Attention (Orange)",
            "headline": "⚠️ FRAUDULENT INVESTMENT LURE",
            "immediate_actions": ["Exit and report the Telegram channel.", "Do not send any UPI or crypto funds."],
            "avoid_actions": ["Do not believe screenshots of fake trading profits."]
        },
        solution_timeline={
            "now": ["Block the recruiter on Telegram."],
            "next_3h": ["Report group to Telegram Anti-Fraud."],
            "next_24h": ["Check SEBI unregistered entity alert list."],
            "next_7d": ["Review investment fraud lessons in Academy."]
        }
    )

    db.add_all([scan1, scan2, scan3])
    db.commit()

    # 3. Financial Fraud Incident (Demo 8: ₹20,000 loss)
    incident = Incident(
        incident_code="RA2-2026-8K39A",
        user_id=user.id,
        title="UPI Reverse-QR Scam: Fake Marketplace Buyer",
        incident_type="upi_reverse_qr_fraud",
        platform="Facebook Marketplace / WhatsApp",
        status="reported_1930",
        financial_loss=True,
        amount_lost=20000.0,
        transaction_id="DEMO20260918739182",
        suspect_upi="refund-desk99@ybl",
        suspect_phone="+91 98231 09876",
        description="Buyer on FB Marketplace pretended to buy furniture for ₹20,000. Sent a QR code claiming 'Scan this to receive ₹20,000 advance into your bank'. When victim entered UPI PIN, ₹20,000 was deducted instead.",
        timeline=[
            {"time": "10:15 AM", "event": "Suspect initiated contact expressing urgency to buy.", "type": "chat"},
            {"time": "10:28 AM", "event": "Suspect sent QR code claiming 'Scan to receive payment'.", "type": "chat"},
            {"time": "10:30 AM", "event": "Victim entered UPI PIN; ₹20,000 debited from SBI account.", "type": "loss"},
            {"time": "10:35 AM", "event": "RakshaAI 2.0 reverse-QR fraud detected & triaged.", "type": "system"},
            {"time": "10:40 AM", "event": "1930 National Cyber Fraud Helpline dialed.", "type": "helpline"},
            {"time": "10:45 AM", "event": "Evidence preserved with SHA-256 fingerprint.", "type": "evidence"}
        ],
        readiness_score=6,
        readiness_checklist={
            "original_media": True,
            "screenshot": True,
            "transaction_proof": True,
            "phone_or_url": True,
            "timestamp": True,
            "incident_narrative": True
        }
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)

    # 4. Evidence items
    ev1 = Evidence(
        evidence_id="RA2-2026-EV101",
        user_id=user.id,
        incident_id=incident.id,
        title="WhatsApp Chat Screenshot with Fraudulent QR Code",
        evidence_type="screenshot",
        sha256_hash=hashlib.sha256(b"whatsapp_qr_screenshot_sample_data").hexdigest(),
        model_version="RakshaAI-v2.0-Production",
        detected_indicators=["Reverse QR code instruction", "Urgency language", "UPI handle: refund-desk99@ybl"],
        notes="Shows suspect instructing victim to enter PIN to receive money.",
        is_verified=True
    )
    ev2 = Evidence(
        evidence_id="RA2-2026-EV102",
        user_id=user.id,
        incident_id=incident.id,
        title="Bank Debit SMS (UTR: DEMO20260918739182)",
        evidence_type="payment_receipt",
        sha256_hash=hashlib.sha256(b"bank_debit_sms_sample_data_20000").hexdigest(),
        model_version="RakshaAI-v2.0-Production",
        detected_indicators=["Amount: INR 20,000.00", "Beneficiary: refund-desk99@ybl"],
        notes="Official SMS from bank confirming unauthorized withdrawal.",
        is_verified=True
    )
    db.add_all([ev1, ev2])
    db.commit()

    # 5. Formal Report
    report = Report(
        report_code="REP-2026-7B910A",
        incident_id=incident.id,
        title="Incident Dossier: UPI Reverse-QR Scam (₹20,000 Loss)",
        complaint_text=f"PRELIMINARY CYBERCRIME COMPLAINT DRAFT (Ref: {incident.incident_code})\nVictim: Vikramaditya Roy\nAmount Lost: INR 20,000\nTransaction ID: DEMO20260918739182\nSuspect UPI: refund-desk99@ybl\nSuspect Phone: +91 98231 09876\nPreserved Hashes: RA2-2026-EV101, RA2-2026-EV102",
        report_data={
            "incident_code": incident.incident_code,
            "title": incident.title,
            "amount_lost": 20000.0,
            "transaction_id": "DEMO20260918739182",
            "evidence_count": 2
        },
        evidence_fingerprint=hashlib.sha256(b"dossier_fingerprint_sample").hexdigest(),
        status="generated"
    )
    db.add(report)
    db.commit()

    print("[SUCCESS] Seed data populated successfully with demo scenarios, incidents, and evidence records.")
    db.close()

if __name__ == "__main__":
    seed_data()
