import React, { useState, useEffect } from 'react';
import {
  Message,
  ProcessingMode,
  ConsequentialActionRequest,
} from './types';
import { storage } from './lib/storage';
import { Header } from './components/Header';
import { ChatView } from './components/ChatView';
import { EvidenceTrustModal } from './components/EvidenceTrustModal';
import { ActionApprovalModal } from './components/ActionApprovalModal';
import { DeleteAllDataModal } from './components/DeleteAllDataModal';

export function App() {
  const [processingMode, setProcessingMode] = useState<ProcessingMode>('local');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [messages, setMessages] = useState<Message[]>([]);

  // Modals state
  const [inspectMessage, setInspectMessage] = useState<Message | null>(null);
  const [pendingAction, setPendingAction] = useState<ConsequentialActionRequest | null>(null);
  const [showDeleteAllModal, setShowDeleteAllModal] = useState<boolean>(false);

  // Initialize from storage on mount
  useEffect(() => {
    const savedTheme = storage.getTheme();
    setTheme(savedTheme || 'dark');
    setProcessingMode(storage.getProcessingMode() || 'local');
    setMessages(storage.getChatMessages());
  }, []);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    storage.setTheme(nextTheme);
  };

  const handleToggleMode = (mode: ProcessingMode) => {
    setProcessingMode(mode);
    storage.setProcessingMode(mode);
  };

  const handleSendMessage = (msg: Message) => {
    setMessages((prev) => {
      const updated = [...prev, msg];
      storage.saveChatMessages(updated);
      return updated;
    });
  };

  const handleClearChat = () => {
    setMessages([]);
    storage.saveChatMessages([]);
  };

  const handleApproveAction = (action: ConsequentialActionRequest) => {
    storage.logActionAudit({
      action: action.actionTitle,
      category: action.actionCategory,
      permissionRequired: 'Explicit User Approval',
      status: 'Approved',
      details: `User explicitly approved execution of: ${action.whatWillDo}. Data used: ${action.dataUsed.join(', ')}`,
    });

    setMessages((prev) => {
      const updated = prev.map((m) => {
        if (m.pendingAction && m.pendingAction.id === action.id) {
          return {
            ...m,
            pendingAction: {
              ...m.pendingAction,
              status: 'APPROVED' as const,
            },
          };
        }
        return m;
      });
      storage.saveChatMessages(updated);
      return updated;
    });

    setPendingAction(null);
  };

  const handleRejectAction = (action: ConsequentialActionRequest) => {
    storage.logActionAudit({
      action: action.actionTitle,
      category: action.actionCategory,
      permissionRequired: 'Explicit User Approval',
      status: 'Rejected',
      details: `User declined execution of: ${action.actionTitle}`,
    });

    setMessages((prev) => {
      const updated = prev.map((m) => {
        if (m.pendingAction && m.pendingAction.id === action.id) {
          return {
            ...m,
            pendingAction: {
              ...m.pendingAction,
              status: 'REJECTED' as const,
            },
          };
        }
        return m;
      });
      storage.saveChatMessages(updated);
      return updated;
    });

    setPendingAction(null);
  };

  const handleConfirmDeleteEverything = () => {
    const res = storage.deleteAllData();
    setMessages([]);
    return res;
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen h-screen flex flex-col transition-colors duration-150 overflow-hidden ${
        isDark
          ? 'bg-[#09090b] text-zinc-100 selection:bg-zinc-800 selection:text-white'
          : 'bg-[#fafafa] text-zinc-900 selection:bg-zinc-200 selection:text-zinc-900'
      }`}
    >
      {/* Minimal Header */}
      <Header
        processingMode={processingMode}
        onToggleMode={handleToggleMode}
        onClearChat={handleClearChat}
        hasMessages={messages.length > 0}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Single Clean Chat View */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <ChatView
          messages={messages}
          onSendMessage={handleSendMessage}
          processingMode={processingMode}
          onToggleMode={handleToggleMode}
          onOpenTrustInspector={(msg) => setInspectMessage(msg)}
          onTriggerConsequentialAction={(act) => setPendingAction(act)}
          theme={theme}
        />
      </main>

      {/* Global Modals */}

      {/* Evidence Trust Inspector Modal */}
      {inspectMessage && (
        <EvidenceTrustModal
          isOpen={true}
          onClose={() => setInspectMessage(null)}
          confidence={inspectMessage.confidence || 'UNKNOWN'}
          sources={inspectMessage.sources}
          evidence={inspectMessage.evidence}
          conflictingInfo={inspectMessage.conflictingInfo}
          agreementRate={inspectMessage.sourcesAgreementRate}
          messageText={inspectMessage.text}
          theme={theme}
        />
      )}

      {/* Action Authorization Modal */}
      <ActionApprovalModal
        action={pendingAction}
        onApprove={handleApproveAction}
        onReject={handleRejectAction}
        theme={theme}
      />

      {/* Delete All Data Modal */}
      <DeleteAllDataModal
        isOpen={showDeleteAllModal}
        onClose={() => setShowDeleteAllModal(false)}
        onConfirmDelete={handleConfirmDeleteEverything}
        theme={theme}
      />
    </div>
  );
}

export default App;
