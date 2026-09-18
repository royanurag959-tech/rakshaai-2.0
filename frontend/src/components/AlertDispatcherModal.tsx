import React, { useState, useEffect } from 'react';
import {
  X, AlertTriangle, Send, ShieldAlert,
  MessageSquare, CheckCircle, Clock, Hash, Smartphone, RefreshCw, Copy, ExternalLink, Check, Key, Info
} from 'lucide-react';
import { api } from '../services/api';
import { AlertNotification } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface AlertDispatcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  prefillPhone?: string;
  prefillTemplate?: string;
  prefillMessage?: string;
  prefillRiskLevel?: string;
}

const FALLBACK_TEMPLATES: Record<string, { title_en: string; title_hi: string; en: string; hi: string }> = {
  STOP_MONEY_TRANSFER: {
    title_en: "Immediate Stop: Fraud Detected",
    title_hi: "तात्कालिक रोक: फ्रॉड अलर्ट",
    en: "🚨 RAKSHAAI EMERGENCY ALERT: A critical financial scam was detected targeting your account/phone! DO NOT transfer money, scan QR codes, or share any OTP with anyone. If unauthorized debit occurred, dial 1930 immediately.",
    hi: "🚨 रक्षाAI आपातकालीन अलर्ट: आपके फोन या खाते पर गंभीर साइबर धोखाधड़ी की पहचान हुई है! किसी को भी पैसे न भेजें, QR कोड स्कैन न करें और कोई OTP न बताएं। पैसे कटने पर तुरंत 1930 पर कॉल करें।"
  },
  DIGITAL_ARREST_POLICE: {
    title_en: "Fake Police / Digital Arrest Threat",
    title_hi: "नकली डिजिटल अरेस्ट व पुलिस धमकी",
    en: "⚠️ RAKSHAAI ALERT: You may be receiving fake police/CBI/Customs video calls claiming 'Digital Arrest'. Indian Police NEVER arrests citizens over Skype/WhatsApp or demands funds. Disconnect immediately and call 1930 / 112.",
    hi: "⚠️ रक्षाAI चेतावनी: आपको 'डिजिटल अरेस्ट' की धमकी देने वाली फर्जी पुलिस/CBI कॉल आ सकती है। भारतीय पुलिस कभी भी व्हाट्सएप पर अरेस्ट नहीं करती और न ही पैसे मांगती है। तुरंत फोन काटें और 1930 पर सूचना दें।"
  },
  REVERSE_QR_TRAP: {
    title_en: "Reverse-QR UPI PIN Scam Trap",
    title_hi: "रिवर्स-QR व UPI पिन जाल",
    en: "🛑 CRITICAL WARNING: A fake buyer has sent a QR code. NEVER enter your UPI PIN to receive money! Entering your UPI PIN ALWAYS transfers money OUT of your bank account. Decline the collect request now.",
    hi: "🛑 गंभीर चेतावनी: फर्जी खरीदार ने QR कोड भेजा है। पैसे प्राप्त करने के लिए कभी भी अपना UPI पिन न डालें! पिन डालने से आपके खाते से पैसे कटते हैं। कलेक्ट रिक्वेस्ट को तुरंत अस्वीकार करें।"
  },
  VOICE_CLONE_KIDNAP: {
    title_en: "AI Voice Cloning Emergency Lure",
    title_hi: "AI वॉयस क्लोनिंग व इमरजेंसी जाल",
    en: "🎙️ RAKSHAAI ALERT: High-probability AI voice clone detected! Scammers are impersonating a relative demanding urgent money. Do NOT send funds. Disconnect and call the person directly on their regular SIM number.",
    hi: "🎙️ रक्षाAI अलर्ट: कृत्रिम AI आवाज़ (Voice Clone) की पहचान हुई है! धोखेबाज़ रिश्तेदार बनकर आपातकाल के नाम पर पैसे मांग रहे हैं। पैसे न भेजें, तुरंत फोन काटकर परिजन के सामान्य नंबर पर सीधे कॉल करें।"
  },
  PHISHING_LINK_CLICKED: {
    title_en: "Malicious Phishing Link Clicked",
    title_hi: "खतरनाक फ़िशिंग लिंक पर क्लिक हुआ",
    en: "🚨 RAKSHAAI CONTAINMENT ALERT: A fake bank/KYC link was clicked on this device. Disconnect mobile data/Wi-Fi now, do not enter passwords or OTPs, and change your net banking password from a different device.",
    hi: "🚨 रक्षाAI सुरक्षा अलर्ट: इस डिवाइस पर फर्जी बैंक/KYC लिंक पर क्लिक हुआ है। तुरंत मोबाइल डेटा/वाई-फाई बंद करें, कोई पासवर्ड न डालें और दूसरे फोन से अपने बैंक का पासवर्ड बदलें।"
  }
};

