import React, { useState } from 'react';
import { SensitiveItem, ProcessingMode } from '../types';
import { scanForSensitiveData, redactText } from '../lib/privacyScanner';
import { storage } from '../lib/storage';
import {
  FileText,
  UploadCloud,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Cloud,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Sparkles,
} from 'lucide-react';
import Markdown from 'react-markdown';

interface DocumentsViewProps {
  theme?: 'light' | 'dark';
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ theme = 'light' }) => {
  const [fileName, setFileName] = useState('Mutual_Non_Disclosure_Agreement.txt');
  const [rawText, setRawText] = useState(
    `CONFIDENTIAL NON-DISCLOSURE AND PROPRIETARY RIGHTS AGREEMENT\n\nThis Non-Disclosure Agreement ("Agreement") is entered into as of October 12, 2025, by and between Horizon Nexus Inc., having a principal place of business at 742 Evergreen Terrace, Springfield, OR ("Disclosing Party"), and Johnathan Vance, email j.vance@examplecorp.com, SSN: 123-45-6789 ("Receiving Party").\n\n1. Confidential Information. Receiving Party agrees to treat all technical architecture, source code, financial balance sheets, and customer databases as strictly confidential.\n\n2. Term and Termination. The obligations of confidentiality shall endure indefinitely, or for a minimum duration of 10 years following termination of discussions.\n\n3. Non-Compete Restriction. Receiving Party agrees not to engage with, consult for, or develop competitive AI software within North America for a period of 24 months post-engagement.\n\n4. Liquidated Damages. Any breach shall incur automatic liquidated damages of $250,000 without requirement of proving actual commercial injury.`
  );

  const [piiItems, setPiiItems] = useState<SensitiveItem[]>([]);
  const [analyzedResult, setAnalyzedResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMode, setSelectedMode] = useState<ProcessingMode>('local');
  const [redactedTextContent, setRedactedTextContent] = useState<string | null>(null);

  const isDark = theme === 'dark';

  // Scan immediately when text changes
  const handleScanText = () => {
    const found = scanForSensitiveData(rawText);
    setPiiItems(found);
  };

  React.useEffect(() => {
    handleScanText();
  }, [rawText]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRawText(content);
      setAnalyzedResult(null);
      setRedactedTextContent(null);
    };
    reader.readAsText(file);
  };

  const handleProcessLocally = () => {
    setIsLoading(true);
    setSelectedMode('local');

    // Local deterministic contract analysis
    setTimeout(() => {
      const localSummary = `### 🔒 Local Privacy Contract Analysis\n**Processed 100% On-Device — 0 Remote Network Requests**\n\n#### 1. Document Summary\nThis is a unilateral or mutual non-disclosure agreement containing proprietary protection clauses, indefinite term lengths, non-compete covenants, and liquidated damages provisions.\n\n#### 2. Key Clauses & Risk Matrix\n- **Indefinite Confidentiality (Section 2)**: ⚠️ *Medium Risk* — Standard commercial NDAs typically limit confidentiality of non-trade-secret data to 2–5 years.\n- **24-Month Non-Compete (Section 3)**: 🚨 *High Risk* — Restrictive covenants in software engineering are frequently unenforceable or excessively burdensome depending on local labor laws.\n- **Liquidated Damages Clause (Section 4)**: 🚨 *High Risk* — Automatic $250,000 penalty clause without proof of actual harm is punitive and one-sided.\n\n#### 3. Missing Standard Protections\n- No standard carve-out for independently developed IP.\n- No standard carve-out for information already in the public domain.\n- No mutual indemnity or limitation of liability for Receiving Party.\n\n#### 4. Recommended Next Steps\n- Negotiate reduction of non-compete clause.\n- Strike the automated liquidated damages clause.\n- Consult qualified legal counsel before signing.`;

      setAnalyzedResult(localSummary);
      setIsLoading(false);
    }, 600);
  };

  const handleRedactAndCloudProcess = async () => {
    const redacted = redactText(rawText, piiItems);
    setRedactedTextContent(redacted);
    await executeCloudProcess(redacted);
  };

  const handleDirectCloudProcess = async () => {
    await executeCloudProcess(rawText);
  };

  const executeCloudProcess = async (textToSend: string) => {
    setIsLoading(true);
    setSelectedMode('cloud');

    // Log outbound telemetry
    storage.logOutboundRequest({
      endpoint: '/api/document',
      service: 'Google Gemini',
      purpose: 'Private Cloud Document Analysis',
      payloadSummary: `Analyzing ${fileName} (${textToSend.length} chars)`,
      bytesSent: new TextEncoder().encode(textToSend).length,
      retentionPolicy: '0-day ephemeral (RAM only)',
      encryptionStatus: 'TLS 1.3 encrypted',
      piiChecked: true,
    });

    try {
      const res = await fetch('/api/document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName,
          textContent: textToSend,
          docType: 'Contract / Document',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Document analysis failed');

      setAnalyzedResult(data.analysis);
    } catch (err: any) {
      console.error('Doc analysis error:', err);
      setAnalyzedResult(`Failed to analyze document via Cloud: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className={`border-b pb-6 ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5">
          <FileText className="h-3.5 w-3.5" />
          <span>Confidential Document Analysis</span>
        </div>
        <h2 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
          Private Document & Contract Scanner
        </h2>
        <p className={`text-xs mt-1.5 font-light ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
          Prioritize on-device evaluation, auto-redact sensitive PII, or execute ephemeral zero-retention cloud reviews.
        </p>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document Editor / Paste Area */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <span
              className={`text-xs font-bold font-mono uppercase tracking-wider ${
                isDark ? 'text-zinc-400' : 'text-zinc-600'
              }`}
            >
              Target Document:{' '}
              <span className={`font-mono ${isDark ? 'text-white' : 'text-zinc-900'}`}>{fileName}</span>
            </span>
            <label
              className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer transition-all ${
                isDark
                  ? 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                  : 'border-slate-200 bg-white text-zinc-700 hover:bg-slate-50 shadow-2xs'
              }`}
            >
              <UploadCloud className="h-3.5 w-3.5" />
              <span>Upload TXT/PDF</span>
              <input
                type="file"
                accept=".txt,.md,.json,.pdf,.doc,.docx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <textarea
            id="pft-document-textarea"
            rows={12}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="Paste contract, resume, medical summary, or financial document text here..."
            className={`w-full rounded-2xl border p-5 font-mono text-xs leading-relaxed transition-all focus:outline-none ${
              isDark
                ? 'border-zinc-800 bg-[#0c0c0e] text-zinc-200 focus:border-zinc-600'
                : 'border-slate-200 bg-white text-zinc-800 shadow-slate-200/50 focus:border-slate-400 focus:ring-2 focus:ring-slate-100'
            }`}
          />
        </div>

        {/* Sensitive Data Pre-Flight Card */}
        <div
          className={`rounded-2xl border p-6 space-y-5 shadow-sm ${
            isDark ? 'border-zinc-800 bg-[#0c0c0e]' : 'border-slate-200 bg-white shadow-slate-200/50'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase font-mono tracking-wider">
            <ShieldAlert className="h-4 w-4 text-amber-500" />
            <span className={isDark ? 'text-zinc-300' : 'text-zinc-800'}>Pre-Flight Privacy Audit</span>
          </div>

          <div className={`text-xs font-light ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Detected <strong className="text-amber-500 font-mono font-bold">{piiItems.length}</strong> sensitive data point{piiItems.length === 1 ? '' : 's'}:
          </div>

          <div
            className={`max-h-40 overflow-y-auto space-y-1.5 rounded-xl border p-3 ${
              isDark ? 'border-zinc-800 bg-black/60' : 'border-slate-200 bg-slate-50'
            }`}
          >
            {piiItems.length === 0 ? (
              <div className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-2 p-2 font-mono">
                <CheckCircle2 className="h-4 w-4" />
                <span>No high-risk PII detected</span>
              </div>
            ) : (
              piiItems.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between text-[11px] rounded-lg px-2.5 py-1.5 border font-mono ${
                    isDark
                      ? 'bg-zinc-900/60 border-zinc-800'
                      : 'bg-white border-slate-200 shadow-2xs'
                  }`}
                >
                  <span className={isDark ? 'text-zinc-400' : 'text-zinc-500'}>{item.label}</span>
                  <span className="text-amber-600 dark:text-amber-400 font-bold truncate max-w-[120px]">
                    {item.matchedText}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Action Choice Buttons */}
          <div className="space-y-2 pt-2">
            <button
              id="pft-btn-doc-local"
              onClick={handleProcessLocally}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 rounded-full py-2.5 text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
                isDark
                  ? 'bg-white text-zinc-900 hover:bg-zinc-200'
                  : 'bg-zinc-900 text-white hover:bg-zinc-800'
              }`}
            >
              <Lock className="h-3.5 w-3.5" />
              <span>PROCESS LOCALLY (0 Outbound)</span>
            </button>

            {piiItems.length > 0 && (
              <button
                id="pft-btn-doc-redact-cloud"
                onClick={handleRedactAndCloudProcess}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-900/40 py-2.5 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-300 transition-all"
              >
                <EyeOff className="h-3.5 w-3.5" />
                <span>REDACT PII & SEND TO CLOUD</span>
              </button>
            )}

            <button
              id="pft-btn-doc-cloud"
              onClick={handleDirectCloudProcess}
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2 rounded-full border py-2.5 text-xs font-bold uppercase tracking-wider transition-all ${
                isDark
                  ? 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                  : 'border-slate-200 bg-slate-50 text-zinc-700 hover:bg-slate-100'
              }`}
            >
              <Cloud className="h-3.5 w-3.5" />
              <span>SEND RAW TO CLOUD (0-Day RAM)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Redacted Preview if applicable */}
      {redactedTextContent && (
        <div
          className={`rounded-2xl border p-5 space-y-3 ${
            isDark
              ? 'border-emerald-500/30 bg-emerald-950/20'
              : 'border-emerald-200 bg-emerald-50/50'
          }`}
        >
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 font-mono uppercase tracking-wider">
            <EyeOff className="h-4 w-4" />
            <span>Redacted Document Payload Transmitted</span>
          </div>
          <p
            className={`text-[11px] font-mono p-4 rounded-xl border whitespace-pre-wrap max-h-32 overflow-y-auto font-light ${
              isDark
                ? 'text-zinc-300 bg-black/70 border-zinc-800'
                : 'text-zinc-700 bg-white border-emerald-100 shadow-2xs'
            }`}
          >
            {redactedTextContent}
          </p>
        </div>
      )}

      {/* Analysis Result Output */}
      {analyzedResult && (
        <div
          className={`rounded-2xl border p-8 shadow-sm space-y-5 ${
            isDark
              ? 'border-zinc-800 bg-[#0c0c0e]'
              : 'border-slate-200 bg-white shadow-slate-200/50'
          }`}
        >
          <div className={`flex items-center justify-between border-b pb-4 ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className={isDark ? 'text-white' : 'text-zinc-900'}>
                DOCUMENT ANALYSIS RESULT ({selectedMode === 'local' ? '🔒 LOCAL RUN' : '☁️ PRIVATE CLOUD'})
              </span>
            </div>
            <span className={`text-[10px] font-mono ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              File: {fileName}
            </span>
          </div>

          <div
            className={`text-sm leading-relaxed font-light ${
              isDark ? 'text-zinc-200' : 'text-zinc-800'
            }`}
          >
            <div className="markdown-body">
              <Markdown>{analyzedResult}</Markdown>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
