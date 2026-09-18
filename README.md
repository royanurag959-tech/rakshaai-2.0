# 🛡️ RakshaAI 2.0
## AI-Powered Digital Trust, Fraud Detection, Safety & Response Platform

> **“Detect. Verify. Protect. Solve. Before You Trust.”**

### Core Philosophy
**INPUT → DETECT → ANALYZE → EXPLAIN → RISK → SAFETY → SOLUTION → VERIFY → EVIDENCE → REPORT → RECOVER**

---

## 🌟 The Golden Differentiator
Most cybersecurity tools answer:
> *"Is this suspicious?"*

**RakshaAI 2.0** answers:
> *"Is this suspicious, **why** is it suspicious, what **NOT** to do, what to do **immediately**, how to **verify safely**, how to **preserve cryptographic evidence**, and **where & how to file a formal 1930 complaint**?"*

---

## 🚀 Key Modules & Capabilities

1. **🎙️ Voice Deepfake & Audio Scam Detector**:
   - Analyzes vocoder harmonic cutoffs (HiFi-GAN/WaveGlow), pitch micro-jitter, and psychological urgency markers.
   - Never makes false absolute claims (e.g. "100% fake"); delivers forensic indicators.
2. **🎥 Multimodal Video Deepfake Inspector**:
   - Visual boundary feathering, temporal blink cadence, and audio-video (AV) plosive lip-sync latency.
3. **🔗 LinkShield Safe URL & Typosquatting Scanner**:
   - Safely analyzes URLs without executing them in your browser; flags lookalike domains imitating Indian banks (SBI, HDFC, ICICI, etc.) and high-abuse TLDs.
4. **💬 Scam Intent & Coercion Engine**:
   - Natural language pattern extraction for money requests, OTP harvesting, fake KYC deactivations, and "Digital Arrest" extortion.
5. **📸 Vision OCR & Screenshot Analyzer**:
   - Extracts UPI VPAs, phone numbers, and URLs directly from screenshots of WhatsApp, Telegram, or banking SMS.
6. **📱 SocialShield**:
   - Tailored defense modules for WhatsApp, Instagram, Telegram, Facebook, and SMS phishing.
7. **💳 PaymentShield & Reverse-QR Defense**:
   - Protects against the classic marketplace reverse-QR trap: *"Never enter your UPI PIN to receive money!"*
8. **🚨 "I Clicked a Suspicious Link" Emergency Mode**:
   - Interactive triage asking what was typed (password, OTP, banking info) and whether money left the account.
   - Instantly triggers the 1930 Golden Hour transaction hold protocol.
9. **📁 Cryptographic Evidence Locker & Timeline**:
   - Preserves media, screenshots, and logs with immutable SHA-256 fingerprints and generates Evidence IDs (`RA2-2026-XXXXX`).
   - Calculates Evidence Readiness (0–6).
10. **📋 AI Incident Report & 1930 Complaint Generator**:
    - Prepares structured dossiers and copy-ready formal complaint drafts for direct submission to `cybercrime.gov.in` and Helpline 1930.
11. **👨‍👩‍👧 Family Shield**:
    - Circle protection for parents, grandparents, and children with zero invasion of private messages and a secret Family Safe-Word protocol.
12. **🎓 Cyber Safety Academy**:
    - Interactive modules available in **English & हिंदी (Hindi)** covering Voice Cloning, Reverse QR Scams, and Digital Arrests.
13. **⚡ Offline Protection Mode**:
    - Operates even with zero internet connectivity; provides local emergency checklists, offline evidence hashing, and sync queues upon reconnection.
14. **📊 Personal & Admin Telemetry Dashboards**:
    - Real-time scan metrics, risk distributions, and modular pluggable provider status.

---

## 🏗️ Architecture & Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite (Modern cybersecurity dark navy palette).
- **Backend**: FastAPI (Python 3.13), Uvicorn, SQLAlchemy, Pydantic v2, SQLite (PostgreSQL-ready).
- **Security**: SHA-256 cryptographic hashing, JWT authentication, bcrypt passwords, zero raw media resale.

---

## ⚡ Quickstart Guide

### 1. Backend Setup
```bash
cd backend
python -m pip install -r requirements.txt
python seed_demo.py     # Seeds initial demo scenarios and sample evidence
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
API Documentation will be live at: `http://127.0.0.1:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Run Automated Tests
```bash
cd backend
python -m pytest tests/test_api.py -v
```

---

## 🎯 9 Polished Interactive Demo Scenarios

The platform includes a persistent 1-click launcher bar for all 9 realistic test scenarios:
1. **AI Voice Scam**: Fake son accident voice note demanding ₹20,000.
2. **Deepfake Video**: Manipulated executive video with temporal facial boundary warping.
3. **WhatsApp Scam**: Urgent relative hospital money transfer request.
4. **Instagram Scam**: Fake luxury giveaway DM demanding courier fees.
5. **Telegram Investment Scam**: 500% guaranteed daily returns crypto scheme.
6. **Fraud Link**: Typosquatted `https://sbi-online-kyc-update-secure.top/login`.
7. **Accidentally Clicked Link**: Interactive emergency recovery protocol.
8. **Financial Fraud (₹20,000)**: Reverse-QR marketplace loss with 1930 complaint generation.
9. **Offline Mode**: Full offline simulation with local vault & sync.

---

## ⚖️ Statutory Notice
*RakshaAI 2.0 is an organizational, educational, and evidence-preservation platform. It does not replace statutory law enforcement or statutory banking dispute authorities. In case of immediate financial fraud, always contact the National Cyber Fraud Helpline (1930) and your bank immediately.*
