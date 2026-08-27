import React, { useState, useEffect } from 'react';
import { OutboundNetworkLog, ActionAuditItem } from '../types';
import { storage } from '../lib/storage';
import {
  ShieldCheck,
  Lock,
  Activity,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Server,
  Key,
  Database,
  EyeOff,
  Radio,
  FileCheck,
  Layers,
} from 'lucide-react';

interface PrivacyViewProps {
  onOpenDeleteAll: () => void;
  theme?: 'light' | 'dark';
}

export const PrivacyView: React.FC<PrivacyViewProps> = ({ onOpenDeleteAll, theme = 'light' }) => {
  const [logs, setLogs] = useState<OutboundNetworkLog[]>([]);
  const [actionAudits, setActionAudits] = useState<ActionAuditItem[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'network' | 'audit' | 'guarantees'>('network');

  const isDark = theme === 'dark';

  useEffect(() => {
    setLogs(storage.getOutboundLogs());
    setActionAudits(storage.getActionAuditLogs());
  }, []);

  const totalBytesSent = logs.reduce((acc, curr) => acc + curr.bytesSent, 0);

  const handleClearLogs = () => {
    storage.clearOutboundLogs();
    setLogs([]);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5">
            <Lock className="h-3.5 w-3.5" />
            <span>PFT Transparency & Privacy Dashboard</span>
          </div>
          <h2 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            Privacy Center & Network Telemetry
          </h2>
          <p className={`text-xs mt-1.5 font-light ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Real-time verification of data egress, zero-retention ephemeral compute, and human-in-the-loop action audit trails.
          </p>
        </div>

        {/* Delete All Action */}
        <button
          onClick={onOpenDeleteAll}
          className={`flex items-center gap-2 rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
            isDark
              ? 'border-red-500/30 bg-red-950/20 hover:bg-red-900/30 text-red-400'
              : 'border-red-200 bg-red-50 hover:bg-red-100 text-red-700'
          }`}
        >
          <Trash2 className="h-3.5 w-3.5 text-red-500" />
          <span>Delete All My Data</span>
        </button>
      </div>

      {/* Live Privacy Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div
          className={`rounded-2xl border p-5 space-y-1 shadow-xs ${
            isDark ? 'border-zinc-800 bg-[#0c0c0e]' : 'border-slate-200 bg-white shadow-slate-200/50'
          }`}
        >
          <span className={`font-mono text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
            Outbound Requests
          </span>
          <p className={`text-3xl font-light ${isDark ? 'text-white' : 'text-zinc-900'}`}>{logs.length}</p>
          <p className={`text-[10px] font-light ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Total API dispatches</p>
        </div>

        <div
          className={`rounded-2xl border p-5 space-y-1 shadow-xs ${
            isDark ? 'border-zinc-800 bg-[#0c0c0e]' : 'border-slate-200 bg-white shadow-slate-200/50'
          }`}
        >
          <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Data Transmitted
          </span>
          <p className="text-3xl font-light text-emerald-600 dark:text-emerald-400">
            {(totalBytesSent / 1024).toFixed(2)} KB
          </p>
          <p className={`text-[10px] font-light ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Strict payload only</p>
        </div>

        <div
          className={`rounded-2xl border p-5 space-y-1 shadow-xs ${
            isDark ? 'border-zinc-800 bg-[#0c0c0e]' : 'border-slate-200 bg-white shadow-slate-200/50'
          }`}
        >
          <span className="font-mono text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">
            Retention Model
          </span>
          <p className="text-3xl font-light text-cyan-600 dark:text-cyan-400">0-Day</p>
          <p className={`text-[10px] font-light ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Ephemeral RAM compute</p>
        </div>

        <div
          className={`rounded-2xl border p-5 space-y-1 shadow-xs ${
            isDark ? 'border-zinc-800 bg-[#0c0c0e]' : 'border-slate-200 bg-white shadow-slate-200/50'
          }`}
        >
          <span className="font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Authentication
          </span>
          <p className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 tracking-tight mt-1">Zero Login</p>
          <p className={`text-[10px] font-light ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Stateless session token</p>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className={`flex items-center gap-2 border-b pb-3 ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
        <button
          onClick={() => setActiveSubTab('network')}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
            activeSubTab === 'network'
              ? isDark
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'bg-zinc-900 text-white shadow-xs'
              : isDark
                ? 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-slate-100'
          }`}
        >
          <Activity className="h-3.5 w-3.5" />
          <span>What Left This Device? ({logs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('audit')}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
            activeSubTab === 'audit'
              ? isDark
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'bg-zinc-900 text-white shadow-xs'
              : isDark
                ? 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="h-3.5 w-3.5" />
          <span>Action Audit Trail ({actionAudits.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('guarantees')}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
            activeSubTab === 'guarantees'
              ? isDark
                ? 'bg-white text-zinc-900 shadow-xs'
                : 'bg-zinc-900 text-white shadow-xs'
              : isDark
                ? 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="h-3.5 w-3.5" />
          <span>PFT Privacy Guarantees</span>
        </button>
      </div>

      {/* SubTab 1: Network Telemetry Log */}
      {activeSubTab === 'network' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className={`text-xs font-bold font-mono uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Outbound Transmission Telemetry
            </h3>
            {logs.length > 0 && (
              <button
                onClick={handleClearLogs}
                className="text-xs text-zinc-500 hover:text-zinc-400 transition-colors font-mono"
              >
                Clear Log History
              </button>
            )}
          </div>

          {logs.length === 0 ? (
            <div
              className={`rounded-2xl border p-10 text-center text-xs space-y-2 ${
                isDark
                  ? 'border-zinc-800 bg-[#0c0c0e] text-zinc-500'
                  : 'border-slate-200 bg-white text-zinc-500 shadow-xs'
              }`}
            >
              <Activity className="mx-auto h-8 w-8 text-zinc-400" />
              <p className="font-light">No outbound network calls recorded in this browser session.</p>
              <p className="text-[11px] font-mono">
                Queries in 🔒 LOCAL AI mode generate zero network telemetry.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((l) => (
                <div
                  key={l.id}
                  className={`rounded-2xl border p-4 text-xs space-y-2.5 shadow-xs ${
                    isDark ? 'border-zinc-800 bg-[#0c0c0e]' : 'border-slate-200 bg-white shadow-slate-200/50'
                  }`}
                >
                  <div className={`flex flex-wrap items-center justify-between gap-2 border-b pb-2.5 ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-2">
                      <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                        {l.endpoint}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold border ${
                          isDark
                            ? 'bg-black text-cyan-400 border-zinc-800'
                            : 'bg-cyan-50 text-cyan-700 border-cyan-200'
                        }`}
                      >
                        {l.service}
                      </span>
                    </div>
                    <div className={`flex items-center gap-2 font-mono text-[11px] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                      <span>{new Date(l.timestamp).toLocaleTimeString()}</span>
                      <span>•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">{l.bytesSent} bytes</span>
                    </div>
                  </div>

                  <div className={`grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-light ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    <div>
                      <strong className={`font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>Purpose:</strong> {l.purpose}
                    </div>
                    <div>
                      <strong className={`font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>Retention:</strong> {l.retentionPolicy}
                    </div>
                    <div>
                      <strong className={`font-medium ${isDark ? 'text-zinc-300' : 'text-zinc-800'}`}>Encryption:</strong> {l.encryptionStatus}
                    </div>
                  </div>

                  <div
                    className={`rounded-xl p-3 font-mono text-[11px] truncate border font-light ${
                      isDark
                        ? 'bg-black text-zinc-400 border-zinc-800'
                        : 'bg-slate-50 text-zinc-700 border-slate-200'
                    }`}
                  >
                    Payload summary: {l.payloadSummary}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SubTab 2: Action Audit Trail */}
      {activeSubTab === 'audit' && (
        <div className="space-y-4">
          <h3 className={`text-xs font-bold font-mono uppercase tracking-widest ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
            Human-In-The-Loop Action Authorization History
          </h3>

          {actionAudits.length === 0 ? (
            <div
              className={`rounded-2xl border p-10 text-center text-xs space-y-2 ${
                isDark
                  ? 'border-zinc-800 bg-[#0c0c0e] text-zinc-500'
                  : 'border-slate-200 bg-white text-zinc-500 shadow-xs'
              }`}
            >
              <FileCheck className="mx-auto h-8 w-8 text-zinc-400" />
              <p className="font-light">No consequential actions have been requested or executed yet.</p>
              <p className="text-[11px] font-mono">
                Actions like sending messages or transferring funds require explicit human signatures.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {actionAudits.map((a) => (
                <div
                  key={a.id}
                  className={`rounded-2xl border p-4 text-xs space-y-2.5 shadow-xs ${
                    isDark ? 'border-zinc-800 bg-[#0c0c0e]' : 'border-slate-200 bg-white shadow-slate-200/50'
                  }`}
                >
                  <div className={`flex items-center justify-between border-b pb-2.5 ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
                    <span className={`font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                      {a.action}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase font-bold ${
                        a.status === 'Approved' || a.status === 'Completed'
                          ? isDark
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : isDark
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {a.status}
                    </span>
                  </div>
                  <p className={`font-light ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{a.details}</p>
                  <div className={`text-[11px] font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                    Authorized At: {new Date(a.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SubTab 3: Privacy Guarantees */}
      {activeSubTab === 'guarantees' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div
            className={`rounded-2xl border p-6 space-y-3 shadow-xs ${
              isDark ? 'border-zinc-800 bg-[#0c0c0e]' : 'border-slate-200 bg-white shadow-slate-200/50'
            }`}
          >
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase font-mono tracking-wider">
              <CheckCircle2 className="h-4 w-4" />
              <span>Zero-Login Architecture</span>
            </div>
            <p className={`font-light leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
              PFT operates with zero mandatory user registration. There are no tracking accounts, no advertising identifiers, and no persistent profiles associated with your identity.
            </p>
          </div>

          <div
            className={`rounded-2xl border p-6 space-y-3 shadow-xs ${
              isDark ? 'border-zinc-800 bg-[#0c0c0e]' : 'border-slate-200 bg-white shadow-slate-200/50'
            }`}
          >
            <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold uppercase font-mono tracking-wider">
              <CheckCircle2 className="h-4 w-4" />
              <span>No AI Training on User Data</span>
            </div>
            <p className={`font-light leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
              Your conversations, uploaded documents, and queries are never utilized to train foundation models or build behavioral analytics profiles.
            </p>
          </div>

          <div
            className={`rounded-2xl border p-6 space-y-3 shadow-xs ${
              isDark ? 'border-zinc-800 bg-[#0c0c0e]' : 'border-slate-200 bg-white shadow-slate-200/50'
            }`}
          >
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold uppercase font-mono tracking-wider">
              <CheckCircle2 className="h-4 w-4" />
              <span>Pre-Flight PII Redaction</span>
            </div>
            <p className={`font-light leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
              Before any query is transmitted to the private cloud, our client-side regex engine flags sensitive items (SSNs, emails, credit cards, phones) and offers 1-click masking.
            </p>
          </div>

          <div
            className={`rounded-2xl border p-6 space-y-3 shadow-xs ${
              isDark ? 'border-zinc-800 bg-[#0c0c0e]' : 'border-slate-200 bg-white shadow-slate-200/50'
            }`}
          >
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold uppercase font-mono tracking-wider">
              <CheckCircle2 className="h-4 w-4" />
              <span>Human-In-The-Loop Actions</span>
            </div>
            <p className={`font-light leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-600'}`}>
              PFT will never autonomously trigger financial transactions, external communications, or irreversible account alterations without explicit dialog confirmation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

