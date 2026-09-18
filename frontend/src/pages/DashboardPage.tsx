import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard, ShieldAlert, CheckCircle, Activity,
  Lock, FileText, TrendingUp, Users, CreditCard, Sparkles, Layers
} from 'lucide-react';
import { api } from '../services/api';
import { DashboardAnalytics } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface DashboardPageProps {
  onSelectScan?: (scanId: number) => void;
  onOpenAdmin?: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onSelectScan, onOpenAdmin }) => {
  const { t, language } = useLanguage();
  const [data, setData] = useState<DashboardAnalytics | null>(null);
  const [activePlan, setActivePlan] = useState<string>('plus_49');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await api.getDashboardAnalytics();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const tiers = language === 'HI' ? [
    { id: 'free', name: 'रक्षा बेसिक (Basic)', price: '₹0', period: 'आजीवन मुफ्त', features: ['प्रतिदिन 5 स्कैन', '1930 आपातकालीन गाइड', 'मूल सुरक्षा चेकलिस्ट', 'सुरक्षा अकादमी'] },
    { id: 'plus_49', name: 'रक्षा प्लस (Plus)', price: '₹49', period: '/ माह', popular: true, features: ['असीमित स्कैन', 'साक्ष्य लॉकर हैश', '4-चरणीय कार्य योजना', '1-क्लिक 1930 शिकायत पत्र'] },
    { id: 'pro_99', name: 'रक्षा प्रो (Pro)', price: '₹99', period: '/ माह', features: ['सभी प्लस सुविधाएं', 'मल्टीमॉडल फोरेंसिक विश्लेषण', 'प्राथमिकता डिजिटल मुहर', 'PDF रिपोर्ट डाउनलोड'] },
    { id: 'family_149', name: 'फैमिली शील्ड (Family)', price: '₹149', period: '/ माह', features: ['5 परिजन सदस्य', 'शून्य गोपनीयता हस्तक्षेप', 'सीक्रेट सेफ-वर्ड प्रोटोकॉल', 'बुजुर्ग सुरक्षा अलर्ट'] }
  ] : [
    { id: 'free', name: 'Raksha Basic', price: '₹0', period: 'Forever Free', features: ['5 Scans / day', '1930 Triage Access', 'Basic Checklists', 'Safety Academy'] },
    { id: 'plus_49', name: 'Raksha Plus', price: '₹49', period: '/ month', popular: true, features: ['Unlimited Scans', 'Evidence Locker Hashes', '4-Stage Solutions', '1-Click 1930 Dossiers'] },
    { id: 'pro_99', name: 'Raksha Pro', price: '₹99', period: '/ month', features: ['All Plus Features', 'Multimodal Forensics', 'Priority Fingerprinting', 'PDF Export Packs'] },
    { id: 'family_149', name: 'Family Shield', price: '₹149', period: '/ month', features: ['5 Family Members', 'Privacy-Zero-Invasion', 'Safe-Word Protocol', 'Elder Alert Sync'] }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-mono mb-2">
            <LayoutDashboard className="w-4 h-4" />
            <span>{t('dash_tag')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {t('dash_title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('dash_desc')}
          </p>
        </div>

        {onOpenAdmin && (
          <button
            onClick={onOpenAdmin}
            className="px-3.5 py-2 rounded-xl bg-cyber-800 hover:bg-cyber-700 text-slate-200 text-xs font-semibold border border-cyber-border transition-colors self-start sm:self-auto flex items-center space-x-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>{t('dash_btn_telemetry')}</span>
          </button>
        )}
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-cyber-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{t('dash_total_scans')}</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white">{data?.total_scans ?? 12}</span>
          <span className="text-[10px] text-emerald-400 block mt-1">{t('dash_across_modalities')}</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-cyber-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{t('dash_high_risks')}</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-red-400">{data?.high_risk_incidents ?? 3}</span>
          <span className="text-[10px] text-red-300 block mt-1">{t('dash_immediate_action')}</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-cyber-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{t('dash_locked_evidence')}</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400">{data?.evidence_count ?? 4}</span>
          <span className="text-[10px] text-slate-400 block mt-1">{t('dash_sha256_fingerprint')}</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-cyber-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">{t('dash_1930_reports')}</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-purple-400">{data?.reports_count ?? 2}</span>
          <span className="text-[10px] text-slate-400 block mt-1">{t('dash_complaint_packs')}</span>
        </div>
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Modality breakdown */}
        <div className="glass-panel p-6 rounded-2xl border border-cyber-border space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
            <TrendingUp className="w-4 h-4 mr-2 text-blue-400" />
            {t('dash_scans_by_modality')}
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>{language === 'HI' ? 'वॉयस डीपफेक' : 'Voice Deepfakes'}</span>
                <span className="font-bold">{data?.voice_scans ?? 4}</span>
              </div>
              <div className="w-full bg-cyber-900 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>{language === 'HI' ? 'वीडियो डीपफेक' : 'Video Deepfakes'}</span>
                <span className="font-bold">{data?.video_scans ?? 3}</span>
              </div>
              <div className="w-full bg-cyber-900 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>{language === 'HI' ? 'लिंकशील्ड फ़िशिंग लिंक' : 'LinkShield Phishing Links'}</span>
                <span className="font-bold">{data?.link_scans ?? 5}</span>
              </div>
              <div className="w-full bg-cyber-900 rounded-full h-2">
                <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>{language === 'HI' ? 'धोखाधड़ी संदेश व टेक्स्ट' : 'Urgent Scam Messages'}</span>
                <span className="font-bold">{data?.message_scans ?? 6}</span>
              </div>
              <div className="w-full bg-cyber-900 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk distribution */}
        <div className="glass-panel p-6 rounded-2xl border border-cyber-border space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
            <ShieldAlert className="w-4 h-4 mr-2 text-amber-400" />
            {t('dash_risk_dist')}
          </h3>

          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40">
              <span className="text-xs text-red-300 block font-bold">{language === 'HI' ? 'अति गंभीर (CRITICAL)' : 'CRITICAL'}</span>
              <span className="text-2xl font-black text-white mt-1 block">
                {data?.risk_distribution?.CRITICAL ?? 2}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-orange-950/40 border border-orange-500/40">
              <span className="text-xs text-orange-300 block font-bold">{language === 'HI' ? 'उच्च (HIGH)' : 'HIGH'}</span>
              <span className="text-2xl font-black text-white mt-1 block">
                {data?.risk_distribution?.HIGH ?? 3}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/40">
              <span className="text-xs text-amber-300 block font-bold">{language === 'HI' ? 'मध्यम (MODERATE)' : 'MODERATE'}</span>
              <span className="text-2xl font-black text-white mt-1 block">
                {data?.risk_distribution?.MODERATE ?? 4}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
              <span className="text-xs text-emerald-300 block font-bold">{language === 'HI' ? 'सुरक्षित (SAFE)' : 'LOW / SAFE'}</span>
              <span className="text-2xl font-black text-white mt-1 block">
                {data?.risk_distribution?.LOW ?? 6}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Pricing Tiers */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyber-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-blue-400 text-xs font-mono mb-1">
              <CreditCard className="w-4 h-4" />
              <span>{t('dash_sub_tag')}</span>
            </div>
            <h2 className="text-xl font-bold text-white">{t('dash_sub_title')}</h2>
            <p className="text-xs text-slate-400">{t('dash_sub_desc')}</p>
          </div>
          <span className="px-3 py-1.5 rounded-xl bg-blue-950 text-blue-300 text-xs font-bold border border-blue-800 self-start sm:self-auto">
            {t('dash_active_plan')}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                tier.popular
                  ? 'bg-blue-950/30 border-blue-500 shadow-xl shadow-blue-500/10'
                  : 'bg-cyber-900 border-cyber-border'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-white">{tier.name}</span>
                  {tier.popular && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                      POPULAR
                    </span>
                  )}
                </div>
                <div className="mb-4">
                  <span className="text-2xl font-black text-white">{tier.price}</span>
                  <span className="text-xs text-slate-400 ml-1">{tier.period}</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-300 mb-6">
                  {tier.features.map((f, idx) => (
                    <li key={idx} className="flex items-center">
                      <span className="text-blue-400 mr-2 text-xs">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => {
                  setActivePlan(tier.id);
                  alert(`Activated ${tier.name}! (Simulated Subscription)`);
                }}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors ${
                  activePlan === tier.id
                    ? 'bg-emerald-600 text-white'
                    : 'bg-cyber-800 hover:bg-cyber-700 text-slate-200 border border-cyber-border'
                }`}
              >
                {activePlan === tier.id ? t('dash_current_plan') : t('dash_select_plan')}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
