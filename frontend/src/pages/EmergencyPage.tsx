import React, { useState, useEffect } from 'react';
import { AlertTriangle, PhoneCall, CheckCircle2, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { api } from '../services/api';
import { SolutionTimeline } from '../components/SolutionTimeline';
import { useLanguage } from '../context/LanguageContext';

interface EmergencyPageProps {
  onDraftIncident?: (draft: any) => void;
  prefillPayload?: any;
}

export const EmergencyPage: React.FC<EmergencyPageProps> = ({ onDraftIncident, prefillPayload }) => {
  const { language, t } = useLanguage();
  const [url, setUrl] = useState<string>(prefillPayload?.url || '');
  const [selectedInfo, setSelectedInfo] = useState<string[]>(prefillPayload?.info_entered || ['Password']);
  const [moneyLost, setMoneyLost] = useState<string>(prefillPayload?.money_lost || 'NO');
  const [amountLost, setAmountLost] = useState<string>('20000');
  const [transactionId, setTransactionId] = useState<string>('DEMO20260918739182');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [emergencyResult, setEmergencyResult] = useState<any>(null);

  const infoOptionsEN = [
    'Password',
    'OTP / One-Time Password',
    'Card details (CVV, Expiry)',
    'Banking information / NetBanking User ID',
    'UPI PIN',
    'Personal information (Aadhaar / PAN)',
    'Nothing (Closed immediately)'
  ];

  const infoOptionsHI = [
    'पासवर्ड (Password)',
    'OTP / वन-टाइम पासवर्ड',
    'कार्ड विवरण (CVV, समाप्ति तिथि)',
    'नेट बैंकिंग यूजर आईडी / बैंक विवरण',
    'UPI पिन (UPI PIN)',
    'व्यक्तिगत जानकारी (आधार / पैन कार्ड)',
    'कुछ भी नहीं (तुरंत बंद कर दिया)'
  ];

  const EMERGENCY_STEPS_HI: Record<string, string> = {
    // Money Lost
    "CALL 1930 IMMEDIATELY: Dial the National Cyber Fraud Reporting Helpline (1930) to trigger an immediate inter-bank transaction freeze.":
      "तुरंत 1930 मिलाएं: अंतर-बैंक लेनदेन को तुरंत फ्रीज कराने के लिए राष्ट्रीय साइबर हेल्पलाइन (1930) पर कॉल करें।",
    "FREEZE BANKING & UPI: Open your legitimate banking app or call your bank's emergency phone number to freeze net banking and UPI access.":
      "बैंकिंग और UPI फ्रीज करें: अपने आधिकारिक बैंक ऐप से या बैंक के आपातकालीन नंबर पर कॉल करके नेट बैंकिंग और UPI को तत्काल बंद करें।",
    "PRESERVE UTR / TRANSACTION ID: Copy your bank debit SMS details, recipient UPI VPA, and time of transfer.":
      "UTR / ट्रांजेक्शन आईडी सुरक्षित रखें: बैंक के डेबिट SMS का विवरण, धोखेबाज का UPI VPA और समय को कॉपी करके सुरक्षित रखें।",
    "DO NOT PANIC: Speed within the first 2-3 hours is vital to recovering intercepted funds before cash-out.":
      "घबराएं नहीं: शुरुआती 2-3 घंटों के भीतर की गई त्वरित कार्रवाई से पैसे वापस मिलने की संभावना सबसे अधिक होती है।",
    "FILE FORMAL REPORT: Draft a full dossier using RakshaAI's Report Generator and submit to cybercrime.gov.in.":
      "औपचारिक शिकायत दर्ज करें: रक्षाAI रिपोर्ट जनरेटर से शिकायत ड्राफ्ट तैयार करें और cybercrime.gov.in पर जमा करें।",

    // Sensitive info entered
    "CHANGE PASSWORDS IMMEDIATELY: From a clean device or separate browser, log into the authentic service and reset passwords.":
      "तुरंत पासवर्ड बदलें: किसी अन्य सुरक्षित फोन या ब्राउज़र से असली वेबसाइट पर लॉगिन करके अपना पासवर्ड तुरंत बदलें।",
    "TERMINATE ACTIVE SESSIONS: Check account security settings and click 'Log out of all devices/sessions'.":
      "सक्रिय सत्र समाप्त करें: सुरक्षा सेटिंग्स में जाकर 'सभी उपकरणों और सत्रों से लॉग आउट' (Log out of all devices) चुनें।",
    "ENABLE TWO-FACTOR AUTH (2FA): Switch to app-based 2FA (Google Authenticator / Microsoft Authenticator) instead of SMS OTP.":
      "2FA (टू-फैक्टर ऑथेंटिकेशन) चालू करें: SMS OTP के बजाय गूगल ऑथेंटिकेटर जैसे सुरक्षित ऐप-आधारित 2FA का उपयोग करें।",
    "MONITOR FINANCIAL STATEMENTS: Inspect bank accounts and credit cards for test micro-charges (e.g. ₹1 or ₹2).":
      "बैंक खातों पर नजर रखें: 1 रुपये या 2 रुपये के किसी भी संदिग्ध टेस्ट चार्ज के लिए अपने बैंक स्टेटमेंट की जांच करें।",
    "PRESERVE PHISHING URL: Save the exact link and screenshot to RakshaAI Evidence Locker.":
      "फिशिंग लिंक सुरक्षित करें: उस सटीक लिंक और स्क्रीनशॉट को रक्षाAI साक्ष्य वॉल्ट में जमा करें।",

    // Passive visit
    "CLOSE THE TAB: Close the suspicious website tab immediately.":
      "टैब तुरंत बंद करें: संदिग्ध वेबसाइट का ब्राउज़र टैब तुरंत बंद कर दें।",
    "CHECK DOWNLOADS: Inspect your browser Downloads folder. If an .apk, .exe, or .zip downloaded automatically, delete it without running!":
      "डाउनलोड्स जांचें: अपने फोन का डाउनलोड्स फोल्डर देखें। यदि कोई .apk, .exe या .zip डाउनलोड हुआ है, तो उसे बिना खोले तुरंत डिलीट करें!",
    "CLEAR CACHE: Clear browser history and temporary site data to remove tracking cookies.":
      "कैशे साफ करें: ट्रैकिंग कुकीज़ हटाने के लिए ब्राउज़र हिस्ट्री और साइट डेटा पूरी तरह साफ करें।",
    "RUN SCAN: Run a standard device scan using your device's built-in antivirus (Microsoft Defender / Play Protect).":
      "सुरक्षा स्कैन चलाएं: अपने फोन या लैपटॉप पर गूगल प्ले प्रोटेक्ट या माइक्रोसॉफ्ट डिफेंडर से तुरंत सुरक्षा स्कैन चलाएं।"
  };

  const infoOptions = language === 'HI' ? infoOptionsHI : infoOptionsEN;

  const toggleInfo = (opt: string) => {
    const nothingStr = language === 'HI' ? 'कुछ भी नहीं (तुरंत बंद कर दिया)' : 'Nothing (Closed immediately)';
    if (opt.includes('Nothing') || opt.includes('कुछ भी नहीं')) {
      setSelectedInfo([nothingStr]);
      return;
    }
    const filtered = selectedInfo.filter(x => !x.includes('Nothing') && !x.includes('कुछ भी नहीं'));
    if (filtered.includes(opt)) {
      setSelectedInfo(filtered.filter(x => x !== opt));
    } else {
      setSelectedInfo([...filtered, opt]);
    }
  };

  const executeTriage = async (targetUrl: string, info: string[], lost: string) => {
    setIsSubmitting(true);
    try {
      const res = await api.emergencyLinkTriage({
        url: targetUrl.trim(),
        info_entered: info,
        money_lost: lost,
        amount_lost: lost === 'YES' ? parseFloat(amountLost || '0') : 0,
        transaction_id: lost === 'YES' ? transactionId : undefined
      });
      setEmergencyResult(res);
    } catch (err: any) {
      alert('Triage request failed: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (prefillPayload?.url) {
      setUrl(prefillPayload.url);
      const info = prefillPayload.info_entered || selectedInfo;
      const lost = prefillPayload.money_lost || moneyLost;
      setSelectedInfo(info);
      setMoneyLost(lost);
      executeTriage(prefillPayload.url, info, lost);
    }
  }, [prefillPayload]);

  const handleTriage = () => {
    executeTriage(url, selectedInfo, moneyLost);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-4">
      {/* Top Warning Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-red-950 via-cyber-900 to-red-950 border border-red-500/50 shadow-2xl">
        <div className="flex items-center space-x-3 text-red-400 mb-2">
          <AlertTriangle className="w-8 h-8 animate-pulse text-red-500" />
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {t('emerg_header_title')}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {t('emerg_header_desc')}
        </p>
      </div>

      {/* Emergency Form */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyber-border space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            {t('emerg_url_label')}
          </label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="e.g. https://income-tax-refund-gov-in.buzz/portal"
            className="w-full bg-cyber-900 border border-cyber-border rounded-xl px-4 py-3 text-sm text-slate-200 focus:outline-none focus:border-red-500 font-mono"
          />
        </div>

        {/* Question 1 */}
        <div>
          <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
            {t('emerg_q1')}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {infoOptions.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => toggleInfo(opt)}
                className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                  selectedInfo.includes(opt)
                    ? 'bg-red-950/50 border-red-500 text-white'
                    : 'bg-cyber-900 border-cyber-border text-slate-300 hover:text-white'
                }`}
              >
                <span>{opt}</span>
                {selectedInfo.includes(opt) && <CheckCircle2 className="w-4 h-4 text-red-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Question 2 */}
        <div>
          <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
            {t('emerg_q2')}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { val: 'YES', label: language === 'HI' ? 'हाँ (YES)' : 'YES' },
              { val: 'NO', label: language === 'HI' ? 'नहीं (NO)' : 'NO' },
              { val: 'NOT SURE', label: language === 'HI' ? 'पक्का नहीं (NOT SURE)' : 'NOT SURE' }
            ].map((ans) => (
              <button
                key={ans.val}
                type="button"
                onClick={() => setMoneyLost(ans.val)}
                className={`py-3 rounded-xl border text-center text-xs font-extrabold transition-all ${
                  moneyLost === ans.val
                    ? (ans.val === 'YES' ? 'bg-red-600 text-white border-red-500 shadow-lg shadow-red-600/30' : 'bg-cyber-800 text-white border-blue-500')
                    : 'bg-cyber-900 border-cyber-border text-slate-400 hover:text-white'
                }`}
              >
                {ans.label}
              </button>
            ))}
          </div>
        </div>

        {/* If money lost = YES, show amount and transaction id */}
        {moneyLost === 'YES' && (
          <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 space-y-4 animate-in fade-in">
            <h4 className="text-xs font-extrabold text-red-300 uppercase tracking-wider">
              {language === 'HI' ? 'वित्तीय नुकसान का विवरण (1930 और बैंक शिकायत हेतु)' : 'Financial Loss Details (for 1930 / Bank dispute)'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  {language === 'HI' ? 'कटी हुई अनुमानित राशि (रुपये ₹)' : 'Approximate Amount Lost (INR ₹)'}
                </label>
                <input
                  type="number"
                  value={amountLost}
                  onChange={(e) => setAmountLost(e.target.value)}
                  className="w-full bg-cyber-900 border border-cyber-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1">
                  {language === 'HI' ? 'बैंक ट्रांजैक्शन UTR / रेफरेंस नंबर (SMS से)' : 'Bank Transaction UTR / Ref Number (from SMS)'}
                </label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g. TXN29104928"
                  className="w-full bg-cyber-900 border border-cyber-border rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-red-500 font-mono"
                />
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleTriage}
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-black text-sm shadow-xl shadow-red-600/30 transition-all flex items-center justify-center space-x-2"
        >
          <span>{t('emerg_btn_protocol')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Emergency Results */}
      {emergencyResult && (
        <div className="space-y-6 animate-in fade-in">
          {/* Priority Helpline Callout */}
          {moneyLost === 'YES' && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-2xl border border-red-400/40 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase bg-red-950/60 px-2.5 py-1 rounded font-bold border border-red-400/40">
                  {t('emerg_golden_tag')}
                </span>
                <h3 className="text-2xl font-black">{t('emerg_call_1930')}</h3>
                <p className="text-xs text-red-100 max-w-xl leading-relaxed">
                  {t('emerg_call_1930_desc')}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a
                  href="tel:1930"
                  className="px-6 py-3.5 rounded-xl bg-white text-red-700 font-black text-sm shadow-xl hover:bg-red-50 flex items-center justify-center space-x-2"
                >
                  <PhoneCall className="w-5 h-5 text-red-600" />
                  <span>{t('emerg_btn_call')}</span>
                </a>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-red-950/60 text-white font-bold text-sm border border-white/30 hover:bg-red-950 flex items-center justify-center space-x-1.5"
                >
                  <span>{t('emerg_btn_portal')}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          )}

          {/* Immediate Steps Checklist */}
          <div className="glass-panel p-6 rounded-2xl border border-cyber-border">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center">
              <Clock className="w-4 h-4 mr-2 text-red-400" />
              {t('emerg_actions_title')}
            </h3>
            <ul className="space-y-3">
              {emergencyResult.safety_steps.map((st: string, idx: number) => {
                const displayStep = language === 'HI' ? (EMERGENCY_STEPS_HI[st] || st) : st;
                return (
                  <li key={idx} className="p-3 rounded-xl bg-cyber-900/80 border border-cyber-border flex items-start text-xs text-slate-200">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-950 text-red-400 text-[11px] font-bold mr-2.5 shrink-0 border border-red-500/40">
                      {idx + 1}
                    </span>
                    <span>{displayStep}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <SolutionTimeline timeline={emergencyResult.solution_timeline} />

          {/* Incident Draft Button */}
          {emergencyResult.incident_draft && (
            <div className="p-6 rounded-2xl bg-cyber-800 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">
                  {language === 'HI' ? 'आधिकारिक प्रारंभिक घटना दस्तावेज बनाएं' : 'Create Official Preliminary Incident Dossier'}
                </h4>
                <p className="text-xs text-slate-400">
                  {language === 'HI' ? 'SHA-256 डिजिटल हैश के साथ शिकायत तैयार करता है।' : 'Prepares a copy-ready complaint and saves digital evidence with SHA-256 hashes.'}
                </p>
              </div>
              <button
                onClick={() => onDraftIncident && onDraftIncident(emergencyResult.incident_draft)}
                className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition-all flex items-center space-x-2 shrink-0"
              >
                <span>{t('emerg_dossier_btn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
