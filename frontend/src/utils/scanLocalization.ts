import { AnalysisResponse, SignalItem, ExplanationItem, SafetyGuidance, SolutionTimeline, VerificationGuide } from '../types';

// Map of Signal Indicators and Descriptions (EN -> HI)
const signalTranslations: Record<string, { indicator: string; description: string }> = {
  // Voice & Audio Forensics
  'Vocoder Frequency Cutoff': {
    indicator: 'वोकोडर फ्रीक्वेंसी कटऑफ (AI आवाज़ संकेत)',
    description: 'ऑडियो स्पेक्ट्रम में 8kHz या 16kHz पर कृत्रिम कटऑफ पाया गया, जो कि HiFi-GAN और न्यूरल वोकोडर द्वारा उत्पन्न वॉयस क्लोनिंग का प्रमुख संकेत है।'
  },
  'Glottal Pulse Irregularity': {
    indicator: 'कृत्रिम ध्वनि तरंगें व सांस अंतराल का अभाव',
    description: 'आवाज़ में प्राकृतिक सांस लेने का अंतराल और जैविक उतार-चढ़ाव (Micro-jitter) गायब है।'
  },
  'High-Pressure Coercion / Urgency Detected': {
    indicator: 'तात्कालिक दबाव व भावनात्मक भय की पहचान',
    description: 'कॉल के लहजे में तुरंत पैसे भेजने और फोन न काटने का अत्यधिक मानसिक दबाव देखा गया।'
  },
  'Natural Speech Harmonics Verified': {
    indicator: 'प्राकृतिक मानव आवाज़ तरंगें सत्यापित',
    description: 'ऑडियो में प्राकृतिक सांस लेने के अंतराल, सामान्य वोकल कॉर्ड कंपन्न और जैविक भिन्नता मौजूद है।'
  },
  'Spectral Harmonics Analysis': {
    indicator: 'स्पेक्ट्रल हार्मोनिक्स व वोकोडर विश्लेषण',
    description: 'ऑडियो स्पेक्ट्रम में न्यूरल वोकोडर और कृत्रिम तरंगों की विकृति पाई गई है।'
  },
  'Prosody & Pitch Micro-variation': {
    indicator: 'पिच कंपन और ध्वनि प्रवाह (Pitch Micro-variation)',
    description: 'प्राकृतिक मानव आवाज़ का जैविक सूक्ष्म कंपन (Micro-jitter) अनुपस्थित या कृत्रिम रूप से संश्लेषित है।'
  },
  'Phonetic Transitions & Glottal Pulse': {
    indicator: 'ध्वनि संक्रमण और सांस अंतराल (Glottal Pulse)',
    description: 'शब्दों के बीच स्वाभाविक सांस लेने का अंतराल गायब है, जो AI आवाज़ का प्रमुख लक्षण है।'
  },
  'Ambient Acoustic Room Consistency': {
    indicator: 'कमरे की पृष्ठभूमि ध्वनि में असंगति (Acoustic Consistency)',
    description: 'पृष्ठभूमि ध्वनि और कमरे के प्राकृतिक गूंज पैटर्न में कृत्रिम भिन्नता पाई गई है।'
  },

  // Video & Deepfake Forensics (Matching video_provider.py)
  'Facial Boundary & Edge Blending': {
    indicator: 'चेहरे के किनारों व बाउंड्री पर विकृति (Edge Blending)',
    description: 'जबड़े और माथे के किनारों पर डिफ्यूजन ब्लेंडिंग और चेहरे की कृत्रिम कटिंग (Alpha Mask Feathering) पाई गई है।'
  },
  'Temporal Consistency & Blink Interval': {
    indicator: 'पलक झपकने की दर व फ्रेम असंगति (Blink Interval)',
    description: 'फ्रेम-दर-फ्रेम पलक झपकने की दर अप्राकृतिक है (सामान्य जैविक दर 15-20 बार/मिनट की तुलना में केवल 1.2 बार/मिनट)।'
  },
  'Lip-Sync & Phoneme Alignment (AV Latency)': {
    indicator: 'आवाज़ और होंठों के तालमेल में अंतर (Lip-Sync Latency)',
    description: 'ऑडियो की ध्वनि (/b/, /p/, /m/) और होंठों के हिलने-डुलने के बीच स्पष्ट अंतर (Desynchronization) पाया गया है।'
  },
  'Skin Texture & Specular Lighting': {
    indicator: 'त्वचा की बनावट और प्रकाश परावर्तन में असंगति',
    description: 'चेहरे की हड्डियों पर रोशनी का फैलाव और त्वचा की चमक कृत्रिम रूप से उत्पन्न डीपफेक पैटर्न दर्शाती है।'
  },
  'Facial Boundary Feathering': {
    indicator: 'चेहरे के किनारों पर धुंधलापन व विकृति',
    description: 'चेहरे और गर्दन के किनारों पर डिफ्यूजन ब्लेंडिंग और पिक्सेल आर्टिफैक्ट्स पाए गए हैं।'
  },
  'Unnatural Blink Cadence': {
    indicator: 'अप्राकृतिक पलक झपकने की दर',
    description: 'चेहरे पर पलक झपकने का समय और अंतराल सामान्य जैविक दर से मेल नहीं खाता।'
  },
  'Audio-Visual Lip Sync Discrepancy': {
    indicator: 'आवाज़ और होंठों के तालमेल में अंतर (Lip-Sync Lag)',
    description: 'ऑडियो की ध्वनि और होंठों की गति में 140ms से अधिक की देरी पाई गई है।'
  },
  'Organic Facial Dynamics': {
    indicator: 'प्राकृतिक चेहरे की गतिशीलता सत्यापित',
    description: 'चेहरे की मांसपेशियों की गति, प्रकाश परावर्तन और आंखों का तालमेल सामान्य मानव व्यवहार से मेल खाता है।'
  },

  // Link & Domain Forensics (Matching link_provider.py)
  'Raw IP Address Host': {
    indicator: 'सीधा IP एड्रेस लिंक (बिना डोमेन नाम)',
    description: 'यह लिंक किसी सुरक्षित पंजीकृत वेबसाइट के बजाय सीधे संख्यात्मक IP पते पर भेजा जा रहा है।'
  },
  'Brand Impersonation / Deceptive Domain': {
    indicator: 'ब्रांड की नकल व फर्जी डोमेन (Brand Impersonation)',
    description: 'यह डोमेन असली बैंक या ब्रांड के नाम की नकल करके अनधिकृत सर्वर पर चलाया जा रहा है।'
  },
  'High-Risk TLD Extension': {
    indicator: 'उच्च जोखिम वाला डोमेन एक्सटेंशन (.top, .xyz, .click)',
    description: 'यह वेबसाइट ऐसे सस्ते व अपंजीकृत डोमेन एक्सटेंशन पर है जिसका इस्तेमाल आमतौर पर साइबर अपराधी करते हैं।'
  },
  'URL Shortener Masking': {
    indicator: 'छुपाया गया छोटा लिंक (URL Shortener Masking)',
    description: 'असली गंतव्य पते को छिपाने के लिए लिंक को छोटा (Shortened URL) किया गया है।'
  },
  'Coercive / Scam Keywords Found': {
    indicator: 'दबाव और भय पैदा करने वाले कीवर्ड्स',
    description: 'वेब लिंक में तुरंत कार्रवाई करने, खाता बंद होने या लॉटरी से जुड़े संदिग्ध शब्द पाए गए हैं।'
  },
  'Excessive Nested Subdomains': {
    indicator: 'अत्यधिक सबडोमेन (Nested Subdomains)',
    description: 'सुरक्षा जांच को चकमा देने के लिए लिंक में कई सबडोमेन को एक साथ जोड़ा गया है।'
  },
  'Typosquatting / Lookalike Brand Domain': {
    indicator: 'बैंक/ब्रांड का मिलता-जुलता फर्जी नाम (Typosquatting)',
    description: 'यह डोमेन असली अधिकृत वेबसाइट के नाम की नकल करके बनाया गया है ताकि ग्राहकों को धोखा दिया जा सके।'
  },
  'Suspicious Top-Level Domain (TLD)': {
    indicator: 'संदिग्ध व उच्च जोखिम वाला वेब एक्सटेंशन (.top, .xyz, .click)',
    description: 'यह वेबसाइट ऐसे सस्ते व अपंजीकृत डोमेन एक्सटेंशन पर है जिसका इस्तेमाल आमतौर पर साइबर अपराधी करते हैं।'
  },
  'Credential Harvesting Pattern': {
    indicator: 'पासवर्ड व नेट बैंकिंग लॉगिन चोरी करने वाला पेज',
    description: 'इस पेज पर बैंक लॉगिन, आधार नंबर या पासवर्ड चुराने वाला फर्जी फॉर्म मौजूद है।'
  },
  'Legitimate Domain Verified': {
    indicator: 'विश्वसनीय व अधिकृत डोमेन सत्यापित',
    description: 'यह आधिकारिक डोमेन रिकॉर्ड, SSL प्रमाणपत्र और सुरक्षा मानकों से मेल खाता है।'
  },

  // Message & Social Engineering (Matching message_provider.py)
  'Unsolicited Money Request': {
    indicator: 'अवांछित पैसे भेजने का अनुरोध',
    description: 'संदेश में सीधे बैंक या UPI खाते में पैसे ट्रांसफर करने की मांग की गई है।'
  },
  'Credential / OTP / PIN Harvesting': {
    indicator: 'गोपनीय OTP व UPI पिन चुराने की कोशिश',
    description: 'अति गंभीर धोखाधड़ी संकेत: संदेश में गोपनीय पासवर्ड, OTP या UPI पिन मांगा जा रहा है।'
  },
  'Psychological Coercion & Manufactured Urgency': {
    indicator: 'मानसिक दबाव और फर्जी तात्कालिकता (Psychological Coercion)',
    description: 'डिजिटल अरेस्ट, पुलिस केस या खाता बंद होने की धमकी देकर जल्दबाजी में फैसला लेने का दबाव बनाया गया है।'
  },
  'High-Yield Scam / Fake Prize Lure': {
    indicator: 'फर्जी लॉटरी, इनाम या भारी मुनाफे का लालच',
    description: 'कम समय में भारी मुनाफा, लॉटरी या पार्ट-टाइम नौकरी का झांसा देकर पैसे ऐंठने की रणनीति।'
  },
  'Unverified Web Link or APK Attachment': {
    indicator: 'अपुष्ट वेब लिंक या जासूसी APK फाइल',
    description: 'संदेश में अनजान लिंक या ऐप डाउनलोड करवाने का ट्रिगर मौजूद है।'
  },
  'Money Transfer Request Detected': {
    indicator: 'पैसे ट्रांसफर करने का संदिग्ध अनुरोध',
    description: 'संदेश में तुरंत UPI, बैंक ट्रांसफर या डिजिटल माध्यम से पैसे भेजने की मांग की गई है।'
  },
  'Psychological Urgency & Panic Tactics': {
    indicator: 'घबराहट पैदा करने वाली तात्कालिक चेतावनी',
    description: 'संदेश में बिना सोचे-समझे तुरंत कदम उठाने के लिए कृत्रिम समय सीमा या डर का माहौल बनाया गया है।'
  },
  'OTP / Sensitive Credential Solicitation': {
    indicator: 'OTP या गोपनीय जानकारी मांगने का प्रयास',
    description: 'संदेश में वन-टाइम पासवर्ड (OTP), बैंक पिन या संवेदनशील विवरण साझा करने के लिए कहा जा रहा है।'
  },
  'Digital Arrest / Police Intimidation Scam': {
    indicator: 'फर्जी "डिजिटल अरेस्ट" व पुलिस धमकी घोटाला',
    description: 'संदेश में पुलिस, सीबीआई, नारकोटिक्स या कोर्ट के नाम पर डराकर पैसे ऐंठने की कोशिश की जा रही है।'
  },
  'Fake KYC Blocking Notice': {
    indicator: 'फर्जी बैंक KYC / सिम ब्लॉक करने की धमकी',
    description: 'संदेश में दावा किया गया है कि तुरंत लिंक पर क्लिक न करने पर बैंक खाता या सिम बंद कर दिया जाएगा।'
  },

  // PaymentShield (Matching payment_provider.py)
  'REVERSE QR CODE SCAM DETECTED': {
    indicator: 'रिवर्स QR कोड घोटाला पहचाना गया',
    description: 'सुनहरा नियम: पैसे प्राप्त करने के लिए कभी भी UPI पिन नहीं डाला जाता! पिन डालने से हमेशा आपके खाते से पैसे कटेंगे।'
  },
  'CRITICAL: REVERSE QR CODE SCAM DETECTED': {
    indicator: 'अति गंभीर: रिवर्स QR कोड घोटाला पहचाना गया',
    description: 'पैसे प्राप्त करने के लिए QR कोड स्कैन करने या UPI पिन डालने को कहा जा रहा है। UPI पिन डालने से हमेशा खाते से पैसे कटते हैं!'
  },
  'Deceptive UPI Collect Mandate': {
    indicator: 'धोखाधड़ी वाली UPI कलेक्ट रिक्वेस्ट (Collect Mandate)',
    description: 'इनाम या रिफंड के नाम पर आपके बैंक खाते से पैसे निकालने की रिक्वेस्ट भेजी गई है।'
  },
  'Deceptive Payment Request': {
    indicator: 'धोखाधड़ी वाली कलेक्ट रिक्वेस्ट (Collect Request)',
    description: 'भुगतान प्राप्त करने के नाम पर आपके खाते से पैसे निकालने की रिक्वेस्ट भेजी गई है।'
  },
  'Suspicious VPA Handle': {
    indicator: 'संदिग्ध व फर्जी UPI हैंडल (Fake VPA)',
    description: 'UPI हैंडल में support, refund या officer जैसे शब्द जोड़कर बैंक जैसा दिखने का ढोंग किया गया है।'
  },
  'High Monetary Value (Urgent Transfer)': {
    indicator: 'अत्यधिक बड़ी राशि का तत्काल अनुरोध',
    description: 'बिना किसी पूर्व सत्यापन के अचानक बड़ी राशि ट्रांसफर करने की मांग की गई है।'
  },
  'Unusual High-Value Transfer Demand': {
    indicator: 'असामान्य रूप से बड़ी रकम की मांग',
    description: 'लेन-देन संदर्भ में बिना सत्यापन के तुरंत बड़ी राशि भेजने का दबाव है।'
  },

  // SocialShield (Matching social_provider.py)
  'Instagram Giveaway / Advance Custom Duty Fee Scam': {
    indicator: 'इंस्टाग्राम फर्जी गिफ्ट व कस्टम शुल्क घोटाला',
    description: 'उपहार या पार्सल छुड़ाने के नाम पर अग्रिम कस्टम शुल्क या डिलीवरी चार्ज की फर्जी मांग।'
  },
  'Telegram Pump-and-Dump / Crypto Ponzi Group Indicator': {
    indicator: 'टेलीग्राम फर्जी निवेश व क्रिप्टो पोंजी घोटाला',
    description: 'अनियमित निवेश योजनाएं और 500% तय मुनाफे का लालच देने वाले स्वचालित बॉट ग्रुप्स।'
  },
  'Facebook Marketplace / Advance QR Code Trap': {
    indicator: 'फेसबुक मार्केटप्लेस / अग्रिम QR कोड जाल',
    description: 'सामान खरीदने के नाम पर धोखेबाज़ द्वारा भेजा गया QR कोड। याद रखें: QR कोड से सिर्फ पैसे कटते हैं, कभी मिलते नहीं!'
  },
  'Smishing / Vishing Carrier Gateway Indicator': {
    indicator: 'फर्जी बैंक SMS व अनधिकृत हेडर (Smishing)',
    description: 'बैंक के फर्जी नाम से भेजा गया थोक SMS जिसमें कोई वैध सरकारी पंजीकरण नहीं है।'
  },

  // OCR / Screenshot (Matching ocr_provider.py)
  'Extracted Web Link Detected': {
    indicator: 'स्क्रीनशॉट में मिला संदिग्ध वेब लिंक',
    description: 'स्क्रीनशॉट की छवि में बाहरी वेबसाइट का लिंक पाया गया है।'
  },
  'Extracted UPI Handle / VPA': {
    indicator: 'स्क्रीनशॉट में मिला UPI VPA हैंडल',
    description: 'स्क्रीनशॉट में भुगतान के लिए भेजा गया UPI आईडी पाया गया है।'
  },
  'Extracted Indian Mobile Contact': {
    indicator: 'स्क्रीनशॉट में मिला संदिग्ध मोबाइल नंबर',
    description: 'संदेश में संपर्क के लिए 10 अंकों का फोन नंबर मौजूद है।'
  },
  'Extracted Urgency Pattern': {
    indicator: 'स्क्रीनशॉट में तात्कालिक दबाव के संकेत',
    description: 'स्क्रीनशॉट की बातचीत में तुरंत पैसे भेजने का दबाव है।'
  },
  'WhatsApp Family Impersonation / Emergency Pattern': {
    indicator: 'व्हाट्सएप पारिवारिक छद्म वेश / आपातकाल पैटर्न',
    description: 'सामान्य "Hi Mom/Dad नया नंबर" या "भाई तुरंत मदद चाहिए" वाला धोखेबाज़ पैटर्न पहचाना गया।'
  },
  'Instagram Fake Giveaway / Brand Ambassador Lure': {
    indicator: 'इंस्टाग्राम फर्जी उपहार / ब्रांड एंबेसडर लालच',
    description: 'मुफ्त लक्जरी उपहार या स्पॉन्सरशिप का झांसा देकर अग्रिम कस्टम या प्रोसेसिंग शुल्क की मांग।'
  }
};

