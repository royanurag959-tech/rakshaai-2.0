import React, { useState, useEffect } from 'react';
import { Users, Plus, Key, Trash2, Lock } from 'lucide-react';
import { api } from '../services/api';
import type { FamilyMember } from '../types';
import { useLanguage } from '../context/LanguageContext';

export const FamilyShieldPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [safeWord, setSafeWord] = useState<string>('Mango-Kite-77');
  const [isEditingSafeWord, setIsEditingSafeWord] = useState<boolean>(false);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newRelation, setNewRelation] = useState<string>('Parent');
  const [newPhone, setNewPhone] = useState<string>('');

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const list = await api.getFamilyMembers();
      setMembers(list);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    try {
      const added = await api.addFamilyMember({
        name: newName.trim(),
        relationship: newRelation,
        phone: newPhone.trim()
      });
      setMembers([...members, added]);
      setIsAddOpen(false);
      setNewName('');
      setNewPhone('');
    } catch (err: any) {
      alert('Could not add member: ' + err.message);
    }
  };

  const handleRemove = async (id: number) => {
    const confirmMsg = language === 'HI' ? 'क्या आप इस सदस्य को सुरक्षा घेरे से हटाना चाहते हैं?' : 'Remove member from Family Shield protection circle?';
    if (!confirm(confirmMsg)) return;
    try {
      await api.removeFamilyMember(id);
      setMembers(members.filter(m => m.id !== id));
    } catch (err: any) {
      alert('Could not remove member: ' + err.message);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-pink-400 text-xs font-mono mb-2">
            <Users className="w-4 h-4" />
            <span>{t('family_tag')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {t('family_title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('family_desc')}
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-700 text-white font-bold text-xs shadow-lg shadow-pink-500/20 transition-all flex items-center space-x-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('family_btn_add')}</span>
        </button>
      </div>

      {/* Core Privacy Principle Banner */}
      <div className="p-4 rounded-xl bg-cyber-800/80 border border-cyber-border text-xs text-slate-300 flex items-start space-x-3">
        <Lock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-white block mb-0.5">{t('family_privacy_title')}</strong>
          {t('family_privacy_desc')}
        </div>
      </div>

      {/* Family Safe-Word Protocol Card */}
      <div className="glass-panel p-6 rounded-2xl border border-pink-500/30 bg-gradient-to-r from-pink-950/20 via-cyber-900 to-cyber-900 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Key className="w-4 h-4 text-pink-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                {t('family_safeword_title')}
              </h3>
            </div>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              {t('family_safeword_desc')}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {isEditingSafeWord ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={safeWord}
                  onChange={(e) => setSafeWord(e.target.value)}
                  className="bg-cyber-900 border border-pink-500 rounded-lg px-3 py-1.5 text-xs text-white font-mono"
                />
                <button
                  onClick={() => setIsEditingSafeWord(false)}
                  className="px-3 py-1.5 rounded-lg bg-pink-600 text-white text-xs font-bold"
                >
                  {language === 'HI' ? 'सेव' : 'Save'}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="px-3.5 py-1.5 rounded-xl bg-cyber-900 border border-pink-500/40 text-pink-300 font-mono font-bold text-sm tracking-wider">
                  🔑 {safeWord}
                </span>
                <button
                  onClick={() => setIsEditingSafeWord(true)}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  {language === 'HI' ? 'बदलें' : 'Change'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Family Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {members.map((member) => (
          <div
            key={member.id}
            className="glass-panel p-5 rounded-2xl border border-cyber-border hover:border-pink-500/40 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyber-900 text-slate-300 border border-cyber-border">
                  {member.relation_type}
                </span>
                <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded ${
                  member.safety_status === 'alert'
                    ? 'bg-amber-950/70 text-amber-400 border border-amber-500/40'
                    : 'bg-emerald-950/70 text-emerald-400 border border-emerald-500/40'
                }`}>
                  {member.safety_status === 'alert' ? '⚠️ Alert Pending' : '✓ Protected'}
                </span>
              </div>

              <h4 className="text-base font-bold text-white mb-1">{member.name}</h4>
              <span className="text-xs text-slate-400 font-mono block mb-3">{member.phone || 'No phone recorded'}</span>

              <div className="p-3 rounded-xl bg-cyber-900/80 border border-cyber-border text-xs">
                <span className="text-[10px] text-slate-400 uppercase font-mono block mb-1">
                  {language === 'HI' ? 'सुरक्षा स्थिति:' : 'Protection Status:'}
                </span>
                <span className="text-slate-200">{member.last_risk_alert || 'All scans clear.'}</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-cyber-border/70 flex items-center justify-between text-xs">
              <button
                onClick={() => alert(`Simulated Voice Clone awareness nudge sent to ${member.name} via WhatsApp/SMS.`)}
                className="text-pink-400 hover:text-pink-300 font-semibold text-[11px]"
              >
                {language === 'HI' ? 'जागरूकता अलर्ट भेजें' : 'Send Awareness Nudge'}
              </button>
              <button
                onClick={() => handleRemove(member.id)}
                className="text-slate-500 hover:text-red-400 p-1"
                title="Remove Member"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Member Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel max-w-md w-full rounded-2xl p-6 border border-cyber-border space-y-4">
            <h3 className="text-base font-bold text-white">
              {language === 'HI' ? 'परिवार का सदस्य जोड़ें' : 'Add Member to Family Shield'}
            </h3>
            <form onSubmit={handleAddMember} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {language === 'HI' ? 'पूरा नाम' : 'Full Name'}
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Anand Roy (Uncle)"
                  className="w-full bg-cyber-900 border border-cyber-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {language === 'HI' ? 'रिश्ता' : 'Relationship'}
                </label>
                <select
                  value={newRelation}
                  onChange={(e) => setNewRelation(e.target.value)}
                  className="w-full bg-cyber-900 border border-cyber-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-pink-500"
                >
                  <option value="Father">{language === 'HI' ? 'पिता (Father)' : 'Father'}</option>
                  <option value="Mother">{language === 'HI' ? 'माता (Mother)' : 'Mother'}</option>
                  <option value="Grandparent">{language === 'HI' ? 'दादा / दादी / नाना / नानी' : 'Grandparent'}</option>
                  <option value="Spouse">{language === 'HI' ? 'पति / पत्नी' : 'Spouse'}</option>
                  <option value="Child">{language === 'HI' ? 'बेटा / बेटी' : 'Child'}</option>
                  <option value="Sibling">{language === 'HI' ? 'भाई / बहन' : 'Sibling'}</option>
                  <option value="Other">{language === 'HI' ? 'अन्य परिजन' : 'Other'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {language === 'HI' ? 'मोबाइल नंबर' : 'Mobile Phone Number'}
                </label>
                <input
                  type="tel"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="+91 98XXX XXXXX"
                  className="w-full bg-cyber-900 border border-cyber-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-pink-500 font-mono"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2 rounded-xl bg-cyber-800 text-slate-300 text-xs font-semibold hover:bg-cyber-700"
                >
                  {language === 'HI' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-pink-600 text-white text-xs font-bold hover:bg-pink-700"
                >
                  {language === 'HI' ? 'सुरक्षा घेरे में शामिल करें' : 'Join Protection Circle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
