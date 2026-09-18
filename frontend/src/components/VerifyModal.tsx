import React from 'react';
import { ShieldQuestion, X, CheckSquare, AlertCircle } from 'lucide-react';
import { VerificationGuide } from '../types';

interface VerifyModalProps {
  guide: VerificationGuide;
  isOpen: boolean;
  onClose: () => void;
}

export const VerifyModal: React.FC<VerifyModalProps> = ({ guide, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="glass-panel max-w-lg w-full rounded-2xl p-6 border border-blue-500/40 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-cyber-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center border border-blue-500/40">
            <ShieldQuestion className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-white">{guide.title}</h3>
        </div>

        {/* Critical Disclaimer */}
        <div className="p-3 bg-amber-950/40 border border-amber-500/30 rounded-xl my-4 flex items-start space-x-2 text-xs text-amber-200">
          <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <span><strong>CRITICAL NOTICE:</strong> {guide.disclaimer} Always demand independent verification before releasing funds.</span>
        </div>

        {/* Steps */}
        <div className="mb-5">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
            Safe Verification Checklist:
          </h4>
          <ul className="space-y-2">
            {guide.verification_steps.map((step, i) => (
              <li key={i} className="flex items-start text-xs text-slate-200 bg-cyber-900/60 p-2 rounded-lg border border-cyber-border">
                <CheckSquare className="w-4 h-4 mr-2 text-blue-400 shrink-0 mt-0.5" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Challenge questions */}
        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
            Independent Challenge Questions (Ask caller):
          </h4>
          <ul className="space-y-2">
            {guide.challenge_questions.map((q, i) => (
              <li key={i} className="text-xs text-blue-200 bg-blue-950/30 p-2.5 rounded-lg border border-blue-800/40 italic">
                "{q}"
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-lg shadow-blue-600/20"
        >
          Understood — I will verify independently
        </button>
      </div>
    </div>
  );
};
