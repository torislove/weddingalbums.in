import React, { useState, useEffect, useCallback } from 'react';
import { History as HistoryIcon, RotateCcw, RefreshCw, Clock, User } from 'lucide-react';
import { API } from '../apiConfig';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import Toast from '../components/Toast';

const getToken = () => localStorage.getItem('uiadminToken') || localStorage.getItem('adminToken');

// Authed fetch with one-shot 401 refresh-retry (matches App.jsx refreshToken flow)
const callApi = async (path, options = {}, retried = false) => {
  const token = getToken();
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...options, headers, credentials: 'include' });
  if (res.status === 401 && !retried) {
    try {
      const r = await fetch(`${API}/api/auth/refresh`, { method: 'POST', credentials: 'include' });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d?.token) {
        localStorage.setItem('uiadminToken', d.token);
        return callApi(path, options, true);
      }
    } catch { /* fallthrough to session-expired */ }
    throw new Error('Session expired — re-login');
  }
  return res;
};

const rowId = (r) => String(r?.id ?? r?.version ?? '');
const rowLabel = (r) => rowId(r) || 'selected version';

const tsOf = (r) => {
  const t = r?.savedAt ?? r?.saved_at ?? r?.timestamp;
  const ms = t ? Date.parse(t) : NaN;
  return Number.isNaN(ms) ? 0 : ms;
};

const dateOf = (r) => {
  const t = r?.savedAt ?? r?.saved_at ?? r?.timestamp;
  if (!t) return 'Unknown time';
  const d = new Date(t);
  return Number.isNaN(d.getTime()) ? 'Unknown time' : d.toLocaleString();
};

const editorOf = (r) => {
  const e = r?.editor ?? r?.savedBy ?? r?.editedBy ?? r?.by ?? r?.user;
  if (typeof e === 'string') return e;
  if (e && typeof e === 'object') return e.name || e.username || e.email || null;
  return null;
};

const History = () => {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [restoringId, setRestoringId] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const [confirmRow, setConfirmRow] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await callApi('/api/content/history');
      if (!res.ok) {
        throw new Error(`Failed to load publish history (HTTP ${res.status})`);
      }
      const d = await res.json();
      const list = Array.isArray(d?.versions) ? d.versions : Array.isArray(d) ? d : [];
      const sorted = list.slice().sort((a, b) => tsOf(b) - tsOf(a));
      setVersions(sorted.slice(0, 20));
    } catch (err) {
      console.error('Failed to fetch content history:', err);
      setErrorMsg(err.message || 'Could not load publish history');
      setVersions([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  const handleRestore = (row) => setConfirmRow(row);

  const runRestore = async () => {
    const row = confirmRow;
    if (!row) return;
    setConfirmRow(null);
    setRestoringId(rowId(row));
    setErrorMsg(null);
    try {
      const res = await callApi('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(row?.data ?? {}),
      });
      if (!res.ok) {
        let msg = `Restore failed (HTTP ${res.status})`;
        try { const err = await res.json(); if (err?.error) msg = err.error; } catch { /* ignore */ }
        throw new Error(msg);
      }
      setToastMsg('Version restored and published');
      setTimeout(() => window.location.reload(), 1200);
    } catch (err) {
      console.error('Restore failed:', err);
      setErrorMsg(err.message || 'Restore failed');
      setRestoringId(null);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto pb-32 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--brand)] to-[#996515] flex items-center justify-center shadow-lg shadow-yellow-900/20">
            <HistoryIcon size={24} className="text-black" />
          </div>
          <div>
            <h2 className="text-3xl font-serif text-white">Publish History</h2>
            <p className="text-sm text-gray-400 mt-1">Latest {versions.length || 20} published versions — restore any snapshot to the live site</p>
          </div>
        </div>

        <button
          onClick={fetchHistory}
          aria-label="Refresh history"
          title="Refresh"
          disabled={loading || !!restoringId}
          className="p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-all disabled:opacity-50"
          title="Refresh history"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      <Toast message={toastMsg ? `✓ ${toastMsg}` : null} type="success" onClose={() => setToastMsg(null)} />

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => { setErrorMsg(null); fetchHistory(); }} className="text-red-400 hover:text-white font-bold ml-4">✕</button>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-gray-400">
          <div className="w-10 h-10 border-4 border-white/10 border-t-[var(--brand)] rounded-full animate-spin mb-4"></div>
          <p className="text-sm">Loading publish history...</p>
        </div>
      ) : versions.length === 0 ? (
        /* Empty */
        <div className="text-center p-16 border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
          <HistoryIcon size={48} className="text-gray-600 mx-auto mb-4" />
          <h3 className="text-white font-medium mb-2">No Versions Found</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            Publish a change from any editor page and it will appear here as a restorable snapshot.
          </p>
        </div>
      ) : (
        /* Rows (newest first) */
        <div className="space-y-3">
          {versions.map((row, i) => {
            const id = rowId(row);
            const editor = editorOf(row);
            const size = JSON.stringify(row?.data ?? {}).length;
            const isRestoring = !!restoringId && restoringId === id;
            return (
              <div
                key={id || i}
                className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-[var(--brand)]/50 transition-all shadow-md"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Clock size={16} className="text-[var(--brand)] flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-white font-semibold">{dateOf(row)}</span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-black/40 border border-white/10 text-[var(--brand)] truncate max-w-[220px]" title={id}>
                        #{id || 'unknown'}
                      </span>
                      {row?.key && (
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-400">
                          {String(row.key)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-gray-500">
                      <span>~{size.toLocaleString()} chars</span>
                      {editor && (
                        <span className="flex items-center gap-1 text-gray-400">
                          <User size={11} /> {String(editor)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleRestore(row)}
                  disabled={!!restoringId}
                  className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${
                    isRestoring
                      ? 'bg-[var(--brand)]/40 text-black cursor-wait'
                      : 'bg-[var(--brand)] hover:bg-[#e6c55a] text-black disabled:opacity-40'
                  }`}
                  title="Restore this snapshot to the live site"
                >
                  {isRestoring ? (
                    <span className="w-3 h-3 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <RotateCcw size={13} />
                  )}
                  {isRestoring ? 'Restoring…' : 'Restore'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmRow}
        tone="danger"
        title={`Restore version ${confirmRow ? rowLabel(confirmRow) : ''}?`}
        message="The current published content will be overwritten and this snapshot goes live immediately. This cannot be undone."
        confirmLabel="Restore & publish"
        busy={!!restoringId}
        onConfirm={runRestore}
        onCancel={() => setConfirmRow(null)}
      />
    </div>
  );
};

export default History;
