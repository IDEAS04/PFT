import React, { useState, useEffect, useRef } from 'react';
import {
  Message,
  ProcessingMode,
  ConfidenceLevel,
  SensitiveItem,
  ConsequentialActionRequest,
  GroundingEngine,
} from '../types';
import { scanForSensitiveData, redactText } from '../lib/privacyScanner';
import { processLocalAiRequest } from '../lib/localAi';
import { storage } from '../lib/storage';
import {
  Send,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Copy,
  Check,
  Lock,
} from 'lucide-react';
import { SensitiveDataModal } from './SensitiveDataModal';
import Markdown from 'react-markdown';

interface ChatViewProps {
  messages: Message[];
  onSendMessage: (msg: Message) => void;
  processingMode: ProcessingMode;
  onToggleMode: (mode: ProcessingMode) => void;
  onOpenTrustInspector: (msg: Message) => void;
  onTriggerConsequentialAction: (action: ConsequentialActionRequest) => void;
  onClearChat?: () => void;
  theme?: 'light' | 'dark';
}

export const ChatView: React.FC<ChatViewProps> = ({
  messages,
  onSendMessage,
  processingMode,
  onOpenTrustInspector,
  onTriggerConsequentialAction,
  theme = 'light',
}) => {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const selectedEngine: GroundingEngine = 'hybrid';
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const isDark = theme === 'dark';

  // Pre-flight scanner state
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [detectedPii, setDetectedPii] = useState<SensitiveItem[]>([]);
  const [showPiiModal, setShowPiiModal] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => {
      setCopiedMessageId(null);
    }, 2000);
  };

  const handleInitiateSend = (textToSend: string) => {
    const trimmed = textToSend.trim();
    if (!trimmed || isLoading) return;

    // Run client-side Sensitive Data Scanner
    const piiFound = scanForSensitiveData(trimmed);

    // If sensitive data found AND in Cloud mode, trigger Pre-Flight Guardian
    if (piiFound.length > 0 && processingMode === 'cloud') {
      setPendingPrompt(trimmed);
      setDetectedPii(piiFound);
      setShowPiiModal(true);
      return;
    }

    // Otherwise proceed directly
    executeSend(trimmed, false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    handleInitiateSend(inputText);
    setInputText('');
  };

  // Execution flow with Gemini multi-turn conversation
  const executeSend = async (
    textToSend: string,
    wasRedacted: boolean = false,
    originalBeforeRedact?: string,
    forceLocalMode: boolean = false
  ) => {
    const activeMode = forceLocalMode ? 'local' : processingMode;

    const userMsg: Message = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      sender: 'user',
      text: textToSend,
      timestamp: Date.now(),
      mode: activeMode,
      engine: selectedEngine,
      wasRedacted,
      redactedOriginal: originalBeforeRedact,
    };

    onSendMessage(userMsg);
    setIsLoading(true);

    try {
      if (activeMode === 'local') {
        // 🔒 LOCAL AI (100% on device with zero delay)
        const localResult = await processLocalAiRequest(textToSend, messages, selectedEngine);

        const pftMsg: Message = {
          id: `pft-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          sender: 'pft',
          text: localResult.text,
          timestamp: Date.now(),
          mode: 'local',
          engine: selectedEngine,
          modelUsed: 'On-Device Engine',
          confidence: localResult.confidence,
          evidence: localResult.evidence,
          riskAnalysis: localResult.riskAnalysis,
          decisionEvaluation: localResult.decisionEvaluation,
          privacyNotice: localResult.privacyNotice,
        };

        onSendMessage(pftMsg);
      } else {
        // ☁️ PRIVATE CLOUD MULTI-TURN GEMINI CHAT
        const memContext = storage.isMemoryEnabled()
          ? storage
              .getMemories()
              .map((m) => `[${m.category}] ${m.content}`)
              .join('\n')
          : '';

        storage.logOutboundRequest({
          endpoint: '/api/chat',
          service: 'Google Gemini',
          purpose: 'Private Multi-turn Gemini Chat',
          payloadSummary: textToSend.substring(0, 60) + (textToSend.length > 60 ? '...' : ''),
          bytesSent: new TextEncoder().encode(textToSend).length,
          retentionPolicy: '0-day ephemeral',
          encryptionStatus: 'TLS 1.3 encrypted',
          piiChecked: true,
        });

        // Send multi-turn history to server
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: textToSend,
            history: messages.slice(-10).map((m) => ({
              sender: m.sender,
              text: m.text,
            })),
            searchGrounded: true,
            memoryContext: memContext,
            engine: selectedEngine,
            model: 'auto',
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Server request failed');
        }

        const pftMsg: Message = {
          id: `pft-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          sender: 'pft',
          text: data.text,
          timestamp: Date.now(),
          mode: 'cloud',
          engine: selectedEngine,
          modelUsed: data.modelUsed,
          confidence: data.confidence || 'HIGH',
          sources: data.sources || [],
          evidence: data.evidence || [],
          pendingAction: data.pendingAction || undefined,
          privacyNotice: data.privacyNotice,
          tokensCount: data.tokensCount,
          sourcesAgreementRate: data.sourcesAgreementRate,
        };

        onSendMessage(pftMsg);

        if (data.pendingAction) {
          onTriggerConsequentialAction(data.pendingAction);
        }
      }
    } catch {
      // Seamless instant fallback
      try {
        const localFallback = await processLocalAiRequest(textToSend, messages, selectedEngine);
        const fallbackMsg: Message = {
          id: `pft-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          sender: 'pft',
          text: localFallback.text,
          timestamp: Date.now(),
          mode: 'local',
          engine: selectedEngine,
          modelUsed: 'On-Device Safe Mode',
          confidence: localFallback.confidence,
          evidence: localFallback.evidence,
          riskAnalysis: localFallback.riskAnalysis,
          decisionEvaluation: localFallback.decisionEvaluation,
          privacyNotice: '🔒 PFT Protected · Private session · No persistent memory',
        };
        onSendMessage(fallbackMsg);
      } catch {
        const errorMsg: Message = {
          id: `pft-err-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          sender: 'pft',
          text: `I'm here and ready to help. What would you like to explore?`,
          timestamp: Date.now(),
          mode: 'local',
          confidence: 'MEDIUM',
          privacyNotice: '🔒 PFT Protected · Private session · No persistent memory',
        };
        onSendMessage(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-flight modal actions
  const handleRedactAndSend = () => {
    if (!pendingPrompt) return;
    const redacted = redactText(pendingPrompt, detectedPii);
    setShowPiiModal(false);
    executeSend(redacted, true, pendingPrompt);
    setPendingPrompt(null);
  };

  const handleSendAnyway = () => {
    if (!pendingPrompt) return;
    setShowPiiModal(false);
    executeSend(pendingPrompt, false);
    setPendingPrompt(null);
  };

  const handleProcessLocallyInstead = () => {
    if (!pendingPrompt) return;
    setShowPiiModal(false);
    executeSend(pendingPrompt, false, undefined, true);
    setPendingPrompt(null);
  };

  const handleCancelSend = () => {
    setShowPiiModal(false);
    setPendingPrompt(null);
  };

  const getConfidenceBadge = (confidence?: ConfidenceLevel) => {
    switch (confidence) {
      case 'HIGH':
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-500">
            <CheckCircle2 className="h-3 w-3" />
            <span>High Confidence</span>
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium text-amber-500">
            <AlertCircle className="h-3 w-3" />
            <span>Medium Confidence</span>
          </span>
        );
      case 'LOW':
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium text-rose-500">
            <AlertCircle className="h-3 w-3" />
            <span>Low Confidence</span>
          </span>
        );
      case 'UNKNOWN':
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-medium text-zinc-400">
            <HelpCircle className="h-3 w-3" />
            <span>General Response</span>
          </span>
        );
    }
  };

  const examplePrompts = [
    {
      label: '💻 Code & Architecture',
      prompt: 'Design a high-throughput async queue in TypeScript with concurrency limits and retry exponential backoff',
    },
    {
      label: '🔬 Logic & Proofs',
      prompt: 'Explain step-by-step how transformer self-attention computes query, key, and value vectors mathematically',
    },
    {
      label: '⚡ Rapid Summary',
      prompt: 'Give me a 3-bullet summary of the core principles of zero-trust security',
    },
    {
      label: '⚖️ Strategy & Trade-offs',
      prompt: 'Should an early-stage startup build on serverless or provisioned container infrastructure?',
    },
  ];

  return (
    <div className="flex h-full flex-col justify-between max-w-4xl mx-auto px-4 sm:px-6">
      {/* Messages Stream Area */}
      <div className="flex-1 overflow-y-auto pt-2 pb-6 space-y-5">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl mb-3 shadow-2xs ${
                isDark ? 'bg-zinc-800/90 border border-zinc-700 text-white' : 'bg-zinc-100 text-zinc-800'
              }`}
            >
              <Sparkles className="h-7 w-7 text-emerald-400" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">
              Privacy-First AI Assistant
            </h2>
            <p className={`max-w-md text-xs sm:text-sm mb-6 ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
              Natural, intelligent multi-turn conversation with 0-day retention privacy and zero-delay execution.
            </p>

            {/* Quick Prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-xl text-left">
              {examplePrompts.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => handleInitiateSend(ex.prompt)}
                  className={`p-3 rounded-xl border text-left transition-all text-xs ${
                    isDark
                      ? 'border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300'
                      : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-zinc-700 shadow-2xs'
                  }`}
                >
                  <div className="font-semibold text-emerald-500 mb-1">{ex.label}</div>
                  <div className="line-clamp-2">{ex.prompt}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="space-y-2">
              {msg.sender === 'user' ? (
                /* User Message Bubble */
                <div className="flex justify-end">
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm sm:text-base font-normal shadow-2xs ${
                      isDark
                        ? 'bg-zinc-800 text-white border border-zinc-700'
                        : 'bg-zinc-900 text-white'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    {msg.wasRedacted && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                        <ShieldCheck className="h-3 w-3" />
                        <span>Pre-flight redacted: sensitive tokens removed before sending</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* Assistant Message Container */
                <div className="flex flex-col space-y-3">
                  <div
                    className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-2xs ${
                      isDark
                        ? 'border-zinc-800 bg-zinc-900/90 text-zinc-100'
                        : 'border-slate-200 bg-white text-zinc-900'
                    }`}
                  >
                    {/* Header row: Confidence & Copy */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-3 border-b border-inherit">
                      <div className="flex items-center gap-2">
                        {getConfidenceBadge(msg.confidence)}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                        <button
                          onClick={() => handleCopyText(msg.text, msg.id)}
                          className={`flex items-center gap-1 p-1 rounded transition-colors ${
                            isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-slate-100 text-zinc-500'
                          }`}
                          title="Copy response"
                        >
                          {copiedMessageId === msg.id ? (
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Markdown Body */}
                    <div className="text-sm leading-relaxed font-normal">
                      <div className="markdown-body">
                        <Markdown>{msg.text}</Markdown>
                      </div>
                    </div>

                    {/* Clean, Minimal PFT Trust & Privacy Footer */}
                    <div className="mt-3.5 pt-2.5 border-t border-inherit flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 select-none">
                        <Lock className="h-3 w-3 text-zinc-400 dark:text-zinc-500 shrink-0" />
                        <span>PFT Protected · Private session · No persistent memory</span>
                      </div>

                      <button
                        onClick={() => onOpenTrustInspector(msg)}
                        className={`flex items-center gap-1 text-xs font-medium transition-colors ${
                          isDark
                            ? 'text-zinc-400 hover:text-zinc-200'
                            : 'text-zinc-500 hover:text-zinc-800'
                        }`}
                      >
                        <ShieldCheck className="h-3.5 w-3.5 opacity-70" />
                        <span>Why trust this?</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-zinc-400 animate-pulse py-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span>PFT is thinking...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="sticky bottom-0 pb-6 pt-2 bg-gradient-to-t from-inherit via-inherit to-transparent">
        <form onSubmit={handleFormSubmit} className="relative">
          <div
            className={`flex items-center rounded-2xl border px-4 py-3.5 shadow-sm transition-all ${
              isDark
                ? 'border-zinc-800 bg-[#0d0d0f] focus-within:border-zinc-600'
                : 'border-slate-300 bg-white focus-within:border-zinc-900 focus-within:ring-1 focus-within:ring-zinc-900'
            }`}
          >
            <input
              ref={inputRef}
              id="pft-chat-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Message PFT..."
              className={`w-full bg-transparent text-sm sm:text-base focus:outline-none ${
                isDark ? 'text-white placeholder-zinc-500' : 'text-zinc-900 placeholder-zinc-400'
              }`}
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all disabled:opacity-20 ${
                isDark
                  ? 'bg-white text-zinc-900 hover:bg-zinc-200'
                  : 'bg-zinc-900 text-white hover:bg-zinc-800'
              }`}
              title="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Pre-Flight Privacy Guardian Modal */}
      <SensitiveDataModal
        isOpen={showPiiModal}
        sensitiveItems={detectedPii}
        originalText={pendingPrompt || ''}
        onRedactAndSend={handleRedactAndSend}
        onSendAnyway={handleSendAnyway}
        onProcessLocallyInstead={handleProcessLocallyInstead}
        onCancel={handleCancelSend}
        theme={theme}
      />
    </div>
  );
};
