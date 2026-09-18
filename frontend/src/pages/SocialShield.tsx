import React, { useState, useEffect } from 'react';
import { Share2, MessageCircle, Camera, Send, Globe, Mail, Activity, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import type { AnalysisResponse } from '../types';
import { RiskCard } from '../components/RiskCard';
import { SafetyChecklist } from '../components/SafetyChecklist';
import { SolutionTimeline } from '../components/SolutionTimeline';
import { useLanguage } from '../context/LanguageContext';

interface SocialShieldProps {
  onPreserveEvidence?: (scanResult: AnalysisResponse) => void;
  onTriggerAlert?: (prefill: { template: string; message: string; riskLevel: string }) => void;
  prefillPayload?: any;
}

export const SocialShield: React.FC<SocialShieldProps> = ({ onPreserveEvidence, onTriggerAlert, prefillPayload }) => {
  const { t } = useLanguage();
  const [platform, setPlatform] = useState<string>(prefillPayload?.platform || 'whatsapp');
  const [content, setContent] = useState<string>(prefillPayload?.content || '');
  const [senderProfile, setSenderProfile] = useState<string>(prefillPayload?.sender_profile || '');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const platforms = [
    { id: 'whatsapp', name: 'WhatsApp', icon: <MessageCircle className="w-4 h-4 text-emerald-400" /> },
    { id: 'instagram', name: 'Instagram', icon: <Camera className="w-4 h-4 text-pink-400" /> },
    { id: 'telegram', name: 'Telegram', icon: <Send className="w-4 h-4 text-cyan-400" /> },
    { id: 'facebook', name: 'Facebook', icon: <Globe className="w-4 h-4 text-blue-400" /> },
    { id: 'sms', name: 'SMS / Email', icon: <Mail className="w-4 h-4 text-amber-400" /> }
  ];

  const executeScan = async (plat: string, cont: string, profile: string) => {
    if (!cont.trim()) {
      setError('Please paste the social media post, DM, or message content.');
      return;
    }
    setIsAnalyzing(true);
    setError(null);

    try {
      const res = await api.analyzeSocial(plat, cont.trim(), profile);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'SocialShield analysis failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (prefillPayload?.content) {
      setContent(prefillPayload.content);
      if (prefillPayload.platform) setPlatform(prefillPayload.platform);
      if (prefillPayload.sender_profile) setSenderProfile(prefillPayload.sender_profile);
      executeScan(
        prefillPayload.platform || platform,
        prefillPayload.content,
        prefillPayload.sender_profile || senderProfile
      );
    }
  }, [prefillPayload]);

  const runAnalysis = () => {
    executeScan(platform, content, senderProfile);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-4">
      <div>
        <div className="flex items-center space-x-2 text-pink-400 text-xs font-mono mb-2">
          <Share2 className="w-4 h-4" />
          <span>{t('social_header_tag')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          {t('social_header_title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
          {t('social_header_desc')}
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-cyber-border space-y-6">
        {/* Platform Tabs */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            {t('social_select_platform')}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`py-2.5 px-3 rounded-xl border flex items-center justify-center space-x-2 text-xs font-bold transition-all ${
                  platform === p.id
                    ? 'bg-cyber-800 border-blue-500 text-white shadow-md'
                    : 'bg-cyber-900 border-cyber-border text-slate-400 hover:text-white'
                }`}
              >
                {p.icon}
                <span>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sender Profile / Handle */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            {t('social_sender_profile')}
          </label>
          <input
            type="text"
            value={senderProfile}
            onChange={(e) => setSenderProfile(e.target.value)}
            placeholder="e.g. @giveaway_winner_apple_2026 or +91 98110 XXXXX"
            className="w-full bg-cyber-900 border border-cyber-border rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-pink-500"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            {t('social_content_label')}
          </label>
          <textarea
            rows={5}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste text from the social media chat or post..."
            className="w-full bg-cyber-900 border border-cyber-border rounded-xl p-4 text-sm text-slate-200 focus:outline-none focus:border-pink-500 leading-relaxed font-sans"
          />
        </div>

        <button
          onClick={runAnalysis}
          disabled={isAnalyzing}
          className="w-full py-3.5 rounded-xl bg-pink-600 hover:bg-pink-700 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-pink-500/25 transition-all flex items-center justify-center space-x-2"
        >
          {isAnalyzing ? (
            <>
              <Activity className="w-4 h-4 animate-spin" />
              <span>Analyzing Platform-Specific Social Engineering Signals...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{t('social_btn_scan')}</span>
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