export const AlertDispatcherModal: React.FC<AlertDispatcherModalProps> = ({
  isOpen,
  onClose,
  prefillPhone = '',
  prefillTemplate = 'STOP_MONEY_TRANSFER',
  prefillMessage = '',
  prefillRiskLevel = 'CRITICAL'
}) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const isHi = language === 'HI';

  const [activeTab, setActiveTab] = useState<'send' | 'history'>('send');
  const [recipientName, setRecipientName] = useState('Family / Victim');
  const [recipientPhone, setRecipientPhone] = useState(prefillPhone || '+91 98765 43210');
  const [selectedTemplate, setSelectedTemplate] = useState<string>(prefillTemplate || 'STOP_MONEY_TRANSFER');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [templates, setTemplates] = useState<any>(FALLBACK_TEMPLATES);
  const [history, setHistory] = useState<AlertNotification[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<AlertNotification | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Fast2SMS API Key state
  const [showGatewayConfig, setShowGatewayConfig] = useState(false);
  const [fast2smsKey, setFast2smsKey] = useState<string>(() => {
    return localStorage.getItem('raksha_fast2sms_key') || '';
  });

  // Sync state whenever modal opens or props change
  useEffect(() => {
    if (isOpen) {
      setError(null);
      setSendSuccess(null);
      const targetTmpl = prefillTemplate && FALLBACK_TEMPLATES[prefillTemplate] ? prefillTemplate : 'STOP_MONEY_TRANSFER';
      setSelectedTemplate(targetTmpl);

      if (prefillPhone) {
        setRecipientPhone(prefillPhone);
      } else if (user?.phone) {
        setRecipientPhone(user.phone);
      } else {
        setRecipientPhone('+91 98765 43210');
      }

      if (prefillMessage) {
        setCustomMessage(prefillMessage);
      } else if (FALLBACK_TEMPLATES[targetTmpl]) {
        setCustomMessage(isHi ? FALLBACK_TEMPLATES[targetTmpl].hi : FALLBACK_TEMPLATES[targetTmpl].en);
      }

      loadTemplates();
      loadHistory();
    }
  }, [isOpen, prefillPhone, prefillTemplate, prefillMessage, language, user]);

  const loadTemplates = async () => {
    try {
      const res = await api.getAlertTemplates();
      if (res && Object.keys(res).length > 0) {
        setTemplates(res);
      }
    } catch (e) {
      console.warn('Using fallback alert templates:', e);
    }
  };

  const loadHistory = async () => {
    try {
      const res = await api.getAlertHistory();
      setHistory(res);
    } catch (e) {
      console.error(e);
    }
  };

  const handleTemplateChange = (tmplKey: string) => {
    setSelectedTemplate(tmplKey);
    const tmplObj = templates[tmplKey] || FALLBACK_TEMPLATES[tmplKey];
    if (tmplObj) {
      setCustomMessage(isHi ? tmplObj.hi : tmplObj.en);
    }
  };

  // Clean phone number for WhatsApp / SMS links
  const getCleanPhone = (raw: string) => {
    let cleaned = raw.replace(/[^0-9]/g, '');
    if (cleaned.length === 10) {
      cleaned = '91' + cleaned;
    }
    return cleaned;
  };

  const handleCopyMessage = () => {
    if (!customMessage) return;
    navigator.clipboard.writeText(customMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveApiKey = (keyVal: string) => {
    setFast2smsKey(keyVal);
    localStorage.setItem('raksha_fast2sms_key', keyVal.trim());
  };

  // 1. Direct WhatsApp Transmission
  const handleSendViaWhatsApp = async () => {
    setError(null);
    if (!recipientPhone.trim() || recipientPhone.replace(/[^0-9]/g, '').length < 10) {
      setError(isHi ? 'कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSending(true);
    const cleanNumber = getCleanPhone(recipientPhone);
    const messageToSend = customMessage.trim() || 'RakshaAI Emergency Alert';
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodeURIComponent(messageToSend)}`;

    try {
      const result = await api.dispatchAlert({
        recipient_name: recipientName.trim(),
        recipient_phone: recipientPhone.trim(),
        alert_type: selectedTemplate,
        channel: 'WhatsApp Direct',
        risk_level: prefillRiskLevel,
        message_content: messageToSend,
        user_id: user?.id
      });
      setSendSuccess(result);
      await loadHistory();
      // Immediately open WhatsApp with the target number and message!
      window.open(whatsappUrl, '_blank');
    } catch (err: any) {
      // Even if offline, open WhatsApp directly
      window.open(whatsappUrl, '_blank');
    } finally {
      setIsSending(false);
    }
  };

  // 2. Direct Mobile SMS App Transmission
  const handleSendViaSMSApp = async () => {
    setError(null);
    if (!recipientPhone.trim() || recipientPhone.replace(/[^0-9]/g, '').length < 10) {
      setError(isHi ? 'कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsSending(true);
    const cleanNumber = getCleanPhone(recipientPhone);
    const messageToSend = customMessage.trim() || 'RakshaAI Emergency Alert';
    const smsUrl = `sms:+${cleanNumber}?body=${encodeURIComponent(messageToSend)}`;

    try {
      const result = await api.dispatchAlert({
        recipient_name: recipientName.trim(),
        recipient_phone: recipientPhone.trim(),
        alert_type: selectedTemplate,
        channel: 'Device SMS App',
        risk_level: prefillRiskLevel,
        message_content: messageToSend,
        user_id: user?.id
      });
      setSendSuccess(result);
      await loadHistory();
      window.open(smsUrl, '_blank');
    } catch (err: any) {
      window.open(smsUrl, '_blank');
    } finally {
      setIsSending(false);
    }
  };

  // 3. Telecom SMS Gateway (Fast2SMS API)
  const handleSendViaTelecomSMS = async () => {
    setError(null);
    if (!recipientPhone.trim() || recipientPhone.replace(/[^0-9]/g, '').length < 10) {
      setError(isHi ? 'कृपया 10 अंकों का सही मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!fast2smsKey.trim()) {
      setShowGatewayConfig(true);
      setError(isHi 
        ? 'सिम कार्ड पर सीधा टेलीकॉम SMS भेजने के लिए Fast2SMS API Key आवश्यक है। यदि आपके पास API Key नहीं है, तो तुरंत ऊपर दिए गए "WhatsApp पर भेजें" बटन का उपयोग करें।' 
        : 'Fast2SMS API Key is required to deliver direct telecom carrier SMS. If you do not have a key, use the "Send via WhatsApp" button above.');
      return;
    }

    setIsSending(true);
    const messageToSend = customMessage.trim() || 'RakshaAI Emergency Alert';

    try {
      const result = await api.dispatchAlert({
        recipient_name: recipientName.trim(),
        recipient_phone: recipientPhone.trim(),
        alert_type: selectedTemplate,
        channel: 'Fast2SMS Telecom SMS',
        risk_level: prefillRiskLevel,
        message_content: messageToSend,
        user_id: user?.id,
        gateway_api_key: fast2smsKey.trim(),
        gateway_provider: 'fast2sms'
      });
      setSendSuccess(result);
      await loadHistory();
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch telecom carrier SMS.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-cyber-900 border border-red-500/30 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5 overflow-hidden max-h-[92vh] overflow-y-auto">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyber-border pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-600/20 text-red-400 border border-red-500/40 flex items-center justify-center shadow-lg">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>{isHi ? '🚨 फ्रॉड अर्ली-वार्निंग अलर्ट प्रेषक' : '🚨 Fraud Early-Warning Alert Dispatcher'}</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                  {isHi ? 'लाइव 24x7' : 'LIVE 24x7'}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                {isHi
                  ? 'धोखाधड़ी के शिकार या संभावित निशाने पर मौजूद व्यक्ति को तुरंत WhatsApp, SMS ऐप या टेलीकॉम गेटवे द्वारा चेतावनी भेजें।'
                  : 'Instantly transmit early-warning fraud containment alerts via WhatsApp, SMS App, or Telecom Gateway to victims.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-cyber-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex p-1 bg-cyber-800/80 rounded-xl border border-cyber-border">
          <button
            type="button"
            onClick={() => setActiveTab('send')}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              activeTab === 'send'
                ? 'bg-red-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {isHi ? '🚨 अलर्ट संदेश भेजें' : '🚨 Dispatch Alert'}
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('history'); loadHistory(); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{isHi ? 'अलर्ट इतिहास' : 'Dispatched History'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-cyber-900 border border-cyber-border">
              {history.length}
            </span>
          </button>
        </div>

        {activeTab === 'send' ? (
          <div className="space-y-4">
            {/* Delivery Explanation Banner */}
            <div className="p-3 bg-blue-950/40 border border-blue-500/30 rounded-xl text-xs space-y-1 text-slate-300">
              <div className="flex items-center space-x-1.5 font-bold text-blue-400 text-xs">
                <Info className="w-4 h-4 shrink-0" />
                <span>{isHi ? '💡 सीधे मोबाइल पर अलर्ट कैसे प्राप्त होगा?' : '💡 How to receive the alert on your mobile?'}</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                {isHi ? (
                  <>
                    <strong className="text-emerald-400">1. WhatsApp (सर्वोत्तम & मुफ़्त)</strong>: नीचे हरा बटन दबाते ही तुरंत WhatsApp खुलेगा और आपके फ़ोन पर मैसेज पहुँच जाएगा।<br />
                    <strong className="text-cyan-400">2. फ़ोन का SMS ऐप</strong>: मोबाइल के डिफ़ॉल्ट SMS मैसेंजर से भेजने के लिए नीला बटन दबाएं।<br />
                    <strong className="text-amber-400">3. SIM कार्ड टेलीकॉम SMS</strong>: सीधे मोबाइल टावर से SMS भेजने के लिए नीचे Fast2SMS API Key दर्ज करें।
                  </>
                ) : (
                  <>
                    <strong className="text-emerald-400">1. WhatsApp (Instant & Free)</strong>: Tap the green button to open WhatsApp and message your phone immediately.<br />
                    <strong className="text-cyan-400">2. Device SMS App</strong>: Tap the blue button to send using your phone's native SMS app.<br />
                    <strong className="text-amber-400">3. Telecom SIM SMS</strong>: Add a free Fast2SMS API Key below to dispatch direct carrier SMS.
                  </>
                )}
              </p>
            </div>

            {/* Delivery Confirmation Card */}
            {sendSuccess && (
              <div className="p-4 bg-emerald-950/70 border border-emerald-500/60 rounded-xl text-xs text-emerald-300 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 font-bold text-sm text-emerald-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>{isHi ? 'आपातकालीन अलर्ट प्रेषित एवं वॉल्ट में सुरक्षित!' : 'Emergency Alert Dispatched & Vault Secured!'}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-900 text-emerald-300 border border-emerald-700">
                    {sendSuccess.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                  <div>
                    <span className="text-slate-400 block">{isHi ? 'प्राप्तकर्ता:' : 'Recipient:'}</span>
                    <span className="font-mono font-bold text-white">{sendSuccess.recipient_phone} ({sendSuccess.recipient_name})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{isHi ? 'वितरण माध्यम:' : 'Channel:'}</span>
                    <span className="font-mono text-emerald-400 font-bold">{sendSuccess.channel}</span>
                  </div>
                  {sendSuccess.gateway_response && (
                    <div className="sm:col-span-2 bg-emerald-900/40 p-2 rounded-lg border border-emerald-700/50">
                      <span className="text-emerald-300 font-mono text-[11px]">{sendSuccess.gateway_response}</span>
                    </div>
                  )}
                  <div className="sm:col-span-2">
                    <span className="text-slate-400 block">{isHi ? 'डिजिटल SHA-256 प्रमाणन मुहर:' : 'Cryptographic SHA-256 Fingerprint:'}</span>
                    <span className="font-mono text-[10px] text-slate-400 break-all">{sendSuccess.dispatch_hash}</span>
                  </div>
                </div>

                {/* Direct Action Forwarding Buttons */}
                <div className="pt-2 border-t border-emerald-800/60 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSendViaWhatsApp}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>{isHi ? 'WhatsApp में दोबारा खोलें' : 'Re-open in WhatsApp'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSendViaSMSApp}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 border border-slate-700 transition"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isHi ? 'SMS ऐप में खोलें' : 'Open in SMS App'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 border border-slate-700 transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{copied ? (isHi ? 'कॉपी हो गया!' : 'Copied!') : (isHi ? 'मैसेज कॉपी करें' : 'Copy Text')}</span>
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="block font-bold">{error}</span>
                  {!fast2smsKey && (
                    <span className="block text-[11px] text-red-300/80">
                      {isHi
                        ? '👉 सबसे आसान उपाय: नीचे दिए गए हरे "WhatsApp से भेजें" बटन पर क्लिक करें। यह बिना किसी API Key के तुरंत काम करता है!'
                        : '👉 Easiest fix: Tap the green "Send via WhatsApp" button below. It works immediately without any API Key!'}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Recipient info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isHi ? 'निशाने पर मौजूद व्यक्ति / परिजन का नाम' : 'Target Person / Contact Name'}
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder={isHi ? 'उदा. पिताजी / मित्र / स्वयं' : 'e.g. Father / Friend / Self'}
                  className="w-full bg-cyber-800/80 border border-cyber-border rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>{isHi ? 'मोबाइल नंबर (जिसपर चेतावनी भेजनी है)' : 'Target Mobile Number (To Alert)'}</span>
                  <span className="text-red-400 font-bold">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full bg-cyber-800/80 border border-cyber-border rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500 font-mono"
                />
              </div>
            </div>

            {/* Quick Test Number Chips */}
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="text-[11px]">{isHi ? 'त्वरित टेस्ट नंबर:' : 'Quick numbers:'}</span>
              {['+91 98765 43210', '+91 91234 56789'].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRecipientPhone(num)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-[11px] font-mono border border-slate-700"
                >
                  {num}
                </button>
              ))}
            </div>

            {/* Template Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {isHi ? 'अलर्ट संदेश का प्रकार (Template)' : 'Select Early-Warning Fraud Template'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { id: 'STOP_MONEY_TRANSFER', label: isHi ? '🛑 तुरंत पैसे ट्रांसफर रोको' : '🛑 Stop Money Transfer' },
                  { id: 'DIGITAL_ARREST_POLICE', label: isHi ? '⚠️ नकली पुलिस डिजिटल अरेस्ट' : '⚠️ Fake Police Arrest' },
                  { id: 'REVERSE_QR_TRAP', label: isHi ? '💳 रिवर्स QR व UPI पिन जाल' : '💳 Reverse-QR PIN Trap' },
                  { id: 'VOICE_CLONE_KIDNAP', label: isHi ? '🎙️ AI नकली आवाज़ कॉल' : '🎙️ AI Voice Clone Lure' },
                  { id: 'PHISHING_LINK_CLICKED', label: isHi ? '🚨 फ़िशिंग लिंक क्लिक अलर्ट' : '🚨 Phishing Link Clicked' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTemplateChange(item.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all ${
                      selectedTemplate === item.id
                        ? 'bg-red-950/80 border-red-500 text-white shadow-md'
                        : 'bg-cyber-800/50 border-cyber-border text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Preview Box */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-400" />
                  <span>{isHi ? 'भेजा जाने वाला चेतावनी संदेश (SMS / WhatsApp Preview)' : 'Alert Message Preview (SMS / WhatsApp)'}</span>
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleCopyMessage}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copied ? (isHi ? 'कॉपी हुआ' : 'Copied') : (isHi ? 'कॉपी करें' : 'Copy')}</span>
                  </button>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {customMessage.length} {isHi ? 'अक्षर' : 'chars'}
                  </span>
                </div>
              </div>
              <textarea
                rows={4}
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="w-full bg-cyber-800/90 border border-cyber-border rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500 leading-relaxed font-sans"
              />
            </div>

            {/* Collapsible Fast2SMS Telecom Gateway Settings */}
            <div className="p-3 bg-cyber-800/60 rounded-xl border border-cyber-border space-y-2.5">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowGatewayConfig(!showGatewayConfig)}
                  className="text-xs text-slate-300 hover:text-white font-semibold flex items-center gap-1.5"
                >
                  <Key className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isHi ? '⚙️ सीधे SIM कार्ड SMS गेटवे सेटिंग्स (Fast2SMS API)' : '⚙️ Direct SIM SMS Gateway Settings (Fast2SMS API)'}</span>
                </button>
                <span className="text-[10px] text-slate-400">
                  {fast2smsKey ? (
                    <span className="text-emerald-400 font-bold">✓ API Key Configured</span>
                  ) : (
                    <span>{isHi ? 'वैकल्पिक (Optional)' : 'Optional'}</span>
                  )}
                </span>
              </div>

              {showGatewayConfig && (
                <div className="space-y-2 pt-2 border-t border-cyber-border/60 text-xs animate-in fade-in">
                  <p className="text-[11px] text-slate-400">
                    {isHi ? (
                      <>
                        अगर आप बिना WhatsApp के सीधे फोन के सिम कार्ड पर SMS पाना चाहते हैं, तो <a href="https://www.fast2sms.com" target="_blank" rel="noreferrer" className="text-amber-400 underline font-semibold">Fast2SMS.com</a> पर मुफ़्त साइन अप करके अपनी <strong>API Key</strong> यहाँ डालें:
                      </>
                    ) : (
                      <>
                        To receive direct cellular SMS on SIM without WhatsApp, register free on <a href="https://www.fast2sms.com" target="_blank" rel="noreferrer" className="text-amber-400 underline font-semibold">Fast2SMS.com</a> and paste your <strong>API Key</strong>:
                      </>
                    )}
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={fast2smsKey}
                      onChange={(e) => handleSaveApiKey(e.target.value)}
                      placeholder="Paste your Fast2SMS API Key here..."
                      className="flex-1 bg-cyber-900 border border-cyber-border rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-amber-500"
                    />
                    {fast2smsKey && (
                      <button
                        type="button"
                        onClick={() => handleSaveApiKey('')}
                        className="text-xs text-red-400 hover:underline px-2"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* THREE CLEAR TRANSMISSION BUTTONS */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-semibold text-slate-300 block">
                {isHi ? 'संदेश भेजने का माध्यम चुनें:' : 'Select Transmission Method:'}
              </span>

              <div className="grid sm:grid-cols-3 gap-2.5">
                {/* Method 1: WhatsApp (Primary) */}
                <button
                  type="button"
                  disabled={isSending}
                  onClick={handleSendViaWhatsApp}
                  className="py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-xs tracking-wide shadow-lg shadow-emerald-600/30 transition-all flex flex-col items-center justify-center text-center gap-1 border border-emerald-400/40"
                >
                  <div className="flex items-center gap-1.5">
                    <ExternalLink className="w-4 h-4" />
                    <span>{isHi ? '🟢 WhatsApp से भेजें' : '🟢 Send via WhatsApp'}</span>
                  </div>
                  <span className="text-[10px] text-emerald-100 font-normal">
                    {isHi ? '100% मुफ़्त एवं तुरंत' : 'Instant & 100% Free'}
                  </span>
                </button>

                {/* Method 2: Mobile SMS App */}
                <button
                  type="button"
                  disabled={isSending}
                  onClick={handleSendViaSMSApp}
                  className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 font-bold text-xs tracking-wide shadow-lg transition-all flex flex-col items-center justify-center text-center gap-1 border border-cyan-500/40"
                >
                  <div className="flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    <span>{isHi ? '💬 फ़ोन के SMS ऐप से' : '💬 Device SMS App'}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {isHi ? 'मैसेज ऐप में खुलेगा' : 'Opens Phone Messenger'}
                  </span>
                </button>

                {/* Method 3: Direct Telecom SMS */}
                <button
                  type="button"
                  disabled={isSending}
                  onClick={handleSendViaTelecomSMS}
                  className="py-3 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 text-white font-bold text-xs tracking-wide shadow-lg shadow-orange-600/20 transition-all flex flex-col items-center justify-center text-center gap-1 border border-amber-400/40"
                >
                  <div className="flex items-center gap-1.5">
                    <Send className="w-4 h-4" />
                    <span>{isHi ? '🚀 Telecom SIM SMS' : '🚀 Telecom SIM SMS'}</span>
                  </div>
                  <span className="text-[10px] text-amber-100 font-normal">
                    {isHi ? 'Fast2SMS गेटवे द्वारा' : 'Via Fast2SMS Gateway'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Dispatched History Table */
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>{isHi ? 'हाल ही में भेजे गए फ्रॉड अलर्ट संदेश:' : 'Recently Dispatched Fraud Alert Notifications:'}</span>
              <button
                onClick={loadHistory}
                className="text-blue-400 hover:underline flex items-center space-x-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>{isHi ? 'रिफ्रेश करें' : 'Refresh'}</span>
              </button>
            </div>

            {history.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 bg-cyber-800/40 rounded-xl border border-cyber-border">
                {isHi ? 'अभी तक कोई आपातकालीन अलर्ट नहीं भेजा गया है।' : 'No emergency alerts dispatched yet.'}
              </div>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                {history.map((alert) => (
                  <div
                    key={alert.id}
                    className="p-3.5 bg-cyber-800/70 border border-cyber-border rounded-xl space-y-2 text-xs"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-800">
                          {alert.alert_type}
                        </span>
                        <span className="font-bold text-white font-mono">{alert.recipient_phone}</span>
                        {alert.recipient_name && (
                          <span className="text-slate-400">({alert.recipient_name})</span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-[10px]">
                        <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                          ✓ {alert.status}
                        </span>
                        <span className="text-slate-500 font-mono">
                          {new Date(alert.sent_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-300 bg-cyber-900/60 p-2 rounded-lg border border-cyber-border text-[11px] leading-relaxed font-sans">
                      {alert.message_content}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      {alert.dispatch_hash && (
                        <div className="flex items-center space-x-1 text-[9px] text-slate-500 font-mono overflow-hidden text-ellipsis">
                          <Hash className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                          <span>SHA-256: {alert.dispatch_hash.substring(0, 24)}...</span>
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const clean = getCleanPhone(alert.recipient_phone);
                          window.open(`https://api.whatsapp.com/send?phone=${clean}&text=${encodeURIComponent(alert.message_content)}`, '_blank');
                        }}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>{isHi ? 'व्हाट्सएप पर पुनः भेजें' : 'Re-send via WhatsApp'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
