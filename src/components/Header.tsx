import React from 'react';
import { ProcessingMode } from '../types';
import {
  Lock,
  Cloud,
  ShieldCheck,
  Sun,
  Moon,
  Trash2,
} from 'lucide-react';

interface HeaderProps {
  processingMode: ProcessingMode;
  onToggleMode: (mode: ProcessingMode) => void;
  onClearChat?: () => void;
  hasMessages?: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  processingMode,
  onToggleMode,
  onClearChat,
  hasMessages = false,
  theme,
  onToggleTheme,
}) => {
  const isDark = theme === 'dark';

  return (
    <header
      id="pft-main-header"
      className={`sticky top-0 z-40 w-full border-b transition-colors backdrop-blur-md ${
        isDark
          ? 'border-zinc-800/80 bg-[#09090b]/95 text-white'
          : 'border-slate-200/80 bg-white/95 text-zinc-900 shadow-2xs'
      }`}
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand & Badges */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-lg font-bold ${
              isDark
                ? 'bg-zinc-800 border border-zinc-700 text-white'
                : 'bg-zinc-900 text-white shadow-2xs'
            }`}
          >
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="text-sm font-black tracking-tight font-sans">
              PFT – Privacy-First Trust AI
            </span>

            <div className="flex items-center gap-1.5 mt-0.5 sm:mt-0">
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${
                  isDark
                    ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                }`}
              >
                0-DAY RETENTION
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider ${
                  isDark
                    ? 'border border-zinc-700 bg-zinc-800/80 text-zinc-300'
                    : 'border border-slate-200 bg-slate-100 text-zinc-700'
                }`}
              >
                ZERO LOGIN
              </span>
            </div>
          </div>
        </div>

        {/* Right side: Local AI Indicator & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Local AI Mode Indicator & Switcher */}
          <button
            id="pft-mode-toggle"
            onClick={() => onToggleMode(processingMode === 'local' ? 'cloud' : 'local')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono transition-all border ${
              processingMode === 'local'
                ? isDark
                  ? 'border-emerald-500/40 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-950/50'
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100/70'
                : isDark
                ? 'border-cyan-500/30 bg-cyan-950/20 text-cyan-400 hover:bg-cyan-950/40'
                : 'border-cyan-200 bg-cyan-50 text-cyan-700 hover:bg-cyan-100/70'
            }`}
            title="Click to switch between Local AI (100% on device) and Private Cloud"
          >
            {processingMode === 'local' ? (
              <>
                <Lock className="h-3.5 w-3.5 text-emerald-500" />
                <span className="font-semibold">Nothing leaves this device</span>
              </>
            ) : (
              <>
                <Cloud className="h-3.5 w-3.5 text-cyan-500" />
                <span className="font-semibold">Private Cloud (0-Day)</span>
              </>
            )}
          </button>

          {/* Clear chat if messages exist */}
          {hasMessages && onClearChat && (
            <button
              id="pft-clear-chat-btn"
              onClick={onClearChat}
              className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
                isDark
                  ? 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-red-400 hover:border-red-500/30'
                  : 'border-slate-200 bg-white text-zinc-500 hover:text-red-600 hover:border-red-200'
              }`}
              title="Clear conversation"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Theme toggle */}
          <button
            id="pft-theme-toggle"
            onClick={onToggleTheme}
            className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
              isDark
                ? 'border-zinc-800 bg-zinc-900 text-amber-300 hover:bg-zinc-800'
                : 'border-slate-200 bg-white text-zinc-700 hover:bg-slate-100'
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
          >
            {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>
    </header>
  );
};


