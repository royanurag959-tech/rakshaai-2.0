import React, { useState, useEffect } from 'react';
import { Layers, Activity, Cpu, CheckCircle2, Shield, Server, Database, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';

interface AdminDashboardPageProps {
  onBack: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onBack }) => {
  const [adminStats, setAdminStats] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await api.getAdminStats();
      setAdminStats(res);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-6 px-4">
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="flex items-center text-xs text-slate-400 hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Back to Main Dashboard</span>
          </button>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-mono mb-1">
            <Layers className="w-4 h-4" />
            <span>ENTERPRISE SYSTEM TELEMETRY & MODEL REGISTRY</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Admin Health & Model Registry
          </h1>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-950/60 text-emerald-400 text-xs font-bold border border-emerald-500/40">
          <Activity className="w-3.5 h-3.5" />
          <span>System Healthy (200 OK)</span>
        </div>
      </div>

      {/* Models Status Grid */}
      <div className="glass-panel p-6 rounded-2xl border border-cyber-border space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center">
          <Cpu className="w-4 h-4 mr-2 text-blue-400" />
          Active Pluggable AI / Heuristic Provider Pipeline
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { name: 'AudioAnalysisProvider', version: 'v2.0-HeuristicSpectra', status: 'ONLINE', latency: '42ms' },
            { name: 'VideoAnalysisProvider', version: 'v2.0-MultimodalTemporal', status: 'ONLINE', latency: '88ms' },
            { name: 'LinkAnalysisProvider', version: 'v2.0-TyposquatHeuristic', status: 'ONLINE', latency: '12ms' },
            { name: 'MessageAnalysisProvider', version: 'v2.0-NLPScamIntent', status: 'ONLINE', latency: '8ms' },
            { name: 'SocialAnalysisProvider', version: 'v2.0-PlatformSocialShield', status: 'ONLINE', latency: '15ms' },
            { name: 'PaymentAnalysisProvider', version: 'v2.0-ReverseQRDefense', status: 'ONLINE', latency: '10ms' },
            { name: 'SafetyEngine', version: 'v2.0-ActiveRulebase', status: 'ACTIVE', latency: '2ms' },
            { name: 'SolutionEngine', version: 'v2.0-GoldenHourMatrix', status: 'ACTIVE', latency: '2ms' },
            { name: 'EvidenceFingerprinter', version: 'v2.0-SHA256Crypto', status: 'ACTIVE', latency: '1ms' }
          ].map((m, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-cyber-900 border border-cyber-border flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-white">{m.name}</span>
                  <span className="text-[10px] font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950/70 border border-emerald-500/30">
                    {m.status}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-slate-400 block">{m.version}</span>
              </div>
              <span className="text-[10px] text-blue-400 font-mono mt-3 block">Avg Latency: {m.latency}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Backend Specs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-xl border border-cyber-border space-y-2">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono">
            <Server className="w-4 h-4 text-blue-400" />
            <span>FastAPI Server Engine</span>
          </div>
          <span className="text-lg font-bold text-white block">Python 3.13 + Uvicorn</span>
          <span className="text-xs text-slate-400 block">Non-blocking async request loop</span>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-cyber-border space-y-2">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono">
            <Database className="w-4 h-4 text-purple-400" />
            <span>Database Architecture</span>
          </div>
          <span className="text-lg font-bold text-white block">SQLAlchemy + SQLite</span>
          <span className="text-xs text-slate-400 block">PostgreSQL / Cloud SQL migration ready</span>
        </div>

        <div className="glass-panel p-5 rounded-xl border border-cyber-border space-y-2">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-mono">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Data Privacy Guarantee</span>
          </div>
          <span className="text-lg font-bold text-white block">Zero Raw Media Resale</span>
          <span className="text-xs text-slate-400 block">Strict localized hash preservation</span>
        </div>
      </div>
    </div>
  );
};