// Map of Explanations (EN -> HI)
const explanationTranslations: Record<string, { point: string; meaning: string }> = {
  'Why was this flagged?': {
    point: 'इसे संदिग्ध क्यों माना गया?',
    meaning: 'विश्लेषण में कई ऐसी विशेषताएं पाई गईं जो आमतौर पर AI वॉयस क्लोनिंग, नकली वीडियो या साइबर अपराध से जुड़ी होती हैं, जैसे स्पेक्ट्रल फ्रीक्वेंसी कटऑफ और कृत्रिम तरंगें।'
  },
  'Why was this video flagged?': {
    point: 'इस वीडियो को संदिग्ध क्यों माना गया?',
    meaning: 'सिस्टम ने चेहरे की बनावट में विकृति, जबड़े के पास कृत्रिम ब्लेंडिंग लाइनें और आवाज़-होंठों के तालमेल में गंभीर अंतर पकड़ा है जो डीपफेक का संकेत है।'
  },
  'Why was this link flagged?': {
    point: 'इस वेब लिंक को संदिग्ध क्यों माना गया?',
    meaning: 'यह डोमेन असली बैंक या संस्था का नहीं है बल्कि मिलता-जुलता फर्जी डोमेन है जिसका उद्देश्य आपके पासवर्ड, कार्ड विवरण या UPI पिन चुराना है।'
  },
  'Why was this message flagged?': {
    point: 'इस संदेश को संदिग्ध क्यों माना गया?',
    meaning: 'संदेश में सोशल इंजीनियरिंग की रणनीति अपनाई गई है: तुरंत कदम उठाने का दबाव, पैसे या गोपनीय कोड की मांग, या कानूनी धमकी देना।'
  },
  'Why was this payment request flagged?': {
    point: 'इस पेमेंट अनुरोध को संदिग्ध क्यों माना गया?',
    meaning: 'इस परिदृश्य में UPI धोखाधड़ी के स्पष्ट संकेत हैं, विशेषकर "पैसे पाने के लिए QR कोड स्कैन करें या पिन डालें" का जाल या फर्जी कलेक्ट रिक्वेस्ट।'
  },
  'What does this mean in plain language?': {
    point: 'सरल भाषा में इसका क्या अर्थ है?',
    meaning: 'यह सामग्री असली नहीं लगती, बल्कि AI या धोखेबाज़ों द्वारा तैयार की गई है। कॉल करने वाले या संदेश भेजने वाले पर बिल्कुल भरोसा न करें।'
  },
  'Audio Integrity Assessment': {
    point: 'ऑडियो सत्यता मूल्यांकन',
    meaning: 'रिकॉर्डिंग में स्वाभाविक सांस लेने के अंतराल, आवाज का प्राकृतिक कंपन और सामान्य मानव विशेषताएं मौजूद हैं।'
  },
  'Video Integrity Assessment': {
    point: 'वीडियो सत्यता मूल्यांकन',
    meaning: 'चेहरे के बिंदु, फ्रेम दर फ्रेम प्रकाश परावर्तन और पलक झपकने की जैविक दर सामान्य असली वीडियो से मेल खाती है।'
  },
  'Domain Reputation Evaluation': {
    point: 'डोमेन प्रतिष्ठा मूल्यांकन',
    meaning: 'यह डोमेन किसी भी ब्लैकलिस्ट या संदिग्ध फर्जी सूची में नहीं पाया गया है। ब्राउज़र में असली स्पेलिंग अवश्य जांचें।'
  },
  'Message Context Assessment': {
    point: 'संदेश संदर्भ मूल्यांकन',
    meaning: 'संदेश में कोई वित्तीय दबाव या गोपनीय जानकारी मांगने वाले शब्द नहीं मिले हैं।'
  },
  'Payment Context Check': {
    point: 'पेमेंट संदर्भ जांच',
    meaning: 'यह एक सामान्य भुगतान जैसा दिखता है जिसमें कोई रिवर्स-QR या धोखाधड़ी वाले संकेत नहीं मिले हैं।'
  },
  'What does this mean?': {
    point: 'इसका क्या अर्थ है?',
    meaning: 'इसमें कोई गंभीर कृत्रिम खराबी नहीं पाई गई है। हालांकि, अगर कोई असामान्य मांग की जाए तो हमेशा सतर्क रहें।'
  },
  'Visual & Temporal Forensics': {
    point: 'विजुअल और फ्रेम विश्लेषण',
    meaning: 'वीडियो में चेहरे की रूपरेखा, पलकें झपकने की दर और आवाज़-होंठ तालमेल में गंभीर विसंगतियाँ पाई गई हैं।'
  },
  'Domain & Network Forensics': {
    point: 'डोमेन और नेटवर्क फोरेंसिक',
    meaning: 'यह वेब लिंक असली बैंक या संस्था का नहीं है। इसका उद्देश्य आपके पासवर्ड या वित्तीय क्रेडेंशियल्स चुराना है।'
  },
  'Intent & Coercion Forensics': {
    point: 'इरादा और दबाव विश्लेषण',
    meaning: 'संदेश में आपको डराकर या लालच देकर तुरंत पैसे ट्रांसफर करवाने या गोपनीय OTP हासिल करने की रणनीति पहचानी गई है।'
  }
};

