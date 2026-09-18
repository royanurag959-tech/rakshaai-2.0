import React, { useState, useEffect } from 'react';
import { Mic, Upload, Activity, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import type { AnalysisResponse } from '../types';
import { RiskCard } from '../components/RiskCard';
import { SafetyChecklist } from '../components/SafetyChecklist';
import { SolutionTimeline } from '../components/SolutionTimeline';
import { VerifyModal } from '../components/VerifyModal';
import { useLanguage } from '../context/LanguageContext';

interface VoiceAnalyzerProps {
  onPreserveEvidence?: (scanResult: AnalysisResponse) => void;
  onTriggerAlert?: (prefill: { template: string; message: string; riskLevel: string }) => void;
  prefillPayload?: any;
}

export const VoiceAnalyzer: React.FC<VoiceAnalyzerProps> = ({ onPreserveEvidence, onTriggerAlert, prefillPayload }) => {
  const { language, t } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [claimedIdentity, setClaimedIdentity] = useState<string>(prefillPayload?.claimed_identity || 'Family Member');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVerifyOpen, setIsVerifyOpen] = useState<boolean>(false);

  const identitiesEN = [
    'Family Member (Son/Daughter/Spouse/Parent)',
    'Friend / Colleague',
    'Boss / Company Executive',
    'Bank Employee / KYC Officer',
    'Police Officer / CBI / Customs',
    'Government Official',
    'Doctor / Hospital Emergency Staff',
    'Customer Support Agent',
    'Other / Unknown'
  ];

  const identitiesHI = [
    'परिवार का सदस्य (बेटा/बेटी/पति/पत्नी/माता-पिता)',
    'मित्र / सहकर्मी (दोस्त)',
    'बॉस / कंपनी का अधिकारी',
    'बैंक कर्मचारी / KYC अधिकारी',
    'पुलिस अधिकारी / CBI / कस्टम्स',
    'सरकारी अधिकारी',
    'डॉक्टर / अस्पताल इमरजेंसी स्टाफ',
    'कस्टमर केयर सपोर्ट एजेंट',
    'अन्य / अपरिचित'
  ];

  const identities = language === 'HI' ? identitiesHI : identitiesEN;

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const executeVoiceScan = async (uploadedFile: File | null, identity: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      let targetFile = uploadedFile;
      if (!targetFile) {
        const dummyBlob = new Blob(['sample-synthetic-audio-data-rakshaai'], { type: 'audio/wav' });
        targetFile = new File([dummyBlob], prefillPayload?.filename || 'urgent_son_accident_call.wav', { type: 'audio/wav' });
      }

      const res = await api.analyzeAudio(targetFile, identity);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Analysis encountered an error. Ensure backend is running.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (prefillPayload?.claimed_identity || prefillPayload?.filename) {
      const id = prefillPayload.claimed_identity || claimedIdentity;
      setClaimedIdentity(id);
      executeVoiceScan(file, id);
    }
  }, [prefillPayload]);

  const runAnalysis = () => {
    executeVoiceScan(file, claimedIdentity);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-4">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-blue-400 text-xs font-mono mb-2">
          <Mic className="w-4 h-4" />
          <span>{t('voice_header_tag')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          {t('voice_header_title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
          {t('voice_header_desc')}
        </p>
      </div>

      {/* Input Form */}
      <div className="glass-panel p-6 rounded-2xl border border-cyber-border space-y-6">
        {/* Claimed Identity Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            {t('voice_who_claims')}
          </label>
          <select
            value={claimedIdentity}
            onChange={(e) => setClaimedIdentity(e.target.value)}
            className="w-full bg-cyber-900 border border-cyber-border rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-blue-500"
          >
            {identities.map((id, idx) => (
              <option key={idx} value={id}>{id}</option>
            ))}
          </select>
        </div>

        {/* Audio File Upload Box */}
        <div className="border-2 border-dashed border-cyber-border rounded-2xl p-8 text-center hover:border-blue-500/50 transition-colors bg-cyber-900/40">
          <input
            type="file"
            id="audio-upload"
            accept="audio/*,video/mp4,video/*,.mp4,.m4a,.opus,.ogg,.mp3,.wav,.aac,.amr,.webm,.flac,.wma,.3gp"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="audio-upload" className="cursor-pointer flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-3 border border-blue-500/30">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-white block">
              {file ? file.name : (prefillPayload?.filename || t('voice_upload_prompt'))}
            </span>
            <span className="text-xs text-slate-400 mt-1">
              {t('voice_upload_sub')}
            </span>
            {file && (
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-blue-600/30 text-blue-300 border border-blue-500/40">
                ✓ {file.name.split('.').pop()?.toUpperCase()} Voice Container Ready ({(file.size / 1024).toFixed(1)} KB)
              </span>
            )}
          </label>

          {file && previewUrl && (
            <div className="mt-4 pt-3 border-t border-cyber-border/60 max-w-md mx-auto">
              <span className="text-[11px] text-slate-400 block mb-1">
                {language === 'HI' ? '▶️ वॉयस नोट सुनें (Playback):' : '▶️ Listen to Voice Note:'}
              </span>
              <audio controls src={previewUrl} className="w-full h-8 rounded-lg" />
            </div>
          )}
        </div>

        {/* Simulated Spectral Visualizer */}
        <div className="p-4 rounded-xl bg-cyber-900/80 border border-cyber-border">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span className="flex items-center">
              <Activity className="w-3.5 h-3.5 mr-1 text-blue-400" />
              {language === 'HI' ? 'हार्मोनिक स्पेक्ट्रम व VAD इंजन:' : 'Harmonic Spectrum & VAD Engine:'}
            </span>
            <span>22.05 kHz | 16-bit PCM</span>
          </div>
          <div className="flex items-end justify-between h-10 gap-1 px-1">
            {[40, 65, 85, 30, 95, 70, 45, 90, 60, 35, 80, 50, 90, 75, 40, 85, 95, 60, 30, 70, 80, 55, 90].map((h, i) => (
              <div
                key={i}
                style={{ height: `${isAnalyzing ? Math.random() * 100 : h}%` }}
                className={`w-full rounded-t transition-all duration-150 ${
                  isAnalyzing ? 'bg-blue-400 animate-pulse' : 'bg-blue-600/40'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Trigger Button */}
        <button
          onClick={runAnalysis}
          disabled={isAnalyzing}
          className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-blue-500/25 transition-all flex items-center justify-center space-x-2"
        >
          {isAnalyzing ? (
            <>
              <Activity className="w-4 h-4 animate-spin" />
              <span>{t('voice_btn_scanning')}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{t('voice_btn_scan')}</span>
            </>
          )}
        </button>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-300">
            {error}
          </div>
        )}
      </div>

      {/* Results Section */}
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
