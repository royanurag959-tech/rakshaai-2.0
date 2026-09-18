import React, { useState, useEffect } from 'react';
import { FileText, Copy, Printer, Check, PhoneCall, ExternalLink, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import type { Incident } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface IncidentReportPageProps {
  initialIncidentId?: number;
}

export const IncidentReportPage: React.FC<IncidentReportPageProps> = ({ initialIncidentId }) => {
  const { language, t } = useLanguage();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [selectedIncidentId, setSelectedIncidentId] = useState<number>(initialIncidentId || 1);
  const userStatement = 'I declare that the details provided above and in the preserved evidence are accurate to the best of my knowledge.';
  const [report, setReport] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    try {
      const list = await api.getIncidents();
      setIncidents(list);
      if (list.length > 0) {
        const targetId = initialIncidentId || list[0].id;
        setSelectedIncidentId(targetId);
        generate(targetId);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const generate = async (incId: number) => {
    try {
      const rep = await api.generateReport(incId, userStatement);
      setReport(rep);
    } catch (err: any) {
      alert('Could not generate report: ' + err.message);
    }
  };

  const handleCopy = () => {
    if (!report) return;
    navigator.clipboard.writeText(report.complaint_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-400 text-xs font-mono mb-2">
            <FileText className="w-4 h-4" />
            <span>{t('report_tag')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {t('report_title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {t('report_desc')}
          </p>
        </div>

        {/* Export / Action Buttons */}
        <div className="flex items-center space-x-2 shrink-0 self-start sm:self-auto">
          <button
            onClick={handleCopy}
            className="px-3.5 py-2 rounded-xl bg-cyber-800 hover:bg-cyber-700 text-white text-xs font-bold border border-cyber-border transition-colors flex items-center space-x-1.5"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-blue-400" />}
            <span>{copied ? t('report_btn_copied') : t('report_btn_copy')}</span>
          </button>
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-500/20 transition-all flex items-center space-x-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>{t('report_btn_print')}</span>
          </button>
        </div>
      </div>

      {/* Select Incident Selector */}
      {incidents.length > 1 && (
        <div className="glass-panel p-4 rounded-xl border border-cyber-border flex items-center space-x-3">
          <span className="text-xs font-bold text-slate-300">
            {language === 'HI' ? 'घटना दस्तावेज चुनें:' : 'Select Incident Dossier:'}
          </span>
          <select
            value={selectedIncidentId}
            onChange={(e) => {
              const id = Number(e.target.value);
              setSelectedIncidentId(id);
              generate(id);
            }}
            className="bg-cyber-900 border border-cyber-border rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          >
            {incidents.map((inc) => (
              <option key={inc.id} value={inc.id}>
                {inc.incident_code} — {inc.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Official Reporting Assistant Callout */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/80 via-cyber-800 to-blue-950/80 border border-blue-500/40 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-mono uppercase text-blue-300 font-bold">
            {language === 'HI' ? 'आधिकारिक पोर्टल निर्देश' : 'Official Cybercrime Portal Instructions'}
          </span>
          <h4 className="text-sm font-bold text-white">{t('report_instructions_title')}</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {t('report_instructions_desc')}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <a
            href="tel:1930"
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center space-x-1.5"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 1930</span>
          </a>
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-1.5"
          >
            <span>Open Portal</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Structured Report Document Display */}
      {report && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyber-border space-y-6 print:bg-white print:text-black print:border-none">
          <div className="flex items-center justify-between border-b border-cyber-border pb-4 print:border-black">
            <div>
              <span className="text-xs font-mono text-blue-400 font-bold block print:text-blue-700">
                DOSSIER REF: {report.report_code}
              </span>
              <h2 className="text-lg font-black text-white print:text-black">{report.title}</h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block font-mono">Fingerprint:</span>
              <span className="text-[11px] font-mono text-blue-300 print:text-black">
                {report.evidence_fingerprint.substring(0, 16)}...
              </span>
            </div>
          </div>

          {/* Copy-Ready Complaint Block */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                {language === 'HI' ? 'कॉपी करने योग्य औपचारिक शिकायत ड्राफ्ट:' : 'Formal Copy-Ready Complaint Text:'}
              </span>
              <button
                onClick={handleCopy}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1 print:hidden"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? t('report_btn_copied') : t('report_btn_copy')}</span>
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-cyber-900 border border-cyber-border font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto print:bg-slate-50 print:text-black print:border-slate-300">
              {report.complaint_text}
            </pre>
          </div>

          {/* Statutory disclaimer */}
          <div className="p-4 rounded-xl bg-cyber-900/80 border border-cyber-border text-xs text-slate-400 print:text-slate-600 flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              {language === 'HI'
                ? 'वैधानिक सूचना: यह रिपोर्ट रक्षाAI 2.0 द्वारा संगठित साक्ष्य सारांश है। रक्षाAI सीधे बैंक खाते फ्रीज नहीं कर सकता। cybercrime.gov.in पर आधिकारिक शिकायत अवश्य दर्ज करें और अपने बैंक को सूचित करें।'
                : 'LEGAL NOTICE: This dossier was compiled via RakshaAI 2.0. RakshaAI does not have statutory police powers and cannot freeze bank accounts directly. Always complete the official filing on cybercrime.gov.in.'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
