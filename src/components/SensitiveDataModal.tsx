import React from 'react';
import { SensitiveItem } from '../types';
import { ShieldAlert, Check, EyeOff, AlertTriangle, X, Lock } from 'lucide-react';

interface SensitiveDataModalProps {
  isOpen: boolean;
  sensitiveItems: SensitiveItem[];
  originalText: string;
  onRedactAndSend: () => void;
  onSendAnyway: () => void;
  onCancel: () => void;
  onProcessLocallyInstead?: () => void;
  theme?: 'light' | 'dark';
}

export const SensitiveDataModal: React.FC<SensitiveDataModalProps> = ({
  isOpen,
  sensitiveItems,
  originalText,
  onRedactAndSend,
  onSendAnyway,
  onCancel,
  onProcessLocallyInstead,
  theme = 'light',
}) => {
  if (!isOpen) return null;
  const isDark = theme === 'dark';

  return (
    <div
      id="pft-sensitive-data-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div
        className={`w-full max-w-xl rounded-2xl border p-6 shadow-2xl ${
          isDark
            ? 'border-zinc-800 bg-[#0c0c0e] text-white'
            : 'border-slate-200 bg-white text-zinc-900 shadow-slate-400/20'
        }`}
      >
        {/* Header */}
        <div className={`flex items-start justify-between gap-3 border-b pb-4 ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${
                isDark
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  : 'bg-amber-50 border-amber-200 text-amber-600'
              }`}
            >
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h2 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Privacy Pre-Flight Alert
              </h2>
              <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mt-0.5">
                Your message appears to contain sensitive information.
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className={`rounded-full p-2 transition-colors ${
              isDark ? 'text-zinc-400 hover:bg-zinc-800 hover:text-white' : 'text-zinc-400 hover:bg-slate-100 hover:text-zinc-900'
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="my-4 space-y-3">
          <p className={`text-xs leading-relaxed font-light ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
            The PFT Sensitive Data Scanner detected <strong className={`font-semibold ${isDark ? 'text-amber-300' : 'text-amber-700'}`}>{sensitiveItems.length} sensitive element{sensitiveItems.length > 1 ? 's' : ''}</strong> in your prompt before any external request was made.
          </p>

          {/* List of Detected Items */}
          <div
            className={`max-h-48 overflow-y-auto rounded-xl border p-3 space-y-2 ${
              isDark ? 'border-zinc-800 bg-black' : 'border-slate-200 bg-slate-50'
            }`}
          >
            {sensitiveItems.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-xs ${
                  isDark
                    ? 'border-zinc-800 bg-zinc-900'
                    : 'border-slate-200 bg-white shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      item.severity === 'high' ? 'bg-red-500' : 'bg-amber-500'
                    }`}
                  />
                  <span className={`font-mono text-[11px] uppercase font-bold ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    {item.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span
                    className={`px-2 py-0.5 rounded border ${
                      isDark
                        ? 'text-zinc-300 bg-zinc-800 border-zinc-700'
                        : 'text-zinc-700 bg-slate-100 border-slate-200'
                    }`}
                  >
                    {item.matchedText}
                  </span>
                  <span className={isDark ? 'text-zinc-500' : 'text-zinc-400'}>→</span>
                  <span
                    className={`px-2 py-0.5 rounded border font-bold ${
                      isDark
                        ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/40'
                        : 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    }`}
                  >
                    {item.redactedText}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div
            className={`rounded-xl border p-3 text-[11px] leading-relaxed font-light ${
              isDark
                ? 'border-zinc-800 bg-black text-zinc-400'
                : 'border-slate-200 bg-slate-50 text-zinc-600'
            }`}
          >
            <strong className={isDark ? 'text-zinc-200' : 'text-zinc-800'}>Zero Silent Redaction Principle:</strong> PFT will never silently alter your content without your explicit instruction. Choose how you want to proceed below.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
          {/* Option 1: Redact */}
          <button
            id="pft-btn-redact-send"
            onClick={onRedactAndSend}
            className="flex items-center justify-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all"
          >
            <EyeOff className="h-4 w-4" />
            <span>Redact & Send</span>
          </button>

          {/* Option 2: Send Anyway */}
          <button
            id="pft-btn-send-anyway"
            onClick={onSendAnyway}
            className={`flex items-center justify-center gap-2 rounded-full border px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
              isDark
                ? 'border-amber-500/40 bg-amber-950/30 text-amber-300 hover:bg-amber-900/40'
                : 'border-amber-300 bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
            <span>Send Raw</span>
          </button>

          {/* Option 3: Process Locally / Cancel */}
          {onProcessLocallyInstead ? (
            <button
              id="pft-btn-process-locally"
              onClick={onProcessLocallyInstead}
              className={`flex items-center justify-center gap-2 rounded-full border px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                isDark
                  ? 'border-zinc-800 bg-zinc-900 text-zinc-200 hover:bg-zinc-800'
                  : 'border-slate-200 bg-slate-50 text-zinc-700 hover:bg-slate-100 hover:text-zinc-900'
              }`}
            >
              <Lock className="h-4 w-4" />
              <span>Run Locally</span>
            </button>
          ) : (
            <button
              id="pft-btn-cancel-send"
              onClick={onCancel}
              className={`flex items-center justify-center gap-2 rounded-full border px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                isDark
                  ? 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                  : 'border-slate-200 bg-slate-50 text-zinc-700 hover:bg-slate-100 hover:text-zinc-900'
              }`}
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
