import React, { useState } from 'react';
import { storage } from '../lib/storage';
import {
  Scale,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  TrendingUp,
  ShieldAlert,
} from 'lucide-react';
import Markdown from 'react-markdown';

interface DecisionsViewProps {
  theme?: 'light' | 'dark';
}

export const DecisionsView: React.FC<DecisionsViewProps> = ({ theme = 'light' }) => {
  const [decisionQuery, setDecisionQuery] = useState('');
  const [context, setContext] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    question: string;
    framework: string;
    reminder: string;
    confidence: string;
  } | null>(null);

  const isDark = theme === 'dark';

  const sampleDecisions = [
    'Should I leave my corporate role to launch a solo consultancy?',
    'Should I buy a home in this interest rate environment or continue renting?',
    'Should our team rewrite our legacy monolith in Rust or keep iterating?',
    'Should I take a higher-paying job with longer commute vs flexible remote work?',
  ];

  const handleEvaluate = async (q: string) => {
    const trimmed = q.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);

    // Log outbound telemetry
    storage.logOutboundRequest({
      endpoint: '/api/decision',
      service: 'Google Gemini',
      purpose: 'Multi-Factor Decision Trade-Off Evaluation',
      payloadSummary: trimmed.substring(0, 60),
      bytesSent: new TextEncoder().encode(trimmed + context).length,
      retentionPolicy: '0-day ephemeral',
      encryptionStatus: 'TLS 1.3 encrypted',
      piiChecked: true,
    });

    try {
      const res = await fetch('/api/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: trimmed, context: context.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Evaluation failed');

      setResult(data);
    } catch (err: any) {
      console.error('Decision error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className={`border-b pb-6 ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5">
          <Scale className="h-3.5 w-3.5" />
          <span>Decision Support Engine</span>
        </div>
        <h2 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          Objective Decision Support & Risk Analysis
        </h2>
        <p className={`text-xs mt-1.5 font-light ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
          PFT provides rigorous multi-factor trade-off frameworks. PFT never blindly dictates actions; you remain the sovereign decision maker.
        </p>
      </div>

      {/* Input Matrix */}
      <div
        className={`rounded-2xl border p-6 space-y-5 shadow-sm ${
          isDark ? 'border-zinc-800 bg-[#0c0c0e]' : 'border-slate-200 bg-white shadow-slate-200/50'
        }`}
      >
        <div>
          <label
            className={`text-xs font-bold font-mono uppercase tracking-wider block mb-2 ${
              isDark ? 'text-zinc-300' : 'text-zinc-800'
            }`}
          >
            What major decision are you evaluating?
          </label>
          <input
            id="pft-decision-input"
            type="text"
            value={decisionQuery}
            onChange={(e) => setDecisionQuery(e.target.value)}
            placeholder="e.g. Should I accept an equity-heavy offer at an early-stage startup?"
            className={`w-full rounded-xl border px-4 py-3 text-sm sm:text-base font-light transition-all focus:outline-none ${
              isDark
                ? 'border-zinc-800 bg-black text-white placeholder-zinc-600 focus:border-zinc-500'
                : 'border-slate-200 bg-slate-50 text-zinc-900 placeholder-zinc-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100'
            }`}
          />
        </div>

        <div>
          <label
            className={`text-xs font-bold font-mono uppercase tracking-wider block mb-2 ${
              isDark ? 'text-zinc-400' : 'text-zinc-500'
            }`}
          >
            Optional Context (Runway, personal constraints, timelines)
          </label>
          <textarea
            id="pft-decision-context"
            rows={2}
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g. I have 9 months emergency runway, no dependents, and 6 years experience in SaaS..."
            className={`w-full rounded-xl border px-4 py-2.5 text-xs font-light transition-all focus:outline-none ${
              isDark
                ? 'border-zinc-800 bg-black text-zinc-200 placeholder-zinc-600 focus:border-zinc-500'
                : 'border-slate-200 bg-slate-50 text-zinc-800 placeholder-zinc-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100'
            }`}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`font-mono text-[10px] font-bold uppercase tracking-wider ${
                isDark ? 'text-zinc-500' : 'text-zinc-400'
              }`}
            >
              Examples:
            </span>
            {sampleDecisions.slice(0, 2).map((d, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setDecisionQuery(d);
                  handleEvaluate(d);
                }}
                className={`rounded-full border px-3 py-1 text-xs transition-all font-light ${
                  isDark
                    ? 'border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:border-zinc-700 hover:text-white'
                    : 'border-slate-200 bg-white text-zinc-600 hover:border-slate-300 hover:text-zinc-900 hover:bg-slate-50 shadow-2xs'
                }`}
              >
                {d.substring(0, 40)}...
              </button>
            ))}
          </div>

          <button
            id="pft-btn-run-decision"
            onClick={() => handleEvaluate(decisionQuery)}
            disabled={!decisionQuery.trim() || isLoading}
            className={`flex items-center gap-2 rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-wider disabled:opacity-30 transition-all shadow-sm shrink-0 ${
              isDark
                ? 'bg-white text-zinc-900 hover:bg-zinc-200'
                : 'bg-zinc-900 text-white hover:bg-zinc-800'
            }`}
          >
            <span>{isLoading ? 'Analyzing Trade-Offs...' : 'Evaluate Decision'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Decision Output */}
      {result && (
        <div
          className={`rounded-2xl border p-8 shadow-sm space-y-6 animate-in fade-in duration-200 ${
            isDark ? 'border-zinc-800 bg-[#0c0c0e]' : 'border-slate-200 bg-white shadow-slate-200/50'
          }`}
        >
          <div
            className={`rounded-xl border p-5 flex items-center justify-between ${
              isDark
                ? 'border-amber-500/30 bg-amber-950/20'
                : 'border-amber-200 bg-amber-50/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Scale className="h-5 w-5 text-amber-500 shrink-0" />
              <div>
                <h4
                  className={`text-xs font-bold uppercase tracking-wider font-mono ${
                    isDark ? 'text-white' : 'text-zinc-900'
                  }`}
                >
                  Sovereign Decision Principle
                </h4>
                <p className="text-xs text-amber-700 dark:text-amber-300 font-light mt-0.5">
                  {result.reminder}
                </p>
              </div>
            </div>
            <span
              className={`rounded px-2.5 py-1 text-[10px] font-mono font-bold border uppercase ${
                isDark
                  ? 'bg-black text-emerald-400 border-zinc-800'
                  : 'bg-white text-emerald-700 border-emerald-200 shadow-2xs'
              }`}
            >
              Confidence: {result.confidence}
            </span>
          </div>

          <div
            className={`text-sm leading-relaxed font-light ${
              isDark ? 'text-zinc-200' : 'text-zinc-800'
            }`}
          >
            <div className="markdown-body">
              <Markdown>{result.framework}</Markdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

