import React, { useState } from 'react';
import {
  X, QrCode, Copy, Check, Smartphone, Globe, Wifi, Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  // Cloudflare Zero-Password Global HTTPS Tunnel (Primary)
  const cloudflareUrl = 'https://her-chuck-especially-grove.trycloudflare.com';
  // Wi-Fi Direct LAN URL
  const wifiUrl = 'http://10.13.246.188:5173';
  const githubUrl = 'https://github.com/royanurag959-tech/rakshaai-2.0';

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // QR Code points to the zero-password Cloudflare URL so anyone can scan it on any network!
  const qrCodeImg = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(cloudflareUrl)}&bgcolor=0a0f1d&color=00d2ff&margin=10`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-lg rounded-3xl border border-cyber-border shadow-2xl p-6 sm:p-7 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-1/3 w-64 h-32 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-cyber-border">
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                {language === 'HI' ? '📱 फोन व लैपटॉप लाइव डेमो लिंक' : '📱 Live Demo Link (Phone & Laptop)'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'HI' ? 'QR कोड स्कैन करें या 1-क्लिक में लिंक कॉपी करें' : 'Scan QR code with phone camera or copy link'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-cyber-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          {/* QR Code Card */}
          <div className="p-4 rounded-2xl bg-cyber-950 border border-cyber-border flex flex-col sm:flex-row items-center gap-4">
            <div className="p-2 bg-[#0a0f1d] rounded-xl border border-cyan-500/30 shrink-0">
              <img
                src={qrCodeImg}
                alt="RakshaAI QR Code"
                className="w-32 h-32 rounded-lg"
                loading="lazy"
              />
            </div>
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-bold uppercase">
                {language === 'HI' ? '⚡ 1-सेकंड में फोन पर खोलें' : '⚡ Instant Mobile Scan'}
              </span>
              <h4 className="text-sm font-bold text-white">
                {language === 'HI' ? 'फोन कैमरा से QR कोड स्कैन करें' : 'Scan with Mobile Camera'}
              </h4>
              <p className="text-xs text-slate-400 leading-snug">
                {language === 'HI'
                  ? 'अपने फोन का कैमरा खोलें और इस QR कोड पर दिखाएं — ऐप बिना किसी पासवर्ड के तुरंत खुल जाएगा!'
                  : 'Point your mobile camera at this QR code. Opens immediately without any password!'}
              </p>
            </div>
          </div>

          {/* Link 1: Cloudflare Public Live URL (Primary) */}
          <div className="p-4 rounded-2xl bg-cyber-900/90 border border-cyber-border space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-cyan-400">
                <Globe className="w-4 h-4" />
                <span>{language === 'HI' ? '1. लाइव पब्लिक लिंक (4G/5G/Wi-Fi कहीं भी)' : '1. Public Live HTTPS URL (Worldwide)'}</span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-950/70 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40 font-bold">
                ZERO PASSWORD
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-cyber-950 border border-cyber-border text-xs font-mono">
              <span className="text-cyan-300 select-all truncate mr-2">{cloudflareUrl}</span>
              <button
                onClick={() => copyToClipboard(cloudflareUrl, 'cf')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shrink-0 ${
                  copiedKey === 'cf'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-md shadow-cyan-600/30'
                }`}
              >
                {copiedKey === 'cf' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{language === 'HI' ? 'कॉपी हुआ!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{language === 'HI' ? 'कॉपी करें' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              {language === 'HI'
                ? 'यह लिंक Cloudflare के हाई-स्पीड CDN पर लाइव है। कोई पासवर्ड नहीं डालना पड़ेगा।'
                : 'Runs on Cloudflare Global Edge. No password or configuration required.'}
            </p>
          </div>

          {/* Link 2: Wi-Fi Direct Link */}
          <div className="p-4 rounded-2xl bg-cyber-900/90 border border-cyber-border space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                <Wifi className="w-4 h-4" />
                <span>{language === 'HI' ? '2. डायरेक्ट वाई-फाई लिंक (सेम नेटवर्क पर)' : '2. Wi-Fi Direct LAN Link'}</span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
                0ms LATENCY
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-cyber-950 border border-cyber-border text-xs font-mono">
              <span className="text-emerald-300 select-all truncate mr-2">{wifiUrl}</span>
              <button
                onClick={() => copyToClipboard(wifiUrl, 'wifi')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shrink-0 ${
                  copiedKey === 'wifi'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white'
                }`}
              >
                {copiedKey === 'wifi' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{language === 'HI' ? 'कॉपी हुआ!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{language === 'HI' ? 'कॉपी करें' : 'Copy'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* GitHub Repository */}
          <div className="p-3 bg-cyber-950 rounded-xl border border-cyber-border flex items-center justify-between text-xs">
            <span className="text-slate-400 font-mono truncate mr-2">GitHub: {githubUrl}</span>
            <button
              onClick={() => copyToClipboard(githubUrl, 'github')}
              className="p-1.5 rounded-lg bg-cyber-800 hover:bg-cyber-700 text-slate-300 shrink-0"
              title="Copy GitHub Link"
            >
              {copiedKey === 'github' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
