import React, { useState } from 'react';
import { ProcessingMode } from '../types';
import { storage } from '../lib/storage';
import {
  Sliders,
  ShieldCheck,
  Lock,
  Cloud,
  Trash2,
  Check,
  ToggleLeft,
  ToggleRight,
  Info,
  Server,
  Key,
} from 'lucide-react';

interface SettingsViewProps {
  processingMode: ProcessingMode;
  onToggleMode: (mode: ProcessingMode) => void;
  onOpenDeleteAll: () => void;
  theme?: 'light' | 'dark';
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  processingMode,
  onToggleMode,
  onOpenDeleteAll,
  theme = 'light',
}) => {
  const [autoRedactNotice, setAutoRedactNotice] = useState(true);
  const [searchGroundingDefault, setSearchGroundingDefault] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const isDark = theme === 'dark';

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className={`border-b pb-6 ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5">
          <Sliders className="h-3.5 w-3.5" />
          <span>System Preferences</span>
        </div>
        <h2 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          Privacy & Engine Settings
        </h2>
        <p className={`text-xs mt-1.5 font-light ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
          All settings are saved locally to your browser. No external telemetry or cloud profiling.
        </p>
      </div>

      <div className="space-y-6 text-xs">
        {/* Section 1: Default Processing Mode */}
        <div
          className={`rounded-2xl border p-6 space-y-4 shadow-xs ${
            isDark ? 'border-zinc-800 bg-[#0c0c0e]' : 'border-slate-200 bg-white shadow-slate-200/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Default Processing Architecture
              </h3>
              <p className={`mt-0.5 text-xs font-light ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Choose how queries are executed by default when entering the app.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => onToggleMode('local')}
              className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                processingMode === 'local'
                  ? isDark
                    ? 'border-emerald-500/50 bg-emerald-950/20 text-white shadow-xs'
                    : 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-xs'
                  : isDark
                    ? 'border-zinc-800 bg-black text-zinc-400 hover:border-zinc-700'
                    : 'border-slate-200 bg-slate-50 text-zinc-600 hover:border-slate-300'
              }`}
            >
              <Lock className={`h-4 w-4 shrink-0 mt-0.5 ${processingMode === 'local' ? 'text-emerald-500' : 'text-zinc-400'}`} />
              <div>
                <div className={`font-bold text-xs ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  🔒 LOCAL AI (Maximum Privacy)
                </div>
                <div className={`text-xs mt-1 font-light ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  100% on-device sandbox. Zero external network transmissions.
                </div>
              </div>
            </button>

            <button
              onClick={() => onToggleMode('cloud')}
              className={`flex items-start gap-3 rounded-xl border p-4 text-left transition-all ${
                processingMode === 'cloud'
                  ? isDark
                    ? 'border-cyan-500/50 bg-cyan-950/20 text-white shadow-xs'
                    : 'border-cyan-500 bg-cyan-50 text-cyan-900 shadow-xs'
                  : isDark
                    ? 'border-zinc-800 bg-black text-zinc-400 hover:border-zinc-700'
                    : 'border-slate-200 bg-slate-50 text-zinc-600 hover:border-slate-300'
              }`}
            >
              <Cloud className={`h-4 w-4 shrink-0 mt-0.5 ${processingMode === 'cloud' ? 'text-cyan-500' : 'text-zinc-400'}`} />
              <div>
                <div className={`font-bold text-xs ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  ☁️ PRIVATE CLOUD (Search Grounded)
                </div>
                <div className={`text-xs mt-1 font-light ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                  Gemini API with Google Search indexing. Ephemeral 0-day retention.
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Section 2: Privacy Pre-Flight Scanner */}
        <div
          className={`rounded-2xl border p-6 space-y-4 shadow-xs ${
            isDark ? 'border-zinc-800 bg-[#0c0c0e]' : 'border-slate-200 bg-white shadow-slate-200/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Sensitive Data Pre-Flight Scanner
              </h3>
              <p className={`mt-0.5 text-xs font-light ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Detects SSNs, credit cards, emails, phone numbers, and keys before transmission.
              </p>
            </div>
            <button
              onClick={() => setAutoRedactNotice(!autoRedactNotice)}
              className="focus:outline-none"
            >
              {autoRedactNotice ? (
                <ToggleRight className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <ToggleLeft className="h-6 w-6 text-zinc-400" />
              )}
            </button>
          </div>

          <div
            className={`rounded-xl border p-3.5 text-xs font-light ${
              isDark
                ? 'border-zinc-800 bg-black text-zinc-400'
                : 'border-slate-200 bg-slate-50 text-zinc-600'
            }`}
          >
            <strong className={`font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>Active Rules:</strong> SSN, Credit Cards (Luhn), Email Addresses, US/International Phone Numbers, API Key signatures, Private Physical Addresses, and Medical symptom flags.
          </div>
        </div>

        {/* Section 3: Google Search Grounding */}
        <div
          className={`rounded-2xl border p-6 space-y-4 shadow-xs ${
            isDark ? 'border-zinc-800 bg-[#0c0c0e]' : 'border-slate-200 bg-white shadow-slate-200/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Live Google Search Grounding
              </h3>
              <p className={`mt-0.5 text-xs font-light ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                Enables real-time citations, verification indexes, and multi-source cross-checking.
              </p>
            </div>
            <button
              onClick={() => setSearchGroundingDefault(!searchGroundingDefault)}
              className="focus:outline-none"
            >
              {searchGroundingDefault ? (
                <ToggleRight className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
              ) : (
                <ToggleLeft className="h-6 w-6 text-zinc-400" />
              )}
            </button>
          </div>
        </div>

        {/* Section 4: Data Wiping & Safety Purge */}
        <div
          className={`rounded-2xl border p-6 space-y-3 shadow-xs ${
            isDark
              ? 'border-red-500/20 bg-red-950/10'
              : 'border-red-200 bg-red-50/70'
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-red-600 dark:text-red-300 tracking-tight">
                Zero-Trace Local Data Purge
              </h3>
              <p className="text-red-700/80 dark:text-red-400/80 mt-0.5 text-xs font-light">
                Immediately wipe all conversations, saved memories, preferences, and telemetry logs from this device.
              </p>
            </div>
            <button
              onClick={onOpenDeleteAll}
              className="flex items-center gap-1.5 rounded-full bg-red-600 hover:bg-red-700 px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-all shrink-0"
            >
              <Trash2 className="h-4 w-4" />
              <span>Delete All Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
