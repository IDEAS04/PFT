import {
  Conversation,
  MemoryItem,
  OutboundNetworkLog,
  ActionAuditItem,
  PermissionSettings,
} from '../types';

const STORAGE_KEYS = {
  CONVERSATIONS: 'pft_local_conversations_v1',
  ACTIVE_CONV_ID: 'pft_active_conv_id_v1',
  MEMORIES: 'pft_user_memories_v1',
  MEMORY_ENABLED: 'pft_memory_enabled_v1',
  NETWORK_LOGS: 'pft_network_logs_v1',
  ACTION_AUDIT: 'pft_action_audit_v1',
  PERMISSIONS: 'pft_permissions_v1',
  LOCAL_MODE: 'pft_processing_mode_v1',
  THEME: 'pft_theme_mode_v1',
  CHAT_MESSAGES: 'pft_chat_messages_v1',
};

export const defaultPermissions: PermissionSettings = {
  readDocuments: true,
  useLocation: false,
  accessContacts: false,
  sendMessage: false,
  bookAppointment: false,
  makePurchase: false,
  modifyAccount: false,
  transferMoneyAlwaysAsk: true,
};

export const storage = {
  // Conversations (Local Only)
  getConversations(): Conversation[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveConversations(convs: Conversation[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(convs));
    } catch (e) {
      console.warn('Local storage write failed', e);
    }
  },

  getActiveConversationId(): string | null {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_CONV_ID);
  },

  setActiveConversationId(id: string | null) {
    if (id) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_CONV_ID, id);
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_CONV_ID);
    }
  },

  // Memories (User controlled, OFF by default)
  isMemoryEnabled(): boolean {
    return localStorage.getItem(STORAGE_KEYS.MEMORY_ENABLED) === 'true';
  },

  setMemoryEnabled(enabled: boolean) {
    localStorage.setItem(STORAGE_KEYS.MEMORY_ENABLED, enabled ? 'true' : 'false');
  },

  getMemories(): MemoryItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMORIES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveMemories(memories: MemoryItem[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(memories));
    } catch (e) {
      console.warn('Memory storage write failed', e);
    }
  },

  addMemory(category: MemoryItem['category'], content: string, savedReason: string): MemoryItem {
    const memories = storage.getMemories();
    const newMem: MemoryItem = {
      id: `mem-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      category,
      content,
      savedReason,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    memories.unshift(newMem);
    storage.saveMemories(memories);
    return newMem;
  },

  deleteMemory(id: string) {
    const memories = storage.getMemories().filter(m => m.id !== id);
    storage.saveMemories(memories);
  },

  clearAllMemories() {
    storage.saveMemories([]);
  },

  // Outbound Network Telemetry ("What Left This Device?")
  getNetworkLogs(): OutboundNetworkLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NETWORK_LOGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  logOutboundRequest(log: Omit<OutboundNetworkLog, 'id' | 'timestamp'>): OutboundNetworkLog {
    const current = storage.getNetworkLogs();
    const newLog: OutboundNetworkLog = {
      ...log,
      id: `net-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
    };
    // Keep last 100 entries locally
    const updated = [newLog, ...current].slice(0, 100);
    try {
      localStorage.setItem(STORAGE_KEYS.NETWORK_LOGS, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return newLog;
  },

  clearNetworkLogs() {
    try {
      localStorage.removeItem(STORAGE_KEYS.NETWORK_LOGS);
    } catch {
      // ignore
    }
  },

  // Action Audit
  getActionAudit(): ActionAuditItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACTION_AUDIT);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  logActionAudit(item: Omit<ActionAuditItem, 'id' | 'timestamp'>): ActionAuditItem {
    const current = storage.getActionAudit();
    const newItem: ActionAuditItem = {
      ...item,
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: Date.now(),
    };
    const updated = [newItem, ...current].slice(0, 100);
    try {
      localStorage.setItem(STORAGE_KEYS.ACTION_AUDIT, JSON.stringify(updated));
    } catch {
      // ignore
    }
    return newItem;
  },

  deleteActionAudit(id: string) {
    const filtered = storage.getActionAudit().filter(a => a.id !== id);
    try {
      localStorage.setItem(STORAGE_KEYS.ACTION_AUDIT, JSON.stringify(filtered));
    } catch {
      // ignore
    }
  },

  clearActionAudit() {
    try {
      localStorage.removeItem(STORAGE_KEYS.ACTION_AUDIT);
    } catch {
      // ignore
    }
  },

  // Permissions
  getPermissions(): PermissionSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PERMISSIONS);
      return data ? { ...defaultPermissions, ...JSON.parse(data) } : defaultPermissions;
    } catch {
      return defaultPermissions;
    }
  },

  savePermissions(perms: PermissionSettings) {
    try {
      localStorage.setItem(STORAGE_KEYS.PERMISSIONS, JSON.stringify(perms));
    } catch {
      // ignore
    }
  },

  // Processing Mode ('local' | 'cloud')
  getProcessingMode(): 'local' | 'cloud' {
    try {
      return (localStorage.getItem(STORAGE_KEYS.LOCAL_MODE) as 'local' | 'cloud') || 'cloud';
    } catch {
      return 'cloud';
    }
  },

  setProcessingMode(mode: 'local' | 'cloud') {
    try {
      localStorage.setItem(STORAGE_KEYS.LOCAL_MODE, mode);
    } catch {
      // ignore
    }
  },

  getPreferredMode(): 'local' | 'cloud' {
    return storage.getProcessingMode();
  },

  setPreferredMode(mode: 'local' | 'cloud') {
    storage.setProcessingMode(mode);
  },

  getTheme(): 'light' | 'dark' {
    try {
      return (localStorage.getItem(STORAGE_KEYS.THEME) as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  },

  setTheme(theme: 'light' | 'dark') {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {
      // ignore
    }
  },

  getOutboundLogs(): OutboundNetworkLog[] {
    return storage.getNetworkLogs();
  },

  clearOutboundLogs() {
    storage.clearNetworkLogs();
  },

  getActionAuditLogs(): ActionAuditItem[] {
    return storage.getActionAudit();
  },

  deleteAllData() {
    return storage.deleteAllLocalData();
  },

  // Active chat messages helper
  getChatMessages(): import('../types').Message[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
      if (!data) return [];
      const parsed: import('../types').Message[] = JSON.parse(data);
      const seenIds = new Set<string>();
      const sanitized = parsed.map((msg, index) => {
        let msgId = msg.id;
        if (!msgId || seenIds.has(msgId)) {
          msgId = `${msg.sender || 'msg'}-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 8)}`;
        }
        seenIds.add(msgId);
        return { ...msg, id: msgId };
      });
      return sanitized;
    } catch {
      return [];
    }
  },

  saveChatMessages(messages: import('../types').Message[]) {
    try {
      localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
    } catch (e) {
      console.warn('Chat messages storage write failed', e);
    }
  },

  // COMPLETE PURGE
  deleteAllLocalData(): {
    conversationsDeleted: number;
    memoriesDeleted: number;
    networkLogsDeleted: number;
    auditItemsDeleted: number;
  } {
    const convCount = storage.getConversations().length;
    const memCount = storage.getMemories().length;
    const netCount = storage.getNetworkLogs().length;
    const auditCount = storage.getActionAudit().length;

    Object.values(STORAGE_KEYS).forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch {
        // ignore
      }
    });

    return {
      conversationsDeleted: convCount,
      memoriesDeleted: memCount,
      networkLogsDeleted: netCount,
      auditItemsDeleted: auditCount,
    };
  },
};
