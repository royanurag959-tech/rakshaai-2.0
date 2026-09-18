import type {
  AnalysisResponse, DashboardAnalytics, Incident,
  EvidenceRecord, FamilyMember, User, AuthResponse, AlertNotification
} from '../types';

const API_BASE_URL = typeof window !== 'undefined' && window.location.port === '5173' ? '/api' : 'http://127.0.0.1:8000/api';

// Offline Storage Keys
const OFFLINE_INCIDENTS_KEY = 'raksha_offline_incidents';

export const api = {
  // Check backend availability
  async ping(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/device-guard/status`, { method: 'GET', signal: AbortSignal.timeout(2500) });
      return res.ok;
    } catch {
      try {
        const res2 = await fetch('http://127.0.0.1:8000/', { method: 'GET', signal: AbortSignal.timeout(2500) });
        return res2.ok;
      } catch {
        return false;
      }
    }
  },

  // Audio analysis
  async analyzeAudio(file: File, claimedIdentity: string = 'Unknown'): Promise<AnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('claimed_identity', claimedIdentity);

    const res = await fetch(`${API_BASE_URL}/analyze/audio`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Audio analysis failed');
    return res.json();
  },

  // Video analysis
  async analyzeVideo(file: File, notes: string = ''): Promise<AnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('notes', notes);

    const res = await fetch(`${API_BASE_URL}/analyze/video`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Video analysis failed');
    return res.json();
  },

  // Link analysis
  async analyzeLink(url: string): Promise<AnalysisResponse> {
    const res = await fetch(`${API_BASE_URL}/analyze/link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    if (!res.ok) throw new Error('Link analysis failed');
    return res.json();
  },

  // Message analysis
  async analyzeMessage(message: string, platform: string = 'generic', senderClaim: string = 'Unknown'): Promise<AnalysisResponse> {
    const res = await fetch(`${API_BASE_URL}/analyze/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, platform, sender_claim: senderClaim }),
    });
    if (!res.ok) throw new Error('Message analysis failed');
    return res.json();
  },

  // Screenshot analysis
  async analyzeScreenshot(file: File, notes: string = ''): Promise<AnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('notes', notes);

    const res = await fetch(`${API_BASE_URL}/analyze/screenshot`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error('Screenshot analysis failed');
    return res.json();
  },

  // Social analysis
  async analyzeSocial(platform: string, content: string, senderProfile: string = '', senderClaim: string = 'Unknown'): Promise<AnalysisResponse> {
    const res = await fetch(`${API_BASE_URL}/analyze/social`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform, content, sender_profile: senderProfile, sender_claim: senderClaim }),
    });
    if (!res.ok) throw new Error('SocialShield analysis failed');
    return res.json();
  },

  // Payment analysis
  async analyzePayment(upiId: string, amount: number, messageContext: string): Promise<AnalysisResponse> {
    const res = await fetch(`${API_BASE_URL}/analyze/payment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ upi_id: upiId, amount, message_context: messageContext }),
    });
    if (!res.ok) throw new Error('PaymentShield analysis failed');
    return res.json();
  },

  // Emergency Link Triage
  async emergencyLinkTriage(payload: {
    url?: string;
    info_entered: string[];
    money_lost: string;
    amount_lost?: number;
    transaction_id?: string;
  }) {
    const res = await fetch(`${API_BASE_URL}/emergency/link-click`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Emergency triage request failed');
    return res.json();
  },

  // Incidents
  async getIncidents(): Promise<Incident[]> {
    const res = await fetch(`${API_BASE_URL}/incidents`);
    if (!res.ok) return [];
    return res.json();
  },

  async createIncident(incidentData: any): Promise<Incident> {
    const res = await fetch(`${API_BASE_URL}/incidents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(incidentData),
    });
    if (!res.ok) throw new Error('Could not create incident');
    return res.json();
  },

  async addTimelineEvent(incidentId: number, eventText: string): Promise<Incident> {
    const res = await fetch(`${API_BASE_URL}/incidents/${incidentId}/timeline?event_text=${encodeURIComponent(eventText)}`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Could not add timeline event');
    return res.json();
  },

  // Evidence
  async getEvidenceList(): Promise<EvidenceRecord[]> {
    const res = await fetch(`${API_BASE_URL}/evidence`);
    if (!res.ok) return [];
    return res.json();
  },

  async createEvidence(evidenceData: any): Promise<EvidenceRecord> {
    const res = await fetch(`${API_BASE_URL}/evidence`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evidenceData),
    });
    if (!res.ok) throw new Error('Could not store evidence');
    return res.json();
  },

  // Report generation
  async generateReport(incidentId: number, userStatement: string = '') {
    const res = await fetch(`${API_BASE_URL}/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ incident_id: incidentId, user_statement: userStatement }),
    });
    if (!res.ok) throw new Error('Could not generate report');
    return res.json();
  },

  // Family Shield
  async getFamilyMembers(): Promise<FamilyMember[]> {
    const res = await fetch(`${API_BASE_URL}/family/members`);
    if (!res.ok) return [];
    return res.json();
  },

  async addFamilyMember(member: { name: string; relationship: string; phone?: string }): Promise<FamilyMember> {
    const res = await fetch(`${API_BASE_URL}/family/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member),
    });
    if (!res.ok) throw new Error('Could not add family member');
    return res.json();
  },

  async removeFamilyMember(id: number) {
    await fetch(`${API_BASE_URL}/family/members/${id}`, { method: 'DELETE' });
  },

  // Dashboard
  async getDashboardAnalytics(): Promise<DashboardAnalytics> {
    const res = await fetch(`${API_BASE_URL}/dashboard`);
    if (!res.ok) throw new Error('Could not fetch dashboard');
    return res.json();
  },

  async getAdminStats() {
    const res = await fetch(`${API_BASE_URL}/dashboard/admin`);
    if (!res.ok) throw new Error('Could not fetch admin telemetry');
    return res.json();
  },

  // Local Storage / Offline helpers
  saveOfflineIncident(incident: any) {
    const existing = JSON.parse(localStorage.getItem(OFFLINE_INCIDENTS_KEY) || '[]');
    existing.unshift({ ...incident, id: Date.now(), is_offline_draft: true, created_at: new Date().toISOString() });
    localStorage.setItem(OFFLINE_INCIDENTS_KEY, JSON.stringify(existing));
  },

  getOfflineIncidents(): any[] {
    return JSON.parse(localStorage.getItem(OFFLINE_INCIDENTS_KEY) || '[]');
  },

  // Authentication
  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Login failed. Please check credentials.');
    }
    return res.json();
  },

  async register(data: { email: string; password: string; full_name?: string; phone?: string }): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Registration failed. Email might already exist.');
    }
    return res.json();
  },

  // Alerts & Early Warning Notification Dispatcher
  async dispatchAlert(alertData: {
    recipient_name?: string;
    recipient_phone: string;
    alert_type?: string;
    channel?: string;
    risk_level?: string;
    message_content: string;
    user_id?: number;
    gateway_api_key?: string;
    gateway_provider?: string;
  }): Promise<AlertNotification> {
    const res = await fetch(`${API_BASE_URL}/alerts/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(alertData)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to dispatch emergency alert');
    }
    return res.json();
  },

  async getAlertHistory(): Promise<AlertNotification[]> {
    const res = await fetch(`${API_BASE_URL}/alerts/history`);
    if (!res.ok) return [];
    return res.json();
  },

  async getAlertTemplates(): Promise<Record<string, { title_en: string; title_hi: string; en: string; hi: string }>> {
    const res = await fetch(`${API_BASE_URL}/alerts/templates`);
    if (!res.ok) return {};
    return res.json();
  },

  // 360 Device Cyber Guard
  async getDeviceGuardStatus(): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/device-guard/status`);
    if (!res.ok) throw new Error('Failed to retrieve device guard status');
    return res.json();
  },

  async scanDeviceUrl(url: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/device-guard/scan-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    if (!res.ok) throw new Error('Failed to scan URL');
    return res.json();
  },

  async inspectDeviceApp(appName: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/device-guard/inspect-app`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app_name: appName })
    });
    if (!res.ok) throw new Error('Failed to inspect application');
    return res.json();
  },

  async triggerDeviceLockdown(reason?: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/device-guard/lockdown`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: reason || 'Live fraud emergency triggered by user' })
    });
    if (!res.ok) throw new Error('Failed to execute lockdown');
    return res.json();
  }
};
