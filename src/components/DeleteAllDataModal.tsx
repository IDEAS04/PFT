import React, { useState } from 'react';
import { Trash2, AlertTriangle, ShieldAlert, Check, X } from 'lucide-react';

interface DeleteAllDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmDelete: () => {
    conversationsDeleted: number;
    memoriesDeleted: number;
    networkLogsDeleted: number;
    auditItemsDeleted: number;
  };
  theme?: 'light' | 'dark';
}

export const DeleteAllDataModal: React.FC<DeleteAllDataModalProps> = ({
  isOpen,
  onClose,
  onConfirmDelete,
  theme = 'light',
}) => {
  const isDark = theme === 'dark';
  const [deletedSummary, setDeletedSummary] = useState<{
    conversationsDeleted: number;
    memoriesDeleted: number;
    networkLogsDeleted: number;
    auditItemsDeleted: number;
  } | null>(null);

  if (!isOpen) return null;

  const handleExecute = () => {
    const res = onConfirmDelete();
    setDeletedSummary(res);
  };

  const handleFinish = () => {
    setDeletedSummary(null);
    onClose();
  };

  return (
    <div
      id="pft-delete-all-data-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className={`w-full max-w-lg rounded-2xl border p-6 sm:p-8 shadow-2xl ${
          isDark
            ? 'border-zinc-800 bg-[#0c0c0e] text-white'
            : 'border-slate-200 bg-white text-zinc-900 shadow-slate-400/20'
        }`}
      >
        {!deletedSummary ? (
          <>
            {/* Header */}
            <div className={`flex items-start justify-between gap-3 border-b pb-5 ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                    isDark
                      ? 'bg-red-500/10 border-red-500/20 text-red-400'
                      : 'bg-red-50 border-red-200 text-red-600'
                  }`}
                >
                  <Trash2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                    Delete All My Data
                  </h2>
                  <p className="text-xs text-red-600 dark:text-red-400 font-mono uppercase tracking-wider font-bold mt-0.5">
                    Zero-Trace Local Data Purge
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className={`rounded-full p-2 transition-colors ${
                  isDark ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white' : 'text-zinc-400 hover:bg-slate-100 hover:text-zinc-900'
                }`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Explanation Checklist */}
            <div className="my-6 space-y-4 text-xs">
              <p className={`font-light leading-relaxed ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
                Executing this action will permanently and irrecoverably wipe all local client-side state stored in your browser sandbox:
              </p>

              <div
                className={`rounded-2xl border p-4 space-y-2.5 font-light ${
                  isDark ? 'border-zinc-800 bg-black text-zinc-300' : 'border-slate-200 bg-slate-50 text-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                  <span>All local conversations & message histories</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                  <span>All user-controlled memory items & saved context</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                  <span>All local action audit trails & permission grants</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                  <span>All outbound network telemetry logs ("What Left This Device?")</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                  <span>Cached document summaries & temporary sandbox state</span>
                </div>
              </div>

              <div
                className={`rounded-xl border p-3.5 text-xs font-light flex items-start gap-2.5 ${
                  isDark
                    ? 'border-red-500/20 bg-red-950/20 text-red-300'
                    : 'border-red-200 bg-red-50 text-red-700'
                }`}
              >
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
                <span>
                  Because PFT does not store your data on remote cloud databases by default, this local deletion is immediate and cannot be undone.
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className={`flex items-center justify-end gap-3 pt-4 border-t ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
              <button
                id="pft-btn-cancel-delete"
                onClick={onClose}
                className={`rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                  isDark
                    ? 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    : 'border-slate-200 bg-slate-50 text-zinc-700 hover:bg-slate-100 hover:text-zinc-900'
                }`}
              >
                Cancel
              </button>
              <button
                id="pft-btn-confirm-delete"
                onClick={handleExecute}
                className="flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-500 px-6 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all"
              >
                <Trash2 className="h-4 w-4" />
                <span>Wipe Everything Now</span>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-4 space-y-5">
            <div
              className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border ${
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-emerald-400'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-600'
              }`}
            >
              <Check className="h-6 w-6" />
            </div>
            <div>
              <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                All Data Successfully Purged
              </h3>
              <p className={`text-xs mt-1 font-light ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Your browser sandbox is now completely reset.
              </p>
            </div>

            <div
              className={`rounded-2xl border p-5 text-xs font-mono text-left space-y-2 ${
                isDark ? 'border-zinc-800 bg-black text-zinc-300' : 'border-slate-200 bg-slate-50 text-zinc-700'
              }`}
            >
              <div>Conversations deleted: {deletedSummary.conversationsDeleted}</div>
              <div>Memory items wiped: {deletedSummary.memoriesDeleted}</div>
              <div>Audit events cleared: {deletedSummary.auditItemsDeleted}</div>
              <div>Network telemetry purged: {deletedSummary.networkLogsDeleted}</div>
            </div>

            <button
              id="pft-btn-finish-purge"
              onClick={handleFinish}
              className={`w-full rounded-full py-3 text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
                isDark
                  ? 'bg-white text-black hover:bg-zinc-200'
                  : 'bg-zinc-900 text-white hover:bg-zinc-800'
              }`}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
