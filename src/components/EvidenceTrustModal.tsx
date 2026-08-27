import React from 'react';
import { ConfidenceLevel, EvidenceItem, GroundingSource } from '../types';
import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Calendar,
  X,
  FileCheck,
} from 'lucide-react';

interface EvidenceTrustModalProps {
  isOpen: boolean;
  onClose: () => void;
  confidence: ConfidenceLevel;
  sources?: GroundingSource[];
  evidence?: EvidenceItem[];
  conflictingInfo?: string[];
  agreementRate?: number;
  messageText: string;
  theme?: 'light' | 'dark';
}

export const EvidenceTrustModal: React.FC<EvidenceTrustModalProps> = ({
  isOpen,
  onClose,
  confidence,
  sources = [],
  evidence = [],
  conflictingInfo = [],
  agreementRate,
  messageText,
  theme = 'light',
}) => {
  if (!isOpen) return null;
  const isDark = theme === 'dark';

  const getConfidenceBadge = () => {
    switch (confidence) {
      case 'HIGH':
        return (
          <div
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-semibold ${
              isDark
                ? 'border-emerald-500/30 bg-emerald-950/40 text-emerald-400'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>HIGH CONFIDENCE</span>
          </div>
        );
      case 'MEDIUM':
        return (
          <div
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-semibold ${
              isDark
                ? 'border-cyan-500/30 bg-cyan-950/40 text-cyan-400'
                : 'border-cyan-200 bg-cyan-50 text-cyan-700'
            }`}
          >
            <AlertCircle className="h-4 w-4" />
            <span>MEDIUM CONFIDENCE</span>
          </div>
        );
      case 'LOW':
        return (
          <div
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-semibold ${
              isDark
                ? 'border-amber-500/30 bg-amber-950/40 text-amber-400'
                : 'border-amber-200 bg-amber-50 text-amber-700'
            }`}
          >
            <AlertCircle className="h-4 w-4" />
            <span>LOW CONFIDENCE</span>
          </div>
        );
      default:
        return (
          <div
            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-semibold ${
              isDark
                ? 'border-zinc-700 bg-zinc-800 text-zinc-300'
                : 'border-slate-300 bg-slate-100 text-zinc-700'
            }`}
          >
            <HelpCircle className="h-4 w-4" />
            <span>UNKNOWN / UNCERTAIN</span>
          </div>
        );
    }
  };

  return (
    <div
      id="pft-trust-inspector-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className={`w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border shadow-2xl overflow-hidden ${
          isDark
            ? 'border-zinc-800 bg-[#0c0c0e] text-white'
            : 'border-slate-200 bg-white text-zinc-900 shadow-slate-400/20'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between border-b px-6 py-5 ${
            isDark ? 'border-zinc-800 bg-black' : 'border-slate-100 bg-slate-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-white'
                  : 'bg-white border-slate-200 text-zinc-900 shadow-2xs'
              }`}
            >
              <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div>
              <h2 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                PFT Evidence & Trust Inspector
              </h2>
              <p className={`text-xs font-light ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Transparent verification trail for this response
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`rounded-full p-2 transition-colors ${
              isDark
                ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                : 'text-zinc-400 hover:bg-slate-200 hover:text-zinc-900'
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Confidence Evaluation */}
          <div
            className={`rounded-2xl border p-5 space-y-3 ${
              isDark ? 'border-zinc-800 bg-black' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-bold uppercase tracking-widest font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Confidence Assessment
              </span>
              {getConfidenceBadge()}
            </div>
            <p className={`text-xs leading-relaxed font-light ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              {confidence === 'HIGH' &&
                'Strong, verifiable multi-source evidence supports this answer without significant contradictory indicators.'}
              {confidence === 'MEDIUM' &&
                'Available evidence supports the primary claim, but some nuances, contextual dependencies, or unverified secondary assumptions exist.'}
              {confidence === 'LOW' &&
                'Public evidence is limited, weak, or conflicting. Exercise independent caution before relying on this conclusion.'}
              {confidence === 'UNKNOWN' &&
                'PFT cannot reliably determine the answer with current verifiable data. PFT does not fabricate citations.'}
            </p>
            {agreementRate !== undefined && (
              <div
                className={`flex items-center gap-2 pt-2 border-t text-xs font-mono font-bold ${
                  isDark
                    ? 'border-zinc-800 text-emerald-400'
                    : 'border-slate-200 text-emerald-700'
                }`}
              >
                <FileCheck className="h-4 w-4" />
                <span>Sources Agreement Rate: {agreementRate}%</span>
              </div>
            )}
          </div>

          {/* Section 2: Grounded Citations & Sources */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className={`text-xs font-bold uppercase tracking-wider font-mono ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                Retrieved & Grounded Sources ({sources.length})
              </h3>
              <div className={`flex items-center gap-1.5 text-[11px] font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                <span>Checked: {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {sources.length === 0 ? (
              <div
                className={`rounded-2xl border p-5 text-xs italic text-center font-light ${
                  isDark ? 'border-zinc-800 bg-black text-zinc-400' : 'border-slate-200 bg-slate-50 text-zinc-500'
                }`}
              >
                This response was synthesized using model parametric logic without live external web citations.
              </div>
            ) : (
              <div className="space-y-2.5">
                {sources.map((src) => (
                  <div
                    key={src.id}
                    className={`flex items-start justify-between gap-3 rounded-2xl border p-4 transition-colors ${
                      isDark
                        ? 'border-zinc-800 bg-black hover:border-zinc-700'
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium text-xs ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                          {src.title}
                        </span>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold border ${
                            isDark
                              ? 'bg-zinc-900 text-emerald-400 border-zinc-800'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          Trust: {src.trustScore}/100
                        </span>
                      </div>
                      <p className={`text-[11px] font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>{src.domain}</p>
                    </div>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs transition-all shrink-0 font-medium ${
                        isDark
                          ? 'border-zinc-800 bg-zinc-900 text-white hover:bg-white hover:text-black'
                          : 'border-slate-200 bg-slate-100 text-zinc-800 hover:bg-zinc-900 hover:text-white'
                      }`}
                    >
                      <span>Visit</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 3: Evidence Breakdown */}
          {evidence.length > 0 && (
            <div>
              <h3 className={`text-xs font-bold uppercase tracking-wider font-mono mb-3 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                Evidence Claim Breakdown
              </h3>
              <div className="space-y-2.5">
                {evidence.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-2xl border p-4 space-y-2 text-xs ${
                      isDark ? 'border-zinc-800 bg-black' : 'border-slate-200 bg-white shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold uppercase ${
                          item.classification === 'VERIFIED'
                            ? isDark
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : item.classification === 'INFERENCE'
                            ? isDark
                              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                              : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                            : item.classification === 'OPINION'
                            ? isDark
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                            : isDark
                              ? 'bg-zinc-800 text-zinc-300'
                              : 'bg-slate-100 text-zinc-700'
                        }`}
                      >
                        {item.classification}
                      </span>
                      {item.sources.length > 0 && (
                        <span className={`text-[10px] font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                          Sources: {item.sources.join(', ')}
                        </span>
                      )}
                    </div>
                    <p className={`font-light leading-relaxed ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>{item.claim}</p>
                    {item.confidenceNotes && (
                      <p className={`text-[11px] italic font-light ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        Note: {item.confidenceNotes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 4: Conflicting Information Check */}
          {conflictingInfo.length > 0 && (
            <div
              className={`rounded-2xl border p-5 space-y-2 ${
                isDark
                  ? 'border-amber-500/30 bg-amber-950/20'
                  : 'border-amber-200 bg-amber-50/70'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider font-mono">
                <AlertCircle className="h-4 w-4" />
                <span>Detected Conflicting Perspectives</span>
              </div>
              <ul className={`space-y-1 text-xs font-light list-disc list-inside ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                {conflictingInfo.map((conflict, i) => (
                  <li key={i}>{conflict}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          className={`border-t px-6 py-4 flex justify-end ${
            isDark ? 'border-zinc-800 bg-black' : 'border-slate-100 bg-slate-50'
          }`}
        >
          <button
            onClick={onClose}
            className={`rounded-full px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
              isDark
                ? 'bg-white text-black hover:bg-zinc-200'
                : 'bg-zinc-900 text-white hover:bg-zinc-800'
            }`}
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
