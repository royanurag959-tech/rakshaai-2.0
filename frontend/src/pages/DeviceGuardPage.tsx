import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, ShieldAlert, Smartphone, Laptop, Lock, 
  ExternalLink, AlertTriangle, CheckCircle, RefreshCw
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import type { DeviceGuardStatus, DeviceScanResult, AppInspectionResult, LockdownResult } from '../types';

export const DeviceGuardPage: React.FC = () => {
  const { language, t } = useLanguage();
  const isHi = language === 'HI';

  const [status, setStatus] = useState<DeviceGuardStatus | null>(null);
  const [, setLoading] = useState<boolean>(true);

  // URL Scanner state
  const [testUrl, setTestUrl] = useState<string>('http://sbi-kyc-update-portal.com/login');
  const [isScanningUrl, setIsScanningUrl] = useState<boolean>(false);
  const [urlResult, setUrlResult] = useState<DeviceScanResult | null>(null);

  // App Inspector state
  const [appName, setAppName] = useState<string>('AnyDesk');
  const [isInspectingApp, setIsInspectingApp] = useState<boolean>(false);
  const [appResult, setAppResult] = useState<AppInspectionResult | null>(null);

  // Lockdown state
  const [isLockingDown, setIsLockingDown] = useState<boolean>(false);
  const [lockdownResult, setLockdownResult] = useState<LockdownResult | null>(null);

  useEffect(() => {
    loadStatus();
  }, []);

  const loadStatus = async () => {
    setLoading(true);
    try {
      const data = await api.getDeviceGuardStatus();
      setStatus(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScanUrl = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!testUrl.trim()) return;
    setIsScanningUrl(true);
    try {
      const res = await api.scanDeviceUrl(testUrl.trim());
      setUrlResult(res);
    } catch (err: any) {
      alert(err.message || 'Failed to scan URL');
    } finally {
      setIsScanningUrl(false);
    }
  };

  const handleInspectApp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!appName.trim()) return;
    setIsInspectingApp(true);
    try {
      const res = await api.inspectDeviceApp(appName.trim());
      setAppResult(res);
    } catch (err: any) {
      alert(err.message || 'Failed to inspect app');
    } finally {
      setIsInspectingApp(false);
    }
  };

  const handleLockdown = async () => {
    const confirmMsg = isHi 
      ? 'क्या आप आपातकालीन लॉकडाउन सक्रिय करना चाहते हैं? इससे सभी रिमोट कनेक्शन ब्लॉक होंगे और बैंक सुरक्षा चेतावनी जारी होगी।'
      : 'Activate Emergency Lockdown? This will sever suspicious remote connections and engage financial safety isolation.';
    if (!window.confirm(confirmMsg)) return;

    setIsLockingDown(true);
    try {
      const res = await api.triggerDeviceLockdown('Live screen hijacking / money theft emergency');
      setLockdownResult(res);
    } catch (err: any) {
      alert(err.message || 'Lockdown failed');
    } finally {
      setIsLockingDown(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 px-4">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          {t('device_guard_badge')}
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          {t('device_guard_title')}
        </h1>
        <p className="text-slate-400 max-w-3xl">
          {t('device_guard_subtitle')}
        </p>
      </div>

      {/* Main Status Hero Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
              <span className="text-sm font-semibold text-slate-400">{t('device_status_label')}</span>
              <span className="text-sm font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-0.5 rounded-full">
                {t('device_status_protected')}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Smartphone className="w-4 h-4 text-cyan-400" />
                <span>Mobile Shield: <strong>ACTIVE</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <Laptop className="w-4 h-4 text-cyan-400" />
                <span>Desktop/Browser: <strong>PROTECTED</strong></span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
                <RefreshCw className="w-4 h-4 text-slate-400" />
                <span>Engine: {status?.threat_definitions_version || '2026.09.18'}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="text-center px-4 py-2 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-2xl font-black text-emerald-400">
                {status?.health_score || 98}/100
              </div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                {t('device_health_score')}
              </div>
            </div>

            <button
              onClick={handleLockdown}
              disabled={isLockingDown}
              className="bg-red-600 hover:bg-red-500 text-white font-bold px-5 py-3 rounded-xl shadow-lg shadow-red-900/30 border border-red-500/30 flex items-center gap-2 transition-all transform active:scale-95 text-sm"
            >
              <Lock className="w-4 h-4" />
              {isLockingDown 
                ? (isHi ? 'लॉकडाउन लागू हो रहा है...' : 'Engaging Lockdown...') 
                : t('device_lockdown_btn')}
            </button>
          </div>
        </div>

        {/* Emergency Lockdown Result Modal / Alert Banner */}
        {lockdownResult && (
          <div className="mt-6 p-5 bg-red-950/70 border border-red-500/50 rounded-xl space-y-3 animate-fadeIn">
            <div className="flex items-center gap-2 text-red-400 font-bold text-base">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span>{isHi ? lockdownResult.status_hi : lockdownResult.status}</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-900/80 p-3 rounded-lg border border-red-900/40">
                <div className="font-semibold text-emerald-400 mb-1.5">
                  {isHi ? 'सक्रिय किए गए सुरक्षा कवच:' : 'Safeguards Engaged:'}
                </div>
                <ul className="space-y-1 text-slate-300">
                  {(isHi ? lockdownResult.safeguards_engaged_hi : lockdownResult.safeguards_engaged).map((sg, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{sg}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900/80 p-3 rounded-lg border border-red-900/40">
                <div className="font-semibold text-amber-400 mb-1.5">
                  {isHi ? 'नागरिक के लिए तत्काल निर्देश:' : 'Immediate Citizen Instructions:'}
                </div>
                <ul className="space-y-1 text-slate-300">
                  {(isHi ? lockdownResult.instructions_hi : lockdownResult.instructions).map((ins, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{ins}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4 Active Real-Time Shield Monitors */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4">
          {t('device_active_shields')}
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {status && Object.entries(status.active_shields).map(([key, shield]) => (
            <div 
              key={key}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-bold text-white text-base">
                  {isHi ? shield.name_hi : shield.name}
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {shield.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                {isHi ? shield.description_hi : shield.description}
              </p>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/80">
                <span className="text-slate-500">
                  {isHi ? 'आज ब्लॉक किए गए खतरे:' : 'Threats Blocked Today:'}
                </span>
                <span className="font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded">
                  {shield.blocked_today} {isHi ? 'रोके गए' : 'prevented'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Protection Testing Tools */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Tool 1: Suspicious URL Sentinel */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">
              {t('device_test_url_title')}
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            {isHi 
              ? 'संदिग्ध SMS या बैंक अपडेट लिंक दर्ज करके रियल-टाइम डोमेन फ़िशिंग एल्गोरिदम से तुरंत जांचें।'
              : 'Test any link or SMS URL against on-device domain fraud heuristics and fake banking signatures.'}
          </p>

          <form onSubmit={handleScanUrl} className="space-y-3">
            <input
              type="text"
              value={testUrl}
              onChange={(e) => setTestUrl(e.target.value)}
              placeholder={t('device_test_url_placeholder')}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={isScanningUrl}
              className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2.5 rounded-xl transition text-sm flex items-center justify-center gap-2"
            >
              {isScanningUrl ? (isHi ? 'जांच जारी है...' : 'Scanning...') : t('device_test_url_btn')}
            </button>
          </form>

          {urlResult && (
            <div className={`p-4 rounded-xl border text-xs space-y-2 ${
              urlResult.is_dangerous 
                ? 'bg-red-950/50 border-red-500/50 text-red-200' 
                : 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
            }`}>
              <div className="flex items-center justify-between font-bold text-sm">
                <span>{urlResult.is_dangerous ? (isHi ? '🚨 खतरनाक फ़िशिंग लिंक!' : '🚨 DANGEROUS PHISHING LINK!') : (isHi ? '✅ सुरक्षित लिंक' : '✅ SAFE LINK')}</span>
                <span className="uppercase text-[10px] px-2 py-0.5 rounded bg-black/40">{urlResult.severity}</span>
              </div>
              <div>
                <strong>{isHi ? 'डोमेन:' : 'Domain:'}</strong> {urlResult.domain}
              </div>
              <div>
                <strong>{isHi ? 'पहचाने गए खतरे:' : 'Reasons:'}</strong>
                <ul className="list-disc pl-4 space-y-0.5 mt-1">
                  {(isHi ? urlResult.reasons_hi : urlResult.reasons).map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
              <div className="pt-1 font-semibold text-white">
                <strong>{isHi ? 'सलाह:' : 'Action:'}</strong> {isHi ? urlResult.recommended_action_hi : urlResult.recommended_action}
              </div>
            </div>
          )}
        </div>

        {/* Tool 2: Screen Hijack & APK Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-white">
              {t('device_inspect_app_title')}
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            {isHi 
              ? 'जांचें कि क्या कोई ऐप धोखेबाज़ों द्वारा स्क्रीन देखने (AnyDesk/TeamViewer) या बैंक हैक करने के लिए इस्तेमाल होता है।'
              : 'Audit installed applications or APKs weaponized in screen-sharing scams and bank credential harvesting.'}
          </p>

          <form onSubmit={handleInspectApp} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder={t('device_inspect_app_placeholder')}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                disabled={isInspectingApp}
                className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-4 py-2.5 rounded-xl transition text-sm flex items-center justify-center gap-2 shrink-0"
              >
                {isInspectingApp ? (isHi ? 'जांच...' : 'Inspecting...') : t('device_inspect_app_btn')}
              </button>
            </div>
            {/* Quick Test Chips */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>{isHi ? 'त्वरित टेस्ट:' : 'Quick test:'}</span>
              {['AnyDesk', 'QuickSupport', 'SBI_Update.apk', 'Calculator'].map((sample) => (
                <button
                  key={sample}
                  type="button"
                  onClick={() => { setAppName(sample); }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-[11px]"
                >
                  {sample}
                </button>
              ))}
            </div>
          </form>

          {appResult && (
            <div className={`p-4 rounded-xl border text-xs space-y-2 ${
              appResult.is_hazardous 
                ? 'bg-red-950/50 border-red-500/50 text-red-200' 
                : 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200'
            }`}>
              <div className="flex items-center justify-between font-bold text-sm">
                <span>{appResult.app_name} — {appResult.classification}</span>
                <span className="uppercase text-[10px] px-2 py-0.5 rounded bg-black/40">{appResult.risk_level}</span>
              </div>
              <p className="text-slate-300">
                {isHi ? appResult.description_hi : appResult.description}
              </p>
              <div>
                <strong>{isHi ? 'सुरक्षित करने के कदम:' : 'Removal / Defense Steps:'}</strong>
                <ul className="list-disc pl-4 space-y-0.5 mt-1">
                  {(isHi ? appResult.removal_instructions_hi : appResult.removal_instructions).map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Intercepts Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">
          {t('device_recent_intercepts')}
        </h3>
        <div className="divide-y divide-slate-800">
          {status?.recent_intercepts?.map((intercept, idx) => (
            <div key={idx} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-200">{intercept.type}</span>
                  <span className="text-slate-500 font-mono text-[11px]">({intercept.time})</span>
                </div>
                <div className="text-slate-400 font-mono">
                  Target: <span className="text-amber-400">{intercept.target}</span>
                </div>
              </div>
              <span className="font-bold text-[11px] px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/60">
                {intercept.action}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
