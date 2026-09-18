import React, { useState, useEffect } from 'react';
import { Link, Activity, Sparkles, Globe } from 'lucide-react';
import { api } from '../services/api';
import type { AnalysisResponse } from '../types';
import { RiskCard } from '../components/RiskCard';
import { SafetyChecklist } from '../components/SafetyChecklist';
import { SolutionTimeline } from '../components/SolutionTimeline';
import { useLanguage } from '../context/LanguageContext';

interface LinkAnalyzerProps {
  onPreserveEvidence?: (scanResult: AnalysisResponse) => void;
  onTriggerAlert?: (prefill: { template: string; message: string; riskLevel: string }) => void;
  prefillPayload?: any;
}

export const LinkAnalyzer: React.FC<LinkAnalyzerProps> = ({ onPreserveEvidence, onTriggerAlert, prefillPayload }) => {
  const { t } = useLanguage();
  const [url, setUrl] = useState<string>(prefillPayload?.url || '');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const executeScan = async (targetUrl: string) => {
    if (!targetUrl.trim()) {
      setError('Please paste a URL to inspect.');
      return;
    }
    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await api.analyzeLink(targetUrl.trim());
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'LinkShield inspection failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (prefillPayload?.url) {
      setUrl(prefillPayload.url);
      executeScan(prefillPayload.url);
    }
  }, [prefillPayload]);

  const runAnalysis = () => {
    executeScan(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-4">
      <div>
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono mb-2">
          <Link className="w-4 h-4" />
          <span>{t('link_header_tag')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          {t('link_header_title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
          {t('link_header_desc')}
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-cyber-border space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            {t('link_paste_label')}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
              <Globe className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="e.g. https://sbi-online-kyc-update-secure.top/login or bit.ly/claim-prize"
              className="w-full bg-cyber-900 border border-cyber-border rounded-xl pl-12 pr-4 py-3.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        {/* Quick sample buttons */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-slate-400 self-center text-[11px]">{t('link_test_samples')}</span>
          <button
            onClick={() => setUrl('https://sbi-online-kyc-update-secure.top/login')}
            className="px-2.5 py-1 rounded bg-cyber-900 hover:bg-cyber-800 text-cyan-300 border border-cyber-border text-[11px] font-mono"
          >
            sbi-online-kyc.top (Phishing)
          </button>
          <button
            onClick={() => setUrl('http://192.168.1.105:8080/apk/gift.apk')}
            className="px-2.5 py-1 rounded bg-cyber-900 hover:bg-cyber-800 text-cyan-300 border border-cyber-border text-[11px] font-mono"
          >
            Raw IP APK Host
          </button>
          <button
            onClick={() => setUrl('https://onlinesbi.sbi')}
            className="px-2.5 py-1 rounded bg-cyber-900 hover:bg-cyber-800 text-emerald-300 border border-cyber-border text-[11px] font-mono"
          >
            onlinesbi.sbi (Official)
          </button>
        </div>

        <button
          onClick={runAnalysis}
          disabled={isAnalyzing}
          className="w-full py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center space-x-2"
        >
          {isAnalyzing ? (
            <>
              <Activity className="w-4 h-4 animate-spin" />
              <span>{t('link_btn_scanning')}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{t('link_btn_scan')}</span>
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
