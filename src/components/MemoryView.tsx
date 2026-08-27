import React, { useState, useEffect } from 'react';
import { MemoryItem } from '../types';
import { storage } from '../lib/storage';
import {
  Database,
  Plus,
  Trash2,
  Edit2,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Info,
  Check,
  X,
} from 'lucide-react';

interface MemoryViewProps {
  theme?: 'light' | 'dark';
}

export const MemoryView: React.FC<MemoryViewProps> = ({ theme = 'light' }) => {
  const [isEnabled, setIsEnabled] = useState(storage.isMemoryEnabled());
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCategory, setNewCategory] = useState<MemoryItem['category']>('preference');
  const [newContent, setNewContent] = useState('');
  const [newReason, setNewReason] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const isDark = theme === 'dark';

  useEffect(() => {
    setMemories(storage.getMemories());
  }, []);

  const handleToggleMemory = (enabled: boolean) => {
    storage.setMemoryEnabled(enabled);
    setIsEnabled(enabled);
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    const reason = newReason.trim() || 'Saved because user explicitly added this preference.';
    const created = storage.addMemory(newCategory, newContent.trim(), reason);
    setMemories([created, ...memories]);
    setNewContent('');
    setNewReason('');
    setShowAddModal(false);
  };

  const handleDeleteMemory = (id: string) => {
    storage.deleteMemory(id);
    setMemories(memories.filter((m) => m.id !== id));
  };

  const handleClearAll = () => {
    storage.clearAllMemories();
    setMemories([]);
  };

  const handleSaveEdit = (id: string) => {
    const updated = memories.map((m) => {
      if (m.id === id) {
        return { ...m, content: editContent, updatedAt: Date.now() };
      }
      return m;
    });
    storage.saveMemories(updated);
    setMemories(updated);
    setEditingId(null);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
        <div>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-[10px] font-bold uppercase tracking-[0.2em] mb-1.5">
            <Database className="h-3.5 w-3.5" />
            <span>User-Controlled Memory Vault</span>
          </div>
          <h2 className={`text-3xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            Explicit Context & Preferences
          </h2>
          <p className={`text-xs mt-1.5 font-light ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Memory is strictly OFF by default. PFT never creates silent long-term profile data.
          </p>
        </div>

        {/* Global Memory Toggle */}
        <div
          className={`flex items-center gap-3 rounded-2xl border px-5 py-3 shadow-xs shrink-0 ${
            isDark
              ? 'border-zinc-800 bg-[#0c0c0e]'
              : 'border-slate-200 bg-white shadow-slate-200/50'
          }`}
        >
          <span className={`text-xs font-bold font-mono uppercase tracking-wider ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
            Memory Engine
          </span>
          <button
            id="pft-toggle-memory-btn"
            onClick={() => handleToggleMemory(!isEnabled)}
            className="flex items-center focus:outline-none"
          >
            {isEnabled ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                <ToggleRight className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                <span>ON</span>
              </div>
            ) : (
              <div className={`flex items-center gap-1.5 text-xs font-mono font-bold ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
                <ToggleLeft className="h-6 w-6" />
                <span>OFF (Default)</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Trust Notice */}
      <div
        className={`rounded-2xl border p-5 text-xs flex items-start gap-3.5 shadow-xs ${
          isDark
            ? 'border-zinc-800 bg-[#0c0c0e] text-zinc-300'
            : 'border-slate-200 bg-white text-zinc-700 shadow-slate-200/50'
        }`}
      >
        <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className={`font-bold uppercase tracking-wider font-mono text-xs ${isDark ? 'text-white' : 'text-zinc-900'}`}>
            Zero Silent Profiling Guarantee
          </p>
          <p className={`font-light leading-relaxed ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
            Every item remembered is explicitly listed below with the exact reason it was stored. You can view, edit, or delete any item at any time, or purge all memories with a single click.
          </p>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between">
        <button
          id="pft-btn-add-memory"
          onClick={() => setShowAddModal(true)}
          className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all shadow-xs ${
            isDark
              ? 'bg-white text-zinc-900 hover:bg-zinc-200'
              : 'bg-zinc-900 text-white hover:bg-zinc-800'
          }`}
        >
          <Plus className="h-4 w-4" />
          <span>Add Explicit Memory</span>
        </button>

        {memories.length > 0 && (
          <button
            onClick={handleClearAll}
            className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              isDark
                ? 'border-red-500/20 bg-red-950/20 text-red-400 hover:bg-red-900/30'
                : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'
            }`}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete All Memories ({memories.length})</span>
          </button>
        )}
      </div>

      {/* Memories List */}
      <div className="space-y-3">
        {memories.length === 0 ? (
          <div
            className={`rounded-2xl border p-10 text-center space-y-2 ${
              isDark ? 'border-zinc-800 bg-[#0c0c0e]' : 'border-slate-200 bg-white shadow-xs'
            }`}
          >
            <Database className={`mx-auto h-8 w-8 ${isDark ? 'text-zinc-600' : 'text-zinc-400'}`} />
            <h4 className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
              No Memories Stored
            </h4>
            <p className={`text-xs max-w-sm mx-auto font-light ${isDark ? 'text-zinc-500' : 'text-zinc-500'}`}>
              {isEnabled
                ? 'Memory is active, but you have not explicitly saved any preference yet.'
                : 'Memory is currently turned OFF. PFT operates completely statelessly.'}
            </p>
          </div>
        ) : (
          memories.map((mem) => (
            <div
              key={mem.id}
              className={`rounded-2xl border p-5 shadow-xs space-y-3 text-xs ${
                isDark
                  ? 'border-zinc-800 bg-[#0c0c0e]'
                  : 'border-slate-200 bg-white shadow-slate-200/50'
              }`}
            >
              <div className={`flex items-center justify-between border-b pb-2.5 ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
                <span
                  className={`rounded px-2 py-0.5 font-mono text-[10px] uppercase font-bold border ${
                    isDark
                      ? 'bg-black text-emerald-400 border-zinc-800'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {mem.category}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingId(mem.id);
                      setEditContent(mem.content);
                    }}
                    className={`p-1 transition-colors ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'}`}
                    title="Edit"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteMemory(mem.id)}
                    className="p-1 text-zinc-400 hover:text-red-500 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {editingId === mem.id ? (
                <div className="space-y-2 pt-1">
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className={`w-full rounded-xl border px-3.5 py-2 text-xs font-light transition-all focus:outline-none ${
                      isDark
                        ? 'border-zinc-800 bg-black text-white focus:border-zinc-500'
                        : 'border-slate-200 bg-slate-50 text-zinc-900 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100'
                    }`}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className={`px-3 py-1.5 text-xs transition-colors ${
                        isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-500 hover:text-zinc-900'
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveEdit(mem.id)}
                      className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all shadow-xs ${
                        isDark
                          ? 'bg-white text-zinc-900 hover:bg-zinc-200'
                          : 'bg-zinc-900 text-white hover:bg-zinc-800'
                      }`}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className={`leading-relaxed font-light text-sm ${isDark ? 'text-zinc-200' : 'text-zinc-800'}`}>
                    <strong className={`font-medium ${isDark ? 'text-white' : 'text-zinc-900'}`}>What PFT Remembers:</strong>{' '}
                    {mem.content}
                  </div>
                  <div className={`text-[11px] italic font-light ${isDark ? 'text-zinc-400' : 'text-zinc-500'}`}>
                    <strong className={`not-italic font-mono ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>Reason Saved:</strong>{' '}
                    {mem.savedReason}
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs animate-in fade-in">
          <div
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-5 text-xs ${
              isDark ? 'border-zinc-800 bg-[#0c0c0e] text-white' : 'border-slate-200 bg-white text-zinc-900'
            }`}
          >
            <div className={`flex items-center justify-between border-b pb-3 ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
              <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-zinc-900'}`}>
                Add Explicit User Memory
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className={`transition-colors ${isDark ? 'text-zinc-400 hover:text-white' : 'text-zinc-400 hover:text-zinc-700'}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleAddMemory} className="space-y-4">
              <div>
                <label
                  className={`text-[10px] font-mono font-bold uppercase tracking-wider block mb-1.5 ${
                    isDark ? 'text-zinc-400' : 'text-zinc-600'
                  }`}
                >
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) =>
                    setNewCategory(e.target.value as MemoryItem['category'])
                  }
                  className={`w-full rounded-xl border p-3 text-xs transition-all focus:outline-none ${
                    isDark
                      ? 'border-zinc-800 bg-black text-white focus:border-zinc-500'
                      : 'border-slate-200 bg-slate-50 text-zinc-900 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100'
                  }`}
                >
                  <option value="preference">Response Preference (e.g. Concise formatting)</option>
                  <option value="instruction">System Instruction (e.g. Always include citations)</option>
                  <option value="context">Background Context (e.g. Senior Backend Engineer)</option>
                </select>
              </div>

              <div>
                <label
                  className={`text-[10px] font-mono font-bold uppercase tracking-wider block mb-1.5 ${
                    isDark ? 'text-zinc-400' : 'text-zinc-600'
                  }`}
                >
                  What should PFT remember?
                </label>
                <input
                  type="text"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="e.g. Prefer concise answers with TypeScript code examples."
                  className={`w-full rounded-xl border p-3 text-xs font-light transition-all focus:outline-none ${
                    isDark
                      ? 'border-zinc-800 bg-black text-white placeholder-zinc-600 focus:border-zinc-500'
                      : 'border-slate-200 bg-slate-50 text-zinc-900 placeholder-zinc-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100'
                  }`}
                  required
                />
              </div>

              <div>
                <label
                  className={`text-[10px] font-mono font-bold uppercase tracking-wider block mb-1.5 ${
                    isDark ? 'text-zinc-400' : 'text-zinc-600'
                  }`}
                >
                  Why is this being saved? (Transparency label)
                </label>
                <input
                  type="text"
                  value={newReason}
                  onChange={(e) => setNewReason(e.target.value)}
                  placeholder="e.g. Explicitly configured by user in memory center."
                  className={`w-full rounded-xl border p-3 text-xs font-light transition-all focus:outline-none ${
                    isDark
                      ? 'border-zinc-800 bg-black text-white placeholder-zinc-600 focus:border-zinc-500'
                      : 'border-slate-200 bg-slate-50 text-zinc-900 placeholder-zinc-400 focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-100'
                  }`}
                />
              </div>

              <div className={`flex justify-end gap-3 pt-3 border-t ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                    isDark
                      ? 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:text-white'
                      : 'border-slate-200 bg-slate-50 text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all shadow-xs ${
                    isDark
                      ? 'bg-white text-zinc-900 hover:bg-zinc-200'
                      : 'bg-zinc-900 text-white hover:bg-zinc-800'
                  }`}
                >
                  Save Explicit Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
