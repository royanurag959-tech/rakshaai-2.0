import React from 'react';
import { Shield, PhoneCall, Globe, AlertCircle, Heart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const Footer: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <footer className="bg-cyber-900 border-t border-cyber-border mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-lg text-white">RakshaAI 2.0</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {t('footer_tagline')}
            </p>
            <div className="pt-2">
              <span className="inline-block px-2.5 py-1 rounded bg-blue-950/60 text-blue-300 border border-blue-800/40 text-[11px] font-semibold">
                {t('footer_privacy_badge')}
              </span>
            </div>
          </div>

          {/* Col 2: Core Philosophy */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">{t('footer_flow_title')}</h4>
            <ul className="text-xs text-slate-400 space-y-1.5 font-mono">
              <li>1. {language === 'HI' ? 'इनपुट' : 'INPUT'} → 2. {language === 'HI' ? 'पहचान' : 'DETECT'}</li>
              <li>3. {language === 'HI' ? 'विश्लेषण' : 'ANALYZE'} → 4. {language === 'HI' ? 'व्याख्या' : 'EXPLAIN'}</li>
              <li>5. {language === 'HI' ? 'जोखिम' : 'RISK'} → 6. {language === 'HI' ? 'सुरक्षा नियम' : 'SAFETY'}</li>
              <li>7. {language === 'HI' ? 'समाधान' : 'SOLUTION'} → 8. {language === 'HI' ? 'सत्यापन' : 'VERIFY'}</li>
              <li>9. {language === 'HI' ? 'साक्ष्य' : 'EVIDENCE'} → 10. {language === 'HI' ? 'रिपोर्ट' : 'REPORT'}</li>
            </ul>
          </div>

          {/* Col 3: Official Indian Cyber Helplines */}
          <div>
            <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3 flex items-center">
              <PhoneCall className="w-3.5 h-3.5 mr-1" />
              {t('footer_helpline_title')}
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 rounded-lg bg-red-950/30 border border-red-900/40">
                <span className="text-slate-300 block">{t('footer_cyber_fraud')}</span>
                <a href="tel:1930" className="text-base font-extrabold text-white hover:text-red-300 flex items-center">
                  📞 1930 {language === 'HI' ? '(टोल-फ्री)' : '(Toll Free)'}
                </a>
              </div>
              <div className="p-2.5 rounded-lg bg-cyber-800 border border-cyber-border">
                <span className="text-slate-400 block">{t('footer_portal_label')}</span>
                <a href="https://cybercrime.gov.in" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline font-mono">
                  cybercrime.gov.in
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Platform Security & Privacy */}
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">{t('footer_sec_title')}</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              {t('footer_sec_desc')}
            </p>
            <div className="text-[11px] text-slate-500">
              {language === 'HI' ? 'समर्थित भाषाएँ: ' : 'Languages supported: '}<strong>English | हिंदी</strong>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 rounded-xl bg-cyber-800/60 border border-cyber-border/80 text-[11px] text-slate-400 leading-relaxed mb-6">
          <div className="flex items-center space-x-1.5 text-amber-400 font-bold mb-1">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{t('footer_disclaimer_title')}</span>
          </div>
          {t('footer_disclaimer_text')}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 pt-4 border-t border-cyber-border">
          <span>{t('footer_copyright')}</span>
          <span className="mt-2 sm:mt-0 flex items-center">
            {t('footer_built_for')}
          </span>
        </div>
      </div>
    </footer>
  );
};
