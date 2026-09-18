import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'EN' | 'HI';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  EN: {
    // Top Bar & Nav
    'emergency_tag': 'EMERGENCY',
    'helpline_prefix': 'India Cyber Financial Fraud Helpline:',
    'portal_prefix': 'National Cybercrime Portal:',
    'cloud_ai_active': 'Cloud AI Active',
    'offline_mode': 'Offline Protection Mode',
    'tagline': 'Detect. Verify. Protect. Solve. Before You Trust.',
    'nav_overview': 'Overview',
    'nav_voice': '🎙️ Voice',
    'nav_video': '🎥 Video',
    'nav_link': '🔗 LinkShield',
    'nav_message': '💬 Message',
    'nav_social': '📱 SocialShield',
    'nav_payment': '💳 PaymentShield',
    'nav_evidence': 'Evidence',
    'nav_family': 'Family',
    'nav_academy': 'Academy',
    'btn_clicked_link': '🚨 I CLICKED A LINK',
    'dashboard_tooltip': 'Dashboard & Analytics',

    // Demo Scenarios Bar
    'demo_title': 'Interactive Live Demo Scenarios',
    'demo_subtitle': 'Click any scenario to prefill and simulate end-to-end detection:',
    'demo_voice': 'Demo 1 — AI Voice Scam',
    'demo_video': 'Demo 2 — Deepfake Video',
    'demo_whatsapp': 'Demo 3 — WhatsApp Scam',
    'demo_instagram': 'Demo 4 — Instagram Scam',
    'demo_telegram': 'Demo 5 — Telegram Investment',
    'demo_link': 'Demo 6 — Fraud Link',
    'demo_emergency': 'Demo 7 — Accidentally Clicked Link',
    'demo_financial': 'Demo 8 — Financial Fraud (₹20,000)',
    'demo_offline': 'Demo 9 — Offline Mode',

    // Hero
    'hero_badge': 'Next-Generation Digital Trust Platform',
    'hero_title': 'RakshaAI 2.0',
    'hero_motto': '“Detect. Verify. Protect. Solve. Before You Trust.”',
    'hero_desc': 'AI-powered protection against voice deepfakes, video manipulation, phishing links, impersonation, scam messages, social media fraud, and digital payment scams.',
    'btn_scan_media': 'Scan Suspicious Media',
    'golden_diff_tag': 'The Golden Differentiator',
    'golden_diff_title': 'Most tools only ask: “Is this suspicious?”',
    'golden_diff_desc': 'RakshaAI 2.0 answers: What is dangerous, why it was flagged, what NOT to do, what to do immediately, how to verify safely, and how to file a formal 1930 complaint.',
    'full_response_badge': '✓ Full Response Protocol',

    // Action Cards
    'select_tool_title': 'Select Detection & Protection Tool',
    'select_tool_desc': 'Multi-signal cybersecurity shields built for citizens and enterprises',
    'act_voice_title': 'Check Voice',
    'act_voice_desc': 'Analyze audio clips, voice notes & calls for AI vocal cloning & synthetic artifacts.',
    'act_video_title': 'Check Video',
    'act_video_desc': 'Scan video files for facial warping, temporal flicker & lip-sync desynchronization.',
    'act_link_title': 'Check Link',
    'act_link_desc': 'Safely inspect suspicious URLs, typosquatting domains & credential harvesters.',
    'act_msg_title': 'Check Message',
    'act_msg_desc': 'Paste suspicious texts to detect psychological urgency, coercion & fraud intent.',
    'act_screen_title': 'Check Screenshot',
    'act_screen_desc': 'OCR & NLP extraction for chat screenshots, payment proofs & fake notices.',
    'act_social_title': 'Check Social Media',
    'act_social_desc': 'Dedicated fraud analyzers for WhatsApp, Instagram, Telegram & Facebook scams.',
    'act_pay_title': 'Check Payment',
    'act_pay_desc': 'Inspect UPI requests, reverse-QR traps & fake payment receipts before approving.',
    'act_emerg_title': 'Cyber Emergency',
    'act_emerg_desc': 'Interactive containment for clicked links, credential leaks & 1930 recovery.',
    'act_acad_title': 'Safety Center',
    'act_acad_desc': 'Interactive awareness modules in English & Hindi to inoculate against digital scams.',
    'launch_analyzer': 'Launch Analyzer',

    // How It Works
    'how_it_works_title': 'How RakshaAI 2.0 Works',
    'step_01_title': 'INPUT',
    'step_01_desc': 'Upload audio, video, screenshot or paste text & URLs.',
    'step_02_title': 'DETECT',
    'step_02_desc': 'AI extracts vocal harmonics, face warping & scam markers.',
    'step_03_title': 'EXPLAIN',
    'step_03_desc': 'Explains in plain language why content was flagged.',
    'step_04_title': 'SAFETY',
    'step_04_desc': 'Immediate avoidance checklist (Do this / Avoid this).',
    'step_05_title': 'SOLVE',
    'step_05_desc': 'Personalized action steps: Now, 3 Hours, 24 Hours, 7 Days.',
    'step_06_title': 'REPORT',
    'step_06_desc': 'Evidence Locker SHA-256 fingerprint & 1930 complaint dossier.',

    // Voice Analyzer
    'voice_header_tag': 'VOICE DEEPFAKE & SYNTHETIC SPEECH DETECTOR',
    'voice_header_title': 'Analyze Audio & Voice Notes',
    'voice_header_desc': 'Detects vocoder synthesis harmonics, HiFi-GAN frequency cutoffs, unnatural phonetic cadence, and psychological urgency tactics.',
    'voice_who_claims': 'Who does the caller claim to be?',
    'voice_upload_prompt': 'Upload Voice Note / Audio',
    'voice_upload_sub': 'Supports all voice notes: MP4, MP3, WAV, M4A, OPUS, AAC, OGG, AMR, WEBM (Max 50MB)',
    'voice_btn_scan': 'Run Deepfake Voice Analysis',
    'voice_btn_scanning': 'Analyzing Spectral Harmonics & Vocoder Artifacts...',

    // Video Analyzer
    'video_header_tag': 'MULTIMODAL TEMPORAL & VISUAL DEEPFAKE INSPECTOR',
    'video_header_title': 'Analyze Video Manipulation & Lip-Sync',
    'video_header_desc': 'Frame-by-frame face boundary inspection, diffusion feathering detection, biological blink cadence, and audio-video phonetic alignment.',
    'video_upload_prompt': 'Upload Video File',
    'video_upload_sub': 'Supports MP4, MOV, WEBM (Max 100MB)',
    'video_btn_scan': 'Run Multimodal Deepfake Video Analysis',
    'video_btn_scanning': 'Analyzing Frame Landmarks & Temporal Artifacts...',

    // Link Analyzer
    'link_header_tag': 'LINKSHIELD SAFE URL & TYPOSQUAT INSPECTOR',
    'link_header_title': 'Inspect Suspicious Links Safely',
    'link_header_desc': 'Inspects domain age, brand spoofing, malicious shortener chains, and credential-theft landing pages without opening the page in your browser.',
    'link_paste_label': 'Paste URL to Analyze',
    'link_test_samples': 'Test samples:',
    'link_btn_scan': 'Inspect Link Safely with LinkShield',
    'link_btn_scanning': 'Inspecting DNS, Typosquatting & Threat Intel...',

    // Message Analyzer
    'msg_header_tag': 'SCAM INTENT & COERCION ENGINE',
    'msg_header_title': 'Analyze Scam Messages & Urgency',
    'msg_header_desc': 'Detects money demands, OTP solicitation, fake KYC blocking notices, Digital Arrest police intimidation, and investment lures.',
    'msg_platform_label': 'Platform Received On',
    'msg_sender_label': 'Sender Claimed Identity',
    'msg_paste_label': 'Paste Suspicious Message Text',
    'msg_btn_scan': 'Scan Message with Scam Intent Engine',
    'msg_btn_scanning': 'Analyzing Scam Intent & Social Engineering Tactics...',

    // Screenshot Analyzer
    'screen_header_tag': 'VISION OCR & SCREENSHOT NLP EXTRACTOR',
    'screen_header_title': 'Analyze Chat & Payment Screenshots',
    'screen_header_desc': 'Extracts conversation text, phone numbers, UPI handles, and embedded URLs directly from images, then evaluates multi-signal fraud risks.',
    'screen_upload_prompt': 'Upload Screenshot (PNG, JPG)',
    'screen_btn_scan': 'Extract & Scan Screenshot',
    'screen_what_found': 'What We Found in This Screenshot:',

    // SocialShield
    'social_header_tag': 'SOCIALSHIELD DIGITAL PLATFORM FRAUD DEFENSE',
    'social_header_title': 'Social Media Scam & DM Analyzer',
    'social_header_desc': 'Protects against WhatsApp family distress traps, Instagram giveaway customs fee lures, Telegram crypto schemes, and Facebook Marketplace advance payment scams.',
    'social_select_platform': 'Select Social Media Platform',
    'social_sender_profile': 'Sender Handle / Profile Details',
    'social_content_label': 'Copied DM / Caption / Message Content',
    'social_btn_scan': 'Analyze with SocialShield',

    // PaymentShield
    'pay_header_tag': 'PAYMENTSHIELD UPI & QR FRAUD PREVENTER',
    'pay_header_title': 'Inspect UPI Requests & Reverse-QR Scams',
    'pay_header_desc': 'Inspects buyer/seller transaction contexts to prevent reverse-QR traps and deceptive UPI collect requests before you enter your PIN.',
    'pay_rule_title': 'THE GOLDEN UPI RULE:',
    'pay_rule_desc': 'You NEVER enter your UPI PIN to receive money! Entering your PIN ALWAYS transfers money OUT of your bank account. RakshaAI will never initiate or execute transactions.',
    'pay_upi_label': 'Recipient UPI ID / VPA Handle',
    'pay_amount_label': 'Requested Amount (INR ₹)',
    'pay_context_label': 'Payment Message or Sender\'s Instructions',
    'pay_btn_scan': 'Inspect Payment Request with PaymentShield',

    // Emergency Page
    'emerg_header_title': '🚨 I Clicked a Suspicious Link',
    'emerg_header_desc': 'Stay calm. Rapid response within the first 1-2 hours (The Golden Hour) dramatically minimizes risk. Answer the questions below to trigger the appropriate emergency containment protocol.',
    'emerg_url_label': 'The Link You Clicked (if remembered)',
    'emerg_q1': '1. Did you enter any confidential information on that website?',
    'emerg_q2': '2. Did money leave your bank account or credit card?',
    'emerg_btn_protocol': 'Run Emergency Containment Protocol',
    'emerg_golden_tag': '⚡ GOLDEN HOUR TRANSACTION FREEZE',
    'emerg_call_1930': 'Dial 1930 Immediately',
    'emerg_call_1930_desc': 'The National Cyber Crime Reporting Portal helpline (1930) can issue an inter-bank transaction freeze on the beneficiary account before the scammer withdraws funds.',
    'emerg_btn_call': 'Call 1930 Now',
    'emerg_btn_portal': 'Open Portal (cybercrime.gov.in)',
    'emerg_actions_title': 'Immediate Containment Actions',
    'emerg_dossier_btn': 'Generate 1930 Complaint Dossier',

    // Evidence Locker
    'locker_tag': 'CRYPTOGRAPHIC EVIDENCE LOCKER & TIMELINE',
    'locker_title': 'Evidence Locker & Integrity Vault',
    'locker_desc': 'Preserves screenshots, audio waveforms, transaction proofs, and chronological logs with SHA-256 cryptographic fingerprints.',
    'locker_btn_add': 'Add Evidence Item',
    'locker_readiness': 'Evidence Readiness',
    'locker_timeline_title': 'Chronological Incident Timeline',
    'locker_btn_report': 'Generate Official Report',
    'locker_secured_items': 'Secured Evidence Items',

    // Report Page
    'report_tag': 'AI PRELIMINARY INCIDENT REPORT GENERATOR',
    'report_title': 'Official Incident Dossier & 1930 Draft',
    'report_desc': 'Structures your digital evidence, timeline, and suspect information into a copy-ready complaint formatted for the National Cyber Crime Reporting Portal.',
    'report_btn_copy': 'Copy Complaint',
    'report_btn_copied': 'Copied to Clipboard!',
    'report_btn_print': 'Print / Export PDF',
    'report_instructions_title': 'How to Submit This Complaint in India:',
    'report_instructions_desc': '1. Copy the formatted complaint below. 2. Visit cybercrime.gov.in or dial 1930. 3. Select "Report Cyber Financial Fraud" or "Report Other Cyber Crime" and paste this text.',

    // Family Shield
    'family_tag': 'FAMILY SHIELD PROTECTION CIRCLE',
    'family_title': 'Protect Parents, Elders & Family',
    'family_desc': 'Monitor cyber threats targeting elderly relatives without invading their private messages or media.',
    'family_btn_add': 'Add Family Member',
    'family_privacy_title': 'ZERO-INVASION PRIVACY PRINCIPLE:',
    'family_privacy_desc': 'RakshaAI never shares private chats, photos, or audio between family members. Only security risk alerts and threat inoculations are synchronized across your protection circle.',
    'family_safeword_title': 'Family Secret Safe-Word Protocol',
    'family_safeword_desc': 'If an elder receives an AI-cloned voice call claiming you or a relative had an accident or is jailed, they MUST ask for this secret safe-word before transferring any money.',

    // Common Cards
    'card_risk': 'RISK',
    'card_confidence': 'AI CONFIDENCE',
    'card_verify_btn': '🔍 Verify Person',
    'card_preserve_btn': '📁 Preserve Evidence',
    'card_signals_title': 'Detected Behavioral & Forensic Signals',
    'card_why_flagged': 'Why was this flagged?',
    'card_what_means': 'What does this mean in plain language?',
    'safety_engine_title': '🛡️ Dedicated Safety Engine — Immediate Actions',
    'safety_do_now': 'DO THIS NOW (IMMEDIATE PRECAUTIONS):',
    'safety_dont_do': 'WHAT NOT TO DO:',
    'solution_engine_title': '💡 Solution Engine — Step-by-Step Action Roadmap',
    'solution_engine_desc': 'Time-critical containment protocol generated specifically for this threat profile.',
    'sol_now': 'NOW (0 – 15 Minutes)',
    'sol_now_sub': 'Immediate containment & damage mitigation',
    'sol_3h': 'NEXT 3 HOURS',
    'sol_3h_sub': 'Golden-hour reporting & account isolation',
    'sol_24h': 'NEXT 24 HOURS',
    'sol_24h_sub': 'Formal bank disputes, device sanitization & credentials reset',
    'sol_7d': 'NEXT 7 DAYS',
    'sol_7d_sub': 'Follow-up tracking, credit bureau audit & long-term protection',

    // Video Analyzer extra keys
    'video_landmarks': 'Face Landmarks',
    'video_feathering': 'Edge Feathering',
    'video_cadence': 'Temporal Cadence',
    'video_lip': 'AV Lip Latency',
    'video_context_label': 'Incident Context / Source',
    'video_context_placeholder': 'e.g. Sent via WhatsApp claiming to be company director asking for wire transfer',

    // Dashboard
    'dash_tag': 'PERSONAL DEFENSE & INCIDENT TELEMETRY',
    'dash_title': 'Security Intelligence Dashboard',
    'dash_desc': 'Real-time tracking of scanned media, high-risk flags, cryptographic evidence records, and subscription status.',
    'dash_btn_telemetry': 'System Telemetry',
    'dash_total_scans': 'Total Scans',
    'dash_across_modalities': 'Across all modalities',
    'dash_high_risks': 'High Risks',
    'dash_immediate_action': 'Immediate action taken',
    'dash_locked_evidence': 'Locked Evidence',
    'dash_sha256_fingerprint': 'SHA-256 fingerprinted',
    'dash_1930_reports': '1930 Reports',
    'dash_complaint_packs': 'Formal complaint packs',
    'dash_scans_by_modality': 'Scans by Modality',
    'dash_risk_dist': 'Detected Risk Distribution',
    'dash_sub_tag': 'MONETIZE PROTECTION, NOT PRIVATE DATA',
    'dash_sub_title': 'RakshaAI Subscription Tiers',
    'dash_sub_desc': 'Production pricing designed for mass Indian citizen adoption.',
    'dash_active_plan': 'Active: Raksha Plus (₹49/mo)',
    'dash_current_plan': 'Current Plan',
    'dash_select_plan': 'Select Plan',

    // Footer
    'footer_tagline': 'AI-Powered Digital Trust, Fraud Detection, Safety & Response Platform. Detect. Verify. Protect. Solve. Before You Trust.',
    'footer_privacy_badge': '🛡️ Monetize Protection, Not Private Data.',
    'footer_flow_title': 'Core Product Flow',
    'footer_helpline_title': 'Official Indian Helplines',
    'footer_cyber_fraud': 'National Cyber Financial Fraud:',
    'footer_portal_label': 'National Cybercrime Portal:',
    'footer_sec_title': 'Security & Privacy',
    'footer_sec_desc': 'Zero-knowledge evidence hashing, SHA-256 fingerprinting, and offline PWA emergency capability.',
    'footer_disclaimer_title': 'STATUTORY DISCLAIMER',
    'footer_disclaimer_text': 'RakshaAI 2.0 provides heuristic and AI-assisted cyber threat detection, evidence organization, and incident complaint preparation. RakshaAI is not a statutory law enforcement agency and cannot automatically freeze bank accounts or file First Information Reports (FIRs). For emergency financial interception within the Golden Hour, users must immediately contact the National Cyber Helpline (1930) and their respective banks.',
    'footer_copyright': '© 2026 RakshaAI Technologies Inc. All rights reserved.',
    'footer_built_for': 'Built for National Digital Trust & Citizen Cyber Safety',

    // Academy
    'acad_tag': 'RAKSHAAI CYBER SAFETY ACADEMY',
    'acad_title': 'Interactive Digital Safety Academy',
    'acad_desc': 'Master defensive reflexes against modern social engineering, deepfakes, and financial fraud tactics.',
    'acad_red_flags': 'RED FLAGS TO IDENTIFY:',
    'acad_how_to_protect': 'HOW TO STAY PROTECTED:',

    // Device Guard
    'nav_device_guard': '🛡️ Device Guard',
    'device_guard_badge': '24x7 REAL-TIME DEVICE FRAUD SHIELD',
    'device_guard_title': '360° Real-Time Device Cyber Guard',
    'device_guard_subtitle': 'Proactive on-device protection preventing screen hijacks (AnyDesk/TeamViewer), fraudulent APKs, deceptive bank URLs, and OTP harvesting traps.',
    'device_status_label': 'Device Security Status:',
    'device_status_protected': '🟢 100% PROTECTED & ARMED',
    'device_health_score': 'Cyber Resilience Score',
    'device_lockdown_title': 'Emergency Cyber Lockdown',
    'device_lockdown_desc': 'If you feel a scammer is currently watching your screen or trying to withdraw money, trigger immediate isolation.',
    'device_lockdown_btn': '🚨 Trigger 1-Click Emergency Lockdown',
    'device_active_shields': 'Active Real-Time Cyber Shields',
    'device_test_url_title': 'Instant Link & Phishing Sentinel',
    'device_test_url_placeholder': 'Paste suspicious link received via SMS/WhatsApp (e.g. sbi-kyc-verify.top)',
    'device_test_url_btn': 'Scan Link Now',
    'device_inspect_app_title': 'Screen Hijack & Scam App Inspector',
    'device_inspect_app_placeholder': 'Enter app name (e.g. AnyDesk, QuickSupport, SBI_Update.apk)',
    'device_inspect_app_btn': 'Inspect Application',
    'device_recent_intercepts': 'Recent On-Device Interceptions & Blocks'
  },
  HI: {
    // Top Bar & Nav
    'emergency_tag': 'आपातकाल (इमरजेंसी)',
    'helpline_prefix': 'भारत राष्ट्रीय साइबर वित्तीय धोखाधड़ी हेल्पलाइन:',
    'portal_prefix': 'राष्ट्रीय साइबर अपराध पोर्टल:',
    'cloud_ai_active': 'क्लाउड AI सक्रिय है',
    'offline_mode': 'ऑफ़लाइन सुरक्षा मोड',
    'tagline': 'जांचें। सत्यापित करें। सुरक्षित रहें। समाधान पाएं। भरोसा करने से पहले।',
    'nav_overview': 'होम पेज',
    'nav_voice': '🎙️ आवाज़ जांचें',
    'nav_video': '🎥 वीडियो जांचें',
    'nav_link': '🔗 लिंक जांचें',
    'nav_message': '💬 संदेश जांचें',
    'nav_social': '📱 सोशल मीडिया',
    'nav_payment': '💳 भुगतान सुरक्षा',
    'nav_evidence': 'साक्ष्य लॉकर',
    'nav_family': 'परिवार सुरक्षा',
    'nav_academy': 'सुरक्षा अकादमी',
    'btn_clicked_link': '🚨 संदिग्ध लिंक पर क्लिक हो गया',
    'dashboard_tooltip': 'डैशबोर्ड और विश्लेषण',

    // Demo Scenarios Bar
    'demo_title': 'इंटरैक्टिव लाइव डेमो परिदृश्य (1-क्लिक टेस्ट)',
    'demo_subtitle': 'तुरंत एंड-टू-एंड धोखाधड़ी जांच देखने के लिए किसी भी डेमो पर क्लिक करें:',
    'demo_voice': 'डेमो 1 — AI वॉयस कॉल स्कैम',
    'demo_video': 'डेमो 2 — डीपफेक वीडियो जांच',
    'demo_whatsapp': 'डेमो 3 — व्हाट्सएप पैसे की मांग',
    'demo_instagram': 'डेमो 4 — इंस्टाग्राम फर्जी इनाम',
    'demo_telegram': 'डेमो 5 — टेलीग्राम क्रिप्टो योजना',
    'demo_link': 'डेमो 6 — फर्जी बैंक लिंक',
    'demo_emergency': 'डेमो 7 — गलती से लिंक क्लिक हो गया',
    'demo_financial': 'डेमो 8 — वित्तीय धोखाधड़ी (₹20,000)',
    'demo_offline': 'डेमो 9 — ऑफ़लाइन सुरक्षा मोड',

    // Hero
    'hero_badge': 'अगली पीढ़ी का डिजिटल सुरक्षा एवं विश्वास प्लेटफॉर्म',
    'hero_title': 'रक्षाAI 2.0 (RakshaAI 2.0)',
    'hero_motto': '“जांचें। सत्यापित करें। सुरक्षित रहें। समाधान पाएं। भरोसा करने से पहले।”',
    'hero_desc': 'आवाज़ की नकल (Voice Cloning), डीपफेक वीडियो, फर्जी बैंक लिंक (Phishing), व्हाट्सएप/टेलीग्राम धोखाधड़ी और UPI पेमेंट स्कैम से AI-संचालित संपूर्ण सुरक्षा।',
    'btn_scan_media': 'संदिग्ध मीडिया या लिंक की जांच करें',
    'golden_diff_tag': 'रक्षाAI का मुख्य अंतर (The Golden Differentiator)',
    'golden_diff_title': 'अधिकांश सुरक्षा टूल्स केवल पूछते हैं: “क्या यह संदिग्ध है?”',
    'golden_diff_desc': 'रक्षाAI 2.0 बताता है: क्या खतरनाक है, इसे क्यों चिह्नित किया गया, क्या बिल्कुल नहीं करना है, तुरंत क्या कदम उठाने हैं, सुरक्षित तरीके से कैसे जांचें और 1930 पर आधिकारिक शिकायत कैसे दर्ज करें।',
    'full_response_badge': '✓ संपूर्ण सुरक्षा व समाधान प्रोटोकॉल',

    // Action Cards
    'select_tool_title': 'जांच और सुरक्षा उपकरण चुनें',
    'select_tool_desc': 'नागरिकों और उद्यमों के लिए विशेष रूप से निर्मित डिजिटल सुरक्षा कवच',
    'act_voice_title': 'आवाज़ की जांच करें',
    'act_voice_desc': 'AI वॉयस क्लोनिंग, वोकोडर प्रभाव और फर्जी कॉल की पहचान करें।',
    'act_video_title': 'वीडियो की जांच करें',
    'act_video_desc': 'चेहरे के फेरबदल, असामान्य पलक झपकने और होंठों के तालमेल (Lip-sync) की जांच करें।',
    'act_link_title': 'वेब लिंक की जांच करें',
    'act_link_desc': 'बैंकों के मिलते-जुलते फर्जी डोमेन और पासवर्ड चुराने वाले लिंक सुरक्षित रूप से परखें।',
    'act_msg_title': 'संदेश की जांच करें',
    'act_msg_desc': 'संदिग्ध व्हाट्सएप या SMS पेस्ट करके पैसे की मांग और डिजिटल अरेस्ट की धमकी पहचानें।',
    'act_screen_title': 'स्क्रीनशॉट की जांच करें',
    'act_screen_desc': 'चैट और पेमेंट स्क्रीनशॉट से सीधे UPI ID, फोन नंबर और फर्जी बातें निकालें।',
    'act_social_title': 'सोशल मीडिया कवच',
    'act_social_desc': 'WhatsApp, Instagram, Telegram और Facebook पर हो रही ठगी से विशेष सुरक्षा।',
    'act_pay_title': 'UPI व पेमेंट जांचें',
    'act_pay_desc': 'रिवर्स क्यूआर कोड और फर्जी कलेक्ट रिक्वेस्ट से पैसे कटने से पहले जांच करें।',
    'act_emerg_title': 'साइबर आपातकाल',
    'act_emerg_desc': 'लिंक क्लिक होने या पैसे कटने पर 1930 गोल्डन ऑवर फ्रीज और समाधान सहायता।',
    'act_acad_title': 'सुरक्षा केंद्र (अकादमी)',
    'act_acad_desc': 'हिंदी और अंग्रेजी में साइबर ठगी के नए तौर-तरीकों से बचने की शिक्षा।',
    'launch_analyzer': 'उपकरण शुरू करें',

    // How It Works
    'how_it_works_title': 'रक्षाAI 2.0 कैसे काम करता है?',
    'step_01_title': '1. इनपुट (INPUT)',
    'step_01_desc': 'ऑडियो, वीडियो, स्क्रीनशॉट अपलोड करें या लिंक व संदेश पेस्ट करें।',
    'step_02_title': '2. पहचान (DETECT)',
    'step_02_desc': 'AI सिंथेटिक आवाज़, चेहरे की विकृति और ठगी के संकेतों को पकड़ता है।',
    'step_03_title': '3. व्याख्या (EXPLAIN)',
    'step_03_desc': 'आसान भाषा में बताता है कि सामग्री को संदिग्ध क्यों माना गया।',
    'step_04_title': '4. सुरक्षा (SAFETY)',
    'step_04_desc': 'तत्काल सावधानियां: क्या तुरंत करें और क्या भूलकर भी न करें।',
    'step_05_title': '5. समाधान (SOLVE)',
    'step_05_desc': 'समय-आधारित एक्शन प्लान: अभी, अगले 3 घंटे, 24 घंटे और 7 दिन।',
    'step_06_title': '6. शिकायत (REPORT)',
    'step_06_desc': 'डिजिटल साक्ष्य का SHA-256 हैश और 1930 हेल्पलाइन के लिए शिकायत ड्राफ्ट।',

    // Voice Analyzer
    'voice_header_tag': 'AI वॉयस डीपफेक और नकली आवाज़ डिटेक्टर',
    'voice_header_title': 'ऑडियो और वॉयस नोट की जांच करें',
    'voice_header_desc': 'आर्टिफिशियल इंटेलिजेंस द्वारा बनाई गई आवाज़, असामान्य सांस का अंतराल और पैसे की तात्कालिक मांग का विश्लेषण करता है।',
    'voice_who_claims': 'कॉल करने वाला खुद को क्या बता रहा है?',
    'voice_upload_prompt': 'वॉयस नोट या ऑडियो फाइल अपलोड करें',
    'voice_upload_sub': 'सभी वॉयस नोट समर्थित: MP4, MP3, WAV, M4A, OPUS, AAC, OGG, AMR, WEBM (अधिकतम 50MB)',
    'voice_btn_scan': 'डीपफेक वॉयस स्कैन शुरू करें',
    'voice_btn_scanning': 'ध्वनि तरंगों और सिंथेटिक आवाज़ की जांच हो रही है...',

    // Video Analyzer
    'video_header_tag': 'मल्टीमोडल टेम्पोरल और विजुअल डीपफेक विश्लेषक',
    'video_header_title': 'वीडियो हेरफेर और लिप-सिंक की जांच करें',
    'video_header_desc': 'चेहरे की बनावट, किनारे का धुंधलापन, पलक झपकने की दर और आवाज़ व होंठों के मिलान का फ्रेम-दर-फ्रेम विश्लेषण।',
    'video_upload_prompt': 'वीडियो फाइल अपलोड करें',
    'video_upload_sub': 'MP4, MOV, WEBM समर्थित (अधिकतम 100MB)',
    'video_btn_scan': 'मल्टीमोडल डीपफेक वीडियो जांच चलाएं',
    'video_btn_scanning': 'चेहरे के लैंडमार्क और फ्रेम विकृति की जांच हो रही है...',

    // Link Analyzer
    'link_header_tag': 'LINKSHIELD सुरक्षित वेब लिंक विश्लेषक',
    'link_header_title': 'संदिग्ध लिंक को बिना खोले सुरक्षित जांचें',
    'link_header_desc': 'बिना ब्राउज़र में लिंक खोले डोमेन की उम्र, बैंकों के मिलते-जुलते नाम और पासवर्ड चुराने वाले फर्जी पेजों की पहचान करता है।',
    'link_paste_label': 'जांच के लिए वेब लिंक (URL) यहाँ पेस्ट करें',
    'link_test_samples': 'नमूना लिंक:',
    'link_btn_scan': 'LinkShield द्वारा लिंक की सुरक्षित जांच करें',
    'link_btn_scanning': 'DNS, डोमेन और सुरक्षा डेटाबेस से मिलान हो रहा है...',

    // Message Analyzer
    'msg_header_tag': 'स्कैम इरादा और दबाव पहचान इंजन',
    'msg_header_title': 'संदिग्ध संदेश और तात्कालिक दबाव की जांच',
    'msg_header_desc': 'पैसे की मांग, OTP पूछना, बैंक खाता बंद होने का डर और फर्जी "डिजिटल अरेस्ट" की धमकियों को तुरंत पहचानता है।',
    'msg_platform_label': 'संदेश किस ऐप पर मिला?',
    'msg_sender_label': 'भेजने वाले का दावा (रिश्तेदार, बैंक, पुलिस)',
    'msg_paste_label': 'संदिग्ध संदेश का टेक्स्ट यहाँ पेस्ट करें',
    'msg_btn_scan': 'स्कैम इंटेंट इंजन से संदेश जांचें',
    'msg_btn_scanning': 'सामाजिक इंजीनियरिंग और दबाव के संकेतों का विश्लेषण जारी है...',

    // Screenshot Analyzer
    'screen_header_tag': 'ऑप्टिकल कैरेक्टर रिकग्निशन (OCR) एवं स्क्रीनशॉट स्कैनर',
    'screen_header_title': 'चैट और पेमेंट स्क्रीनशॉट का विश्लेषण करें',
    'screen_header_desc': 'इमेज से बातचीत का टेक्स्ट, फोन नंबर, UPI ID और वेब लिंक सीधे निकालकर ठगी के खतरे का आकलन करता है।',
    'screen_upload_prompt': 'स्क्रीनशॉट अपलोड करें (PNG, JPG)',
    'screen_btn_scan': 'स्क्रीनशॉट से डेटा निकालें और जांचें',
    'screen_what_found': 'इस स्क्रीनशॉट में हमें क्या मिला:',

    // SocialShield
    'social_header_tag': 'SOCIALSHIELD डिजिटल सोशल मीडिया फ्रॉड सुरक्षा',
    'social_header_title': 'सोशल मीडिया स्कैम और चैट विश्लेषक',
    'social_header_desc': 'WhatsApp परिवार इमरजेंसी, Instagram फर्जी गिफ्ट कस्टम शुल्क, Telegram क्रिप्टो फ्रॉड और OLX मार्केटप्लेस अग्रिम भुगतान स्कैम से रक्षा।',
    'social_select_platform': 'सोशल मीडिया प्लेटफॉर्म चुनें',
    'social_sender_profile': 'भेजने वाले का हैंडल या प्रोफाइल जानकारी',
    'social_content_label': 'कॉपी की गई चैट या संदेश यहाँ पेस्ट करें',
    'social_btn_scan': 'SocialShield द्वारा विश्लेषण करें',

    // PaymentShield
    'pay_header_tag': 'PAYMENTSHIELD UPI और क्यूआर कोड धोखाधड़ी निवारक',
    'pay_header_title': 'UPI अनुरोध और रिवर्स क्यूआर स्कैम जांचें',
    'pay_header_desc': 'पिन दर्ज करने से पहले खरीदार/विक्रेता के पेमेंट संदेशों की जांच करता है ताकि आप रिवर्स क्यूआर के जाल में न फंसें।',
    'pay_rule_title': 'सुनहरा UPI नियम (THE GOLDEN RULE):',
    'pay_rule_desc': 'पैसे पाने (Receive) के लिए कभी भी UPI PIN नहीं डालना पड़ता! पिन डालने से हमेशा आपके बैंक खाते से पैसे कटते हैं। रक्षाAI कभी भी कोई लेन-देन नहीं करता।',
    'pay_upi_label': 'प्राप्तकर्ता का UPI ID / VPA हैंडल',
    'pay_amount_label': 'मांगी गई राशि (रुपये ₹)',
    'pay_context_label': 'पेमेंट से जुड़ा संदेश या सामने वाले के निर्देश',
    'pay_btn_scan': 'PaymentShield से पेमेंट अनुरोध जांचें',

    // Emergency Page
    'emerg_header_title': '🚨 संदिग्ध लिंक पर क्लिक हो गया',
    'emerg_header_desc': 'घबराएं नहीं! शुरुआती 1-2 घंटे (गोल्डन ऑवर) में तुरंत कदम उठाने से नुकसान रोका जा सकता है। आपातकालीन प्रोटोकॉल के लिए नीचे दिए गए सवालों के जवाब दें।',
    'emerg_url_label': 'जो लिंक आपने क्लिक किया था (यदि याद हो)',
    'emerg_q1': '1. क्या आपने उस वेबसाइट पर कोई गोपनीय जानकारी दर्ज की थी?',
    'emerg_q2': '2. क्या आपके बैंक खाते या क्रेडिट कार्ड से पैसे कटे हैं?',
    'emerg_btn_protocol': 'आपातकालीन रोकथाम प्रोटोकॉल शुरू करें',
    'emerg_golden_tag': '⚡ गोल्डन ऑवर ट्रांजैक्शन फ्रीज',
    'emerg_call_1930': 'तुरंत 1930 पर कॉल करें',
    'emerg_call_1930_desc': 'राष्ट्रीय साइबर अपराध हेल्पलाइन (1930) ठग द्वारा पैसे निकालने से पहले संबंधित बैंक खाते को फ्रीज करवा सकती है।',
    'emerg_btn_call': 'अभी 1930 मिलाएं',
    'emerg_btn_portal': 'पोर्टल खोलें (cybercrime.gov.in)',
    'emerg_actions_title': 'तुरंत उठाए जाने वाले कदम (Immediate Actions)',
    'emerg_dossier_btn': '1930 शिकायत ड्राफ्ट तैयार करें',

    // Evidence Locker
    'locker_tag': 'क्रिप्टोग्राफिक साक्ष्य लॉकर और टाइमलाइन',
    'locker_title': 'साक्ष्य लॉकर एवं अखंडता वॉल्ट',
    'locker_desc': 'स्क्रीनशॉट, वॉयस रिकॉर्डिंग, पेमेंट प्रूफ और घटना की टाइमलाइन को SHA-256 डिजिटल फिंगरप्रिंट के साथ सुरक्षित रखता है।',
    'locker_btn_add': 'नया साक्ष्य जोड़ें',
    'locker_readiness': 'साक्ष्य तत्परता (Readiness)',
    'locker_timeline_title': 'घटनाक्रम की क्रमानुसार टाइमलाइन',
    'locker_btn_report': 'आधिकारिक रिपोर्ट तैयार करें',
    'locker_secured_items': 'सुरक्षित रखे गए साक्ष्य',

    // Report Page
    'report_tag': 'AI प्रारंभिक साइबर अपराध रिपोर्ट जनरेटर',
    'report_title': 'आधिकारिक घटना दस्तावेज और 1930 शिकायत ड्राफ्ट',
    'report_desc': 'राष्ट्रीय साइबर अपराध रिपोर्टिंग पोर्टल के प्रारूप में आपके साक्ष्य, टाइमलाइन और संदिग्ध की जानकारी को तैयार करता है।',
    'report_btn_copy': 'शिकायत कॉपी करें',
    'report_btn_copied': 'क्लिपबोर्ड में कॉपी हो गई!',
    'report_btn_print': 'प्रिंट करें / PDF सेव करें',
    'report_instructions_title': 'भारत में इस शिकायत को कैसे दर्ज करें:',
    'report_instructions_desc': '1. नीचे दिए गए शिकायत पाठ को कॉपी करें। 2. cybercrime.gov.in पर जाएं या 1930 पर कॉल करें। 3. वित्तीय या अन्य अपराध चुनकर इस शिकायत को पेस्ट कर दें।',

    // Family Shield
    'family_tag': 'FAMILY SHIELD परिवार सुरक्षा घेरा',
    'family_title': 'माता-पिता, बुजुर्गों और परिवार की रक्षा करें',
    'family_desc': 'बुजुर्गों को निशाना बनाने वाले साइबर खतरों पर नज़र रखें, बिना उनकी निजी चैट या मीडिया में दखल दिए।',
    'family_btn_add': 'परिवार का सदस्य जोड़ें',
    'family_privacy_title': 'गोपनीयता का मूल सिद्धांत (Zero Invasion):',
    'family_privacy_desc': 'रक्षाAI कभी भी परिवार के सदस्यों की निजी चैट, फोटो या ऑडियो साझा नहीं करता। केवल सुरक्षा खतरे के अलर्ट और जागरूकता संदेश साझा किए जाते हैं।',
    'family_safeword_title': 'परिवार का गुप्त "सेफ-वर्ड" (Family Safe-Word) नियम',
    'family_safeword_desc': 'यदि किसी बुजुर्ग परिजन को दुर्घटना या गिरफ्तारी का फर्जी AI कॉल आए, तो पैसे भेजने से पहले उन्हें यह गुप्त शब्द पूछना अनिवार्य है।',

    // Common Cards
    'card_risk': 'जोखिम स्तर (RISK)',
    'card_confidence': 'AI सटीकता (CONFIDENCE)',
    'card_verify_btn': '🔍 व्यक्ति को सत्यापित करें',
    'card_preserve_btn': '📁 साक्ष्य सुरक्षित करें',
    'card_signals_title': 'पहचाने गए संदिग्ध व्यवहार और तकनीकी संकेत',
    'card_why_flagged': 'इसे संदिग्ध क्यों माना गया?',
    'card_what_means': 'सरल भाषा में इसका क्या अर्थ है?',
    'safety_engine_title': '🛡️ समर्पित सुरक्षा इंजन — तुरंत उठाए जाने वाले कदम',
    'safety_do_now': 'अभी यह करें (तत्काल सावधानियां):',
    'safety_dont_do': 'यह भूलकर भी न करें:',
    'solution_engine_title': '💡 समाधान इंजन — चरणबद्ध कार्य योजना (Roadmap)',
    'solution_engine_desc': 'इस खतरे के लिए विशेष रूप से तैयार की गई चरणबद्ध सुरक्षा प्रक्रिया।',
    'sol_now': 'अभी (0 से 15 मिनट)',
    'sol_now_sub': 'तत्काल नुकसान रोकथाम और संपर्क विच्छेद',
    'sol_3h': 'अगले 3 घंटे',
    'sol_3h_sub': 'गोल्डन ऑवर में 1930 रिपोर्टिंग और खातों को अलग करना',
    'sol_24h': 'अगले 24 घंटे',
    'sol_24h_sub': 'बैंक में औपचारिक विवाद, पासवर्ड बदलना व डिवाइस की सफाई',
    'sol_7d': 'अगले 7 दिन',
    'sol_7d_sub': 'कार्रवाई पर नज़र, क्रेडिट रिपोर्ट जांच व दीर्घकालिक सुरक्षा',

    // Video Analyzer extra keys
    'video_landmarks': 'चेहरे की रूपरेखा',
    'video_feathering': 'किनारों की बनावट',
    'video_cadence': 'नेत्र गति और पलकें',
    'video_lip': 'आवाज-होंठ तालमेल',
    'video_context_label': 'घटना का संदर्भ / स्रोत',
    'video_context_placeholder': 'उदा. व्हाट्सएप पर कंपनी डायरेक्टर बनकर पैसे ट्रांसफर करने का वीडियो',

    // Dashboard
    'dash_tag': 'व्यक्तिगत सुरक्षा एवं घटना विश्लेषण',
    'dash_title': 'सुरक्षा इंटेलिजेंस डैशबोर्ड',
    'dash_desc': 'स्कैन किए गए मीडिया, उच्च-जोखिम चेतावनियों, डिजिटल साक्ष्य रिकॉर्ड और सदस्यता स्थिति का रीयल-टाइम विवरण।',
    'dash_btn_telemetry': 'सिस्टम टेलीमेट्री',
    'dash_total_scans': 'कुल स्कैन',
    'dash_across_modalities': 'सभी श्रेणियों में',
    'dash_high_risks': 'गंभीर खतरे',
    'dash_immediate_action': 'तत्काल कार्रवाई की गई',
    'dash_locked_evidence': 'सुरक्षित साक्ष्य',
    'dash_sha256_fingerprint': 'SHA-256 डिजिटल मुहर',
    'dash_1930_reports': '1930 रिपोर्ट',
    'dash_complaint_packs': 'तैयार शिकायत पत्र',
    'dash_scans_by_modality': 'श्रेणी अनुसार स्कैन विश्लेषण',
    'dash_risk_dist': 'पहचाने गए जोखिमों का अनुपात',
    'dash_sub_tag': 'सुरक्षा से लाभ कमाएं, निजी डेटा बेचकर नहीं',
    'dash_sub_title': 'रक्षाAI सदस्यता योजनाएं (Subscription Plans)',
    'dash_sub_desc': 'भारतीय नागरिकों के लिए तैयार की गई किफायती और पारदर्शी सुरक्षा योजनाएं।',
    'dash_active_plan': 'सक्रिय योजना: रक्षा प्लस (₹49/माह)',
    'dash_current_plan': 'वर्तमान योजना',
    'dash_select_plan': 'योजना चुनें',

    // Footer
    'footer_tagline': 'AI-संचालित डिजिटल विश्वास, धोखाधड़ी पहचान, सुरक्षा और समाधान प्लेटफॉर्म। विश्वास करने से पहले जांचें।',
    'footer_privacy_badge': '🛡️ सुरक्षा से लाभ कमाएं, निजी डेटा बेचकर नहीं।',
    'footer_flow_title': 'सिस्टम प्रक्रिया प्रवाह',
    'footer_helpline_title': 'आधिकारिक भारतीय हेल्पलाइन',
    'footer_cyber_fraud': 'राष्ट्रीय साइबर वित्तीय धोखाधड़ी:',
    'footer_portal_label': 'राष्ट्रीय साइबर अपराध पोर्टल:',
    'footer_sec_title': 'सुरक्षा एवं गोपनीयता',
    'footer_sec_desc': 'ज़ीरो-नॉलेज साक्ष्य हैशिंग, SHA-256 डिजिटल मुहर, और ऑफलाइन PWA आपातकालीन सुविधा।',
    'footer_disclaimer_title': 'वैधानिक अस्वीकरण (DISCLAIMER)',
    'footer_disclaimer_text': 'रक्षाAI 2.0 AI-सहायता प्राप्त साइबर खतरे का पता लगाने, साक्ष्य व्यवस्थित करने और शिकायत पत्र तैयार करने का साधन है। रक्षाAI पुलिस या बैंक नहीं है और सीधे खाते फ्रीज नहीं कर सकता। पैसे कटने पर गोल्डन ऑवर (Golden Hour) के भीतर तुरंत राष्ट्रीय साइबर हेल्पलाइन 1930 और अपने बैंक से संपर्क करें।',
    'footer_copyright': '© 2026 रक्षाAI टेक्नोलॉजीज। सर्वाधिकार सुरक्षित।',
    'footer_built_for': 'नागरिक साइबर सुरक्षा और डिजिटल विश्वास के लिए समर्पित',

    // Academy
    'acad_tag': 'रक्षाAI साइबर सुरक्षा अकादमी',
    'acad_title': 'इंटरएक्टिव डिजिटल सुरक्षा अकादमी',
    'acad_desc': 'आधुनिक सोशल इंजीनियरिंग, डीपफेक और वित्तीय धोखाधड़ी के खिलाफ व्यावहारिक रक्षात्मक रणनीतियाँ सीखें।',
    'acad_red_flags': 'धोखे के प्रमुख संकेत (RED FLAGS):',
    'acad_how_to_protect': 'सुरक्षित रहने के नियम (HOW TO STAY SAFE):',

    // Device Guard
    'nav_device_guard': '🛡️ डिवाइस सुरक्षा',
    'device_guard_badge': '24x7 रियल-टाइम डिवाइस सुरक्षा कवच',
    'device_guard_title': '360° रियल-टाइम डिवाइस साइबर गार्ड',
    'device_guard_subtitle': 'AnyDesk/TeamViewer जैसे जासूसी ऐप्स, अनवेरिफाइड APKs, फर्जी बैंक वेबसाइट और OTP चोरी से आपके फोन व लैपटॉप की 24 घंटे रियल-टाइम सुरक्षा।',
    'device_status_label': 'डिवाइस सुरक्षा स्थिति:',
    'device_status_protected': '🟢 100% सुरक्षित एवं साइबर शील्ड सक्रिय',
    'device_health_score': 'साइबर सुरक्षा स्कोर',
    'device_lockdown_title': 'आपातकालीन डिवाइस लॉकडाउन',
    'device_lockdown_desc': 'यदि आपको लगे कि कोई धोखेबाज आपकी स्क्रीन देख रहा है या बैंक खाते में सेंध लगा रहा है, तो तुरंत 1-क्लिक लॉकडाउन दबाएं।',
    'device_lockdown_btn': '🚨 1-क्लिक इमरजेंसी लॉकडाउन सक्रिय करें',
    'device_active_shields': 'सक्रिय 360° रियल-टाइम सुरक्षा शील्ड्स',
    'device_test_url_title': 'त्वरित लिंक व फ़िशिंग डिटेक्टर',
    'device_test_url_placeholder': 'SMS या WhatsApp पर आया संदिग्ध लिंक यहाँ पेस्ट करें (उदा. sbi-kyc-verify.top)',
    'device_test_url_btn': 'लिंक की जांच करें',
    'device_inspect_app_title': 'स्क्रीन शेयर व फ्रॉड ऐप चेकर',
    'device_inspect_app_placeholder': 'ऐप का नाम दर्ज करें (उदा. AnyDesk, QuickSupport, SBI_Update.apk)',
    'device_inspect_app_btn': 'ऐप की जांच करें',
    'device_recent_intercepts': 'डिवाइस द्वारा ब्लॉक किए गए हालिया साइबर खतरे'
  }
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'EN',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('raksha_lang') as Language) || 'EN';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('raksha_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['EN'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
