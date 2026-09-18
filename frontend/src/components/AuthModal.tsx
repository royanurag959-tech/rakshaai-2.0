import React, { useState } from 'react';
import { X, Shield, Lock, Mail, User as UserIcon, Phone, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { login, register } = useAuth();
  const { language } = useLanguage();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      if (mode === 'login') {
        if (!email.trim() || !password.trim()) {
          throw new Error(language === 'HI' ? 'कृपया ईमेल और पासवर्ड दोनों दर्ज करें।' : 'Please provide both email and password.');
        }
        await login(email.trim(), password);
        setSuccessMsg(language === 'HI' ? 'सफलतापूर्वक लॉगिन हो गए!' : 'Logged in successfully!');
        setTimeout(() => {
          onClose();
        }, 600);
      } else {
        if (!email.trim() || !password.trim()) {
          throw new Error(language === 'HI' ? 'कृपया ईमेल और पासवर्ड दर्ज करें।' : 'Please enter email and password.');
        }
        if (!phone.trim()) {
          throw new Error(language === 'HI' ? 'आपातकालीन अलर्ट के लिए कृपया अपना मोबाइल नंबर दर्ज करें।' : 'Please enter your mobile phone number for fraud emergency alerts.');
        }
        await register({
          email: email.trim(),
          password,
          full_name: fullName.trim() || undefined,
          phone: phone.trim() || undefined,
        });
        setSuccessMsg(language === 'HI' ? 'खाता सफलतापूर्वक बन गया और लॉगिन हो गए!' : 'Account registered and logged in successfully!');
        setTimeout(() => {
          onClose();
        }, 600);
      }
    } catch (err: any) {
      setError(err.message || (language === 'HI' ? 'प्रमाणीकरण विफल रहा।' : 'Authentication failed.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-cyber-900 border border-cyber-border rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 overflow-hidden">
        {/* Decorative corner glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md">
              <Shield className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-white text-base">RakshaAI 2.0</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-cyber-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-cyber-800/80 rounded-xl border border-cyber-border">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'HI' ? 'लॉगिन करें' : 'Sign In'}
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'HI' ? 'नया खाता बनाएं' : 'Create Account'}
          </button>
        </div>

        <div>
          <h2 className="text-lg font-bold text-white">
            {mode === 'login'
              ? (language === 'HI' ? 'सुरक्षित रक्षाAI खाते में प्रवेश करें' : 'Sign in to your RakshaAI Account')
              : (language === 'HI' ? 'नागरिक साइबर सुरक्षा खाता पंजीकृत करें' : 'Register for Citizen Cyber Shield')}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login'
              ? (language === 'HI' ? 'अपने व्यक्तिगत स्कैन, साक्ष्य लॉकर और फ्रॉड अलर्ट रिकॉर्ड तक पहुंचें।' : 'Access your incident telemetry, evidence records, and automated early warning alerts.')
              : (language === 'HI' ? 'स्वचालित फ्रॉड अलर्ट पाने के लिए अपना वास्तविक मोबाइल नंबर अवश्य जोड़ें।' : 'Provide your mobile number to receive automated fraud alerts when targeted.')}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {language === 'HI' ? 'पूरा नाम' : 'Full Name'}
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder={language === 'HI' ? 'उदा. रोहन शर्मा' : 'e.g. Rohan Sharma'}
                    className="w-full bg-cyber-800/80 border border-cyber-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>{language === 'HI' ? 'मोबाइल नंबर (अलर्ट संदेश के लिए)' : 'Mobile Phone (for Fraud Alerts)'}</span>
                  <span className="text-[10px] text-blue-400 font-normal">{language === 'HI' ? 'SMS / WhatsApp' : 'SMS / WhatsApp'}</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-cyber-800/80 border border-cyber-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {language === 'HI' ? 'ईमेल पता' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full bg-cyber-800/80 border border-cyber-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              {language === 'HI' ? 'पासवर्ड' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-cyber-800/80 border border-cyber-border rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center space-x-2 mt-2"
          >
            <span>
              {isLoading
                ? (language === 'HI' ? 'कृपया प्रतीक्षा करें...' : 'Processing...')
                : mode === 'login'
                ? (language === 'HI' ? 'लॉगिन करें' : 'Sign In')
                : (language === 'HI' ? 'खाता बनाएं' : 'Create Protected Account')}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center pt-1 border-t border-cyber-border">
          <span className="text-[11px] text-slate-500">
            {language === 'HI' ? 'एंड-टू-एंड एनक्रिप्टेड • शून्य निजी डेटा बिक्री' : 'End-to-End Encrypted • Zero Private Data Sale'}
          </span>
        </div>
      </div>
    </div>
  );
};
