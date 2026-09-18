import React from 'react';
import { Lock, FileCheck, Hash, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { EvidenceRecord } from '../types';

interface EvidenceCardProps {
  evidence: EvidenceRecord;
  onViewReport?: () => void;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ evidence, onViewReport }) => {
  return (
    <div className="glass-panel rounded-xl p-5 border border-cyber-border hover:border-blue-500/40 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <span className="font-mono text-xs font-bold text-white block">{evidence.evidence_id}</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">{evidence.evidence_type.replace('_', ' ')}</span>
            </div>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/70 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 mr-1" /> SECURED
          </span>
        </div>

        <h4 className="text-sm font-semibold text-slate-100 mb-2">{evidence.title}</h4>
        {evidence.notes && <p className="text-xs text-slate-400 mb-3">{evidence.notes}</p>}

        {/* SHA-256 Hash */}
        <div className="bg-cyber-900/80 p-2.5 rounded-lg border border-cyber-border mb-3">
          <div className="flex items-center text-[10px] text-slate-400 font-mono mb-1">
            <Hash className="w-3 h-3 mr-1 text-blue-400" />
            <span>SHA-256 Cryptographic Fingerprint:</span>
          </div>
          <span className="text-[11px] font-mono text-blue-300 break-all select-all block">
            {evidence.sha256_hash}
          </span>
        </div>

        {/* Indicators */}
        {evidence.detected_indicators && evidence.detected_indicators.length > 0 && (
          <div className="mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Preserved Indicators:</span>
            <div className="flex flex-wrap gap-1">
              {evidence.detected_indicators.map((ind, i) => (
                <span key={i} className="text-[10px] px-2 py-0.5 bg-cyber-900 text-slate-300 rounded border border-cyber-border">
                  {typeof ind === 'string' ? ind : ind.indicator || JSON.stringify(ind)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-3 border-t border-cyber-border/70 flex items-center justify-between text-[10px] text-slate-400">
        <span>Model: {evidence.model_version}</span>
        <span>{new Date(evidence.created_at).toLocaleDateString()}</span>
      </div>
    </div>
  );
};
