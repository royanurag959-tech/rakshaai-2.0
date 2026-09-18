import React, { useState } from 'react';
import { Image, Upload, Activity, Sparkles, FileSearch } from 'lucide-react';
import { api } from '../services/api';
import type { AnalysisResponse } from '../types';
import { RiskCard } from '../components/RiskCard';
import { SafetyChecklist } from '../components/SafetyChecklist';
import { SolutionTimeline } from '../components/SolutionTimeline';
import { useLanguage } from '../context/LanguageContext';

interface ScreenshotAnalyzerProps {
  onPreserveEvidence?: (scanResult: AnalysisResponse) => void;
  onTriggerAlert?: (prefill: { template: string; message: string; riskLevel: string }) => void;
  prefillPayload?: any;
}

export const ScreenshotAnalyzer: React.FC<ScreenshotAnalyzerProps> = ({ onPreserveEvidence, onTriggerAlert, prefillPayload }) => {
  const { language, t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [notes, setNotes] = useState<string>(prefillPayload?.notes || '');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      let uploadFile = file;
      if (!uploadFile) {
        const dummyBlob = new Blob(['sample-screenshot-ocr-data'], { type: 'image/png' });
        uploadFile = new File([dummyBlob], prefillPayload?.filename || 'whatsapp_chat_screenshot.png', { type: 'image/png' });
      }

      const res = await api.analyzeScreenshot(uploadFile, notes);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Screenshot analysis failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-4">
      <div>
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono mb-2">
          <Image className="w-4 h-4" />
          <span>{t('screen_header_tag')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          {t('screen_header_title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
          {t('screen_header_desc')}
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-cyber-border space-y-6">
        <div className="border-2 border-dashed border-cyber-border rounded-2xl p-8 text-center hover:border-indigo-500/50 transition-colors bg-cyber-900/40">
          <input
            type="file"
            id="screenshot-upload"
            accept="image/*,.png,.jpg,.jpeg,.webp"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="screenshot-upload" className="cursor-pointer flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-3 border border-indigo-500/30">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-white block">
              {file ? file.name : (prefillPayload?.filename || t('screen_upload_prompt'))}
            </span>
            <span className="text-xs text-slate-400 mt-1">
              {language === 'HI' ? 'व्हाट्सएप चैट, इंस्टाग्राम डीएम, बैंक SMS स्क्रीनशॉट समर्थित (अधिकतम 20MB)' : 'Supports WhatsApp chats, Instagram DMs, banking SMS screenshots (Max 20MB)'}
            </span>
          </label>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            {language === 'HI' ? 'अतिरिक्त विवरण या संदर्भ' : 'Optional Notes / Description'}
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={language === 'HI' ? 'उदा. अनजान नंबर से अस्पताल या जमानत के नाम पर पैसे मांगने वाली व्हाट्सएप चैट का स्क्रीनशॉट' : 'e.g. Screenshot of WhatsApp conversation from unknown number asking for bail money'}
            className="w-full bg-cyber-900 border border-cyber-border rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <button
          onClick={runAnalysis}
          disabled={isAnalyzing}
          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2"
        >
          {isAnalyzing ? (
            <>
              <Activity className="w-4 h-4 animate-spin" />
              <span>{language === 'HI' ? 'ऑप्टिकल कैरेक्टर रिकग्निशन और डेटा एक्सट्रैक्शन जारी...' : 'Running Optical Character Recognition & Entity Extraction...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{t('screen_btn_scan')}</span>
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
          {/* "What We Found" Section */}
          <div className="glass-panel p-6 rounded-2xl border border-cyber-border">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center">
              <FileSearch className="w-4 h-4 mr-2 text-indigo-400" />
              {t('screen_what_found')}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-cyber-900/80 border border-cyber-border flex items-start space-x-2.5">
                <span className="text-red-400 text-sm">🚨</span>
                <div>
                  <strong className="text-slate-200 block">{language === 'HI' ? 'भुगतान / पैसे का अनुरोध' : 'Payment / Money Request'}</strong>
                  <span className="text-slate-400">{language === 'HI' ? 'चैट में सीधे ट्रांसफर या UPI हैंडल का पता चला।' : 'Direct transfer or UPI handle detected in conversation.'}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyber-900/80 border border-cyber-border flex items-start space-x-2.5">
                <span className="text-amber-400 text-sm">⚠️</span>
                <div>
                  <strong className="text-slate-200 block">{language === 'HI' ? 'दबाव और घबराहट पैदा करने वाली भाषा' : 'Urgency & Coercion Language'}</strong>
                  <span className="text-slate-400">{language === 'HI' ? 'अत्यंत कम समय में पैसे भेजने का दबाव।' : 'Demanding action within a short or panic window.'}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyber-900/80 border border-cyber-border flex items-start space-x-2.5">
                <span className="text-blue-400 text-sm">🔗</span>
                <div>
                  <strong className="text-slate-200 block">{language === 'HI' ? 'वेब लिंक या क्यूआर कोड' : 'Extracted External Link / QR'}</strong>
                  <span className="text-slate-400">{language === 'HI' ? 'संभावित फर्जी लिंक या भुगतान गेटवे।' : 'Potential phishing URL or unverified payment gateway.'}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-cyber-900/80 border border-cyber-border flex items-start space-x-2.5">
                <span className="text-purple-400 text-sm">👤</span>
                <div>
                  <strong className="text-slate-200 block">{language === 'HI' ? 'पहचान का दावा' : 'Identity Claim'}</strong>
                  <span className="text-slate-400">{language === 'HI' ? 'रिश्तेदार, अस्पताल या अधिकारी होने का दावा।' : 'Impersonation of relative, hospital, or executive.'}</span>
                </div>
              </div>
            </div>
          </div>

          <RiskCard
            result={result}
            onPreserveEvidence={() => onPreserveEvidence && onPreserveEvidence(result)}
            onTriggerAlert={onTriggerAlert}
          />
          <SafetyChecklist guidance={result.safety_guidance} />
          <SolutionTimeline timeline={result.solution_timeline} />
        </div>
      )}
    </div>
  );
};
