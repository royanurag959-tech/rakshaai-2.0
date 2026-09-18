import datetime
from sqlalchemy import Column, Integer, String, Float, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship as orm_relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=True)
    phone = Column(String(50), nullable=True)
    role = Column(String(50), default="user") # user, admin, analyst
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    scans = orm_relationship("Scan", back_populates="user")
    incidents = orm_relationship("Incident", back_populates="user")
    evidence_records = orm_relationship("Evidence", back_populates="user")
    family_members = orm_relationship("FamilyMember", back_populates="user")
    subscriptions = orm_relationship("Subscription", back_populates="user")
    alerts = orm_relationship("AlertNotification", back_populates="user")

class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    scan_type = Column(String(50), nullable=False) # audio, video, link, message, screenshot, social, payment
    target_summary = Column(String(500), nullable=True)
    file_path = Column(String(500), nullable=True)
    sha256_hash = Column(String(64), nullable=True)
    
    # Risk & Confidence
    risk_level = Column(String(20), nullable=False) # LOW, MODERATE, HIGH, CRITICAL
    risk_score = Column(Float, nullable=False) # 0 to 100
    confidence = Column(String(20), nullable=False) # LOW, MEDIUM, HIGH
    confidence_score = Column(Float, nullable=False) # 0 to 100
    
    # Multimodal breakdown
    visual_risk = Column(Float, nullable=True)
    temporal_risk = Column(Float, nullable=True)
    audio_risk = Column(Float, nullable=True)
    context_risk = Column(Float, nullable=True)

    # Detailed data (JSON)
    signals = Column(JSON, default=list)
    explanations = Column(JSON, default=list)
    safety_guidance = Column(JSON, default=dict)
    solution_timeline = Column(JSON, default=dict)
    raw_results = Column(JSON, default=dict)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = orm_relationship("User", back_populates="scans")
    evidence = orm_relationship("Evidence", back_populates="scan", uselist=False)

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    incident_code = Column(String(50), unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String(255), nullable=False)
    incident_type = Column(String(100), nullable=False)
    platform = Column(String(100), nullable=True)
    status = Column(String(50), default="open")
    
    financial_loss = Column(Boolean, default=False)
    amount_lost = Column(Float, default=0.0)
    transaction_id = Column(String(255), nullable=True)
    suspect_upi = Column(String(255), nullable=True)
    suspect_phone = Column(String(100), nullable=True)
    suspect_url = Column(String(500), nullable=True)
    
    description = Column(Text, nullable=True)
    timeline = Column(JSON, default=list)
    
    readiness_score = Column(Integer, default=1)
    readiness_checklist = Column(JSON, default=dict)

    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

    user = orm_relationship("User", back_populates="incidents")
    evidence_items = orm_relationship("Evidence", back_populates="incident")
    reports = orm_relationship("Report", back_populates="incident")

class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(Integer, primary_key=True, index=True)
    evidence_id = Column(String(50), unique=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=True)
    scan_id = Column(Integer, ForeignKey("scans.id"), nullable=True)
    
    title = Column(String(255), nullable=False)
    evidence_type = Column(String(50), nullable=False)
    file_path = Column(String(500), nullable=True)
    sha256_hash = Column(String(64), nullable=False)
    model_version = Column(String(50), default="RakshaAI-v2.0-Production")
    
    detected_indicators = Column(JSON, default=list)
    metadata_info = Column(JSON, default=dict)
    notes = Column(Text, nullable=True)
    is_verified = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = orm_relationship("User", back_populates="evidence_records")
    incident = orm_relationship("Incident", back_populates="evidence_items")
    scan = orm_relationship("Scan", back_populates="evidence")

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    report_code = Column(String(50), unique=True, index=True)
    incident_id = Column(Integer, ForeignKey("incidents.id"), nullable=False)
    title = Column(String(255), nullable=False)
    
    complaint_text = Column(Text, nullable=False)
    report_data = Column(JSON, default=dict)
    evidence_fingerprint = Column(String(64), nullable=False)
    status = Column(String(50), default="draft")
    
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    incident = orm_relationship("Incident", back_populates="reports")

class FamilyMember(Base):
    __tablename__ = "family_members"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False)
    relation_type = Column(String(100), nullable=False) # e.g. Father, Mother, Grandparent
    phone = Column(String(50), nullable=True)
    safety_status = Column(String(50), default="safe")
    last_risk_alert = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = orm_relationship("User", back_populates="family_members")

class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    tier = Column(String(50), default="free")
    price_inr = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    starts_at = Column(DateTime, default=datetime.datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)

    user = orm_relationship("User", back_populates="subscriptions")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=True)
    action = Column(String(100), nullable=False)
    details = Column(Text, nullable=True)
    ip_address = Column(String(100), nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class AlertNotification(Base):
    __tablename__ = "alert_notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    recipient_name = Column(String(255), nullable=True)
    recipient_phone = Column(String(50), nullable=False)
    alert_type = Column(String(100), nullable=False) # CRITICAL_FRAUD_STOP, REVERSE_QR_TRAP, DIGITAL_ARREST_ALERT, VOICE_CLONE_WARNING, EARLY_TARGET_WARNING
    channel = Column(String(50), default="WhatsApp / SMS")
    risk_level = Column(String(20), default="CRITICAL")
    message_content = Column(Text, nullable=False)
    status = Column(String(50), default="DELIVERED") # DELIVERED, DISPATCHED, SIMULATED
    dispatch_hash = Column(String(64), nullable=True)
    sent_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = orm_relationship("User", back_populates="alerts")
