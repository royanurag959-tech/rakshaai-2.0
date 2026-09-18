export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
export type ConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface SignalItem {
  indicator: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

export interface ExplanationItem {
  point: string;
  meaning: string;
}

export interface SafetyGuidance {
  level: string;
  headline: string;
  immediate_actions: string[];
  avoid_actions: string[];
}

export interface SolutionTimeline {
  now: string[];
  next_3h: string[];
  next_24h: string[];
  next_7d: string[];
}

export interface VerificationGuide {
  title: string;
  disclaimer: string;
  verification_steps: string[];
  challenge_questions: string[];
}

export interface AnalysisResponse {
  id?: number;
  scan_type: string;
  target_summary: string;
  risk_level: RiskLevel;
  risk_score: number;
  confidence: ConfidenceLevel;
  confidence_score: number;
  visual_risk?: number;
  temporal_risk?: number;
  audio_risk?: number;
  context_risk?: number;
  signals: SignalItem[];
  explanations: ExplanationItem[];
  safety_guidance: SafetyGuidance;
  solution_timeline: SolutionTimeline;
  verification_guide?: VerificationGuide;
  sha256_hash?: string;
  created_at?: string;
}

export interface Incident {
  id: number;
  incident_code: string;
  title: string;
  incident_type: string;
  platform?: string;
  status: string;
  financial_loss: boolean;
  amount_lost: number;
  transaction_id?: string;
  suspect_upi?: string;
  suspect_phone?: string;
  suspect_url?: string;
  description?: string;
  timeline: Array<{ time: string; event: string; type: string }>;
  readiness_score: number;
  created_at: string;
}

export interface EvidenceRecord {
  id: number;
  evidence_id: string;
  incident_id?: number;
  scan_id?: number;
  title: string;
  evidence_type: string;
  sha256_hash: string;
  model_version: string;
  detected_indicators: any[];
  notes?: string;
  is_verified: boolean;
  created_at: string;
}

export interface FamilyMember {
  id: number;
  name: string;
  relation_type: string;
  phone?: string;
  safety_status: 'safe' | 'alert' | 'high_risk';
  last_risk_alert?: string;
  created_at: string;
}

export interface DashboardAnalytics {
  total_scans: number;
  voice_scans: number;
  video_scans: number;
  link_scans: number;
  message_scans: number;
  social_scans: number;
  high_risk_incidents: number;
  evidence_count: number;
  reports_count: number;
  risk_distribution: Record<string, number>;
  scam_category_distribution: Record<string, number>;
  recent_scans: Array<{
    id: number;
    scan_type: string;
    target_summary: string;
    risk_level: string;
    risk_score: number;
    confidence: string;
    created_at: string;
  }>;
}

export interface User {
  id: number;
  email: string;
  full_name?: string;
  phone?: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface AlertNotification {
  id: number;
  recipient_name?: string;
  recipient_phone: string;
  alert_type: string;
  channel: string;
  risk_level: string;
  message_content: string;
  status: string;
  dispatch_hash?: string;
  sent_at: string;
  gateway_provider?: string;
  gateway_response?: string;
}

export interface ShieldMonitor {
  name: string;
  name_hi: string;
  status: string;
  blocked_today: number;
  description: string;
  description_hi: string;
}

export interface DeviceGuardStatus {
  health_score: number;
  device_status: string;
  last_audit_time: string;
  threat_definitions_version: string;
  active_shields: {
    phishing_web_guard: ShieldMonitor;
    remote_screen_guard: ShieldMonitor;
    sms_otp_guard: ShieldMonitor;
    wifi_network_guard: ShieldMonitor;
  };
  recent_intercepts: Array<{
    time: string;
    type: string;
    target: string;
    action: string;
  }>;
}

export interface DeviceScanResult {
  url: string;
  domain: string;
  is_dangerous: boolean;
  threat_category: string;
  severity: string;
  reasons: string[];
  reasons_hi: string[];
  recommended_action: string;
  recommended_action_hi: string;
}

export interface AppInspectionResult {
  app_name: string;
  is_hazardous: boolean;
  classification: string;
  risk_level: string;
  description: string;
  description_hi: string;
  removal_instructions: string[];
  removal_instructions_hi: string[];
}

export interface LockdownResult {
  lockdown_mode: boolean;
  status: string;
  status_hi: string;
  timestamp: string;
  safeguards_engaged: string[];
  safeguards_engaged_hi: string[];
  instructions: string[];
  instructions_hi: string[];
}
