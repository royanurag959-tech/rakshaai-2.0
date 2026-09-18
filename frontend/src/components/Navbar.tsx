import React from 'react';
import {
  Shield, AlertTriangle, PhoneCall, Wifi, WifiOff, Users,
  BookOpen, LayoutDashboard, Lock, Languages, User as UserIcon, LogOut, Bell, Send, ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOnline: boolean;
  onOpenAuth?: () => void;
  onOpenAlerts?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, isOnline, onOpenAuth, onOpenAlerts }) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-cyber-900/90 backdrop-blur-md border-b border-cyber-border">
      {/* Top emergency & helpline notification bar */}
      <div className="bg-gradient-to-r from-red-950 via-cyber-800 to-red-950 px-4 py-1.5 text-xs text-slate-300 border-b border-red-900/40 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-600 text-white uppercase tracking-wider animate-pulse">
            {t('emergency_tag')}
          </span>
          <span>{t('helpline_prefix')}</span>
          <a href="tel:1930" className="text-white font-bold underline flex items-center hover:text-red-300">
            <PhoneCall className="w-3 h-3 mr-1 text-red-400 inline" /> 1930
          </a>
          <span className="hidden md:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-400">{t('portal_prefix')} <strong className="text-slate-200">cybercrime.gov.in</strong></span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Language Switcher Button in Header */}
          <div className="flex items-center p-0.5 bg-cyber-900 rounded-lg border border-cyber-border">
            <button
              onClick={() => setLanguage('EN')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                language === 'EN'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('HI')}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all ${
                language === 'HI'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              हिंदी
            </button>
          </div>

          <div className="flex items-center space-x-1">
            {isOnline ? (
              <span className="inline-flex items-center text-emerald-400 text-[11px]">
                <Wifi className="w-3 h-3 mr-1" /> {t('cloud_ai_active')}
              </span>
            ) : (
              <span className="inline-flex items-center text-amber-400 text-[11px] font-semibold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-600/40">
                <WifiOff className="w-3 h-3 mr-1" /> {t('offline_mode')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Tagline */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-500/20 border border-blue-400/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-white">RakshaAI</span>
                <span className="text-xs bg-blue-600/30 text-blue-400 px-1.5 py-0.5 rounded font-mono border border-blue-500/30">2.0</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide hidden sm:block">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium">
            <button
              onClick={() => setActiveTab('home')}
              className={`px-3 py-2 rounded-lg transition-colors ${activeTab === 'home' ? 'text-blue-400 bg-blue-950/50' : 'text-slate-300 hover:text-white hover:bg-cyber-800'}`}
            >
              {t('nav_overview')}
            </button>
            <button
              onClick={() => setActiveTab('voice')}
              className={`px-3 py-2 rounded-lg transition-colors ${activeTab === 'voice' ? 'text-blue-400 bg-blue-950/50' : 'text-slate-300 hover:text-white hover:bg-cyber-800'}`}
            >
              {t('nav_voice')}
            </button>
            <button
              onClick={() => setActiveTab('video')}
              className={`px-3 py-2 rounded-lg transition-colors ${activeTab === 'video' ? 'text-blue-400 bg-blue-950/50' : 'text-slate-300 hover:text-white hover:bg-cyber-800'}`}
            >
              {t('nav_video')}
            </button>
            <button
              onClick={() => setActiveTab('link')}
              className={`px-3 py-2 rounded-lg transition-colors ${activeTab === 'link' ? 'text-blue-400 bg-blue-950/50' : 'text-slate-300 hover:text-white hover:bg-cyber-800'}`}
            >
              {t('nav_link')}
            </button>
            <button
              onClick={() => setActiveTab('message')}
              className={`px-3 py-2 rounded-lg transition-colors ${activeTab === 'message' ? 'text-blue-400 bg-blue-950/50' : 'text-slate-300 hover:text-white hover:bg-cyber-800'}`}
            >
              {t('nav_message')}
            </button>
            <button
              onClick={() => setActiveTab('social')}
              className={`px-3 py-2 rounded-lg transition-colors ${activeTab === 'social' ? 'text-blue-400 bg-blue-950/50' : 'text-slate-300 hover:text-white hover:bg-cyber-800'}`}
            >
              {t('nav_social')}
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`px-3 py-2 rounded-lg transition-colors ${activeTab === 'payment' ? 'text-blue-400 bg-blue-950/50' : 'text-slate-300 hover:text-white hover:bg-cyber-800'}`}
            >
              {t('nav_payment')}
            </button>
            <button
              onClick={() => setActiveTab('device_guard')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1 ${activeTab === 'device_guard' ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/60' : 'text-emerald-400/90 hover:text-emerald-300 hover:bg-emerald-950/30'}`}
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
              <span>{t('nav_device_guard')}</span>
            </button>
            <button
              onClick={() => setActiveTab('locker')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1 ${activeTab === 'locker' ? 'text-blue-400 bg-blue-950/50' : 'text-slate-300 hover:text-white hover:bg-cyber-800'}`}
            >
              <Lock className="w-3.5 h-3.5 mr-1" />
              <span>{t('nav_evidence')}</span>
            </button>
            <button
              onClick={() => setActiveTab('family')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1 ${activeTab === 'family' ? 'text-blue-400 bg-blue-950/50' : 'text-slate-300 hover:text-white hover:bg-cyber-800'}`}
            >
              <Users className="w-3.5 h-3.5 mr-1" />
              <span>{t('nav_family')}</span>
            </button>
            <button
              onClick={() => setActiveTab('academy')}
              className={`px-3 py-2 rounded-lg transition-colors flex items-center space-x-1 ${activeTab === 'academy' ? 'text-blue-400 bg-blue-950/50' : 'text-slate-300 hover:text-white hover:bg-cyber-800'}`}
            >
              <BookOpen className="w-3.5 h-3.5 mr-1" />
              <span>{t('nav_academy')}</span>
            </button>
          </nav>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            {onOpenAlerts && (
              <button
                onClick={onOpenAlerts}
                className="bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-300 hover:text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all"
                title={language === 'HI' ? 'पीड़ित को त्वरित फ्रॉड चेतावनी SMS / WhatsApp भेजें' : 'Transmit early-warning fraud alert to victim'}
              >
                <Send className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                <span className="hidden sm:inline">{language === 'HI' ? '🚨 अलर्ट भेजें' : '🚨 Alert Dispatch'}</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('emergency')}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-2 rounded-lg shadow-lg shadow-red-600/30 flex items-center space-x-1.5 transition-all transform hover:scale-105 border border-red-500/50"
            >
              <AlertTriangle className="w-4 h-4 animate-bounce" />
              <span>{t('btn_clicked_link')}</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="p-2 text-slate-300 hover:text-white hover:bg-cyber-800 rounded-lg transition-colors border border-cyber-border"
              title={t('dashboard_tooltip')}
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>

            {/* Auth Login / User Status */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-1.5 pl-1">
                <div
                  className="px-2.5 py-1.5 bg-cyber-800 border border-blue-500/40 rounded-lg flex items-center space-x-1.5 text-xs text-slate-200"
                  title={user.email}
                >
                  <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                    {(user.full_name || user.email)[0].toUpperCase()}
                  </div>
                  <span className="hidden md:inline font-semibold text-white max-w-[90px] truncate">
                    {user.full_name || user.email.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-cyber-800 rounded-lg transition-colors border border-cyber-border"
                  title={language === 'HI' ? 'लॉगआउट करें' : 'Sign Out'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              onOpenAuth && (
                <button
                  onClick={onOpenAuth}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-3 py-2 rounded-lg flex items-center space-x-1.5 transition-all shadow-md shadow-blue-500/20 border border-blue-500/50"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>{language === 'HI' ? 'लॉगिन' : 'Sign In'}</span>
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
