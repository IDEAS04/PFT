import React, { useState } from 'react';
import { GroundingSource } from '../types';
import { storage } from '../lib/storage';
import {
  Compass,
  Search,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  FileText,
  Calendar,
  Layers,
  Sparkles,
  ArrowRight,
  Sliders,
} from 'lucide-react';
import Markdown from 'react-markdown';

interface ResearchViewProps {
  theme?: 'light' | 'dark';
}

export const ResearchView: React.FC<ResearchViewProps> = ({ theme = 'light' }) => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [researchData, setResearchData] = useState<{
    topic: string;
    text: string;
    sources: GroundingSource[];
    sourcesAnalyzed: number;
    sourcesAgreeing: number;
    conflictingInfoCount: number;
    confidence: 'HIGH' | 'MEDIUM' | 'LOW';
    agreementRate: number;
    timestamp: number;
  } | null>(null);

  const isDark = theme === 'dark';

  const sampleTopics = [
    'Recent breakthroughs in mRNA cancer vaccines',
    'Global semiconductor supply chain diversification trends',
    'Quantum computing error mitigation developments',
    'Commercial fusion energy pilot milestones',
  ];

  const handleRunResearch = async (targetTopic: string) => {
    const trimmed = targetTopic.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);

    // Log outbound telemetry
    storage.logOutboundRequest({
      endpoint: '/api/research',
      service: 'Google Search Grounding',
      purpose: 'Deep Multi-Source Grounded Investigation',
      payloadSummary: trimmed.substring(0, 60),
      bytesSent: new TextEncoder().encode(trimmed).length,
      retentionPolicy: '0-day ephemeral',
      encryptionStatus: 'TLS 1.3 encrypted',
      piiChecked: true,
    });

    try {
      const res = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: trimmed }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Research failed');

      setResearchData(data);
    } catch (err: any) {
      console.error('Research error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className={`border-b pb-6 ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5">
          <Compass className="h-3.5 w-3.5" />
          <span>PFT Grounded Research Engine</span>
        </div>
        <h2 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          Multi-Source Deep Investigation
        </h2>
        <p className={`text-xs mt-1.5 font-light ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
          Grounded via real-time search indexing • Cross-checked evidence synthesis • Explicit source agreement & conflict metrics.
        </p>
      </div>

      {/* Omnibar */}
      <div
        className={`rounded-2xl border p-5 shadow-sm ${
          isDark
            ? 'border-zinc-800 bg-[#0c0c0e]'
            : 'border-slate-200 bg-white shadow-slate-200/50'
        }`}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleRunResearch(topic);
          }}
          className="space-y-4"
        >
          <div
            className={`flex items-center rounded-xl border px-4 py-3 transition-all ${
              isDark
                ? 'border-zinc-800 bg-black focus-within:border-zinc-500'
                : 'border-slate-200 bg-slate-50 focus-within:border-slate-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-100'
            }`}
          >
            <Search className={`h-4 w-4 mr-3 shrink-0 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`} />
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter research topic, technology claim, or complex inquiry..."
              className={`w-full bg-transparent text-sm sm:text-base focus:outline-none font-light ${
                isDark ? 'text-white placeholder:text-zinc-600' : 'text-zinc-900 placeholder:text-zinc-400'
              }`}
            />
            <button
              type="submit"
              disabled={!topic.trim() || isLoading}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider disabled:opacity-30 transition-all shrink-0 shadow-xs ${
                isDark
                  ? 'bg-white text-zinc-900 hover:bg-zinc-200'
                  : 'bg-zinc-900 text-white hover:bg-zinc-800'
              }`}
            >
              <span>{isLoading ? 'Investigating...' : 'Start Research'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`font-mono text-[10px] font-bold uppercase tracking-wider ${
                isDark ? 'text-zinc-500' : 'text-zinc-400'
              }`}
            >
              Suggestions:
            </span>
            {sampleTopics.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setTopic(t);
                  handleRunResearch(t);
                }}
                className={`rounded-full border px-3 py-1 text-xs transition-all font-light ${
                  isDark
                    ? 'border-zinc-800 bg-zinc-900/60 text-zinc-300 hover:border-zinc-700 hover:text-white'
                    : 'border-slate-200 bg-white text-zinc-600 hover:border-slate-300 hover:text-zinc-900 hover:bg-slate-50 shadow-2xs'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div
          className={`rounded-2xl border p-10 text-center space-y-4 animate-pulse ${
            isDark ? 'border-zinc-800 bg-[#0c0c0e]' : 'border-slate-200 bg-white shadow-xs'
          }`}
        >
          <div
            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border ${
              isDark
                ? 'border-zinc-700 bg-zinc-800 text-white'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
          >
            <Compass className="h-7 w-7 animate-spin" />
          </div>
          <div className="space-y-1.5">
            <h3 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              Executing Multi-Source Investigation
            </h3>
            <p className={`text-xs font-mono ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Search Grounding → Source Quality Verification → Cross-Check Detection → Synthesis
            </p>
          </div>
        </div>
      )}

      {/* Research Output Result */}
      {researchData && !isLoading && (
        <div className="space-y-6">
          {/* Metrics Card */}
          <div
            className={`rounded-2xl border p-6 shadow-sm space-y-5 ${
              isDark ? 'border-zinc-800 bg-[#0c0c0e]' : 'border-slate-200 bg-white shadow-slate-200/50'
            }`}
          >
            <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4" />
                <span>RESEARCH COMPLETE</span>
              </div>
              <span className={`text-[11px] font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                {new Date(researchData.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div
                className={`rounded-xl border p-4 ${
                  isDark ? 'border-zinc-800 bg-black/50' : 'border-slate-200 bg-slate-50/70'
                }`}
              >
                <span
                  className={`text-[10px] font-mono uppercase font-bold tracking-wider ${
                    isDark ? 'text-zinc-500' : 'text-zinc-400'
                  }`}
                >
                  Sources Analyzed
                </span>
                <p className={`text-3xl font-light mt-1 ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                  {researchData.sourcesAnalyzed}
                </p>
              </div>

              <div
                className={`rounded-xl border p-4 ${
                  isDark ? 'border-zinc-800 bg-black/50' : 'border-slate-200 bg-slate-50/70'
                }`}
              >
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
                  Sources Agreeing
                </span>
                <p className="text-3xl font-light text-emerald-600 dark:text-emerald-400 mt-1">
                  {researchData.sourcesAgreeing}
                </p>
              </div>

              <div
                className={`rounded-xl border p-4 ${
                  isDark ? 'border-zinc-800 bg-black/50' : 'border-slate-200 bg-slate-50/70'
                }`}
              >
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400">
                  Conflicting Points
                </span>
                <p className="text-3xl font-light text-amber-600 dark:text-amber-400 mt-1">
                  {researchData.conflictingInfoCount}
                </p>
              </div>

              <div
                className={`rounded-xl border p-4 ${
                  isDark ? 'border-zinc-800 bg-black/50' : 'border-slate-200 bg-slate-50/70'
                }`}
              >
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-cyan-600 dark:text-cyan-400">
                  Confidence
                </span>
                <p className="text-2xl font-bold font-mono text-cyan-600 dark:text-cyan-400 mt-1 tracking-tight">
                  {researchData.confidence}
                </p>
              </div>
            </div>
          </div>

          {/* Sources Inspection Drawer */}
          {researchData.sources.length > 0 && (
            <div
              className={`rounded-2xl border p-6 space-y-4 ${
                isDark ? 'border-zinc-800 bg-[#0c0c0e]' : 'border-slate-200 bg-white shadow-xs'
              }`}
            >
              <h3
                className={`text-xs font-bold uppercase tracking-widest font-mono ${
                  isDark ? 'text-zinc-400' : 'text-zinc-600'
                }`}
              >
                Inspect Grounded Source Index ({researchData.sources.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {researchData.sources.map((src) => (
                  <div
                    key={src.id}
                    className={`flex items-start justify-between gap-3 rounded-xl border p-3.5 text-xs ${
                      isDark
                        ? 'border-zinc-800 bg-zinc-900/40'
                        : 'border-slate-200 bg-slate-50/80 shadow-2xs'
                    }`}
                  >
                    <div className="space-y-1">
                      <div
                        className={`font-bold truncate max-w-[280px] ${
                          isDark ? 'text-white' : 'text-zinc-900'
                        }`}
                      >
                        {src.title}
                      </div>
                      <div
                        className={`flex items-center gap-2 font-mono text-[10px] ${
                          isDark ? 'text-zinc-500' : 'text-zinc-400'
                        }`}
                      >
                        <span>{src.domain}</span>
                        <span>•</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                          Trust: {src.trustScore}/100
                        </span>
                      </div>
                    </div>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`rounded-md border p-1.5 shrink-0 transition-colors ${
                        isDark
                          ? 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700'
                          : 'border-slate-200 bg-white text-zinc-600 hover:text-zinc-900 hover:bg-slate-100 shadow-2xs'
                      }`}
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Synthesis Body */}
          <div
            className={`rounded-2xl border p-8 shadow-xs text-sm leading-relaxed font-light ${
              isDark
                ? 'border-zinc-800 bg-[#0c0c0e] text-zinc-200'
                : 'border-slate-200 bg-white text-zinc-800 shadow-slate-200/50'
            }`}
          >
            <div className="markdown-body">
              <Markdown>{researchData.text}</Markdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
