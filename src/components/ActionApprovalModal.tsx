import React from 'react';
import { ConsequentialActionRequest } from '../types';
import { ShieldCheck, AlertOctagon, X, Check, FileCode2 } from 'lucide-react';

interface ActionApprovalModalProps {
  action: ConsequentialActionRequest | null;
  onApprove: (action: ConsequentialActionRequest) => void;
  onReject: (action: ConsequentialActionRequest) => void;
  theme?: 'light' | 'dark';
}

export const ActionApprovalModal: React.FC<ActionApprovalModalProps> = ({
  action,
  onApprove,
  onReject,
  theme = 'light',
}) => {
  if (!action) return null;
  const isDark = theme === 'dark';

  return (
    <div
      id="pft-action-approval-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className={`w-full max-w-xl rounded-2xl border p-6 sm:p-8 shadow-2xl ${
          isDark
            ? 'border-zinc-800 bg-[#0c0c0e] text-white'
            : 'border-slate-200 bg-white text-zinc-900 shadow-slate-400/20'
        }`}
      >
        {/* Header */}
        <div className={`flex items-start justify-between gap-3 border-b pb-5 ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                isDark
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-amber-50 border-amber-200 text-amber-600'
              }`}
            >
              <AlertOctagon className="h-5 w-5" />
            </div>
            <div>
              <h2 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Permission Engine: Action Authorization
              </h2>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-mono mt-0.5 uppercase tracking-wider font-bold">
                Human-In-The-Loop Verification
              </p>
            </div>
          </div>
          <button
            onClick={() => onReject(action)}
            className={`rounded-full p-2 transition-colors ${
              isDark ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white' : 'text-zinc-400 hover:bg-slate-100 hover:text-zinc-900'
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="my-6 space-y-4 text-xs">
          {/* Action Title */}
          <div
            className={`rounded-2xl border p-4 space-y-1 ${
              isDark ? 'border-zinc-800 bg-black' : 'border-slate-200 bg-slate-50'
            }`}
          >
            <span className={`text-[10px] font-mono uppercase font-bold tracking-wider ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              Target Consequential Action
            </span>
            <p className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              {action.actionTitle}
            </p>
          </div>

          {/* Grid 4 questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div
              className={`rounded-2xl border p-4 space-y-1.5 ${
                isDark ? 'border-zinc-800 bg-black' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider font-mono">
                1. What will PFT do?
              </span>
              <p className={`font-light leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{action.whatWillDo}</p>
            </div>

            <div
              className={`rounded-2xl border p-4 space-y-1.5 ${
                isDark ? 'border-zinc-800 bg-black' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <span className="text-[10px] font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider font-mono">
                2. Why does PFT want to do it?
              </span>
              <p className={`font-light leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>{action.whyDoIt}</p>
            </div>

            <div
              className={`rounded-2xl border p-4 space-y-1.5 ${
                isDark ? 'border-zinc-800 bg-black' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider font-mono">
                3. What data will be used?
              </span>
              <ul className={`list-disc list-inside font-light space-y-0.5 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                {action.dataUsed.map((d, i) => (
                  <li key={i}>{d}</li>
                ))}
              </ul>
            </div>

            <div
              className={`rounded-2xl border p-4 space-y-1.5 ${
                isDark ? 'border-zinc-800 bg-black' : 'border-slate-200 bg-slate-50'
              }`}
            >
              <span className="text-[10px] font-bold text-red-600 dark:text-red-400 uppercase tracking-wider font-mono">
                4. Potential Consequences
              </span>
              <ul className={`list-disc list-inside font-light space-y-0.5 ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                {action.potentialConsequences.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </div>
          </div>

          {action.requiresExplicitSignature && (
            <div
              className={`rounded-xl border p-3.5 text-xs font-light ${
                isDark
                  ? 'border-red-500/30 bg-red-950/20 text-red-300'
                  : 'border-red-200 bg-red-50 text-red-700'
              }`}
            >
              ⚠️ <strong className="font-bold">High-Risk Consequence:</strong> This action involves financial or account state changes and will never be executed autonomously.
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className={`flex items-center justify-end gap-3 pt-4 border-t ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
          <button
            id="pft-action-cancel-btn"
            onClick={() => onReject(action)}
            className={`rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
              isDark
                ? 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                : 'border-slate-200 bg-slate-50 text-zinc-700 hover:bg-slate-100 hover:text-zinc-900'
            }`}
          >
            CANCEL ACTION
          </button>
          <button
            id="pft-action-approve-btn"
            onClick={() => onApprove(action)}
            className={`flex items-center gap-2 rounded-full px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
              isDark
                ? 'bg-white text-black hover:bg-zinc-200'
                : 'bg-zinc-900 text-white hover:bg-zinc-800'
            }`}
          >
            <Check className="h-4 w-4" />
            <span>APPROVE & EXECUTE</span>
          </button>
        </div>
      </div>
    </div>
  );
};