// Action item string translator
const actionTranslations: Record<string, string> = {
  // Critical immediate actions
  'Stop all communication with the sender immediately. Block on caller/chat app.': 'संदेश भेजने वाले या कॉल करने वाले से तुरंत बातचीत बंद करें और नंबर को तुरंत ब्लॉक करें।',
  'Do NOT transfer any money or approve any UPI collect request.': 'भूलकर भी कोई पैसे ट्रांसफर न करें और न ही किसी UPI कलेक्ट रिक्वेस्ट को स्वीकार करें।',
  'Do NOT share OTP, UPI PIN, ATM PIN, or passwords under any circumstances.': 'किसी भी परिस्थिति में OTP, UPI पिन, ATM पिन या पासवर्ड किसी के साथ साझा न करें।',
  'If credentials or banking PIN were entered, immediately freeze cards/UPI via your official banking app.': 'यदि आपने पिन या पासवर्ड डाल दिया है, तो तुरंत अपने बैंकिंग ऐप से कार्ड और UPI को फ्रीज/ब्लॉक करें।',
  'Preserve screenshots, audio files, phone numbers, and UPI handles in Evidence Locker.': 'स्क्रीनशॉट, कॉल रिकॉर्डिंग, फोन नंबर और UPI हैंडल को रक्षाAI साक्ष्य लॉकर में सुरक्षित रखें।',
  'Call National Cyber Fraud Helpline at 1930 immediately if money has left your account.': 'यदि खाते से पैसे कट गए हैं, तो बिना एक पल गंवाए राष्ट्रीय साइबर हेल्पलाइन 1930 पर कॉल करें।',

  // Avoid actions
  'Do NOT call back the suspicious number provided in the message/call.': 'संदेश या कॉल में दिए गए किसी भी अनजान नंबर पर दोबारा कॉल न करें।',
  'Do NOT click any further links or install APK/screen-sharing tools (AnyDesk, TeamViewer, RustDesk).': 'किसी अन्य लिंक पर क्लिक न करें और कोई APK या स्क्रीन-शेयरिंग ऐप (AnyDesk, TeamViewer, RustDesk) इंस्टॉल न करें।',
  'Do NOT confront the scammer; preserve evidence quietly.': 'धोखेबाज़ से बहस न करें; चुपचाप सबूतों को सुरक्षित रखें।',
  'Do NOT panic; follow the step-by-step solution below.': 'घबराएं नहीं; नीचे दिए गए चरणबद्ध समाधान का पालन करें।',

  // High actions
  'Pause and break the urgency cycle. Scammers deliberately manufacture panic.': 'रुकें और जल्दबाजी न करें। धोखेबाज़ जानबूझकर डर और जल्दबाजी का माहौल बनाते हैं।',
  'Do not transfer funds, share verification codes, or disclose private credentials.': 'पैसे ट्रांसफर न करें, कोई वेरिफिकेशन कोड न बताएं और न ही निजी जानकारी साझा करें।',
  'Independently verify the claimed identity using a saved, verified contact number.': 'अपने फोन में पहले से सुरक्षित परिजन के नंबर पर सीधे सामान्य कॉल करके पुष्टि करें।',
  'Preserve all interaction history, voice notes, and URLs.': 'सभी चैट, वॉयस नोट और वेब लिंक को साक्ष्य के तौर पर सुरक्षित रखें।',
  'Prepare an incident record if impersonation of an official or family member occurred.': 'यदि किसी अधिकारी या परिजन का रूप धारण किया गया है, तो आधिकारिक शिकायत तैयार करें।',
  'Do NOT trust caller ID or profile display names without two-way verification.': 'कॉल पर दिखने वाले नाम या प्रोफाइल फोटो पर बिना दोबारा जांच किए भरोसा न करें।',
  'Do NOT use links, phone numbers, or QR codes sent directly by the caller.': 'कॉलर द्वारा भेजे गए किसी भी लिंक, फोन नंबर या QR कोड का इस्तेमाल न करें।',
  'Do NOT forward the message to friends or family without a warning.': 'बिना चेतावनी दिए इस संदेश को किसी परिजन या ग्रुप में फॉरवर्ड न करें।',

  // Moderate
  'Review message origin carefully. Compare sender handle with authentic domain.': 'संदेश के स्रोत की सावधानीपूर्वक जांच करें। प्रेषक के हैंडल की तुलना असली डोमेन से करें।',
  'Check if the tone involves unsolicited financial, investment, or delivery updates.': 'जांचें कि क्या संदेश में बिना मांगे पैसे, निवेश या लॉटरी का लालच दिया गया है।',
  'Verify with the official organization through their verified portal or customer care.': 'आधिकारिक पोर्टल या सत्यापित कस्टमर केयर नंबर पर संपर्क करके पुष्टि करें।',
  'Do NOT rush into actions based on limited-time discounts or lottery claims.': 'सीमित समय के डिस्काउंट या लॉटरी के दावों के झांसे में आकर जल्दबाजी न करें।',
  'Do NOT click shortened URLs (bit.ly, tinyurl) from unknown senders.': 'अज्ञात प्रेषकों द्वारा भेजे गए छोटे लिंक (bit.ly, tinyurl) पर क्लिक न करें।',

  // Low / Safe
  'Content shows standard baseline characteristics and low synthetic indicators.': 'सामग्री सामान्य मानव व्यवहार से मेल खाती है और कोई गंभीर कृत्रिम संकेत नहीं मिले हैं।',
  'Continue normal cautious digital practices: keep 2FA enabled on all accounts.': 'सामान्य सावधानी बरतें: अपने सभी खातों पर टू-फैक्टर ऑथेंटिकेशन (2FA) चालू रखें।',
  'Regularly review authorized devices in your messaging apps.': 'व्हाट्सएप और बैंकिंग ऐप्स में जुड़े हुए अधिकृत डिवाइसेस की नियमित समीक्षा करें।',
  'Do not disable device security protections or grant unnecessary permissions.': 'डिवाइस की सुरक्षा सेटिंग्स बंद न करें और ऐप्स को अनावश्यक परमिशन न दें।'
};

