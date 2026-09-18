import React, { useState } from 'react';
import {
  Mic, Video, Link, MessageSquare, Image, Share2,
  CreditCard, AlertTriangle, ShieldCheck, ArrowRight,
  Sparkles, Shield, Lock, Zap, Award, CheckCircle2, TrendingUp,
  Radio, Volume2, Cpu
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LiveThreatTicker } from '../components/LiveThreatTicker';
import { InteractiveThreatSandbox } from '../components/InteractiveThreatSandbox';
import { LiveScamSimulator } from '../components/LiveScamSimulator';
import { IndiaThreatRadar } from '../components/IndiaThreatRadar';

interface HomePageProps {
  setActiveTab: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ setActiveTab }) => {
  const { language, t } = useLanguage();
  const [activeDefenseModule, setActiveDefenseModule] = useState<'simulator' | 'radar' | 'sandbox'>('simulator');

  const actions = [
    {
      id: 'voice',
      title: t('act_voice_title'),
      desc: t('act_voice_desc'),
      icon: <Mic className="w-6 h-6 text-blue-400" />,
      tag: 'AI Voice Shield',
      color: 'hover:border-blue-500/50'
    },
    {
      id: 'video',
      title: t('act_video_title'),
      desc: t('act_video_desc'),
      icon: <Video className="w-6 h-6 text-purple-400" />,
      tag: 'Multimodal Vision',
      color: 'hover:border-purple-500/50'
    },
    {
      id: 'link',
      title: t('act_link_title'),
      desc: t('act_link_desc'),
      icon: <Link className="w-6 h-6 text-cyan-400" />,
      tag: 'LinkShield',
      color: 'hover:border-cyan-500/50'
    },
    {
      id: 'message',
      title: t('act_msg_title'),
      desc: t('act_msg_desc'),
      icon: <MessageSquare className="w-6 h-6 text-emerald-400" />,
      tag: 'Scam Intent AI',
      color: 'hover:border-emerald-500/50'
    },
    {
      id: 'screenshot',
      title: t('act_screen_title'),
      desc: t('act_screen_desc'),
      icon: <Image className="w-6 h-6 text-indigo-400" />,
      tag: 'Vision OCR',
      color: 'hover:border-indigo-500/50'
    },
    {
      id: 'social',
      title: t('act_social_title'),
      desc: t('act_social_desc'),
      icon: <Share2 className="w-6 h-6 text-pink-400" />,
      tag: 'SocialShield',
      color: 'hover:border-pink-500/50'
    },
    {
      id: 'payment',
      title: t('act_pay_title'),
      desc: t('act_pay_desc'),
      icon: <CreditCard className="w-6 h-6 text-amber-400" />,
      tag: 'PaymentShield',
      color: 'hover:border-amber-500/50'
    },
    {
      id: 'emergency',
      title: t('act_emerg_title'),
      desc: t('act_emerg_desc'),
      icon: <AlertTriangle className="w-6 h-6 text-red-400" />,
      tag: '🚨 Priority Protocol',
      color: 'hover:border-red-500/50',
      highlight: true
    },
    {
      id: 'device_guard',
      title: language === 'HI' ? '🛡️ डिवाइस साइबर सुरक्षा' : '🛡️ Device Cyber Guard',
      desc: language === 'HI' ? 'AnyDesk स्क्रीन हाईजैक, फर्जी बैंक APKs और OTP चोरी से फोन व लैपटॉप की 24x7 सुरक्षा।' : 'Proactive real-time shield against screen hijacking (AnyDesk), rogue APKs, and live OTP theft.',
      icon: <Shield className="w-6 h-6 text-emerald-400" />,
      tag: 'Real-Time Protection',
      color: 'hover:border-emerald-500/50'
    },
    {
      id: 'academy',
      title: t('act_acad_title'),
      desc: t('act_acad_desc'),
      icon: <ShieldCheck className="w-6 h-6 text-teal-400" />,
      tag: 'Cyber Academy',
      color: 'hover:border-teal-500/50'
    }
  ];

  return (
    <div className="space-y-16 py-4">
      {/* Live Cyber Threat Telemetry Ticker across India */}
      <LiveThreatTicker onSelectAction={(tab) => setActiveTab(tab)} />

      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto px-4 pt-4">
        {/* Futuristic Trust Badges Ribbon */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-500/30 text-blue-300 text-[11px] font-mono font-bold">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>{t('hero_badge')}</span>
          </div>
          <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-[11px] font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>I4C & CERT-In Aligned</span>
          </div>
          <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-purple-950/50 border border-purple-500/30 text-purple-300 text-[11px] font-mono">
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span>SHA-256 Vault Custody</span>
          </div>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight mb-4">
          RakshaAI <span className="text-hologram">2.0</span>
        </h1>

        <p className="text-lg sm:text-2xl font-extrabold text-slate-200 mb-4 tracking-wide">
          {t('hero_motto')}
        </p>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed mb-8">
          {t('hero_desc')}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
          <button
            onClick={() => setActiveTab('voice')}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white font-extrabold text-sm shadow-xl shadow-blue-500/25 transition-all transform hover:-translate-y-0.5 flex items-center space-x-2 border border-blue-400/30"
          >
            <span>{t('btn_scan_media')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('emergency')}
            className="px-6 py-3.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 font-extrabold text-sm border border-red-500/40 transition-all flex items-center space-x-2 shadow-lg shadow-red-500/10"
          >
            <AlertTriangle className="w-4 h-4 text-red-400 animate-pulse" />
            <span>{t('btn_clicked_link')}</span>
          </button>
        </div>

        {/* Live Cyber Defense Counter Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
          <div className="glass-panel p-3.5 rounded-2xl border border-cyber-border text-center hover:border-cyan-500/40 transition-all">
            <span className="text-2xl sm:text-3xl font-black text-cyan-400 block font-mono">₹5.2 Cr+</span>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
              {language === 'HI' ? 'वित्तीय नुकसान से बचाव' : 'Fraud Loss Prevented'}
            </span>
          </div>
          <div className="glass-panel p-3.5 rounded-2xl border border-cyber-border text-center hover:border-blue-500/40 transition-all">
            <span className="text-2xl sm:text-3xl font-black text-blue-400 block font-mono">18,400+</span>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
              {language === 'HI' ? 'साइबर हमले रोके' : 'Attacks Neutralized'}
            </span>
          </div>
          <div className="glass-panel p-3.5 rounded-2xl border border-cyber-border text-center hover:border-emerald-500/40 transition-all">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 block font-mono">&lt; 1.2s</span>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
              {language === 'HI' ? 'AI रिस्पॉन्स लेटेंसी' : 'Real-Time Triage'}
            </span>
          </div>
          <div className="glass-panel p-3.5 rounded-2xl border border-cyber-border text-center hover:border-purple-500/40 transition-all">
            <span className="text-2xl sm:text-3xl font-black text-purple-400 block font-mono">99.4%</span>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
              {language === 'HI' ? 'फोरेंसिक सटीकता' : 'Detection Accuracy'}
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Cyber Defense & Simulation Deck */}
      <section className="max-w-6xl mx-auto px-4 space-y-4">
        {/* Module Switcher Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-cyber-900/90 border border-cyber-border max-w-2xl mx-auto">
          <button
            onClick={() => setActiveDefenseModule('simulator')}
            className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeDefenseModule === 'simulator'
                ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-lg shadow-red-500/25 border border-red-400/40'
                : 'text-slate-400 hover:text-white hover:bg-cyber-800'
            }`}
          >
            <Volume2 className="w-4 h-4" />
            <span>{language === 'HI' ? '🎙️ लाइव कॉल सिम्युलेटर' : '🎙️ Live Voice Attack'}</span>
          </button>

          <button
            onClick={() => setActiveDefenseModule('radar')}
            className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeDefenseModule === 'radar'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/25 border border-cyan-400/40'
                : 'text-slate-400 hover:text-white hover:bg-cyber-800'
            }`}
          >
            <Radio className="w-4 h-4" />
            <span>{language === 'HI' ? '🇮🇳 भारत थ्रेट रडार' : '🇮🇳 India Threat Radar'}</span>
          </button>

          <button
            onClick={() => setActiveDefenseModule('sandbox')}
            className={`flex-1 min-w-[170px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 ${
              activeDefenseModule === 'sandbox'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 border border-purple-400/40'
                : 'text-slate-400 hover:text-white hover:bg-cyber-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>{language === 'HI' ? '🔬 फोरेंसिक सैंडबॉक्स' : '🔬 Forensic Sandbox'}</span>
          </button>
        </div>

        {/* Dynamic Display of Selected Module */}
        {activeDefenseModule === 'simulator' && (
          <LiveScamSimulator onLaunchTool={(tab) => setActiveTab(tab)} />
        )}
        {activeDefenseModule === 'radar' && (
          <IndiaThreatRadar onSelectAction={(tab) => setActiveTab(tab)} />
        )}
        {activeDefenseModule === 'sandbox' && (
          <InteractiveThreatSandbox onLaunchTool={(tab) => setActiveTab(tab)} />
        )}
      </section>

      {/* Golden Differentiator Banner */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-cyber-800 via-cyber-700/50 to-cyber-800 border border-cyber-border shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono uppercase text-blue-400 font-bold tracking-wider">
                {t('golden_diff_tag')}
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-white">
                {t('golden_diff_title')}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t('golden_diff_desc')}
              </p>
            </div>
            <div className="flex items-center space-x-2 shrink-0">
              <span className="px-3 py-2 rounded-xl bg-cyber-900 text-emerald-400 text-xs font-bold border border-cyber-border">
                {t('full_response_badge')}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 9 Main Actions Grid */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-xl sm:text-2xl font-black text-white">{t('select_tool_title')}</h2>
          <p className="text-xs text-slate-400 mt-1">{t('select_tool_desc')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {actions.map((act) => (
            <div
              key={act.id}
              onClick={() => setActiveTab(act.id)}
              className={`glass-panel hud-card p-6 rounded-2xl border border-cyber-border cursor-pointer transition-all transform hover:-translate-y-1 ${act.color} ${
                act.highlight ? 'bg-red-950/20 border-red-500/40' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-cyber-800 border border-cyber-border">
                  {act.icon}
                </div>
                <span className="text-[10px] font-mono px-2.5 py-1 rounded bg-cyber-900 text-slate-300 border border-cyber-border font-bold">
                  {act.tag}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2">{act.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">{act.desc}</p>

              <div className="flex items-center text-xs font-semibold text-blue-400 hover:text-blue-300">
                <span>{t('launch_analyzer')}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Stepper */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h2 className="text-xl sm:text-2xl font-black text-white">{t('how_it_works_title')}</h2>
          <p className="text-xs text-slate-400 mt-1">
            UPLOAD / PASTE → ANALYZE → UNDERSTAND → STAY SAFE → SOLVE → REPORT
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { step: '01', title: t('step_01_title'), desc: t('step_01_desc') },
            { step: '02', title: t('step_02_title'), desc: t('step_02_desc') },
            { step: '03', title: t('step_03_title'), desc: t('step_03_desc') },
            { step: '04', title: t('step_04_title'), desc: t('step_04_desc') },
            { step: '05', title: t('step_05_title'), desc: t('step_05_desc') },
            { step: '06', title: t('step_06_title'), desc: t('step_06_desc') }
          ].map((st, i) => (
            <div key={i} className="glass-panel p-4 rounded-xl border border-cyber-border text-center">
              <span className="text-xs font-mono font-extrabold text-blue-400 block mb-1">{st.step}</span>
              <h4 className="text-xs font-bold text-white mb-1">{st.title}</h4>
              <p className="text-[11px] text-slate-400 leading-snug">{st.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
