import React, { useState } from 'react';
import { ProcessingMode } from '../types';
import {
  Lock,
  Cloud,
  ArrowRight,
  ShieldCheck,
  Search,
  FileText,
  Scale,
  Sparkles,
  Shield,
  CheckCircle2,
  Database,
  Sliders,
} from 'lucide-react';

interface HomeViewProps {
  processingMode: ProcessingMode;
  onToggleMode: (mode: ProcessingMode) => void;
  onNavigate: (tab: string, initialPrompt?: string) => void;
  onDirectPrompt: (prompt: string) => void;
  theme?: 'light' | 'dark';
}

export const HomeView: React.FC<HomeViewProps> = ({
  processingMode,
  onToggleMode,
  onNavigate,
  onDirectPrompt,
  theme = 'light',
}) => {
  const [inputVal, setInputVal] = useState('');
  const isDark = theme === 'dark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    onDirectPrompt(inputVal.trim());
    setInputVal('');
  };

  const samplePrompts = [
    { label: 'Should I quit my job for a startup?', type: 'decision' },
    { label: 'Summarize latest EU AI Act compliance rules', type: 'research' },
    { label: 'Evaluate potential risks in a standard NDA agreement', type: 'doc' },
    { label: 'Compare Roth IRA vs Traditional 401(k) tax trade-offs', type: 'chat' },
  ];

  return (
    <div className="relative mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-14 space-y-12 sm:space-y-16 animate-in fade-in duration-300">
      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.02] select-none -z-10 overflow-hidden">
        <h1 className="text-[260px] sm:text-[420px] font-black leading-none tracking-tighter">
          PFT
        </h1>
      </div>

      {/* Main Hero Header */}
      <div className="text-center space-y-4">
        <div
          className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider ${
            isDark
              ? 'border border-zinc-800 bg-zinc-900/80 text-zinc-300'
              : 'border border-slate-200 bg-white text-zinc-700 shadow-xs'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Zero Login • Ephemeral 0-Day Retention • Full User Control</span>
        </div>

        <div className="pt-2">
          <h2
            className={`text-4xl sm:text-6xl font-light tracking-tight ${
              isDark ? 'text-white' : 'text-zinc-900'
            }`}
          >
            AI you can <span className="italic font-serif font-normal text-emerald-600">trust.</span>
          </h2>
          <p
            className={`mt-2.5 text-sm sm:text-base tracking-[0.2em] uppercase font-bold ${
              isDark ? 'text-zinc-400' : 'text-zinc-500'
            }`}
          >
            Privacy you control.
          </p>
        </div>
      </div>

      {/* Omnibar Input Card */}
      <div className="mx-auto max-w-3xl space-y-4">
        <form onSubmit={handleSubmit} className="relative group">
          <div
            className={`relative rounded-2xl border transition-all p-4 sm:p-5 shadow-lg ${
              isDark
                ? 'border-zinc-800 bg-[#0c0c0e] focus-within:border-zinc-600 shadow-black/40'
                : 'border-slate-200 bg-white focus-within:border-slate-400 focus-within:ring-4 focus-within:ring-slate-100 shadow-slate-200/50'
            }`}
          >
            <input
              id="pft-home-input"
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Ask a question, upload a document, or compare decisions..."
              className={`w-full bg-transparent py-2 px-1 text-lg sm:text-2xl font-light focus:outline-none ${
                isDark
                  ? 'text-white placeholder:text-zinc-600'
                  : 'text-zinc-900 placeholder:text-zinc-400'
              }`}
            />
            <div className="flex items-center justify-between pt-4 border-t border-dashed mt-3 border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${
                    processingMode === 'local'
                      ? isDark
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                        : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : isDark
                      ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400'
                      : 'border-cyan-200 bg-cyan-50 text-cyan-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      processingMode === 'local' ? 'bg-emerald-500 animate-pulse' : 'bg-cyan-500'
                    }`}
                  ></span>
                  {processingMode === 'local' ? '🔒 Local AI Mode' : '☁️ Private Cloud Mode'}
                </span>
              </div>

              <button
                type="submit"
                disabled={!inputVal.trim()}
                className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all shadow-md ${
                  isDark
                    ? 'bg-white text-zinc-900 hover:bg-zinc-200 disabled:opacity-20'
                    : 'bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-30'
                }`}
              >
                <span>Ask AI</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </form>

        {/* Quick Sample Prompts */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={`text-[10px] uppercase font-bold tracking-widest mr-1 ${
              isDark ? 'text-zinc-500' : 'text-zinc-400'
            }`}
          >
            Examples:
          </span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => onDirectPrompt(p.label)}
              className={`rounded-full border px-3 py-1 text-xs transition-all text-left ${
                isDark
                  ? 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:text-white hover:bg-zinc-800'
                  : 'border-slate-200 bg-white text-zinc-600 hover:border-slate-300 hover:text-zinc-900 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              "{p.label}"
            </button>
          ))}
        </div>
      </div>

      {/* Telemetry 3-Pillar Privacy Guarantees */}
      <div
        className={`rounded-2xl border p-6 ${
          isDark
            ? 'border-zinc-800 bg-[#0c0c0e]'
            : 'border-slate-200 bg-white shadow-xs'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left divide-y sm:divide-y-0 sm:divide-x divide-zinc-200 dark:divide-zinc-800">
          <div className="flex flex-col gap-1 sm:pr-4">
            <span
              className={`text-[10px] uppercase font-bold tracking-[0.2em] ${
                isDark ? 'text-zinc-500' : 'text-zinc-400'
              }`}
            >
              Data Retention
            </span>
            <span className="text-base font-mono font-bold text-emerald-600">
              0-DAY EPHEMERAL
            </span>
            <p className={`text-xs font-light ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Queries are discarded immediately after response synthesis.
            </p>
          </div>

          <div className="flex flex-col gap-1 pt-4 sm:pt-0 sm:px-6">
            <span
              className={`text-[10px] uppercase font-bold tracking-[0.2em] ${
                isDark ? 'text-zinc-500' : 'text-zinc-400'
              }`}
            >
              Local Redaction Scanner
            </span>
            <span
              className={`text-base font-mono font-bold ${
                isDark ? 'text-white' : 'text-zinc-900'
              }`}
            >
              CLIENT-SIDE SCANNER
            </span>
            <p className={`text-xs font-light ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              SSNs, keys, and PII are redacted before network transmission.
            </p>
          </div>

          <div className="flex flex-col gap-1 pt-4 sm:pt-0 sm:pl-6">
            <span
              className={`text-[10px] uppercase font-bold tracking-[0.2em] ${
                isDark ? 'text-zinc-500' : 'text-zinc-400'
              }`}
            >
              Model Training Policy
            </span>
            <span className="text-base font-mono font-bold text-red-500">
              STRICT OPT-OUT
            </span>
            <p className={`text-xs font-light ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Your private data is never used to train public models.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Module Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Research */}
        <button
          id="quick-card-research"
          onClick={() => onNavigate('research')}
          className={`group rounded-2xl border p-6 text-left transition-all ${
            isDark
              ? 'border-zinc-800 bg-[#0c0c0e] hover:border-zinc-700 hover:bg-zinc-900'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
          }`}
        >
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl mb-4 group-hover:scale-105 transition-transform ${
              isDark
                ? 'bg-zinc-800 border border-zinc-700 text-white'
                : 'bg-emerald-50 border border-emerald-200 text-emerald-700'
            }`}
          >
            <Search className="h-5 w-5" />
          </div>
          <span
            className={`text-[10px] font-bold uppercase tracking-widest block mb-1 ${
              isDark ? 'text-zinc-500' : 'text-zinc-400'
            }`}
          >
            Deep Research
          </span>
          <h3
            className={`text-base font-bold transition-colors ${
              isDark ? 'text-white group-hover:text-zinc-200' : 'text-zinc-900 group-hover:text-emerald-700'
            }`}
          >
            Web Investigation
          </h3>
          <p
            className={`mt-1 text-xs leading-relaxed font-light ${
              isDark ? 'text-zinc-400' : 'text-zinc-500'
            }`}
          >
            Multi-source grounding with source agreement rates and conflicting perspective alerts.
          </p>
        </button>

        {/* Document Analysis */}
        <button
          id="quick-card-documents"
          onClick={() => onNavigate('documents')}
          className={`group rounded-2xl border p-6 text-left transition-all ${
            isDark
              ? 'border-zinc-800 bg-[#0c0c0e] hover:border-zinc-700 hover:bg-zinc-900'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
          }`}
        >
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl mb-4 group-hover:scale-105 transition-transform ${
              isDark
                ? 'bg-zinc-800 border border-zinc-700 text-white'
                : 'bg-cyan-50 border border-cyan-200 text-cyan-700'
            }`}
          >
            <FileText className="h-5 w-5" />
          </div>
          <span
            className={`text-[10px] font-bold uppercase tracking-widest block mb-1 ${
              isDark ? 'text-zinc-500' : 'text-zinc-400'
            }`}
          >
            Document Vault
          </span>
          <h3
            className={`text-base font-bold transition-colors ${
              isDark ? 'text-white group-hover:text-zinc-200' : 'text-zinc-900 group-hover:text-cyan-700'
            }`}
          >
            Document Analyzer
          </h3>
          <p
            className={`mt-1 text-xs leading-relaxed font-light ${
              isDark ? 'text-zinc-400' : 'text-zinc-500'
            }`}
          >
            Inspect contracts and notes privately with pre-flight PII masking and local analysis.
          </p>
        </button>

        {/* Compare Decisions */}
        <button
          id="quick-card-decisions"
          onClick={() => onNavigate('decisions')}
          className={`group rounded-2xl border p-6 text-left transition-all ${
            isDark
              ? 'border-zinc-800 bg-[#0c0c0e] hover:border-zinc-700 hover:bg-zinc-900'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
          }`}
        >
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl mb-4 group-hover:scale-105 transition-transform ${
              isDark
                ? 'bg-zinc-800 border border-zinc-700 text-white'
                : 'bg-amber-50 border border-amber-200 text-amber-700'
            }`}
          >
            <Scale className="h-5 w-5" />
          </div>
          <span
            className={`text-[10px] font-bold uppercase tracking-widest block mb-1 ${
              isDark ? 'text-zinc-500' : 'text-zinc-400'
            }`}
          >
            Decision Matrix
          </span>
          <h3
            className={`text-base font-bold transition-colors ${
              isDark ? 'text-white group-hover:text-zinc-200' : 'text-zinc-900 group-hover:text-amber-700'
            }`}
          >
            Compare Decisions
          </h3>
          <p
            className={`mt-1 text-xs leading-relaxed font-light ${
              isDark ? 'text-zinc-400' : 'text-zinc-500'
            }`}
          >
            Objective pros, cons, and consequence assessment without bias or deceptive manipulation.
          </p>
        </button>

        {/* Privacy Center */}
        <button
          id="quick-card-privacy"
          onClick={() => onNavigate('privacy')}
          className={`group rounded-2xl border p-6 text-left transition-all ${
            isDark
              ? 'border-zinc-800 bg-[#0c0c0e] hover:border-zinc-700 hover:bg-zinc-900'
              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
          }`}
        >
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl mb-4 group-hover:scale-105 transition-transform ${
              isDark
                ? 'bg-zinc-800 border border-zinc-700 text-white'
                : 'bg-indigo-50 border border-indigo-200 text-indigo-700'
            }`}
          >
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span
            className={`text-[10px] font-bold uppercase tracking-widest block mb-1 ${
              isDark ? 'text-zinc-500' : 'text-zinc-400'
            }`}
          >
            Transparency
          </span>
          <h3
            className={`text-base font-bold transition-colors ${
              isDark ? 'text-white group-hover:text-zinc-200' : 'text-zinc-900 group-hover:text-indigo-700'
            }`}
          >
            Privacy Center
          </h3>
          <p
            className={`mt-1 text-xs leading-relaxed font-light ${
              isDark ? 'text-zinc-400' : 'text-zinc-500'
            }`}
          >
            Live "What Left This Device?" telemetry stream, human authorization audit, and 1-click wipe.
          </p>
        </button>
      </div>

      {/* The 5 Trust Questions (PFT Trust Model) */}
      <div
        className={`rounded-2xl border p-8 space-y-6 ${
          isDark
            ? 'border-zinc-800 bg-[#0c0c0e]'
            : 'border-slate-200 bg-slate-50/80'
        }`}
      >
        <div className="flex items-center gap-3">
          <span
            className={`text-xs font-bold uppercase tracking-[0.25em] ${
              isDark ? 'text-zinc-400' : 'text-zinc-600'
            }`}
          >
            PFT 5-Pillar Trust Framework
          </span>
          <div
            className={`flex-grow h-px ${
              isDark ? 'bg-zinc-800' : 'bg-slate-200'
            }`}
          ></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-xs">
          <div
            className={`rounded-xl border p-4 space-y-1.5 ${
              isDark
                ? 'border-zinc-800/80 bg-zinc-900/40'
                : 'border-slate-200 bg-white shadow-2xs'
            }`}
          >
            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              1. What Does PFT Know?
            </span>
            <p className={`leading-relaxed font-light ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Explicitly categorizes verified facts, logical inferences, and opinions.
            </p>
          </div>

          <div
            className={`rounded-xl border p-4 space-y-1.5 ${
              isDark
                ? 'border-zinc-800/80 bg-zinc-900/40'
                : 'border-slate-200 bg-white shadow-2xs'
            }`}
          >
            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              2. Where Did It Come From?
            </span>
            <p className={`leading-relaxed font-light ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Live search citations with domain transparency, timestamps, and verifiable links.
            </p>
          </div>

          <div
            className={`rounded-xl border p-4 space-y-1.5 ${
              isDark
                ? 'border-zinc-800/80 bg-zinc-900/40'
                : 'border-slate-200 bg-white shadow-2xs'
            }`}
          >
            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              3. How Confident Is PFT?
            </span>
            <p className={`leading-relaxed font-light ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Clear confidence ratings. PFT is designed to decline answers rather than hallucinate.
            </p>
          </div>

          <div
            className={`rounded-xl border p-4 space-y-1.5 ${
              isDark
                ? 'border-zinc-800/80 bg-zinc-900/40'
                : 'border-slate-200 bg-white shadow-2xs'
            }`}
          >
            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              4. What Left My Device?
            </span>
            <p className={`leading-relaxed font-light ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Granular outbound logs showing byte sizes, destination endpoints, and payload hashes.
            </p>
          </div>

          <div
            className={`rounded-xl border p-4 space-y-1.5 ${
              isDark
                ? 'border-zinc-800/80 bg-zinc-900/40'
                : 'border-slate-200 bg-white shadow-2xs'
            }`}
          >
            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              5. What Control Do I Retain?
            </span>
            <p className={`leading-relaxed font-light ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              Actions affecting external state require human-in-the-loop permission authorization.
            </p>
          </div>

          <div
            className={`rounded-xl border p-4 space-y-1.5 ${
              isDark
                ? 'border-zinc-800/80 bg-zinc-900/40'
                : 'border-slate-200 bg-white shadow-2xs'
            }`}
          >
            <span className={`text-sm font-bold ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Zero Mandatory Account
            </span>
            <p className={`leading-relaxed font-light ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              No login walls, no ad profiling, and immediate 1-click local cache wipe anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

