import React from 'react';
import { ShieldCheck, XCircle, CheckCircle2 } from 'lucide-react';
import type { SafetyGuidance } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { localizeScanResult } from '../utils/scanLocalization';

interface SafetyChecklistProps {
  guidance: SafetyGuidance;
}

export const SafetyChecklist: React.FC<SafetyChecklistProps> = ({ guidance }) => {
  const { language, t } = useLanguage();
  const localized = localizeScanResult({ safety_guidance: guidance, risk_level: guidance.level.includes('Red') || guidance.level.includes('Emergency') ? 'CRITICAL' : guidance.level.includes('Orange') ? 'HIGH' : guidance.level.includes('Yellow') ? 'MODERATE' : 'LOW' } as any, language);
  const displayGuidance = localized.safety_guidance || guidance;

  return (
    <div className="glass-panel rounded-2xl p-6 border border-cyber-border mt-6">
      <div className="flex items-center space-x-2 mb-4">
        <ShieldCheck className="w-5 h-5 text-emerald-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          {t('safety_engine_title')}
        </h3>
      </div>

      <div className="p-3.5 rounded-xl bg-cyber-900/80 border border-cyber-border mb-5">
        <span className="text-xs font-bold text-slate-200 block">
          {displayGuidance.headline}
        </span>
        <span className="text-[11px] text-slate-400">
          {language === 'HI' ? 'स्थिति: ' : 'Status: '}<strong className="text-amber-400">{displayGuidance.level}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Do this now */}
        <div>
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            {t('safety_do_now')}
          </h4>
          <ul className="space-y-2.5">
            {displayGuidance.immediate_actions.map((act, i) => (
              <li key={i} className="flex items-start text-xs text-slate-300">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-950 text-emerald-400 text-[10px] font-bold mr-2 mt-0.5 shrink-0 border border-emerald-500/30">
                  ✓
                </span>
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* What NOT to do */}
        <div>
          <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3 flex items-center">
            <XCircle className="w-4 h-4 mr-1.5" />
            {t('safety_dont_do')}
          </h4>
          <ul className="space-y-2.5">
            {displayGuidance.avoid_actions.map((act, i) => (
              <li key={i} className="flex items-start text-xs text-slate-300">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-950 text-red-400 text-[10px] font-bold mr-2 mt-0.5 shrink-0 border border-red-500/30">
                  ✗
                </span>
                <span>{act}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
