import React from 'react';
import { Activity, ShieldAlert, Zap, Radio } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LiveThreatTickerProps {
  onSelectAction?: (tab: string) => void;
}

export const LiveThreatTicker: React.FC<LiveThreatTickerProps> = ({ onSelectAction }) => {
  const { language } = useLanguage();

  const threats = language === 'HI' ? [
    { city: 'नई दिल्ली', type: '🚨 डिजिटल अरेस्ट नकली CBI कॉल', stat: 'AI वॉयस क्लोनिंग 88.4%', target: 'voice', tag: 'CRITICAL' },
    { city: 'बेंगलुरु', type: '🛑 OLX रिवर्स-QR ₹50,000 पेमेंट जाल', stat: 'पिन दर्ज करने से पहले ब्लॉक', target: 'payment', tag: 'BLOCKED' },
    { city: 'मुंबई', type: '⚠️ फर्जी SBI KYC फिशिंग लिंक (sbi-kyc.top)', stat: 'ब्रांड नकल ब्लैकलिस्टेड', target: 'link', tag: 'MITIGATED' },
    { city: 'जयपुर', type: '🛡️ AnyDesk स्क्रीन हाईजैक व OTP जासूसी प्रयास', stat: 'डिवाइस गार्ड द्वारा रोका गया', target: 'device_guard', tag: 'CONTAINED' },
    { city: 'पुणे', type: '🚨 सेना अधिकारी का रूप धारण कर डीपफेक वीडियो कॉल', stat: 'लिप-सिंक विसंगति 92%', target: 'video', tag: 'CRITICAL' },
    { city: 'कोलकाता', type: '🛑 इंस्टाग्राम लक्जरी वॉच कस्टम ड्यूटी घोटाला', stat: 'साक्ष्य लॉकर में SHA-256 सुरक्षित', target: 'social', tag: 'PRESERVED' },
    { city: 'हैदराबाद', type: '⚡ फर्जी बिजली बिल कटने की धमकी वाला बल्क SMS', stat: 'DLT हेडर अनधिकृत', target: 'message', tag: 'BLOCKED' },
  ] : [
    { city: 'NEW DELHI', type: '🚨 Digital Arrest Fake CBI Arrest Warrant Call', stat: 'AI Voice Jitter: 88.4%', target: 'voice', tag: 'CRITICAL' },
    { city: 'BENGALURU', type: '🛑 OLX Reverse-QR ₹50,000 Fraud Trap', stat: 'Blocked Before UPI PIN Entry', target: 'payment', tag: 'BLOCKED' },
    { city: 'MUMBAI', type: '⚠️ Fake SBI NetBanking KYC Phishing (sbi-kyc.top)', stat: 'Brand Typosquat Blacklisted', target: 'link', tag: 'MITIGATED' },
    { city: 'JAIPUR', type: '🛡️ AnyDesk Screen-Share Hijack & Live OTP Spy', stat: 'Neutralized by Device Guard', target: 'device_guard', tag: 'CONTAINED' },
    { city: 'PUNE', type: '🚨 Deepfake WhatsApp Video Call Impersonating Army Officer', stat: 'Lip-Sync Latency: 92%', target: 'video', tag: 'CRITICAL' },
    { city: 'KOLKATA', type: '🛑 Instagram Luxury Watch Customs Duty Scam DM', stat: 'Evidence SHA-256 Vaulted', target: 'social', tag: 'PRESERVED' },
    { city: 'HYDERABAD', type: '⚡ Fake Electricity Bill Cut-off Threat SMS', stat: 'DLT Header Spoof Intercepted', target: 'message', tag: 'BLOCKED' },
  ];

  return (
    <div className="w-full bg-cyber-950/90 border-y border-cyan-500/20 py-2 overflow-hidden relative backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center">
        {/* Live Indicator Pill */}
        <div className="flex items-center space-x-2 shrink-0 pr-4 border-r border-cyber-border z-10 bg-cyber-950/95 py-0.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="text-[10px] font-mono font-black text-cyan-300 tracking-wider flex items-center">
            <Radio className="w-3 h-3 mr-1 text-red-400 animate-pulse" />
            {language === 'HI' ? 'लाइव साइबर रक्षा रडार' : 'LIVE THREAT RADAR'}
          </span>
          <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
            1930 SYNC
          </span>
        </div>

        {/* Marquee Threat Stream */}
        <div className="overflow-hidden whitespace-nowrap flex-1 ml-4 mask-gradient">
          <div className="animate-marquee flex items-center space-x-8 text-xs font-mono text-slate-300">
            {threats.concat(threats).map((threat, idx) => (
              <div
                key={idx}
                onClick={() => onSelectAction && onSelectAction(threat.target)}
                className="flex items-center space-x-2 cursor-pointer group hover:text-cyan-300 transition-colors"
              >
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyber-800 text-cyan-400 border border-cyan-500/30">
                  {threat.city}
                </span>
                <span className="text-slate-200 group-hover:underline font-semibold">{threat.type}</span>
                <span className="text-slate-400">({threat.stat})</span>
                <span className={`text-[9px] px-1 rounded font-bold ${
                  threat.tag === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-500/40' :
                  threat.tag === 'BLOCKED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' :
                  'bg-blue-950 text-blue-400 border border-blue-500/40'
                }`}>
                  {threat.tag}
                </span>
                <span className="text-slate-600">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
