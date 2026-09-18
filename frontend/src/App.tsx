import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { DemoScenarioBar } from './components/DemoScenarioBar';
import { OfflineBanner } from './components/OfflineBanner';
import { AuthModal } from './components/AuthModal';
import { AlertDispatcherModal } from './components/AlertDispatcherModal';
import type { DemoScenario } from './services/mockScenarios';
import { api } from './services/api';

// Pages
import { HomePage } from './pages/HomePage';
import { VoiceAnalyzer } from './pages/VoiceAnalyzer';
import { VideoAnalyzer } from './pages/VideoAnalyzer';
import { LinkAnalyzer } from './pages/LinkAnalyzer';
import { MessageAnalyzer } from './pages/MessageAnalyzer';
import { ScreenshotAnalyzer } from './pages/ScreenshotAnalyzer';
import { SocialShield } from './pages/SocialShield';
import { PaymentShield } from './pages/PaymentShield';
import { EmergencyPage } from './pages/EmergencyPage';
import { EvidenceLockerPage } from './pages/EvidenceLockerPage';
import { IncidentReportPage } from './pages/IncidentReportPage';
import { FamilyShieldPage } from './pages/FamilyShieldPage';
import { AcademyPage } from './pages/AcademyPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { DeviceGuardPage } from './pages/DeviceGuardPage';

const MainApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [prefillPayload, setPrefillPayload] = useState<any>(null);
  const [selectedIncidentId, setSelectedIncidentId] = useState<number>(1);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState<boolean>(false);
  const [alertPrefill, setAlertPrefill] = useState<{ phone?: string; template?: string; message?: string; riskLevel?: string }>({});
  const { language } = useLanguage();

  const handleTriggerAlert = (prefill: { template: string; message: string; riskLevel: string; phone?: string }) => {
    setAlertPrefill(prefill);
    setIsAlertModalOpen(true);
  };

  // Monitor connectivity
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial ping to backend
    api.ping().then((alive) => {
      if (!alive) setIsOnline(false);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle Scenario click from DemoScenarioBar
  const handleSelectScenario = (scenario: DemoScenario) => {
    if (scenario.targetPage === 'offline') {
      setIsOnline(false);
      setActiveTab('emergency');
      return;
    }
    setPrefillPayload({ ...scenario.payload, _ts: Date.now() });
    setActiveTab(scenario.targetPage);
  };

  // Handle preserving evidence from any analysis result
  const handlePreserveEvidence = async (scanResult: any) => {
    try {
      await api.createEvidence({
        scan_id: scanResult.id,
        title: `Preserved Evidence: ${scanResult.target_summary}`,
        evidence_type: scanResult.scan_type === 'audio' ? 'audio_recording' :
                       scanResult.scan_type === 'video' ? 'video_clip' :
                       scanResult.scan_type === 'link' ? 'url' : 'screenshot',
        sha256_hash: scanResult.sha256_hash,
        detected_indicators: scanResult.signals,
        notes: `Automatically preserved from RakshaAI 2.0 scan (Risk: ${scanResult.risk_level}, Score: ${scanResult.risk_score}).`
      });
      alert(language === 'HI' 
        ? 'डिजिटल साक्ष्य को SHA-256 के साथ सुरक्षित कर साक्ष्य वॉल्ट में जमा कर दिया गया है!'
        : 'Digital evidence successfully fingerprinted with SHA-256 and locked in Evidence Vault!');
      setActiveTab('locker');
    } catch (err: any) {
      alert('Could not save evidence: ' + err.message);
    }
  };

  // Handle draft incident from Emergency triage
  const handleDraftIncident = async (draft: any) => {
    try {
      const created = await api.createIncident(draft);
      setSelectedIncidentId(created.id);
      setActiveTab('report');
    } catch (err: any) {
      alert('Could not create incident: ' + err.message);
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage setActiveTab={setActiveTab} />;
      case 'voice':
        return (
          <VoiceAnalyzer
            onPreserveEvidence={handlePreserveEvidence}
            onTriggerAlert={handleTriggerAlert}
            prefillPayload={prefillPayload}
          />
        );
      case 'video':
        return (
          <VideoAnalyzer
            onPreserveEvidence={handlePreserveEvidence}
            onTriggerAlert={handleTriggerAlert}
            prefillPayload={prefillPayload}
          />
        );
      case 'link':
        return (
          <LinkAnalyzer
            onPreserveEvidence={handlePreserveEvidence}
            onTriggerAlert={handleTriggerAlert}
            prefillPayload={prefillPayload}
          />
        );
      case 'message':
        return (
          <MessageAnalyzer
            onPreserveEvidence={handlePreserveEvidence}
            onTriggerAlert={handleTriggerAlert}
            prefillPayload={prefillPayload}
          />
        );
      case 'screenshot':
        return (
          <ScreenshotAnalyzer
            onPreserveEvidence={handlePreserveEvidence}
            onTriggerAlert={handleTriggerAlert}
            prefillPayload={prefillPayload}
          />
        );
      case 'social':
        return (
          <SocialShield
            onPreserveEvidence={handlePreserveEvidence}
            onTriggerAlert={handleTriggerAlert}
            prefillPayload={prefillPayload}
          />
        );
      case 'payment':
        return (
          <PaymentShield
            onPreserveEvidence={handlePreserveEvidence}
            onTriggerAlert={handleTriggerAlert}
            prefillPayload={prefillPayload}
          />
        );
      case 'emergency':
        return (
          <EmergencyPage
            onDraftIncident={handleDraftIncident}
            prefillPayload={prefillPayload}
          />
        );
      case 'locker':
        return (
          <EvidenceLockerPage
            onGenerateReport={(id) => {
              setSelectedIncidentId(id);
              setActiveTab('report');
            }}
          />
        );
      case 'report':
        return <IncidentReportPage initialIncidentId={selectedIncidentId} />;
      case 'family':
        return <FamilyShieldPage />;
      case 'academy':
        return <AcademyPage />;
      case 'device_guard':
        return <DeviceGuardPage />;
      case 'dashboard':
        return (
          <DashboardPage
            onOpenAdmin={() => setActiveTab('admin')}
          />
        );
      case 'admin':
        return <AdminDashboardPage onBack={() => setActiveTab('dashboard')} />;
      default:
        return <HomePage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-cyber-900 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Offline Alert Banner */}
      <OfflineBanner
        isOnline={isOnline}
        onSync={() => {
          api.ping().then(online => setIsOnline(online));
        }}
      />

      {/* Global Navbar with Language Switcher */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setPrefillPayload(null);
          setActiveTab(tab);
        }}
        isOnline={isOnline}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onOpenAlerts={() => {
          setAlertPrefill({});
          setIsAlertModalOpen(true);
        }}
      />

      {/* One-Click 9 Demo Scenarios Launcher Bar */}
      <DemoScenarioBar onSelectScenario={handleSelectScenario} />

      {/* Page Content */}
      <main className="flex-1">
        {renderActiveTab()}
      </main>

      {/* Auth Modal (Sign In / Register) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Automated Fraud Victim Alert Dispatcher Modal */}
      <AlertDispatcherModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        prefillPhone={alertPrefill.phone}
        prefillTemplate={alertPrefill.template}
        prefillMessage={alertPrefill.message}
        prefillRiskLevel={alertPrefill.riskLevel}
      />

      {/* Global Footer with statutory disclaimers & 1930 */}
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
