import React from 'react';
import { Lightbulb, Clock, Calendar } from 'lucide-react';
import type { SolutionTimeline as SolutionTimelineType } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { localizeScanResult } from '../utils/scanLocalization';

interface SolutionTimelineProps {
  timeline: SolutionTimelineType;
}

export const SolutionTimeline: React.FC<SolutionTimelineProps> = ({ timeline }) => {
  const { language, t } = useLanguage();
  const localized = localizeScanResult({ solution_timeline: timeline } as any, language);
  const displayTimeline = localized.solution_timeline || timeline;

  const steps = [
    {
      title: t('sol_now'),
      subtitle: t('sol_now_sub'),
      color: 'border-red-500 text-red-400 bg-red-950/30',
      items: displayTimeline.now,
      icon: <Clock className="w-4 h-4 text-red-400" />
    },
    {
      title: t('sol_3h'),
      subtitle: t('sol_3h_sub'),
      color: 'border-amber-500 text-amber-400 bg-amber-950/30',
      items: displayTimeline.next_3h,
      icon: <Clock className="w-4 h-4 text-amber-400" />
    },
    {
      title: t('sol_24h'),
      subtitle: t('sol_24h_sub'),
      color: 'border-blue-500 text-blue-400 bg-blue-950/30',
      items: displayTimeline.next_24h,
      icon: <Calendar className="w-4 h-4 text-blue-400" />
    },
    {
      title: t('sol_7d'),
      subtitle: t('sol_7d_sub'),
      color: 'border-emerald-500 text-emerald-400 bg-emerald-950/30',
      items: displayTimeline.next_7d,
      icon: <Calendar className="w-4 h-4 text-emerald-400" />
    }
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-cyber-border mt-6">
      <div className="flex items-center space-x-2 mb-2">
        <Lightbulb className="w-5 h-5 text-amber-400" />
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          {t('solution_engine_title')}
        </h3>
      </div>
      <p className="text-xs text-slate-400 mb-6">
        {t('solution_engine_desc')}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {steps.map((step, idx) => (
          <div key={idx} className={`p-4 rounded-xl border ${step.color} flex flex-col justify-between`}>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                {step.icon}
                <h4 className="text-xs font-bold uppercase tracking-wider">{step.title}</h4>
              </div>
              <p className="text-[11px] text-slate-400 mb-3">{step.subtitle}</p>

              <ul className="space-y-2">
                {step.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="text-xs text-slate-300 flex items-start">
                    <span className="text-slate-500 mr-2 text-xs font-mono">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
