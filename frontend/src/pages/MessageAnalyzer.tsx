import React, { useState, useEffect } from 'react';
import { MessageSquare, Activity, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import type { AnalysisResponse } from '../types';
import { RiskCard } from '../components/RiskCard';
import { SafetyChecklist } from '../components/SafetyChecklist';
import { SolutionTimeline } from '../components/SolutionTimeline';
import { VerifyModal } from '../components/VerifyModal';
import { useLanguage } from '../context/LanguageContext';

interface MessageAnalyzerProps {
  onPreserveEvidence?: (scanResult: AnalysisResponse) => void;
  onTriggerAlert?: (prefill: { template: string; message: string; riskLevel: string }) => void;
  prefillPayload?: any;
}

export const MessageAnalyzer: React.FC<MessageAnalyzerProps> = ({ onPreserveEvidence, onTriggerAlert, prefillPayload }) => {
  const { language, t } = useLanguage();
  const [message, setMessage] = useState<string>(prefillPayload?.message || '');
  const [platform, setPlatform] = useState<string>(prefillPayload?.platform || 'whatsapp');
  const [senderClaim, setSenderClaim] = useState<string>(prefillPayload?.sender_claim || 'Friend / Relative');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVerifyOpen, setIsVerifyOpen] = useState<boolean>(false);

  const executeScan = async (text: string, plat: string, claim: string) => {
    if (!text.trim()) {
      setError(language === 'HI' ? 'कृपया जांचने के लिए संदेश का टेक्स्ट पेस्ट करें।' : 'Please paste message text to analyze.');
      return;
    }
    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await api.analyzeMessage(text.trim(), plat, claim);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Message analysis failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (prefillPayload?.message) {
      setMessage(prefillPayload.message);
      if (prefillPayload.platform) setPlatform(prefillPayload.platform);
      if (prefillPayload.sender_claim) setSenderClaim(prefillPayload.sender_claim);
      executeScan(
        prefillPayload.message,
        prefillPayload.platform || platform,
        prefillPayload.sender_claim || senderClaim
      );
    }
  }, [prefillPayload]);

  const runAnalysis = () => {
    executeScan(message, platform, senderClaim);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-4">
      <div>
        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-mono mb-2">
          <MessageSquare className="w-4 h-4" />
          <span>{t('msg_header_tag')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          {t('msg_header_title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
          {t('msg_header_desc')}
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-cyber-border space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              {t('msg_platform_label')}
            </label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
              className="w-full bg-cyber-900 border border-cyber-border rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="sms">SMS / Cellular Text</option>
              <option value="telegram">Telegram</option>
              <option value="instagram">Instagram DM</option>
              <option value="facebook">Facebook Messenger</option>
              <option value="email">Email</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              {t('msg_sender_label')}
            </label>
            <input
              type="text"
              value={senderClaim}
              onChange={(e) => setSenderClaim(e.target.value)}
              placeholder="e.g. Close Friend, Bank Manager, Police/CBI"
              className="w-full bg-cyber-900 border border-cyber-border rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            {t('msg_paste_label')}
          </label>
          <textarea
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Paste text here... (e.g. 'Bhai emergency hai, abhi ₹20,000 bhej do...')"
            className="w-full bg-cyber-900 border border-cyber-border rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-emerald-500 leading-relaxed font-sans"
          />
        </div>

        {/* Quick sample chips */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-slate-400 self-center text-[11px]">{language === 'HI' ? 'नमूना:' : 'Presets:'}</span>
          <button
            onClick={() => {
              setMessage('Bhai emergency hai hospital mein hoon. Abhi turant ₹20,000 bhej do hospital-care99@oksbi par. Shaam ko lauta dunga.');
              setSenderClaim('Close Friend');
            }}
            className="px-2.5 py-1 rounded bg-cyber-900 hover:bg-cyber-800 text-emerald-300 border border-cyber-border text-[11px]"
          >
            WhatsApp Money Urgency
          </button>
          <button
            onClick={() => {
              setMessage('Dear Customer, your SBI account will be blocked today due to pending KYC update. Click http://sbi-online-kyc.top to verify now.');
              setSenderClaim('Bank Official');
            }}
            className="px-2.5 py-1 rounded bg-cyber-900 hover:bg-cyber-800 text-emerald-300 border border-cyber-border text-[11px]"
          >
            Bank KYC Suspension
          </button>
          <button
            onClick={() => {
              setMessage('This is CBI Cyber Cell Officer. Your Aadhaar is linked to money laundering parcel. You are under Digital Arrest. Join Skype call immediately or police will arrive.');
              setSenderClaim('Police / CBI Officer');
            }}
            className="px-2.5 py-1 rounded bg-cyber-900 hover:bg-cyber-800 text-red-300 border border-red-500/40 text-[11px]"
          >
            Digital Arrest Coercion
          </button>
        </div>

        <button
          onClick={runAnalysis}
          disabled={isAnalyzing}
          className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all flex items-center justify-center space-x-2"
        >
          {isAnalyzing ? (
            <>
              <Activity className="w-4 h-4 animate-spin" />
              <span>{t('msg_btn_scanning')}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{t('msg_btn_scan')}</span>
            </>
          )}
        </button>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-300">
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className="space-y-6 animate-in fade-in">
          <RiskCard
            result={result}
            onOpenVerify={() => setIsVerifyOpen(true)}
            onPreserveEvidence={() => onPreserveEvidence && onPreserveEvidence(result)}
            onTriggerAlert={onTriggerAlert}
          />
          <SafetyChecklist guidance={result.safety_guidance} />
          <SolutionTimeline timeline={result.solution_timeline} />

          {result.verification_guide && (
            <VerifyModal
              guide={result.verification_guide}
              isOpen={isVerifyOpen}
              onClose={() => setIsVerifyOpen(false)}
            />
          )}
        </div>
      )}
    </div>
  );
};
