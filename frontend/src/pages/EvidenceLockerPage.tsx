import React, { useState, useEffect } from 'react';
import { Lock, Plus, FileText, Clock, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import type { EvidenceRecord, Incident } from '../types';
import { EvidenceCard } from '../components/EvidenceCard';
import { useLanguage } from '../context/LanguageContext';

interface EvidenceLockerPageProps {
  onGenerateReport?: (incidentId: number) => void;
}

export const EvidenceLockerPage: React.FC<EvidenceLockerPageProps> = ({ onGenerateReport }) => {
  const { language, t } = useLanguage();
  const [evidenceList, setEvidenceList] = useState<EvidenceRecord[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [newTimelineText, setNewTimelineText] = useState<string>('');

  // Manual evidence entry modal
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newType, setNewType] = useState<string>('screenshot');
  const [newNotes, setNewNotes] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [evList, incList] = await Promise.all([
        api.getEvidenceList(),
        api.getIncidents()
      ]);
      setEvidenceList(evList);
      setIncidents(incList);
      if (incList.length > 0) {
        setSelectedIncident(incList[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTimeline = async () => {
    if (!selectedIncident || !newTimelineText.trim()) return;
    try {
      const updated = await api.addTimelineEvent(selectedIncident.id, newTimelineText.trim());
      setSelectedIncident(updated);
      setNewTimelineText('');
      setIncidents(incidents.map(inc => inc.id === updated.id ? updated : inc));
    } catch (err: any) {
      alert('Could not add timeline event: ' + err.message);
    }
  };

  const handleCreateEvidence = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const created = await api.createEvidence({
        incident_id: selectedIncident?.id,
        title: newTitle.trim(),
        evidence_type: newType,
        notes: newNotes.trim()
      });
      setEvidenceList([created, ...evidenceList]);
      setIsAddOpen(false);
      setNewTitle('');
      setNewNotes('');
    } catch (err: any) {
      alert('Could not save evidence: ' + err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 py-6 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-mono mb-2">
            <Lock className="w-4 h-4" />
            <span>{t('locker_tag')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {t('locker_title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('locker_desc')}
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all flex items-center space-x-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('locker_btn_add')}</span>
        </button>
      </div>

      {/* Legal disclaimer badge */}
      <div className="p-3.5 rounded-xl bg-cyber-800/80 border border-cyber-border text-xs text-slate-400 flex items-start space-x-2.5">
        <AlertCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <span>
          {language === 'HI'
            ? 'साक्ष्य अखंडता सूचना: रक्षाAI डिजिटल छेड़छाड़ से बचाव के लिए SHA-256 हैश तैयार करता है। ये साक्ष्य संगठनात्मक और पुलिस शिकायत सहायता के लिए हैं।'
            : 'EVIDENCE INTEGRITY NOTICE: RakshaAI computes SHA-256 digests upon ingestion to preserve chain-of-custody timestamps. These summaries are organizational and complaint aids.'}
        </span>
      </div>

      {/* Active Incident & Readiness Score */}
      {selectedIncident && (
        <div className="glass-panel p-6 rounded-2xl border border-cyber-border">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-cyber-border">
            <div>
              <span className="text-xs font-mono text-blue-400 font-bold block mb-1">
                {language === 'HI' ? 'सक्रिय घटना कोड: ' : 'Active Incident: '} {selectedIncident.incident_code}
              </span>
              <h2 className="text-lg font-bold text-white">{selectedIncident.title}</h2>
              <span className="text-xs text-slate-400">
                {language === 'HI' ? 'प्लेटफॉर्म: ' : 'Platform: '} <strong>{selectedIncident.platform || 'Digital'}</strong> | {language === 'HI' ? 'श्रेणी: ' : 'Category: '} <strong>{selectedIncident.incident_type}</strong>
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Evidence Readiness Score */}
              <div className="text-right">
                <span className="text-[11px] text-slate-400 uppercase tracking-wider block">
                  {t('locker_readiness')}
                </span>
                <div className="flex items-center space-x-1.5 justify-end">
                  <span className="text-2xl font-black text-emerald-400">
                    {selectedIncident.readiness_score} / 6
                  </span>
                </div>
              </div>

              {onGenerateReport && (
                <button
                  onClick={() => onGenerateReport(selectedIncident.id)}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/25 transition-all flex items-center space-x-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>{t('locker_btn_report')}</span>
                </button>
              )}
            </div>
          </div>

          {/* Readiness checklist pills */}
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 my-4 text-center text-xs">
            {[
              { label: language === 'HI' ? 'मूल मीडिया' : 'Original Media', met: true },
              { label: language === 'HI' ? 'स्क्रीनशॉट' : 'Screenshot', met: selectedIncident.readiness_score >= 2 },
              { label: language === 'HI' ? 'पेमेंट सबूत' : 'Transaction Proof', met: selectedIncident.financial_loss || selectedIncident.readiness_score >= 3 },
              { label: language === 'HI' ? 'फोन / लिंक' : 'Phone / URL', met: Boolean(selectedIncident.suspect_phone || selectedIncident.suspect_url || selectedIncident.suspect_upi) },
              { label: language === 'HI' ? 'तारीख व समय' : 'Date & Time', met: true },
              { label: language === 'HI' ? 'घटना विवरण' : 'Narrative', met: Boolean(selectedIncident.description) }
            ].map((chk, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg border text-[11px] font-semibold ${
                  chk.met
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                    : 'bg-cyber-900 text-slate-500 border-cyber-border'
                }`}
              >
                {chk.met ? '✓' : '○'} {chk.label}
              </div>
            ))}
          </div>

          {/* Chronological Timeline */}
          <div className="mt-6 pt-4 border-t border-cyber-border">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4 flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
              {t('locker_timeline_title')}
            </h3>

            <div className="space-y-3 relative before:absolute before:inset-0 before:left-2.5 before:w-0.5 before:bg-cyber-border pl-6">
              {(selectedIncident.timeline || []).map((tl, i) => (
                <div key={i} className="relative text-xs">
                  <div className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-2 border-cyber-900"></div>
                  <span className="font-mono text-[10px] text-blue-400 font-bold block">{tl.time}</span>
                  <span className="text-slate-200">{tl.event}</span>
                </div>
              ))}
            </div>

            {/* Add event input */}
            <div className="mt-4 flex items-center space-x-2">
              <input
                type="text"
                value={newTimelineText}
                onChange={(e) => setNewTimelineText(e.target.value)}
                placeholder={language === 'HI' ? 'नया घटनाक्रम जोड़ें (जैसे: 11:05 AM — बैंक को ईमेल द्वारा सूचना दी)' : 'Add manual event (e.g. 11:05 AM — Notified bank via email)'}
                className="flex-1 bg-cyber-900 border border-cyber-border rounded-xl px-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleAddTimeline}
                className="px-3.5 py-2 rounded-xl bg-cyber-800 hover:bg-cyber-700 text-white text-xs font-semibold border border-cyber-border transition-colors"
              >
                {language === 'HI' ? 'जोड़ें' : 'Add Entry'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Evidence Cards Grid */}
      <div>
        <h3 className="text-base font-bold text-white mb-4 flex items-center">
          <span>{t('locker_secured_items')} ({evidenceList.length})</span>
        </h3>

        {evidenceList.length === 0 ? (
          <div className="glass-panel p-8 rounded-2xl border border-cyber-border text-center text-slate-400 text-xs">
            {language === 'HI' ? 'अभी कोई साक्ष्य नहीं जोड़ा गया है।' : 'No evidence preserved yet.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evidenceList.map((ev) => (
              <EvidenceCard key={ev.id} evidence={ev} />
            ))}
          </div>
        )}
      </div>

      {/* Add Evidence Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel max-w-md w-full rounded-2xl p-6 border border-cyber-border space-y-4">
            <h3 className="text-base font-bold text-white">
              {language === 'HI' ? 'लॉकर में साक्ष्य जोड़ें' : 'Add Evidence to Locker'}
            </h3>
            <form onSubmit={handleCreateEvidence} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {language === 'HI' ? 'साक्ष्य का शीर्षक' : 'Evidence Title'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. WhatsApp Audio Recording with Scammer"
                  className="w-full bg-cyber-900 border border-cyber-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {language === 'HI' ? 'साक्ष्य का प्रकार' : 'Evidence Type'}
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-cyber-900 border border-cyber-border rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="screenshot">{language === 'HI' ? 'स्क्रीनशॉट (चैट/ईमेल)' : 'Screenshot (Chat/Email)'}</option>
                  <option value="audio_recording">{language === 'HI' ? 'ऑडियो रिकॉर्डिंग / वॉयस नोट' : 'Audio Recording / Voice Note'}</option>
                  <option value="video_clip">{language === 'HI' ? 'वीडियो क्लिप' : 'Video Clip'}</option>
                  <option value="payment_receipt">{language === 'HI' ? 'पेमेंट रसीद / बैंक SMS' : 'Payment Receipt / Bank SMS'}</option>
                  <option value="url">{language === 'HI' ? 'फिशिंग वेब लिंक' : 'Phishing URL'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {language === 'HI' ? 'जांच विवरण / टिप्पणी' : 'Investigative Notes'}
                </label>
                <textarea
                  rows={3}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Details on how and when this evidence was gathered..."
                  className="w-full bg-cyber-900 border border-cyber-border rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
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
                  className="flex-1 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
                >
                  {language === 'HI' ? 'सुरक्षित करें और हैश बनाएं' : 'Lock & Fingerprint'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