// Solution Timeline translator
const timelineTranslations: Record<string, string> = {
  // Generic / Social / Message Roadmap (from solution engine)
  'Do not click links or reply to the message.':
    'संदेश में दिए गए किसी लिंक पर क्लिक न करें और न ही कोई उत्तर दें।',
  'Take a complete screenshot showing the sender\'s handle, phone number, and timestamp.':
    'भेजने वाले का हैंडल, फोन नंबर और समय दिखाते हुए पूरी बातचीत का स्क्रीनशॉट लें।',
  'Preserve the raw message text into RakshaAI Evidence Locker for SHA-256 fingerprinting.':
    'संदेश के मूल टेक्स्ट को SHA-256 डिजिटल फिंगरप्रिंट के साथ रक्षाAI साक्ष्य लॉकर में सुरक्षित रखें।',
  'Report and block the account on the respective platform (WhatsApp/Instagram/Telegram).':
    'संबंधित सोशल मीडिया प्लेटफॉर्म (WhatsApp/Instagram/Telegram) पर इस अकाउंट को रिपोर्ट और तुरंत ब्लॉक करें।',
  'Warn any mutual contacts if the scammer is impersonating someone in your network.':
    'यदि धोखेबाज़ किसी परिचित या रिश्तेदार का नाम ले रहा है, तो तुरंत अपने संपर्कों को सतर्क करें।',
  'Review privacy settings on the social media platform to hide your contact number and friend list from public viewing.':
    'सोशल मीडिया पर अपनी प्राइवेसी सेटिंग्स की जांच करें और अपने फोन नंबर व मित्र सूची को सार्वजनिक होने से छिपाएं।',
  'Enable two-step verification inside the messaging application.':
    'मैसेजिंग ऐप (जैसे WhatsApp या Telegram) के अंदर टू-स्टेप वेरिफिकेशन (2-Step Verification) चालू करें।',
  'Review active sessions on the messaging app and terminate any unfamiliar desktop or web clients.':
    'मैसेजिंग ऐप के "Linked Devices / Active Sessions" में जाकर किसी भी अनजान कंप्यूटर या वेब लॉगिन को तुरंत लॉग आउट करें।',
  'Consult RakshaAI Cyber Safety Academy to stay updated on emerging social engineering tactics.':
    'नए उभरते साइबर फ्रॉड और सोशल इंजीनियरिंग के तरीकों से सुरक्षित रहने के लिए रक्षाAI साइबर सुरक्षा अकादमी पढ़ें।',

  // Link & Malware Roadmap (from solution engine)
  'Run a malware scan using Microsoft Defender or trusted mobile security suite.':
    'माइक्रोसॉफ्ट डिफेंडर या विश्वसनीय मोबाइल सुरक्षा ऐप से मैलवेयर/एंटीवायरस स्कैन चलाएं।',
  'Check active login sessions on your Google, Microsoft, and banking accounts and revoke any unknown devices.':
    'अपने गूगल, माइक्रोसॉफ्ट और बैंक खातों के एक्टिव लॉगिन सेशन जांचें और अनजान डिवाइसेस को तुरंत हटाएं।',
  'Inspect email forwarding rules to ensure no silent copy rules were inserted by attackers.':
    'ईमेल फॉरवर्डिंग सेटिंग्स की जांच करें कि हैकर्स द्वारा कोई गुप्त कॉपी या फॉरवर्डिंग नियम तो नहीं लगाया गया।',
  'Bookmark official banking and government websites; never rely on search engine sponsored ads for login portals.':
    'आधिकारिक बैंकिंग और सरकारी वेबसाइटों को बुकमार्क करें; लॉगिन के लिए गूगल विज्ञापनों (Sponsored Ads) पर कभी भरोसा न करें।',
  'Monitor bank account statements for micro-debits or unauthorized mandate registrations.':
    'अपने बैंक खाते पर 1-2 रुपये के किसी भी अनधिकृत टेस्ट डेबिट या ऑटो-पे मैंडेट पर नजर रखें।',

  // NOW
  'IMMEDIATE: Dial 1930 (National Cyber Crime Reporting Helpline) to report financial loss and initiate a Golden Hour transaction hold.':
    'तत्काल: वित्तीय नुकसान की सूचना देने और गोल्डन ऑवर में बैंक खाते को होल्ड कराने के लिए 1930 (राष्ट्रीय साइबर हेल्पलाइन) पर कॉल करें।',
  'Log in to your banking app or call your bank\'s 24x7 emergency helpline to freeze debit cards, disable UPI, and block compromised net banking accounts.':
    'अपने आधिकारिक बैंकिंग ऐप में लॉगिन करें या बैंक को 24x7 हेल्पलाइन पर कॉल करके कार्ड, UPI और नेट बैंकिंग को तुरंत फ्रीज कराएं।',
  'Preserve payment UTR number, UPI reference ID, receiver\'s UPI VPA handle, and screenshots of debit SMS.':
    'ट्रांजैक्शन UTR नंबर, UPI संदर्भ आईडी, धोखेबाज़ का UPI VPA और पैसे कटने वाले SMS का स्क्रीनशॉट सुरक्षित रखें।',
  'Save full communication logs with the scammer before they unsend or delete messages.':
    'धोखेबाज़ द्वारा संदेश डिलीट करने से पहले पूरी चैट और बातचीत का रिकॉर्ड सुरक्षित रखें।',
  'Immediately terminate the voice conversation. Do not agree to wire any money.':
    'तुरंत वॉयस कॉल काट दें। किसी भी हालत में पैसे भेजने के लिए सहमति न दें।',
  'Dial your relative or colleague on their regular cell number (SIM to SIM) to verify their safety.':
    'परिजन या सहकर्मी के नियमित मोबाइल नंबर (SIM से SIM) पर सीधे कॉल करके उनकी कुशलता जांचें।',
  'Save the voicemail, call recording, or incoming phone number to RakshaAI Evidence Locker.':
    'कॉल रिकॉर्डिंग, वॉयस नोट और इनकमिंग नंबर को रक्षाAI साक्ष्य लॉकर में सुरक्षित रखें।',
  'Close the suspicious browser tab immediately. Do not interact further.':
    'संदिग्ध ब्राउज़र टैब को तुरंत बंद कर दें। आगे कोई भी क्लिक न करें।',
  'If you downloaded any file (.apk, .exe, .scr, .zip), DO NOT open it; delete it from Downloads immediately.':
    'यदि कोई फाइल (.apk, .exe, .zip) डाउनलोड हुई है, तो उसे खोलें नहीं; तुरंत डाउनलोड्स से डिलीट करें।',
  'If passwords were typed on the fake portal, change that password immediately on the legitimate service via a clean browser.':
    'यदि आपने फर्जी पेज पर पासवर्ड डाला था, तो किसी दूसरे सुरक्षित डिवाइस से तुरंत अपना असली पासवर्ड बदलें।',

  // NEXT 3 HOURS
  'Draft an official cybercrime complaint using RakshaAI\'s Report Generator.':
    'रक्षाAI रिपोर्ट जनरेटर का उपयोग करके आधिकारिक साइबर अपराध शिकायत पत्र तैयार करें।',
  'File the complaint on https://cybercrime.gov.in with transaction ID, suspect phone/UPI, and digital evidence.':
    'ट्रांजैक्शन आईडी, संदिग्ध के फोन/UPI और साक्ष्यों के साथ https://cybercrime.gov.in पर औपचारिक शिकायत दर्ज करें।',
  'Obtain and note your Cyber Crime Acknowledgement Number.':
    'शिकायत दर्ज करने के बाद मिलने वाले पावती नंबर (Acknowledgement Number) को नोट करके रखें।',
  'Send an email with the complaint copy and transaction proof to your bank\'s Nodal / Grievance Officer requesting formal reversal.':
    'शिकायत की कॉपी और बैंक ट्रांजैक्शन प्रूफ के साथ अपने बैंक के नोडल/शिकायत निवारण अधिकारी को ईमेल भेजकर पैसे वापसी की मांग करें।',
  'Check with other mutual family members or coworkers to see if they received similar distress calls.':
    'अन्य रिश्तेदारों या दोस्तों से बात करके पता करें कि क्या उन्हें भी इस प्रकार की कॉल आई है।',
  'Block the caller ID and report spam on your carrier and Truecaller/Whoscall.':
    'संदिग्ध नंबर को अपने फोन और ट्रूकेलर पर स्पैम व फ्रॉड के रूप में रिपोर्ट और ब्लॉक करें।',
  'Clear browser history, cookies, and local storage cache.':
    'ब्राउज़र का इतिहास, कुकीज़ और कैशे मेमोरी पूरी तरह साफ करें।',
  'Enable Multi-Factor Authentication (MFA) via Authenticator app (not SMS) on the affected accounts.':
    'संबंधित खातों पर SMS के बजाय ऑथेंटिकेटर ऐप के माध्यम से मल्टी-फैक्टर ऑथेंटिकेशन (MFA) चालू करें।',

  // NEXT 24 HOURS
  'Visit your home bank branch in person and submit a written dispute letter along with the 1930 complaint copy.':
    'अपनी बैंक शाखा में व्यक्तिगत रूप से जाएं और 1930 शिकायत की प्रति के साथ लिखित विवाद पत्र जमा करें।',
  'Change all internet banking passwords, UPI PINs, and email passwords from a separate clean device.':
    'किसी अन्य सुरक्षित डिवाइस से अपने सभी इंटरनेट बैंकिंग पासवर्ड, UPI पिन और ईमेल पासवर्ड बदलें।',
  'Run an antivirus scan on your mobile device to ensure no malicious APK or remote viewer was installed.':
    'अपने फोन पर एंटीवायरस स्कैन चलाएं ताकि यह सुनिश्चित हो सके कि कोई जासूसी APK या रिमोट व्यूअर इंस्टॉल नहीं है।',
  'Establish a private, un-hackable \'Family Safe Word\' that must be spoken before any urgent money transfer is ever considered.':
    'परिवार के बीच एक गुप्त "फैमिली सेफ-वर्ड" तय करें, जिसे बोले बिना कभी कोई आपातकालीन पैसा न भेजा जाए।',
  'Review social media accounts and make voice-containing reels/videos private to prevent further voice model scraping.':
    'सोशल मीडिया अकाउंट्स की समीक्षा करें और आवाज़ वाली रील्स/वीडियो को प्राइवेट करें ताकि AI द्वारा आवाज़ न चुराई जा सके।',

  // NEXT 7 DAYS
  'Track the formal freeze status with your bank and local cyber cell investigating officer.':
    'अपने बैंक और स्थानीय साइबर सेल जांच अधिकारी के साथ आरोपी के खाते के फ्रीज होने की स्थिति पर नज़र रखें।',
  'Review your credit reports (CIBIL / Experian) to verify no unauthorized loan inquiries were initiated in your name.':
    'अपनी CIBIL / Experian क्रेडिट रिपोर्ट की जांच करें कि आपके नाम पर कोई फर्जी लोन तो नहीं निकाला गया।',
  'Share details within RakshaAI Family Shield to inoculate family members against similar payment trap tactics.':
    'रक्षाAI परिवार सुरक्षा में इस घटना का विवरण साझा करें ताकि परिवार के अन्य सदस्य इस जाल से बच सकें।',
  'Educate family elders on AI voice cloning and virtual kidnapping scams using RakshaAI Cyber Safety Academy.':
    'रक्षाAI साइबर सुरक्षा अकादमी का उपयोग करके परिवार के बुजुर्गों को वॉयस क्लोनिंग और वर्चुअल किडनैपिंग के बारे में सिखाएं।',
  'Keep phone firmware updated to benefit from carrier-level spam and spoofing filters.':
    'अपने फोन के सॉफ्टवेयर को हमेशा अपडेट रखें ताकि टेलीकॉम स्तर के स्पैम फिल्टर का लाभ मिल सके।'
};

