import React, { useState } from 'react';
import { BookOpen, Languages, Shield, CheckCircle2, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const AcademyPage: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const lang = language;
  const [expandedId, setExpandedId] = useState<number | null>(1);

  const modules = [
    {
      id: 1,
      titleEN: 'AI Voice Cloning & Virtual Kidnapping',
      titleHI: 'AI वॉयस क्लोनिंग और वर्चुअल किडनैपिंग स्कैम',
      tag: 'AI Deepfakes',
      contentEN: {
        summary: 'Scammers take a 3-second audio snippet from Instagram or YouTube to clone your child or relative’s voice, then call demanding emergency bail or hospital funds.',
        redFlags: [
          'Extreme urgency demanding immediate wire transfer.',
          'Caller insists you do not disconnect or consult anyone else.',
          'Audio has slight metallic vocoder frequency cutoff or lacks natural breathing pauses.'
        ],
        protection: [
          'Immediately disconnect the call.',
          'Call the person back on their regular cell number (SIM to SIM).',
          'Ask your secret Family Safe-Word.'
        ]
      },
      contentHI: {
        summary: 'धोखेबाज़ सोशल मीडिया से 3 सेकंड की आवाज़ का नमूना लेकर AI से आपके बच्चे या रिश्तेदार की आवाज़ बना लेते हैं, और दुर्घटना या जेल का बहाना बनाकर तुरंत पैसे मांगते हैं।',
        redFlags: [
          'अत्यधिक घबराहट और तुरंत पैसे भेजने का भारी दबाव।',
          'फोन न काटने और किसी अन्य रिश्तेदार से बात न करने की चेतावनी।',
          'आवाज़ में असामान्य रोबोटिक टोन या सांस लेने के प्राकृतिक अंतराल का अभाव।'
        ],
        protection: [
          'तुरंत फोन काट दें।',
          'उस परिजन के सामान्य मोबाइल नंबर पर सीधे कॉल करें।',
          'अपने परिवार का गुप्त "सेफ-वर्ड" पूछें।'
        ]
      }
    },
    {
      id: 2,
      titleEN: 'The Reverse-QR Code Scam (UPI PIN Trap)',
      titleHI: 'रिवर्स क्यूआर कोड घोटाला (UPI पिन जाल)',
      tag: 'UPI Fraud',
      contentEN: {
        summary: 'A fake buyer on OLX/Marketplace sends a QR code claiming: "Scan this QR code and type your PIN to receive advance payment".',
        redFlags: [
          'Anyone telling you to enter UPI PIN to receive money.',
          'QR codes sent via WhatsApp chat for buyer payments.',
          'Incoming "Collect Request" disguised as a refund or prize.'
        ],
        protection: [
          'NEVER enter your UPI PIN to receive money.',
          'Entering your UPI PIN ALWAYS transfers money OUT of your bank account.',
          'Reject any collect requests from unfamiliar VPAs.'
        ]
      },
      contentHI: {
        summary: 'OLX या फेसबुक मार्केटप्लेस पर कोई फर्जी खरीदार QR कोड भेजकर कहता है: "पैसे पाने के लिए इसे स्कैन करें और अपना UPI पिन डालें"।',
        redFlags: [
          'पैसे प्राप्त करने के लिए UPI पिन डालने को कहना।',
          'व्हाट्सएप पर भुगतान पाने के लिए QR कोड भेजना।',
          'रिफंड या इनाम के नाम पर "कलेक्ट रिक्वेस्ट" भेजना।'
        ],
        protection: [
          'पैसे प्राप्त करने के लिए कभी भी UPI पिन न डालें।',
          'UPI पिन डालने से हमेशा आपके खाते से पैसे कटते हैं!',
          'अपरिचित लोगों के कलेक्ट अनुरोध को तुरंत अस्वीकार करें।'
        ]
      }
    },
    {
      id: 3,
      titleEN: 'The "Digital Arrest" Police / CBI Threat Scam',
      titleHI: '"डिजिटल अरेस्ट" पुलिस / CBI फर्जी कॉल घोटाला',
      tag: 'Coercion & Extortion',
      contentEN: {
        summary: 'Scammers wear fake police uniforms on Skype or WhatsApp video, claiming your Aadhaar was used in illegal drugs/parcels and demand "security deposits" to clear your name.',
        redFlags: [
          'Official law enforcement demanding you stay on video call for hours ("Digital Arrest").',
          'Threatening immediate arrest unless funds are transferred to a "RBI verification account".',
          'Displaying fake court orders, arrest warrants, or forged CBI letters.'
        ],
        protection: [
          'Indian Law Enforcement NEVER conducts "Digital Arrests" or court hearings over Skype/WhatsApp!',
          'Police will never ask citizens to transfer funds to any bank account for clearance.',
          'Immediately disconnect and dial 1930 and 112.'
        ]
      },
      contentHI: {
        summary: 'धोखेबाज़ स्काइप या व्हाट्सएप वीडियो पर नकली पुलिस वर्दी पहनकर दावा करते हैं कि आपके आधार से ड्रग्स या मनी लॉन्ड्रिंग पार्सल भेजा गया है और आपको घर में "डिजिटल अरेस्ट" किया जाता है।',
        redFlags: [
          'पुलिस या सीबीआई का वीडियो कॉल पर घंटों बैठे रहने का दबाव बनाना।',
          'मामले से नाम हटाने के लिए "वेरिफिकेशन खाते" में पैसे ट्रांसफर करने की मांग।',
          'नकली अदालती आदेश, गिरफ्तारी वारंट या CBI पत्र दिखाना।'
        ],
        protection: [
          'भारतीय कानून में स्काइप या व्हाट्सएप पर "डिजिटल अरेस्ट" का कोई प्रावधान नहीं है!',
          'पुलिस कभी भी पैसे ट्रांसफर करने के लिए कोई बैंक खाता नहीं देती।',
          'तुरंत कॉल काटें और राष्ट्रीय साइबर हेल्पलाइन 1930 या 112 पर सूचना दें।'
        ]
      }
    },
    {
      id: 4,
      titleEN: 'Golden Hour Protocol: What to Do If Money Was Stolen',
      titleHI: 'गोल्डन ऑवर प्रोटोकॉल: अगर पैसे कट जाएं तो क्या करें',
      tag: 'Emergency Recovery',
      contentEN: {
        summary: 'The first 2 to 3 hours after unauthorized debit are known as the "Golden Hour". Rapid reporting allows banks to block funds in transit before withdrawal.',
        redFlags: [
          'Waiting hours or days hoping the scammer will refund you.',
          'Searching customer care numbers on Google (most top results are fake scammer numbers!).'
        ],
        protection: [
          'Dial 1930 immediately (National Cyber Financial Fraud Helpline).',
          'Call your bank\'s 24x7 helpline to block net banking, UPI, and debit cards.',
          'Note down transaction UTR, date/time, and beneficiary UPI ID.',
          'File an incident dossier on https://cybercrime.gov.in using RakshaAI.'
        ]
      },
      contentHI: {
        summary: 'पैसे कटने के शुरुआती 2 से 3 घंटे "गोल्डन ऑवर" कहलाते हैं। इस दौरान तुरंत शिकायत करने पर पुलिस और बैंक धोखेबाज़ के खाते को फ्रीज कर पैसे बचा सकते हैं।',
        redFlags: [
          'धोखेबाज़ के पैसे लौटाने का इंतज़ार करना।',
          'गूगल पर बैंक कस्टमर केयर नंबर खोजना (गूगल पर अधिकांश नंबर फर्जी धोखेबाज़ों के होते हैं!)।'
        ],
        protection: [
          'बिना देर किए तुरंत 1930 (राष्ट्रीय साइबर वित्तीय धोखाधड़ी हेल्पलाइन) पर कॉल करें।',
          'अपने बैंक को तुरंत कॉल करके अपने कार्ड और नेट बैंकिंग को ब्लॉक कराएं।',
          'ट्रांजैक्शन UTR नंबर, समय और आरोपी का UPI ID सुरक्षित रखें।',
          'RakshaAI के माध्यम से cybercrime.gov.in पर आधिकारिक शिकायत दर्ज कराएं।'
        ]
      }
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-mono mb-2">
            <BookOpen className="w-4 h-4" />
            <span>{t('acad_tag')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {t('acad_title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('acad_desc')}
          </p>
        </div>

        {/* Language Toggle */}
        <div className="flex items-center p-1 bg-cyber-800 rounded-xl border border-cyber-border self-start sm:self-auto shrink-0">
          <button
            onClick={() => setLanguage('EN')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              language === 'EN' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setLanguage('HI')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              language === 'HI' ? 'bg-blue-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            हिंदी (Hindi)
          </button>
        </div>
      </div>

      {/* Modules Accordion */}
      <div className="space-y-4">
        {modules.map((mod) => {
          const isExpanded = expandedId === mod.id;
          const data = lang === 'EN' ? mod.contentEN : mod.contentHI;
          const title = lang === 'EN' ? mod.titleEN : mod.titleHI;

          return (
            <div
              key={mod.id}
              className={`glass-panel rounded-2xl border transition-all overflow-hidden ${
                isExpanded ? 'border-teal-500/50 shadow-xl' : 'border-cyber-border hover:border-cyber-border/80'
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : mod.id)}
                className="w-full p-6 text-left flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyber-900 text-teal-300 border border-cyber-border mb-2 inline-block">
                    {mod.tag}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white">{title}</h3>
                </div>
                <div className="p-2 rounded-xl bg-cyber-800 text-slate-400">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-cyber-border/60 space-y-5 animate-in fade-in">
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-cyber-900/60 p-4 rounded-xl border border-cyber-border">
                    {data.summary}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Red Flags */}
                    <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30">
                      <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-2 flex items-center">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1" />
                        {lang === 'EN' ? 'RED FLAGS TO IDENTIFY:' : 'धोखे के प्रमुख संकेत:'}
                      </h4>
                      <ul className="space-y-2">
                        {data.redFlags.map((flag, idx) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-start">
                            <span className="text-red-400 mr-2 font-bold">•</span>
                            <span>{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* How to Stay Safe */}
                    <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                      <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        {lang === 'EN' ? 'HOW TO STAY PROTECTED:' : 'सुरक्षित रहने के नियम:'}
                      </h4>
                      <ul className="space-y-2">
                        {data.protection.map((prot, idx) => (
                          <li key={idx} className="text-xs text-slate-300 flex items-start">
                            <span className="text-emerald-400 mr-2 font-bold">✓</span>
                            <span>{prot}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
