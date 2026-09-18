export interface DemoScenario {
  id: string;
  title: string;
  category: string;
  description: string;
  targetPage: string;
  payload: any;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'demo-voice',
    title: 'Demo 1 — AI Voice Scam',
    category: 'Voice Deepfake',
    description: 'Fake family-member distress call: "Dad, I had an accident, wire ₹25,000 immediately".',
    targetPage: 'voice',
    payload: {
      filename: 'urgent_son_accident_call.wav',
      claimed_identity: 'Son / Family Member',
      notes: 'Contains synthetic vocoder frequency cutoff and high emotional urgency.'
    }
  },
  {
    id: 'demo-video',
    title: 'Demo 2 — Deepfake Video',
    category: 'Video Manipulation',
    description: 'Face-swapped CEO announcement with facial edge warping and lip-sync desynchronization.',
    targetPage: 'video',
    payload: {
      filename: 'manipulated_ceo_announcement.mp4',
      notes: 'Temporal blink rate irregularity and jawline diffusion artifacts.'
    }
  },
  {
    id: 'demo-whatsapp',
    title: 'Demo 3 — WhatsApp Scam',
    category: 'SocialShield',
    description: '"Bhai emergency hai, hospital mein hoon. Abhi turant ₹20,000 bhej do is UPI par."',
    targetPage: 'message',
    payload: {
      platform: 'whatsapp',
      sender_claim: 'Close Friend',
      message: 'Bhai urgent emergency hai! Hospital mein admit hoon. Turant ₹20,000 transfer kar de is UPI par: hospital-care99@oksbi. Main shaam tak pakka lauta dunga. Please jaldi kar!'
    }
  },
  {
    id: 'demo-instagram',
    title: 'Demo 4 — Instagram Scam',
    category: 'SocialShield',
    description: 'Fake brand giveaway DM: "You won iPhone 16 Pro! Pay ₹999 delivery customs fee to claim."',
    targetPage: 'social',
    payload: {
      platform: 'instagram',
      content: 'Congratulations @user! You were selected as the winner of our Apple Giveaway 2026. Claim your iPhone 16 Pro by paying a nominal courier handling charge of ₹999 via: https://apple-courier-clearance.xyz/pay',
      sender_profile: '@apple_giveaway_official_india'
    }
  },
  {
    id: 'demo-telegram',
    title: 'Demo 5 — Telegram Investment Scam',
    category: 'SocialShield',
    description: 'VIP Crypto Ponzi group offering guaranteed 500% daily returns with fake SEBI certificate.',
    targetPage: 'social',
    payload: {
      platform: 'telegram',
      content: '🔥 VIP GUARANTEED DAILY PROFITS! Invest ₹5,000 and withdraw ₹25,000 within 24 hours. 100% risk free, approved by global crypto liquidity fund. DM admin @crypto_king_invest for direct UPI payment.',
      sender_profile: '@crypto_king_invest'
    }
  },
  {
    id: 'demo-link',
    title: 'Demo 6 — Fraud Link (LinkShield)',
    category: 'LinkShield',
    description: 'Typosquatting phishing portal: https://sbi-online-kyc-update-secure.top/login',
    targetPage: 'link',
    payload: {
      url: 'https://sbi-online-kyc-update-secure.top/login'
    }
  },
  {
    id: 'demo-emergency',
    title: 'Demo 7 — Accidentally Clicked Link',
    category: 'Emergency Triage',
    description: 'User clicked a phishing link and entered their netbanking password and OTP.',
    targetPage: 'emergency',
    payload: {
      url: 'https://income-tax-refund-gov-in.buzz/portal',
      info_entered: ['Password', 'OTP', 'Banking information'],
      money_lost: 'NO'
    }
  },
  {
    id: 'demo-financial',
    title: 'Demo 8 — Financial Fraud (₹20,000)',
    category: 'PaymentShield & 1930',
    description: '₹20,000 lost through Reverse QR code scam on marketplace; triggers 1930 dossier.',
    targetPage: 'payment',
    payload: {
      upi_id: 'refund-desk99@ybl',
      amount: 20000,
      message_context: 'Scan this buyer QR code and enter your UPI PIN to receive ₹20,000 in your account.'
    }
  },
  {
    id: 'demo-offline',
    title: 'Demo 9 — Offline Protection Mode',
    category: 'Offline Resilience',
    description: 'Zero connectivity mode: cached 1930 protocols, local evidence hashing & sync queue.',
    targetPage: 'offline',
    payload: {}
  }
];