/**
 * Translates a full AnalysisResponse object into Hindi when lang is 'HI',
 * or returns clean English when lang is 'EN'.
 */
export function localizeScanResult(res: AnalysisResponse, lang: 'EN' | 'HI'): AnalysisResponse {
  if (lang === 'EN') return res;

  // Clone object
  const localized: AnalysisResponse = JSON.parse(JSON.stringify(res));

  // Localize Target Summary
  if (localized.target_summary) {
    localized.target_summary = localized.target_summary
      .replace('Voice Analysis:', 'वॉयस डीपफेक जांच:')
      .replace('Video Analysis:', 'वीडियो डीपफेक जांच:')
      .replace('LinkShield Scan:', 'लिंक-शील्ड सुरक्षा जांच:')
      .replace('Link Analysis:', 'वेब लिंक सुरक्षा जांच:')
      .replace('Message Scan', 'संदेश सुरक्षा जांच')
      .replace('Message Analysis:', 'संदिग्ध संदेश जांच:')
      .replace('PaymentShield:', 'पेमेंट-शील्ड सुरक्षा जांच:')
      .replace('Payment Analysis:', 'पेमेंट सुरक्षा जांच:')
      .replace('Screenshot OCR Analysis:', 'स्क्रीनशॉट OCR विश्लेषण:')
      .replace('chars extracted', 'अक्षर निकाले गए')
      .replace('SocialShield (WHATSAPP):', 'सोशल शील्ड (व्हाट्सएप):')
      .replace('SocialShield (INSTAGRAM):', 'सोशल शील्ड (इंस्टाग्राम):')
      .replace('SocialShield (TELEGRAM):', 'सोशल शील्ड (टेलीग्राम):')
      .replace('SocialShield (FACEBOOK):', 'सोशल शील्ड (फेसबुक):')
      .replace('SocialShield (SMS):', 'सोशल शील्ड (SMS):')
      .replace('SocialShield (EMAIL):', 'सोशल शील्ड (ईमेल):')
      .replace('Claimed:', 'दावा:')
      .replace('Family Member', 'परिजन / रिश्तेदार')
      .replace('Friend', 'मित्र')
      .replace('Bank Official', 'बैंक अधिकारी')
      .replace('Police / CBI / Customs', 'पुलिस / CBI / नारकोटिक्स')
      .replace('Unknown Caller', 'अज्ञात कॉलर');
  }

  // Localize Signals
  if (localized.signals && Array.isArray(localized.signals)) {
    localized.signals = localized.signals.map((sig: SignalItem) => {
      // 1. Exact match
      const match = signalTranslations[sig.indicator] || signalTranslations[sig.indicator.trim()];
      if (match) {
        return {
          ...sig,
          indicator: match.indicator,
          description: match.description
        };
      }

      // 2. Extracted UPI Handle (from Screenshot OCR)
      if (sig.indicator.startsWith('Extracted UPI Handle:')) {
        const handle = sig.indicator.replace('Extracted UPI Handle:', '').trim();
        return {
          ...sig,
          indicator: `निकाला गया UPI हैंडल: ${handle}`,
          description: `स्क्रीनशॉट छवि (OCR) से सीधे निकाला गया संदिग्ध भुगतान गंतव्य UPI पता (${handle})।`
        };
      }

      // 3. Extracted URL / Web Link (from Screenshot OCR)
      if (sig.indicator.startsWith('Extracted URL:') || sig.indicator.startsWith('Extracted Web Link:')) {
        const url = sig.indicator.replace(/^Extracted (URL|Web Link):/, '').trim();
        return {
          ...sig,
          indicator: `निकाला गया वेब लिंक: ${url}`,
          description: `स्क्रीनशॉट छवि (OCR) में मिला बाहरी संदिग्ध वेब लिंक (${url})।`
        };
      }

      // 4. Extracted Phone / Mobile Contact (from Screenshot OCR)
      if (sig.indicator.startsWith('Extracted Phone:') || sig.indicator.startsWith('Extracted Mobile:') || sig.indicator.startsWith('Extracted Indian Mobile Contact:')) {
        const phone = sig.indicator.replace(/^Extracted (Phone|Mobile|Indian Mobile Contact):/, '').trim();
        return {
          ...sig,
          indicator: `निकाला गया मोबाइल नंबर: ${phone}`,
          description: `स्क्रीनशॉट छवि (OCR) से सीधे पहचाना गया 10 अंकों का संपर्क नंबर (${phone})।`
        };
      }

      // 5. Claimed Identity
      if (sig.indicator.startsWith('Claimed Identity:')) {
        const claim = sig.indicator.replace('Claimed Identity:', '').trim();
        return {
          ...sig,
          indicator: `दावा की गई पहचान: ${claim}`,
          description: `संदेश भेजने वाला '${claim}' होने का दावा कर रहा है। बिना स्वतंत्र सत्यापन के कोई कदम न उठाएं।`
        };
      }

      // 6. Voice Note Container Format (e.g. MP4, OPUS, AMR, etc.)
      if (sig.indicator.startsWith('Voice Note Container:')) {
        const fmt = sig.indicator.replace('Voice Note Container:', '').trim();
        return {
          ...sig,
          indicator: `वॉयस नोट फॉर्मेट: ${fmt}`,
          description: `ध्वनि विश्लेषण के लिए वॉयस कंटेनर से ऑडियो स्ट्रीम को सफलतापूर्वक निकाला और डीकोड किया गया।`
        };
      }

      // 6. Generic Description Translations fallback
      let desc = sig.description;
      if (desc === 'Payment destination handle parsed directly from image OCR.') {
        desc = 'स्क्रीनशॉट छवि (OCR) से सीधे निकाला गया भुगतान गंतव्य UPI पता।';
      } else if (desc === 'Embedded hyperlink detected in screenshot image.') {
        desc = 'स्क्रीनशॉट छवि (OCR) में पहचाना गया एम्बेडेड वेब लिंक।';
      } else if (desc === 'Mobile contact number parsed directly from screenshot image OCR.') {
        desc = 'स्क्रीनशॉट छवि (OCR) से सीधे निकाला गया मोबाइल संपर्क नंबर।';
      } else if (desc?.startsWith("VPA '") && desc?.includes("mimics an official support handle")) {
        desc = desc.replace("VPA '", "UPI VPA '")
                   .replace("' mimics an official support handle to gain false trust.", "' आधिकारिक बैंक सपोर्ट हैंडल की नकल करके झूठा भरोसा जीतने का प्रयास करता है।");
      } else if (desc?.startsWith("Request involves substantial funds (₹") && desc?.includes("amplifying scam risk.")) {
        desc = desc.replace("Request involves substantial funds (₹", "अनुरोध में अत्यधिक बड़ी राशि (₹")
                   .replace("), amplifying scam risk.", ") शामिल है, जो धोखाधड़ी का जोखिम काफी बढ़ा देती है।");
      } else if (desc?.startsWith("URL points directly to numeric IP (") && desc?.includes("rather than registered domain name.")) {
        desc = desc.replace("URL points directly to numeric IP (", "वेब लिंक पंजीकृत डोमेन के बजाय सीधे संख्यात्मक IP पते (")
                   .replace(") rather than registered domain name.", ") पर भेज रहा है।");
      } else if (desc?.startsWith("Domain references recognizable brand ('") && desc?.includes("') on an unverified host.")) {
        desc = desc.replace("Domain references recognizable brand ('", "डोमेन किसी अधिकृत सर्वर के बजाय अनजान होस्ट पर लोकप्रिय ब्रांड ('")
                   .replace("') on an unverified host.", "') के नाम का उपयोग कर रहा है।");
      } else if (desc?.startsWith("Domain registered under high-abuse low-cost TLD ('") && desc?.includes("').")) {
        desc = desc.replace("Domain registered under high-abuse low-cost TLD ('", "डोमेन उच्च जोखिम वाले सस्ते व अपंजीकृत वेब एक्सटेंशन ('")
                   .replace("').", "') पर बनाया गया है।");
      } else if (desc?.startsWith("URL contains high-urgency keywords: ")) {
        desc = desc.replace("URL contains high-urgency keywords: ", "वेब लिंक में तुरंत कार्रवाई कराने वाले संदिग्ध कीवर्ड्स पाए गए हैं: ");
      }

      return {
        ...sig,
        description: desc
      };
    });
  }

  // Localize Explanations
  if (localized.explanations && Array.isArray(localized.explanations)) {
    localized.explanations = localized.explanations.map((exp: ExplanationItem) => {
      const match = explanationTranslations[exp.point];
      if (match) {
        return { point: match.point, meaning: match.meaning };
      }
      return exp;
    });
  }

  // Localize Safety Guidance
  if (localized.safety_guidance) {
    const sg = localized.safety_guidance;
    if (res.risk_level === 'CRITICAL') {
      sg.level = 'आपातकाल (रेड अलर्ट)';
      sg.headline = '🚨 अति गंभीर खतरा पहचाना गया: धोखाधड़ी रोकने के लिए तुरंत कदम उठाएं';
    } else if (res.risk_level === 'HIGH') {
      sg.level = 'तत्काल ध्यान आवश्यक (ऑरेंज अलर्ट)';
      sg.headline = '⚠️ उच्च जोखिम: हेरफेर या सोशल इंजीनियरिंग के स्पष्ट संकेत';
    } else if (res.risk_level === 'MODERATE') {
      sg.level = 'सावधानी (येलो अलर्ट)';
      sg.headline = '🟡 सावधानी: सामग्री या संदर्भ में विसंगतियां पाई गईं';
    } else {
      sg.level = 'सुरक्षित मार्गदर्शन (ग्रीन)';
      sg.headline = '🟢 कोई तात्कालिक खतरा नहीं: सामान्य डिजिटल सुरक्षा का पालन करें';
    }

    if (Array.isArray(sg.immediate_actions)) {
      sg.immediate_actions = sg.immediate_actions.map(act => actionTranslations[act] || act);
    }
    if (Array.isArray(sg.avoid_actions)) {
      sg.avoid_actions = sg.avoid_actions.map(act => actionTranslations[act] || act);
    }
  }

  // Localize Solution Timeline
  if (localized.solution_timeline) {
    const st = localized.solution_timeline;
    if (Array.isArray(st.now)) {
      st.now = st.now.map(item => timelineTranslations[item] || item);
    }
    if (Array.isArray(st.next_3h)) {
      st.next_3h = st.next_3h.map(item => timelineTranslations[item] || item);
    }
    if (Array.isArray(st.next_24h)) {
      st.next_24h = st.next_24h.map(item => timelineTranslations[item] || item);
    }
    if (Array.isArray(st.next_7d)) {
      st.next_7d = st.next_7d.map(item => timelineTranslations[item] || item);
    }
  }

  return localized;
}
