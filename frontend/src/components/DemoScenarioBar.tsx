import React from 'react';
import { Sparkles, Play } from 'lucide-react';
import { DEMO_SCENARIOS, DemoScenario } from '../services/mockScenarios';
import { useLanguage } from '../context/LanguageContext';

interface DemoScenarioBarProps {
  onSelectScenario: (scenario: DemoScenario) => void;
}

const scenarioHindiTitles: Record<string, string> = {
  'demo-voice': 'डेमो 1 — AI वॉयस कॉल स्कैम',
  'demo-video': 'डेमो 2 — डीपफेक वीडियो जांच',
  'demo-whatsapp': 'डेमो 3 — व्हाट्सएप पैसे की मांग',
  'demo-instagram': 'डेमो 4 — इंस्टाग्राम फर्जी गिफ्ट',
  'demo-telegram': 'डेमो 5 — टेलीग्राम क्रिप्टो फ्रॉड',
  'demo-link': 'डेमो 6 — फर्जी SBI लिंक',
  'demo-emergency': 'डेमो 7 — लिंक क्लिक आपातकाल',
  'demo-financial': 'डेमो 8 — ₹20,000 वित्तीय धोखाधड़ी',
  'demo-offline': 'डेमो 9 — ऑफ़लाइन सुरक्षा मोड'
};

export const DemoScenarioBar: React.FC<DemoScenarioBarProps> = ({ onSelectScenario }) => {
  const { language, t } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-blue-950/90 via-cyber-800/90 to-indigo-950/90 border-y border-blue-500/30 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center space-x-2 shrink-0">
          <div className="p-1.5 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/40">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-extrabold text-white block">{t('demo_title')}</span>
            <span className="text-[10px] text-blue-300">{t('demo_subtitle')}</span>
          </div>
        </div>

        {/* Scrollable scenario buttons */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {DEMO_SCENARIOS.map((scen) => {
            const displayTitle = language === 'HI' && scenarioHindiTitles[scen.id]
              ? scenarioHindiTitles[scen.id].split('—')[1]?.trim() || scenarioHindiTitles[scen.id]
              : scen.title.split('—')[1]?.trim() || scen.title;

            return (
              <button
                key={scen.id}
                onClick={() => onSelectScenario(scen)}
                className="px-3 py-1.5 rounded-lg bg-cyber-900/90 hover:bg-blue-600/30 text-slate-200 hover:text-white border border-cyber-border hover:border-blue-400/50 text-xs font-semibold whitespace-nowrap transition-all shadow-sm flex items-center space-x-1.5 shrink-0"
                title={scen.description}
              >
                <Play className="w-2.5 h-2.5 text-blue-400" />
                <span>{displayTitle}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
