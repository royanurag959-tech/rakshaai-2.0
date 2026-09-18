import React, { useState } from 'react';
import { Mic, Link as LinkIcon, CreditCard, ShieldCheck, AlertTriangle, Play, Pause, Activity, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface InteractiveThreatSandboxProps {
  onLaunchTool?: (tab: string) => void;
}

export const InteractiveThreatSandbox: React.FC<InteractiveThreatSandboxProps> = ({ onLaunchTool }) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'voice' | 'link' | 'payment'>('voice');
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [voiceSampleType, setVoiceSampleType] = useState<'cloned' | 'real'>('cloned');

  return (
    <div className="glass-panel hud-card p-6 sm:p-8 rounded-3xl border border-cyan-500/30 relative overflow-hidden bg-gradient-to-b from-cyber-900/90 via-cyber-800/80 to-cyber-900/90">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-cyber-border">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold mb-2">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>{language === 'HI' ? 'लाइव फोरेंसिक लैब और साइबर सैंडबॉक्स' : 'LIVE FORENSIC LAB & CYBER SANDBOX'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center">
            <span className="text-hologram mr-2">
              {language === 'HI' ? 'अत्याधुनिक AI साइबर रक्षा सिमुलेटर' : 'Next-Gen AI Cyber Threat Dissector'}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'HI' 
              ? 'देखें कि रक्षाAI 2.0 सेकंडों में AI वॉयस क्लोनिंग, फर्जी बैंकिंग डोमेन और QR जाल को कैसे बेनकाब करता है।'
              : 'See how RakshaAI 2.0 dissects AI voice clones, lookalike banking domains, and reverse-QR traps in real-time.'}
          </p>
        </div>

        {/* Sandbox Tabs */}
        <div className="flex items-center p-1 bg-cyber-950/80 rounded-xl border border-cyber-border shrink-0 self-start md:self-auto">
          <button
            onClick={() => setActiveTab('voice')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'voice'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{language === 'HI' ? 'वॉयस क्लोन' : 'AI Voice Clone'}</span>
          </button>
          <button
            onClick={() => setActiveTab('link')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'link'
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>{language === 'HI' ? 'डोमेन नकल' : 'Phishing Domain'}</span>
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'payment'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{language === 'HI' ? 'रिवर्स-QR' : 'Reverse-QR Trap'}</span>
          </button>
        </div>
      </div>

      {/* Tab 1: AI Voice Clone Dissection */}
      {activeTab === 'voice' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 flex items-center">
                <Activity className="w-3.5 h-3.5 mr-1 text-blue-400" />
                {language === 'HI' ? 'स्पेक्ट्रोप्रोग्राम व फोनेटिक विश्लेषण:' : 'Spectrogram & Phonetic Cadence:'}
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setVoiceSampleType('cloned')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-all ${
                    voiceSampleType === 'cloned'
                      ? 'bg-red-950/80 border-red-500 text-red-300'
                      : 'bg-cyber-900 border-cyber-border text-slate-400 hover:text-white'
                  }`}
                >
                  {language === 'HI' ? '🚨 क्लोन किया गया नमूना' : '🚨 AI Cloned Sample'}
                </button>
                <button
                  onClick={() => setVoiceSampleType('real')}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-all ${
                    voiceSampleType === 'real'
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                      : 'bg-cyber-900 border-cyber-border text-slate-400 hover:text-white'
                  }`}
                >
                  {language === 'HI' ? '🟢 असली मानव वॉयस' : '🟢 Real Human Voice'}
                </button>
              </div>
            </div>

            {/* Interactive Animated Waveform HUD */}
            <div className="p-5 rounded-2xl bg-cyber-950 border border-cyber-border relative overflow-hidden">
              <div className="flex items-end justify-between h-24 gap-1 px-2">
                {Array.from({ length: 32 }).map((_, i) => {
                  const isCutoff = voiceSampleType === 'cloned' && i > 20;
                  const height = isCutoff 
                    ? 8 
                    : voiceSampleType === 'cloned' 
                      ? (Math.sin(i * 0.8) * 35 + 50) 
                      : (Math.sin(i * 0.5) * 45 + 50 + (i % 3) * 10);

                  return (
                    <div
                      key={i}
                      style={{ height: `${height}%` }}
                      className={`w-full rounded-t transition-all duration-300 ${
                        isCutoff
                          ? 'bg-red-500/30'
                          : voiceSampleType === 'cloned'
                            ? 'bg-gradient-to-t from-red-600 to-amber-400'
                            : 'bg-gradient-to-t from-emerald-600 to-cyan-400'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Spectral Anomaly Indicator Overlay */}
              {voiceSampleType === 'cloned' && (
                <div className="absolute top-2 right-4 px-2 py-1 rounded bg-red-950/90 border border-red-500/60 text-red-300 text-[10px] font-mono flex items-center shadow-lg">
                  <AlertTriangle className="w-3 h-3 mr-1 text-red-400 animate-pulse" />
                  <span>8kHz HiFi-GAN Vocoder Cutoff Detected</span>
                </div>
              )}
            </div>

            {/* Explanation Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-cyber-900/60 border border-cyber-border">
                <span className="text-slate-400 block text-[11px]">
                  {language === 'HI' ? 'माइक्रो-जिटर व पिच निरंतरता:' : 'Micro-Jitter & Pitch Variance:'}
                </span>
                <strong className={`font-mono text-sm block mt-0.5 ${voiceSampleType === 'cloned' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {voiceSampleType === 'cloned' ? '0.04% (अस्वाभाविक रूप से सपाट/Flat)' : '1.82% (प्राकृतिक मानव कंपन/Organic)'}
                </strong>
              </div>
              <div className="p-3 rounded-xl bg-cyber-900/60 border border-cyber-border">
                <span className="text-slate-400 block text-[11px]">
                  {language === 'HI' ? 'श्वसन विराम व फोनेटिक अंतराल:' : 'Breathing Pauses & Glottal Pulse:'}
                </span>
                <strong className={`font-mono text-sm block mt-0.5 ${voiceSampleType === 'cloned' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {voiceSampleType === 'cloned' ? 'अनुपस्थित (AI संश्लेषित निर्बाध ऑडियो)' : 'प्राकृतिक जैविक विराम मौजूद'}
                </strong>
              </div>
            </div>
          </div>

          {/* Right Verdict Box */}
          <div className="glass-panel p-5 rounded-2xl border border-cyber-border flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                {language === 'HI' ? 'रक्षाAI फोरेंसिक परिणाम' : 'RakshaAI Forensic Verdict'}
              </span>
              <div className={`p-3 rounded-xl border mb-4 ${
                voiceSampleType === 'cloned' ? 'bg-red-950/50 border-red-500/50' : 'bg-emerald-950/50 border-emerald-500/50'
              }`}>
                <span className={`text-xs font-bold block ${voiceSampleType === 'cloned' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {voiceSampleType === 'cloned' ? '🚨 88.4% AI SYNTHETIC VOICE CLONE' : '🟢 18.2% AUTHENTIC HUMAN VOICE'}
                </span>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                  {voiceSampleType === 'cloned'
                    ? (language === 'HI' 
                        ? 'ध्वनि में ऑटोट्यून और न्यूरल वोकोडर के स्पष्ट लक्षण पाए गए हैं। तुरंत सतर्क रहें!' 
                        : 'Neural vocoder cutoff and synthetic pitch contour confirmed. Highly deceptive caller.')
                    : (language === 'HI'
                        ? 'आवाज में सामान्य मानवीय सांस और प्राकृतिक पिच कंपन मौजूद है।'
                        : 'Acoustic waveform shows natural biological resonance and organic cadence.')}
                </p>
              </div>
            </div>

            <button
              onClick={() => onLaunchTool && onLaunchTool('voice')}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center space-x-1.5"
            >
              <span>{language === 'HI' ? 'वॉयस एनालाइज़र खोलें' : 'Launch Voice Shield'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Phishing Domain Unmasker */}
      {activeTab === 'link' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          <div className="lg:col-span-2 space-y-4">
            <div className="p-4 rounded-2xl bg-cyber-950 border border-cyber-border space-y-3">
              <span className="text-[11px] font-mono text-slate-400 block">
                {language === 'HI' ? 'असली बैंक लिंक बनाम नकली फिशिंग डोमेन का मिलान:' : 'Authentic vs. Spoofed Brand Domain Comparison:'}
              </span>

              {/* Legit Link */}
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/40 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-mono text-xs text-emerald-300">https://www.onlinesbi.sbi/login</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 font-bold">
                  {language === 'HI' ? 'अधिकृत डोमेन (.sbi)' : 'AUTHENTIC BANK'}
                </span>
              </div>

              {/* Fake Phishing Link */}
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 animate-pulse" />
                  <span className="font-mono text-xs text-red-300">
                    http://<strong className="text-white underline">sbi-online-kyc-secure</strong>.<span className="text-amber-400 font-black">top</span>/login
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-900/80 text-red-300 border border-red-500/40 font-bold self-start sm:self-auto">
                  🚨 {language === 'HI' ? 'फर्जी डोमेन (.top)' : 'SPOOFED TLD (.top)'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-cyber-900/60 border border-cyber-border">
                <span className="text-slate-400 block text-[10px]">1. TYPOSQUATTING</span>
                <span className="text-amber-300 font-bold mt-0.5 block">Brand Spoofing</span>
                <span className="text-[11px] text-slate-400">असली SBI डोमेन के नाम की अनधिकृत नकल।</span>
              </div>
              <div className="p-3 rounded-xl bg-cyber-900/60 border border-cyber-border">
                <span className="text-slate-400 block text-[10px]">2. HIGH-ABUSE TLD</span>
                <span className="text-red-400 font-bold mt-0.5 block">.top / .xyz / .click</span>
                <span className="text-[11px] text-slate-400">अपराधियों द्वारा प्रयुक्त सस्ते अपंजीकृत एक्सटेंशन।</span>
              </div>
              <div className="p-3 rounded-xl bg-cyber-900/60 border border-cyber-border">
                <span className="text-slate-400 block text-[10px]">3. CREDENTIAL THEFT</span>
                <span className="text-red-400 font-bold mt-0.5 block">KYC Form Trap</span>
                <span className="text-[11px] text-slate-400">लॉगिन पासवर्ड व OTP चुराने का जाल।</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-cyber-border flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                {language === 'HI' ? 'LinkShield सुरक्षा स्थिति' : 'LinkShield Assessment'}
              </span>
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 mb-4">
                <span className="text-xs font-bold text-red-400 block">
                  🚨 CRITICAL PHISHING RISK (94.0%)
                </span>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                  {language === 'HI'
                    ? 'लिंक को बिना खोले सुरक्षित जांचा गया। क्रेडेंशियल चोरी का खतरा 94%!'
                    : 'Inspected headlessly without browser opening. High probability of credential harvest.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onLaunchTool && onLaunchTool('link')}
              className="w-full py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center space-x-1.5"
            >
              <span>{language === 'HI' ? 'लिंक स्कैनर खोलें' : 'Launch LinkShield'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: Reverse-QR Attack Simulator */}
      {activeTab === 'payment' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
          <div className="lg:col-span-2 space-y-4">
            <div className="p-5 rounded-2xl bg-amber-950/30 border border-amber-500/40 relative">
              <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span>{language === 'HI' ? 'सुनहरा UPI नियम (THE GOLDEN RULE):' : 'THE GOLDEN UPI RULE:'}</span>
              </div>
              <p className="text-sm font-black text-white leading-relaxed">
                {language === 'HI'
                  ? 'पैसे प्राप्त करने के लिए कभी भी UPI पिन (PIN) नहीं डाला जाता! पिन डालने से हमेशा आपके बैंक खाते से पैसे कटते हैं।'
                  : 'You NEVER enter your UPI PIN to receive money! Entering a PIN ALWAYS transfers money OUT of your bank account.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-cyber-950 border border-emerald-500/40">
                <span className="text-[10px] font-mono text-emerald-400 font-bold block mb-1">
                  ✓ {language === 'HI' ? 'असली पेमेंट (व्यापारी को भुगतान)' : 'LEGITIMATE PAYMENT'}
                </span>
                <p className="text-xs text-slate-300 leading-snug">
                  आप सामान खरीदते हैं ➡️ QR स्कैन करते हैं ➡️ पिन डालते हैं ➡️ पैसे आपके खाते से निकलते हैं।
                </p>
              </div>

              <div className="p-4 rounded-xl bg-cyber-950 border border-red-500/50">
                <span className="text-[10px] font-mono text-red-400 font-bold block mb-1">
                  ✗ {language === 'HI' ? 'धोखाधड़ी (रिवर्स-QR ट्रैप)' : 'FRAUDULENT REVERSE-QR TRAP'}
                </span>
                <p className="text-xs text-slate-300 leading-snug">
                  धोखेबाज़ कहता है "पैसे पाने के लिए QR स्कैन कर पिन डालो" ➡️ पिन डालते ही आपके खाते से पैसे कट जाते हैं!
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-cyber-border flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                {language === 'HI' ? 'PaymentShield सुरक्षा स्थिति' : 'PaymentShield Verdict'}
              </span>
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/50 mb-4">
                <span className="text-xs font-bold text-red-400 block">
                  🚨 REVERSE-QR SCAM PREVENTED
                </span>
                <p className="text-[11px] text-slate-300 mt-1 leading-snug">
                  {language === 'HI'
                    ? 'धोखाधड़ी वाली कलेक्ट रिक्वेस्ट पहचानी गई। पिन दर्ज करने से तुरंत रोकें।'
                    : 'Deceptive collect request identified before transaction authorization.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onLaunchTool && onLaunchTool('payment')}
              className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center space-x-1.5"
            >
              <span>{language === 'HI' ? 'पेमेंट सुरक्षा खोलें' : 'Launch PaymentShield'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
