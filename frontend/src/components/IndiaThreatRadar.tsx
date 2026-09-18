import React, { useState } from 'react';
import {
  Shield, AlertTriangle, Radio, Navigation, CheckCircle2,
  TrendingUp, ArrowRight, Activity, MapPin, Eye
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface IndiaThreatRadarProps {
  onSelectAction: (tab: string) => void;
}

interface ThreatNode {
  id: string;
  city: string;
  state: string;
  x: number; // percentage on map
  y: number; // percentage on map
  dominantThreatEn: string;
  dominantThreatHi: string;
  severity: 'CRITICAL' | 'HIGH' | 'ELEVATED';
  riskScore: number;
  blockedVolume: string;
  modality: string;
  sampleMessageEn: string;
  sampleMessageHi: string;
  counterAction: string;
  targetTool: string;
}

const THREAT_NODES: ThreatNode[] = [
  {
    id: 'delhi',
    city: 'Delhi NCR',
    state: 'National Capital Region',
    x: 43,
    y: 28,
    dominantThreatEn: 'CBI "Digital Arrest" & Fake Electricity SMS',
    dominantThreatHi: 'CBI "डिजिटल अरेस्ट" व बिजली बिल का फर्जी SMS',
    severity: 'CRITICAL',
    riskScore: 98,
    blockedVolume: '₹1.84 Cr',
    modality: 'message',
    sampleMessageEn: '"Electricity cut tonight at 9:30 PM. Download Discom_Update.apk or call officer immediately."',
    sampleMessageHi: '"आज रात 9:30 बजे बिजली काट दी जाएगी। Discom_Update.apk डाउनलोड करें या अधिकारी को तुरंत कॉल करें।"',
    counterAction: '1930 Cyber Cell Instant Triage',
    targetTool: 'message'
  },
  {
    id: 'mumbai',
    city: 'Mumbai',
    state: 'Maharashtra',
    x: 32,
    y: 56,
    dominantThreatEn: 'AI Deepfake Stock Advice & Police Video Calls',
    dominantThreatHi: 'AI डीपफेक स्टॉक टिप्स व नकली पुलिस वीडियो कॉल',
    severity: 'CRITICAL',
    riskScore: 97,
    blockedVolume: '₹2.12 Cr',
    modality: 'video',
    sampleMessageEn: 'Synthetic video showing cloned public figure promising 400% returns on fake trading app.',
    sampleMessageHi: 'मशहूर हस्तियों के चेहरे का AI डीपफेक बनाकर फर्जी ट्रेडिंग ऐप पर 400% मुनाफे का लालच।',
    counterAction: 'Temporal Frame & Lip-Sync Forensics',
    targetTool: 'video'
  },
  {
    id: 'bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    x: 42,
    y: 78,
    dominantThreatEn: 'AI Voice-Cloned Emergency Bail Ransom',
    dominantThreatHi: 'AI वॉयस क्लोन आपातकालीन जमानत फिरौती',
    severity: 'HIGH',
    riskScore: 94,
    blockedVolume: '₹95 Lakh',
    modality: 'voice',
    sampleMessageEn: 'Synthesized voice mimicking son crying for immediate hospital / accident settlement money.',
    sampleMessageHi: 'बेटे की हूबहू क्लोन आवाज में फोन करके एक्सीडेंट या पुलिस केस से बचने के लिए तुरंत पैसे की मांग।',
    counterAction: 'Harmonic Spectrum & Micro-Jitter Scan',
    targetTool: 'voice'
  },
  {
    id: 'hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    x: 46,
    y: 63,
    dominantThreatEn: 'Reverse-QR & Fake OLX Buyer PIN Traps',
    dominantThreatHi: 'रिवर्स QR कोड व OLX पर एडवांस देने का जाल',
    severity: 'HIGH',
    riskScore: 92,
    blockedVolume: '₹72 Lakh',
    modality: 'payment',
    sampleMessageEn: '"Scan this QR code to receive ₹15,000 advance. Enter your UPI PIN to approve receipt."',
    sampleMessageHi: '"15,000 रुपये एडवांस पाने के लिए यह QR स्कैन करें और UPI PIN डालकर रिसीव करें।"',
    counterAction: 'PaymentShield Collect-Request Blocker',
    targetTool: 'payment'
  },
  {
    id: 'jaipur',
    city: 'Jaipur',
    state: 'Rajasthan',
    x: 34,
    y: 35,
    dominantThreatEn: 'Rogue Chinese Instant Loan App Blackmail',
    dominantThreatHi: 'अवैध इंस्टेंट लोन ऐप व कॉन्टैक्ट ब्लैकमेल',
    severity: 'CRITICAL',
    riskScore: 96,
    blockedVolume: '₹64 Lakh',
    modality: 'screenshot',
    sampleMessageEn: 'Morphed defamatory photos sent to contact list demanding extortion via UPI.',
    sampleMessageHi: 'गैलरी की तस्वीरों को मॉर्फ करके पूरे कॉन्टैक्ट्स को भेजने की धमकी देकर जबरन वसूली।',
    counterAction: 'Evidence Locker Cryptographic SHA-256',
    targetTool: 'screenshot'
  },
  {
    id: 'pune',
    city: 'Pune',
    state: 'Maharashtra',
    x: 35,
    y: 59,
    dominantThreatEn: 'Telegram "Like & Review" Part-Time Job Trap',
    dominantThreatHi: 'टेलीग्राम पर होटल/यूट्यूब रिव्यू पार्ट-टाइम जॉब जाल',
    severity: 'HIGH',
    riskScore: 91,
    blockedVolume: '₹88 Lakh',
    modality: 'social',
    sampleMessageEn: '"Earn ₹3,000 to ₹8,000 daily by simply reviewing Google Maps locations. Join Telegram VIP VIP."',
    sampleMessageHi: '"गूगल मैप्स रिव्यू करके रोज 3000 से 8000 रुपये कमाएं। वीआईपी टेलीग्राम ग्रुप से जुड़ें।"',
    counterAction: 'SocialShield Intent Scanner',
    targetTool: 'social'
  },
  {
    id: 'kolkata',
    city: 'Kolkata',
    state: 'West Bengal',
    x: 72,
    y: 45,
    dominantThreatEn: 'FedEx Customs Parcel Narcotic Phishing Link',
    dominantThreatHi: 'FedEx पार्सल में ड्रग्स निकलने का फर्जी लिंक',
    severity: 'ELEVATED',
    riskScore: 89,
    blockedVolume: '₹53 Lakh',
    modality: 'link',
    sampleMessageEn: '"FedEx Parcel #9817 detained at Mumbai Customs. Click fedex-customs-clearance.top to verify."',
    sampleMessageHi: '"आपका FedEx पार्सल कस्टम द्वारा रोक लिया गया है। जांच के लिए तुरंत लिंक पर क्लिक करें।"',
    counterAction: 'LinkShield Typosquatting Analyzer',
    targetTool: 'link'
  },
  {
    id: 'ahmedabad',
    city: 'Ahmedabad',
    state: 'Gujarat',
    x: 27,
    y: 43,
    dominantThreatEn: 'Fake IPO Allotment & High-Yield Demat Fraud',
    dominantThreatHi: 'फर्जी IPO अलॉटमेंट व डीमैट खाता धोखाधड़ी',
    severity: 'HIGH',
    riskScore: 93,
    blockedVolume: '₹1.15 Cr',
    modality: 'payment',
    sampleMessageEn: '"100% Guaranteed Allotment in upcoming Mega-IPO. Deposit funds to Institutional VPA."',
    sampleMessageHi: '"आगामी मेगा IPO में 100% गारंटीड अलॉटमेंट। इस प्राइवेट UPI पर तुरंत पूंजी जमा करें।"',
    counterAction: 'NPCI VPA Verification Engine',
    targetTool: 'payment'
  }
];

export const IndiaThreatRadar: React.FC<IndiaThreatRadarProps> = ({ onSelectAction }) => {
  const { language } = useLanguage();
  const [selectedNodeId, setSelectedNodeId] = useState<string>('delhi');

  const selectedNode = THREAT_NODES.find((n) => n.id === selectedNodeId) || THREAT_NODES[0];

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyber-border shadow-2xl relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-5 border-b border-cyber-border">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold mb-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>{language === 'HI' ? 'राष्ट्रीय साइबर खतरा रडार (लाइव)' : 'NATIONAL CYBER THREAT RADAR (LIVE)'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {language === 'HI' ? 'भारत साइबर सुरक्षा टेलीमेट्री व रीजनल थ्रेट मैप' : 'India Real-Time Threat Telemetry & Regional Hotspots'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {language === 'HI'
              ? 'प्रमुख भारतीय शहरों में इंटरसेप्ट हो रहे नए साइबर हमलों, डिजिटल अरेस्ट और वॉयस क्लोनिंग का लाइव नक्शा।'
              : 'Live telemetry stream of coordinated attacks, digital arrest coercion, and regional scam patterns.'}
          </p>
        </div>

        {/* Global Live Indicator */}
        <div className="flex items-center space-x-3 text-xs font-mono bg-cyber-900/90 border border-cyber-border px-3.5 py-2 rounded-xl">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-emerald-300 font-bold">8 ACTIVE DEFENSE NODES</span>
          <span className="text-slate-500">|</span>
          <span className="text-cyan-300 font-bold">1930 SYNCED</span>
        </div>
      </div>

      {/* Main Grid: Radar Screen (Left) + Detail Tactical Dossier (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Radar Graphic Visualizer (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-cyber-950 border border-cyber-border p-4 relative flex flex-col justify-between overflow-hidden min-h-[380px]">
          {/* Radar Background Rings */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-80 h-80 rounded-full border border-cyan-500/20" />
            <div className="w-60 h-60 rounded-full border border-cyan-500/20 absolute" />
            <div className="w-40 h-40 rounded-full border border-cyan-500/20 absolute" />
            <div className="w-20 h-20 rounded-full border border-cyan-500/30 absolute" />
            <div className="w-full h-px bg-cyan-500/15 absolute" />
            <div className="h-full w-px bg-cyan-500/15 absolute" />
            {/* Rotating Radar Sweep Line */}
            <div className="w-80 h-80 rounded-full absolute overflow-hidden pointer-events-none">
              <div
                className="w-full h-full radar-sweep"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(0, 210, 255, 0.25) 0deg, transparent 60deg, transparent 360deg)',
                  transformOrigin: 'center center'
                }}
              />
            </div>
          </div>

          {/* India SVG stylized boundary watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
            <span className="text-7xl font-mono font-black text-cyan-400 tracking-widest">BHARAT-RADAR</span>
          </div>

          {/* Radar Header Telemetry */}
          <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-cyan-400/80 px-2 pt-1">
            <span>SECTOR: IN-CYBER-OPS</span>
            <span className="flex items-center space-x-1">
              <Activity className="w-3.5 h-3.5 animate-spin" />
              <span>SCAN FREQ: 4.8 GHz</span>
            </span>
          </div>

          {/* Tactical Map Points */}
          <div className="relative z-10 w-full h-72 my-2">
            {THREAT_NODES.map((node) => {
              const isSelected = selectedNodeId === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-all ${
                    isSelected ? 'z-30 scale-125' : 'z-20 hover:scale-110'
                  }`}
                >
                  {/* Ping Animation on Critical */}
                  <span
                    className={`absolute inset-0 rounded-full animate-ping opacity-75 ${
                      node.severity === 'CRITICAL'
                        ? 'bg-red-500'
                        : node.severity === 'HIGH'
                        ? 'bg-amber-500'
                        : 'bg-cyan-500'
                    }`}
                  />
                  {/* Center Dot */}
                  <div
                    className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-white border-cyan-400 shadow-lg shadow-cyan-400'
                        : node.severity === 'CRITICAL'
                        ? 'bg-red-500 border-red-300'
                        : node.severity === 'HIGH'
                        ? 'bg-amber-500 border-amber-300'
                        : 'bg-cyan-500 border-cyan-300'
                    }`}
                  />
                  {/* City Label Badge */}
                  <div
                    className={`mt-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-black shadow-md'
                        : 'bg-cyber-900/90 text-slate-300 border border-cyber-border'
                    }`}
                  >
                    {node.city}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Filter City Buttons Bar */}
          <div className="relative z-10 flex flex-wrap gap-1.5 pt-2 border-t border-cyber-border/60">
            {THREAT_NODES.map((node) => (
              <button
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                  selectedNodeId === node.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400'
                    : 'bg-cyber-900/70 text-slate-400 hover:text-slate-200 border border-transparent'
                }`}
              >
                {node.city}
              </button>
            ))}
          </div>
        </div>

        {/* Tactical Dossier Details (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-cyber-900/90 border border-cyber-border flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-cyber-border">
              <div>
                <div className="flex items-center space-x-1.5 text-xs text-slate-400 font-mono">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{selectedNode.city}, {selectedNode.state}</span>
                </div>
                <h3 className="text-base font-extrabold text-white mt-0.5">
                  {language === 'HI' ? selectedNode.dominantThreatHi : selectedNode.dominantThreatEn}
                </h3>
              </div>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-black border ${
                  selectedNode.severity === 'CRITICAL'
                    ? 'bg-red-950 text-red-300 border-red-500/40'
                    : selectedNode.severity === 'HIGH'
                    ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                    : 'bg-blue-950 text-blue-300 border-blue-500/40'
                }`}
              >
                {selectedNode.severity}
              </span>
            </div>

            {/* Metric Counters */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="p-2.5 rounded-xl bg-cyber-950/80 border border-cyber-border">
                <span className="text-[10px] font-mono text-slate-400 block">
                  {language === 'HI' ? 'अटैक इंटेंसिटी स्कोर' : 'Risk Threat Index'}
                </span>
                <span className="text-lg font-mono font-black text-red-400">{selectedNode.riskScore}%</span>
              </div>
              <div className="p-2.5 rounded-xl bg-cyber-950/80 border border-cyber-border">
                <span className="text-[10px] font-mono text-slate-400 block">
                  {language === 'HI' ? 'रोका गया वित्तीय नुकसान' : 'Loss Intercepted'}
                </span>
                <span className="text-lg font-mono font-black text-emerald-400">{selectedNode.blockedVolume}</span>
              </div>
            </div>

            {/* Intercepted Sample Payload */}
            <div className="p-3 bg-cyber-950 rounded-xl border border-cyber-border mb-4">
              <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1 font-bold">
                {language === 'HI' ? '⚠️ इंटरसेप्ट किया गया वास्तविक पेलोड / मैसेज' : '⚠️ ACTUAL INTERCEPTED ATTACK PAYLOAD'}
              </span>
              <p className="text-xs text-slate-200 italic font-mono leading-relaxed">
                {language === 'HI' ? selectedNode.sampleMessageHi : selectedNode.sampleMessageEn}
              </p>
            </div>

            {/* Active Counter-Measure */}
            <div className="p-2.5 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs">
              <div className="flex items-center space-x-1.5 text-blue-300 font-bold mb-0.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                <span>{language === 'HI' ? 'सक्रिय रक्षा काउंटर-मेजर' : 'Active Defense Countermeasure'}</span>
              </div>
              <span className="text-slate-300 text-[11px]">{selectedNode.counterAction}</span>
            </div>
          </div>

          {/* Launch Direct Forensic Scan Button */}
          <div className="pt-4 border-t border-cyber-border mt-4">
            <button
              onClick={() => onSelectAction(selectedNode.targetTool)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all border border-cyan-400/30"
            >
              <span>
                {language === 'HI'
                  ? `${selectedNode.city} के थ्रेट का लाइव स्कैनर खोलें`
                  : `Launch Scanner for ${selectedNode.city} Vector`}
              </span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
