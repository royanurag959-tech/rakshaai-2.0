import React, { useState, useEffect } from 'react';
import { Video, Upload, Activity, Sparkles, Layers, Eye, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { AnalysisResponse } from '../types';
import { RiskCard } from '../components/RiskCard';
import { SafetyChecklist } from '../components/SafetyChecklist';
import { SolutionTimeline } from '../components/SolutionTimeline';
import { useLanguage } from '../context/LanguageContext';

interface VideoAnalyzerProps {
  onPreserveEvidence?: (scanResult: AnalysisResponse) => void;
  onTriggerAlert?: (prefill: { template: string; message: string; riskLevel: string }) => void;
  prefillPayload?: any;
}

export const VideoAnalyzer: React.FC<VideoAnalyzerProps> = ({ onPreserveEvidence, onTriggerAlert, prefillPayload }) => {
  const { t, language } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [contextNotes, setContextNotes] = useState<string>(prefillPayload?.notes || '');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const executeVideoScan = async (uploadedFile: File | null, notes: string) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      let uploadFile = uploadedFile;
      if (!uploadFile) {
        const dummyBlob = new Blob(['sample-synthetic-video-data-rakshaai'], { type: 'video/mp4' });
        uploadFile = new File([dummyBlob], prefillPayload?.filename || 'deepfake_sample_video.mp4', { type: 'video/mp4' });
      }

      const res = await api.analyzeVideo(uploadFile, notes);
      setResult(res);
    } catch (err: any) {
      setError(err.message || 'Video analysis failed. Ensure backend is active.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (prefillPayload?.filename || prefillPayload?.notes) {
      const notes = prefillPayload.notes || contextNotes;
      setContextNotes(notes);
      executeVideoScan(file, notes);
    }
  }, [prefillPayload]);

  const runAnalysis = () => {
    executeVideoScan(file, contextNotes);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-4">
      <div>
        <div className="flex items-center space-x-2 text-purple-400 text-xs font-mono mb-2">
          <Video className="w-4 h-4" />
          <span>{t('video_header_tag')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          {t('video_header_title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
          {t('video_header_desc')}
        </p>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-cyber-border space-y-6">
        {/* Drag & Drop video upload */}
        <div className="border-2 border-dashed border-cyber-border rounded-2xl p-8 text-center hover:border-purple-500/50 transition-colors bg-cyber-900/40">
          <input
            type="file"
            id="video-upload"
            accept="video/*,.mp4,.mov,.webm"
            onChange={handleFileChange}
            className="hidden"
          />
          <label htmlFor="video-upload" className="cursor-pointer flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-3 border border-purple-500/30">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-white block">
              {file ? file.name : (prefillPayload?.filename || t('video_upload_prompt'))}
            </span>
            <span className="text-xs text-slate-400 mt-1">
              {t('video_upload_sub')}
            </span>
          </label>
        </div>

        {/* Video Pipeline steps preview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
          <div className="bg-cyber-900 p-2 rounded-lg border border-cyber-border">
            <Eye className="w-3.5 h-3.5 mx-auto text-purple-400 mb-1" />
            <span className="text-[11px] text-slate-300">{t('video_landmarks')}</span>
          </div>
          <div className="bg-cyber-900 p-2 rounded-lg border border-cyber-border">
            <Layers className="w-3.5 h-3.5 mx-auto text-blue-400 mb-1" />
            <span className="text-[11px] text-slate-300">{t('video_feathering')}</span>
          </div>
          <div className="bg-cyber-900 p-2 rounded-lg border border-cyber-border">
            <RefreshCw className="w-3.5 h-3.5 mx-auto text-emerald-400 mb-1" />
            <span className="text-[11px] text-slate-300">{t('video_cadence')}</span>
          </div>
          <div className="bg-cyber-900 p-2 rounded-lg border border-cyber-border">
            <Activity className="w-3.5 h-3.5 mx-auto text-pink-400 mb-1" />
            <span className="text-[11px] text-slate-300">{t('video_lip')}</span>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            {t('video_context_label')}
          </label>
          <input
            type="text"
            value={contextNotes}
            onChange={(e) => setContextNotes(e.target.value)}
            placeholder={t('video_context_placeholder')}
            className="w-full bg-cyber-900 border border-cyber-border rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Button */}
        <button
          onClick={runAnalysis}
          disabled={isAnalyzing}
          className="w-full py-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-purple-500/25 transition-all flex items-center justify-center space-x-2"
        >
          {isAnalyzing ? (
            <>
              <Activity className="w-4 h-4 animate-spin" />
              <span>{t('video_btn_scanning')}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{t('video_btn_scan')}</span>
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
