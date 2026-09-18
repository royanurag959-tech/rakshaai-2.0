import React, { useState, useEffect } from 'react';
import { CreditCard, AlertOctagon, Activity, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import type { AnalysisResponse } from '../types';
import { RiskCard } from '../components/RiskCard';
import { SafetyChecklist } from '../components/SafetyChecklist';
import { SolutionTimeline } from '../components/SolutionTimeline';
import { useLanguage } from '../context/LanguageContext';

interface PaymentShieldProps {
  onPreserveEvidence?: (scanResult: AnalysisResponse) => void;
  onTriggerAlert?: (prefill: { template: string; message: string; riskLevel: string }) => void;
  prefillPayload?: any;
}

export const PaymentShield: React.FC<PaymentShieldProps> = ({ onPreserveEvidence, onTriggerAlert, prefillPayload }) => {
  const { t } = useLanguage();
  const [upiId, setUpiId] = useState<string>(prefillPayload?.upi_id || '');
  const [amount, setAmount] = useState<string>(prefillPayload?.amount ? String(prefillPayload.amount) : '');
  const [messageContext, setMessageContext] = useState<string>(prefillPayload?.message_context || '');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const executeScan = async (uId: string, amt: string, ctx: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await api.analyzePayment(
        uId.trim(),
        amt ? parseFloat(amt) : 0,
        ctx.trim()
      );
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'PaymentShield inspection failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (prefillPayload?.upi_id) {
      setUpiId(prefillPayload.upi_id);
      if (prefillPayload.amount) setAmount(String(prefillPayload.amount));
      if (prefillPayload.message_context) setMessageContext(prefillPayload.message_context);
      executeScan(
        prefillPayload.upi_id,
        prefillPayload.amount ? String(prefillPayload.amount) : amount,
        prefillPayload.message_context || messageContext
      );
    }
  }, [prefillPayload]);

  const runAnalysis = () => {
    executeScan(upiId, amount, messageContext);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-4">
      <div>
        <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono mb-2">
          <CreditCard className="w-4 h-4" />
          <span>{t('pay_header_tag')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          {t('pay_header_title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
          {t('pay_header_desc')}
        </p>
      </div>

      {/* Cardinal Rule Highlight */}
      <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start space-x-3">
        <AlertOctagon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200">
          <strong className="text-white block mb-0.5">{t('pay_rule_title')}</strong>
          {t('pay_rule_desc')}
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-cyber-border space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              {t('pay_upi_label')}
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. refund-desk99@ybl or paytmqr2810..."
              className="w-full bg-cyber-900 border border-cyber-border rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              {t('pay_amount_label')}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 20000"
              className="w-full bg-cyber-900 border border-cyber-border rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            {t('pay_context_label')}
          </label>
          <textarea
            rows={4}
            value={messageContext}
            onChange={(e) => setMessageContext(e.target.value)}
            placeholder="e.g. 'Buyer told me: Scan this QR code and type your PIN to accept advance payment for OLX furniture'"
            className="w-full bg-cyber-900 border border-cyber-border rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-amber-500 leading-relaxed font-sans"
          />
        </div>

        <button
          onClick={runAnalysis}
          disabled={isAnalyzing}
          className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-amber-500/25 transition-all flex items-center justify-center space-x-2"
        >
          {isAnalyzing ? (
            <>
              <Activity className="w-4 h-4 animate-spin" />
              <span>Checking VPA Reputation & Reverse-QR Mandates...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{t('pay_btn_scan')}</span>
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
