import React, { useState, useEffect, useRef } from 'react';
import {
  PhoneCall, PhoneOff, Volume2, ShieldAlert, Sparkles,
  AlertOctagon, CheckCircle, RefreshCw, Zap, ArrowRight, Activity
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LiveScamSimulatorProps {
  onLaunchTool: (tab: string) => void;
}

interface ScamScenario {
  id: string;
  titleEn: string;
  titleHi: string;
  badge: string;
  badgeColor: string;
  caller: string;
  voiceTextEn: string;
  voiceTextHi: string;
  highlightWords: string[];
  threatType: string;
  riskScore: number;
  confidence: number;
  signals: { nameEn: string; nameHi: string; val: string }[];
  targetTool: string;
}

const SCENARIOS: ScamScenario[] = [
  {
    id: 'digital_arrest',
    titleEn: 'CBI "Digital Arrest" Coercion Call',
    titleHi: 'CBI "डिजिटल अरेस्ट" धमकी भरी कॉल',
    badge: 'CRITICAL THREAT',
    badgeColor: 'text-red-400 bg-red-950/60 border-red-500/50',
    caller: '+91 98765-XXXXX (Spoofed: Delhi Police / CBI)',
    voiceTextEn: 'This is Inspector Sharma from Cyber Crime Investigation Headquarters. An illegal parcel containing contraband narcotics and fake biometric passports has been intercepted under your Aadhaar number. A non-bailable arrest warrant has been issued. Do not disconnect this call or local police patrol will reach your registered home address within fifteen minutes.',
    voiceTextHi: 'यह साइबर क्राइम मुख्यालय से इंस्पेक्टर शर्मा हैं। आपके आधार नंबर पर प्रतिबंधित नशीले पदार्थों और जाली पासपोर्ट वाला पार्सल पकड़ा गया है। आपके खिलाफ गैर-जमानती अरेस्ट वारंट जारी हो चुका है। इस कॉल को बिल्कुल मत काटिए अन्यथा स्थानीय पुलिस पेट्रोल पंद्रह मिनट में आपके घर पहुंचेगी।',
    highlightWords: ['Aadhaar', 'narcotics', 'arrest warrant', 'Do not disconnect', 'fifteen minutes', 'पुलिस', 'वारंट', 'कॉल मत काटिए', 'आधार'],
    threatType: 'Psychological Coercion & Fake Law Enforcement',
    riskScore: 98,
    confidence: 99,
    signals: [
      { nameEn: 'Authority Impersonation Index', nameHi: 'फर्जी अधिकारी पहचान सूचकांक', val: '99%' },
      { nameEn: 'Psychological Coercion Pressure', nameHi: 'मानसिक दबाव व घबराहट इंडेक्स', val: '96%' },
      { nameEn: 'Spoofed Caller ID Probability', nameHi: 'फर्जी कॉलर आईडी संभावना', val: '94%' },
      { nameEn: 'Digital Arrest Illegality Match', nameHi: 'डिजिटल अरेस्ट कानूनन अवैध मैच', val: '100%' },
    ],
    targetTool: 'message'
  },
  {
    id: 'voice_clone',
    titleEn: 'AI Voice-Cloned Child Kidnap Call',
    titleHi: 'AI क्लोन आवाज: बच्चे के अपहरण का झांसा',
    badge: 'HIGH DEEPFAKE RISK',
    badgeColor: 'text-purple-400 bg-purple-950/60 border-purple-500/50',
    caller: '+91 88102-XXXXX (Voice Mimicry Engine)',
    voiceTextEn: 'Papa, please help me! My phone battery died and our car had a terrible collision near the bypass. The local police have detained me and the victim is demanding immediate compensation. Please transfer fifty thousand rupees immediately to this UPI number or they will lock me up!',
    voiceTextHi: 'पापा, प्लीज मेरी मदद करो! मेरे फोन की बैटरी खत्म हो गई थी और बाईपास के पास कार का भयानक एक्सीडेंट हो गया। पुलिस ने मुझे पकड़ लिया है। प्लीज तुरंत इस UPI नंबर पर पचास हजार रुपये ट्रांसफर कर दो वरना वे मुझे जेल भेज देंगे!',
    highlightWords: ['Papa', 'terrible collision', 'fifty thousand', 'UPI number', 'lock me up', 'पापा', 'एक्सीडेंट', 'पचास हजार', 'UPI', 'जेल'],
    threatType: 'Neural Vocoder Voice Clone + Urgent Ransom Trap',
    riskScore: 96,
    confidence: 97,
    signals: [
      { nameEn: 'Vocoder 8kHz Spectral Cutoff', nameHi: '8kHz न्यूरल वोकोडर कटऑफ', val: '97%' },
      { nameEn: 'Pitch Micro-Jitter Deficiency', nameHi: 'प्राकृतिक वोकल कम्पन का अभाव', val: '93%' },
      { nameEn: 'Emergency Urgency Exploitation', nameHi: 'आपातकालीन घबराहट दोहन', val: '98%' },
      { nameEn: 'Direct UPI Coercion Match', nameHi: 'तात्कालिक UPI मांग पैटर्न', val: '95%' },
    ],
    targetTool: 'voice'
  },
  {
    id: 'power_cut',
    titleEn: 'Midnight Electricity Disconnection Threat',
    titleHi: 'बिजली कनेक्शन कटने की फर्जी धमकी',
    badge: 'FINANCIAL PHISHING',
    badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-500/50',
    caller: 'VK-POWER-ALERT (Bulk SMS Harvester)',
    voiceTextEn: 'Dear electricity consumer, your power connection will be permanently disconnected tonight at nine-thirty PM because your previous payment was not updated in the state electricity portal. Immediately call our power officer or install the official verification APK to avoid blackout.',
    voiceTextHi: 'प्रिय उपभोक्ता, आपकी बिजली का कनेक्शन आज रात साढ़े नौ बजे स्थायी रूप से काट दिया जाएगा क्योंकि पिछले माह का बिल पोर्टल में अपडेट नहीं है। तुरंत बिजली अधिकारी को कॉल करें या ब्लैकआउट से बचने के लिए वेरिफिकेशन APK डाउनलोड करें।',
    highlightWords: ['disconnected tonight', 'nine-thirty PM', 'power officer', 'verification APK', 'बिजली कनेक्शन', 'रात साढ़े नौ', 'APK', 'काट दिया जाएगा'],
    threatType: 'Utility Disconnection Phishing & Malicious APK Trap',
    riskScore: 91,
    confidence: 95,
    signals: [
      { nameEn: 'Scam Countdown Urgency Index', nameHi: 'नकली उलटी गिनती/डेडलाइन दबाव', val: '95%' },
      { nameEn: 'Malicious APK Weaponization', nameHi: 'खतरनाक APK डाउनलोड मांग', val: '99%' },
      { nameEn: 'Unofficial Gateway Redirection', nameHi: 'अनधिकृत पेमेंट गेटवे लिंक', val: '92%' },
      { nameEn: 'Bulk Harvester Match Rate', nameHi: 'थोक साइबर धोखाधड़ी मैच दर', val: '94%' },
    ],
    targetTool: 'payment'
  }
];

export const LiveScamSimulator: React.FC<LiveScamSimulatorProps> = ({ onLaunchTool }) => {
  const { language } = useLanguage();
  const [activeScenarioId, setActiveScenarioId] = useState<string>('digital_arrest');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [spokenProgress, setSpokenProgress] = useState<number>(0);
  const [waveformBars, setWaveformBars] = useState<number[]>(new Array(24).fill(15));
  const animFrameRef = useRef<number | null>(null);

  const scenario = SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];

  // Stop speech if switching scenario or unmounting
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [activeScenarioId]);

  // Audio synthesis trigger
  const handlePlayVoice = () => {
    if (isPlaying) {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlaying(false);
      setSpokenProgress(0);
      setWaveformBars(new Array(24).fill(15));
      return;
    }

    const textToSpeak = language === 'HI' ? scenario.voiceTextHi : scenario.voiceTextEn;

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // clear previous
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.rate = 0.95; // realistic tense caller cadence
      utterance.pitch = 0.9;
      utterance.lang = language === 'HI' ? 'hi-IN' : 'en-IN';

      utterance.onstart = () => {
        setIsPlaying(true);
        startWaveformAnimation();
      };

      utterance.onboundary = (e) => {
        if (e.charIndex && textToSpeak.length > 0) {
          setSpokenProgress(Math.min(100, Math.round((e.charIndex / textToSpeak.length) * 100)));
        }
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setSpokenProgress(100);
        setWaveformBars(new Array(24).fill(12));
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setSpokenProgress(0);
      };

      window.speechSynthesis.speak(utterance);
    } else {
      // Fallback if browser doesn't have Web Speech
      setIsPlaying(true);
      startWaveformAnimation();
      setTimeout(() => {
        setIsPlaying(false);
        setSpokenProgress(100);
      }, 5000);
    }
  };

  const startWaveformAnimation = () => {
    const updateBars = () => {
      setWaveformBars(
        Array.from({ length: 24 }, () => Math.floor(Math.random() * 75) + 15)
      );
      animFrameRef.current = requestAnimationFrame(updateBars);
    };
    updateBars();
  };

  useEffect(() => {
    if (!isPlaying && animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
  }, [isPlaying]);

  const currentText = language === 'HI' ? scenario.voiceTextHi : scenario.voiceTextEn;

  // Render text with highlighted scam tokens
  const renderHighlightedText = () => {
    let parts = [currentText];
    scenario.highlightWords.forEach((word) => {
      const newParts: (string | React.ReactNode)[] = [];
      parts.forEach((p) => {
        if (typeof p === 'string') {
          const split = p.split(new RegExp(`(${word})`, 'gi'));
          split.forEach((piece) => {
            if (piece.toLowerCase() === word.toLowerCase()) {
              newParts.push(
                <span
                  key={Math.random()}
                  className="bg-red-500/20 text-red-300 font-bold px-1.5 py-0.5 rounded border border-red-500/40 animate-pulse"
                >
                  {piece}
                </span>
              );
            } else if (piece) {
              newParts.push(piece);
            }
          });
        } else {
          newParts.push(p);
        }
      });
      parts = newParts as any;
    });

    return parts;
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyber-border shadow-2xl relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-1/4 w-96 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-5 border-b border-cyber-border">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono font-bold mb-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>{language === 'HI' ? 'लाइव साइबर अटैक ऑडियो सिम्युलेटर' : 'LIVE SCAM CALL & AUDIO INTERCEPTOR'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {language === 'HI' ? 'अटैक सिमुलेशन: AI से फ्रॉड कॉल का लाइव विश्लेषण' : 'Simulate Live Attacks: Real-Time AI Interception'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'HI'
              ? 'जूरी और इवैल्यूएटर्स नीचे किसी भी फ्रॉड कॉल को लाइव चलाकर RakshaAI का रियल-टाइम वॉयस व इंटेंट एनालिसिस टेस्ट कर सकते हैं।'
              : 'Experience how RakshaAI listens, transcribes, flags coercion tokens, and neutralizes threats in sub-seconds.'}
          </p>
        </div>

        {/* Scenario Selector Pills */}
        <div className="flex flex-wrap gap-2">
          {SCENARIOS.map((sc) => (
            <button
              key={sc.id}
              onClick={() => {
                if (isPlaying && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                  setIsPlaying(false);
                }
                setActiveScenarioId(sc.id);
                setSpokenProgress(0);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                activeScenarioId === sc.id
                  ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/30'
                  : 'bg-cyber-900/80 text-slate-300 border-cyber-border hover:border-slate-500'
              }`}
            >
              {language === 'HI' ? sc.titleHi : sc.titleEn}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Call HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Simulated Phone Call & Waveform Console (7 cols) */}
        <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
          <div className="p-5 rounded-2xl bg-cyber-900/90 border border-cyber-border relative">
            {/* Incoming Call Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyber-border">
              <div className="flex items-center space-x-3">
                <div className={`p-2.5 rounded-xl ${isPlaying ? 'bg-red-500/20 text-red-400 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                    {language === 'HI' ? 'इंटरसेप्टेड इनकमिंग कॉल' : 'INTERCEPTED CALL INCOMING'}
                  </span>
                  <span className="text-sm font-mono font-bold text-white tracking-wider">{scenario.caller}</span>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-black border ${scenario.badgeColor}`}>
                {scenario.badge}
              </span>
            </div>

            {/* Live Audio Equalizer Waveform */}
            <div className="py-4 px-3 bg-cyber-950/80 rounded-xl border border-cyber-border/70 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-cyan-400 flex items-center space-x-1">
                  <Activity className="w-3 h-3 animate-spin" />
                  <span>{isPlaying ? (language === 'HI' ? 'लाइव ऑडियो स्ट्रीम एक्टिव' : 'LIVE HARMONIC FREQUENCY STREAM') : (language === 'HI' ? 'ऑडियो स्टैंडबाय' : 'AUDIO STANDBY')}</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {isPlaying ? `${spokenProgress}% STREAMED` : '0.00 / 0.18s'}
                </span>
              </div>
              <div className="h-16 flex items-end justify-between gap-1 px-2">
                {waveformBars.map((height, idx) => (
                  <div
                    key={idx}
                    className={`w-full rounded-t transition-all duration-75 ${
                      isPlaying
                        ? idx % 3 === 0
                          ? 'bg-gradient-to-t from-red-600 to-amber-400'
                          : 'bg-gradient-to-t from-blue-600 to-cyan-400'
                        : 'bg-slate-800'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Live Speech Recognition & Keyword Highlighting */}
            <div className="p-3.5 bg-cyber-950 rounded-xl border border-cyber-border text-xs leading-relaxed font-sans">
              <div className="text-[10px] font-mono text-slate-400 uppercase mb-1.5 flex items-center justify-between">
                <span>{language === 'HI' ? '📡 लाइव AI ट्रांसक्रिप्शन व कीवर्ड डिटेक्शन' : '📡 REAL-TIME SPEECH TRANSCRIBED & TOKENIZED'}</span>
                <span className="text-red-400 font-bold">{scenario.highlightWords.length} RED-FLAGS</span>
              </div>
              <p className="text-slate-200">{renderHighlightedText()}</p>
            </div>

            {/* Play/Stop Audio Controls */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-cyber-border">
              <button
                onClick={handlePlayVoice}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all shadow-lg ${
                  isPlaying
                    ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-500/30'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-blue-500/25'
                }`}
              >
                {isPlaying ? (
                  <>
                    <PhoneOff className="w-4 h-4 animate-pulse" />
                    <span>{language === 'HI' ? 'कॉल बंद करें (Stop)' : 'Terminate Call Audio'}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>{language === 'HI' ? '▶️ फर्जी कॉल सुनें (Play Voice Simulation)' : '▶️ Play Voice Attack Simulation'}</span>
                  </>
                )}
              </button>

              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                {language === 'HI' ? 'Web Speech सिंथेसाइज़र एक्टिव' : 'Uses Local Web Speech Synthesizer'}
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: AI Threat Assessment & Forensic Verdict (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-cyber-900/90 border border-cyber-border flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono uppercase text-blue-400 font-bold tracking-wider">
                {language === 'HI' ? 'AI फोरेंसिक परिणाम' : 'AI FORENSIC VERDICT'}
              </span>
              <span className="text-xs font-mono font-black text-red-400 bg-red-950/60 px-2 py-0.5 rounded border border-red-500/40">
                RISK {scenario.riskScore}%
              </span>
            </div>

            <h3 className="text-base font-extrabold text-white mb-1">{scenario.threatType}</h3>
            <p className="text-xs text-slate-400 mb-4">
              {language === 'HI'
                ? 'सिस्टम ने वॉयस कैडेंस और धमकी भरे शब्दों के आधार पर इसे 100% संदेहास्पद और खतरनाक चिह्नित किया है।'
                : 'Instant neural triage detected predatory coercion and synthetic signature artifacts.'}
            </p>

            {/* Forensic Signal Meters */}
            <div className="space-y-2.5 mb-5">
              {scenario.signals.map((sig, i) => (
                <div key={i} className="p-2 rounded-xl bg-cyber-950/80 border border-cyber-border/60">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium">
                      {language === 'HI' ? sig.nameHi : sig.nameEn}
                    </span>
                    <span className="font-mono font-bold text-cyan-400">{sig.val}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-red-500 rounded-full"
                      style={{ width: sig.val }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-3 border-t border-cyber-border space-y-2">
            <button
              onClick={() => onLaunchTool(scenario.targetTool)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20 border border-blue-400/30 transition-all"
            >
              <span>{language === 'HI' ? 'इस थ्रेट का पूरा फोरेंसिक विश्लेषण खोलें' : 'Launch Deep Forensic Analyzer'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center justify-center space-x-1.5 text-[10px] text-emerald-400 font-mono">
              <CheckCircle className="w-3 h-3" />
              <span>{language === 'HI' ? '1930 गोल्डन ऑवर प्रोटोकॉल ऑटो-सिंक' : '1930 Golden Hour Ready'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
