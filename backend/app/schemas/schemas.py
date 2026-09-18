from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# Token & Auth
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserRegister(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    role: str
    created_at: datetime
    class Config:
        from_attributes = True

# Explainability & Engines
class SignalItem(BaseModel):
    indicator: str
    description: str
    severity: str # LOW, MEDIUM, HIGH, CRITICAL

class ExplanationItem(BaseModel):
    point: str
    meaning: str

class SafetyGuidance(BaseModel):
    level: str # Safe Guidance (Green), Caution (Yellow), Immediate Attention (Orange), Emergency (Red)
    headline: str
    immediate_actions: List[str]
    avoid_actions: List[str]

class SolutionTimeline(BaseModel):
    now: List[str]
    next_3h: List[str]
    next_24h: List[str]
    next_7d: List[str]

class VerificationGuide(BaseModel):
    title: str = "Verify Person Before Trust"
    disclaimer: str = "AI cannot independently prove that a person is who they claim to be."
    verification_steps: List[str]
    challenge_questions: List[str]

# Base Scan Result
class AnalysisResponse(BaseModel):
    id: Optional[int] = None
    scan_type: str
    target_summary: str
    risk_level: str # LOW, MODERATE, HIGH, CRITICAL
    risk_score: float # 0 - 100
    confidence: str # LOW, MEDIUM, HIGH
    confidence_score: float
    
    # Multimodal Breakdown
    visual_risk: Optional[float] = None
    temporal_risk: Optional[float] = None
    audio_risk: Optional[float] = None
    context_risk: Optional[float] = None

    signals: List[SignalItem] = []
    explanations: List[ExplanationItem] = []
    safety_guidance: SafetyGuidance
    solution_timeline: SolutionTimeline
    verification_guide: Optional[VerificationGuide] = None
    sha256_hash: Optional[str] = None
    created_at: Optional[datetime] = None

# Analysis Requests
class LinkAnalysisRequest(BaseModel):
    url: str

class MessageAnalysisRequest(BaseModel):
    message: str
    platform: Optional[str] = "generic" # whatsapp, telegram, sms, instagram, facebook, email
    sender_claim: Optional[str] = None # family, friend, bank, police, support, etc.

class SocialAnalysisRequest(BaseModel):
    platform: str # whatsapp, instagram, facebook, telegram
    content: str
    sender_profile: Optional[str] = None
    sender_claim: Optional[str] = None

class PaymentAnalysisRequest(BaseModel):
    upi_id: Optional[str] = None
    amount: Optional[float] = None
    message_context: Optional[str] = None
    qr_data: Optional[str] = None

# Emergency "I Clicked a Suspicious Link" Request
class EmergencyLinkClickRequest(BaseModel):
    url: Optional[str] = None
    info_entered: List[str] # ["Password", "OTP", "Card details", "Banking information", "UPI information", "Personal information", "Nothing"]
    money_lost: str # "YES", "NO", "NOT_SURE"
    amount_lost: Optional[float] = 0.0
    transaction_id: Optional[str] = None

class EmergencyResponse(BaseModel):
    status: str
    risk_level: str
    national_helpline: str = "1930"
    national_portal: str = "https://cybercrime.gov.in"
    immediate_alert: str
    safety_steps: List[str]
    solution_timeline: SolutionTimeline
    incident_draft: Optional[Dict[str, Any]] = None

# Incident & Evidence
class IncidentCreate(BaseModel):
    title: str
    incident_type: str
    platform: Optional[str] = None
    financial_loss: bool = False
    amount_lost: Optional[float] = 0.0
    transaction_id: Optional[str] = None
    suspect_upi: Optional[str] = None
    suspect_phone: Optional[str] = None
    suspect_url: Optional[str] = None
    description: Optional[str] = None
    timeline: Optional[List[Dict[str, Any]]] = None

class IncidentOut(BaseModel):
    id: int
    incident_code: str
    title: str
    incident_type: str
    platform: Optional[str]
    status: str
    financial_loss: bool
    amount_lost: float
    transaction_id: Optional[str]
    suspect_upi: Optional[str]
    suspect_phone: Optional[str]
    suspect_url: Optional[str]
    description: Optional[str]
    timeline: List[Dict[str, Any]]
    readiness_score: int
    created_at: datetime
    class Config:
        from_attributes = True

class EvidenceCreate(BaseModel):
    incident_id: Optional[int] = None
    scan_id: Optional[int] = None
    title: str
    evidence_type: str
    file_path: Optional[str] = None
    sha256_hash: Optional[str] = None
    detected_indicators: Optional[List[Any]] = None
    notes: Optional[str] = None

class EvidenceOut(BaseModel):
    id: int
    evidence_id: str
    incident_id: Optional[int]
    scan_id: Optional[int]
    title: str
    evidence_type: str
    sha256_hash: str
    model_version: str
    detected_indicators: List[Any]
    notes: Optional[str]
    is_verified: bool
    created_at: datetime
    class Config:
        from_attributes = True

class ReportGenerateRequest(BaseModel):
    incident_id: int
    user_statement: Optional[str] = None

class ReportOut(BaseModel):
    id: int
    report_code: str
    incident_id: int
    title: str
    complaint_text: str
    report_data: Dict[str, Any]
    evidence_fingerprint: str
    created_at: datetime
    class Config:
        from_attributes = True

# Family
class FamilyMemberCreate(BaseModel):
    name: str
    relationship: str
    phone: Optional[str] = None

class FamilyMemberOut(BaseModel):
    id: int
    name: str
    relation_type: str
    phone: Optional[str] = None
    safety_status: str
    last_risk_alert: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

# Dashboard
class DashboardAnalytics(BaseModel):
    total_scans: int
    voice_scans: int
    video_scans: int
    link_scans: int
    message_scans: int
    social_scans: int
    high_risk_incidents: int
    evidence_count: int
    reports_count: int
    risk_distribution: Dict[str, int]
    scam_category_distribution: Dict[str, int]
    recent_scans: List[Any]

# Alert Notifications (Victim / Target Early-Warning Messages)
class AlertCreate(BaseModel):
    recipient_name: Optional[str] = "Potential Victim"
    recipient_phone: str
    alert_type: str = "CRITICAL_FRAUD_STOP"
    channel: Optional[str] = "WhatsApp / SMS"
    risk_level: Optional[str] = "CRITICAL"
    message_content: str
    user_id: Optional[int] = None
    gateway_api_key: Optional[str] = None
    gateway_provider: Optional[str] = "fast2sms"

class AlertOut(BaseModel):
    id: int
    recipient_name: Optional[str]
    recipient_phone: str
    alert_type: str
    channel: str
    risk_level: str
    message_content: str
    status: str
    dispatch_hash: Optional[str]
    sent_at: datetime
    gateway_provider: Optional[str] = None
    gateway_response: Optional[str] = None
    class Config:
        from_attributes = True
