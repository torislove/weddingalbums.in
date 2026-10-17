import React, { useEffect, useRef } from 'react';

/**
 * ConfirmDialog — accessible, promise-free, controlled modal used in place of
 * native window.confirm() / window.prompt().
 *
 * Props:
 *   open          boolean
 *   title         string
 *   message       string | node
 *   confirmLabel  string (default 'Confirm')
 *   cancelLabel   string (default 'Cancel')
 *   tone          'default' | 'danger' | 'success'   (drives confirm button colour)
 *   withInput     boolean  → renders a textarea; resolves the typed string
 *   inputLabel    string
 *   inputPlaceholder string
 *   busy          boolean  → disables buttons while the action runs
 *   onConfirm(value)  called with the textarea value (or undefined)
 *   onCancel()        called on Cancel / Esc / backdrop click
 */
const TONES = {
  default: { border: 'rgba(34,211,238,0.5)', bg: 'rgba(14,165,233,0.2)', fg: '#38bdf8' },
  success: { border: 'rgba(16,185,129,0.5)', bg: 'rgba(16,185,129,0.2)', fg: '#34d399' },
  danger: { border: 'rgba(239,68,68,0.5)', bg: 'rgba(239,68,68,0.2)', fg: '#f87171' },
};

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
  withInput = false,
  inputLabel = 'Reason',
  inputPlaceholder = 'Type here…',
  busy = false,
  onConfirm,
  onCancel,
}) {
  const [value, setValue] = React.useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    setValue('');
    const onKey = (e) => { if (e.key === 'Escape' && !busy) onCancel?.(); };
    window.addEventListener('keydown', onKey);
    const t = setTimeout(() => inputRef.current?.focus(), 40);
    return () => { window.removeEventListener('keydown', onKey); clearTimeout(t); };
  }, [open, busy, onCancel]);

  if (!open) return null;
  const t = TONES[tone] || TONES.default;

  return (
    <div
      onClick={() => { if (!busy) onCancel?.(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 1200, background: 'rgba(2,6,23,0.72)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.25rem',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : 'Confirmation'}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 'min(460px, 100%)', background: '#0b1220',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14,
          padding: 'clamp(1rem, 3vw, 1.5rem)', color: 'var(--paper)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        }}
      >
        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.5rem' }}>{title}</h2>
        {message && (
          <p style={{ margin: '0 0 1rem', fontSize: 13, lineHeight: 1.5, color: 'rgba(255,255,255,0.65)' }}>{message}</p>
        )}

        {withInput && (
          <label style={{ display: 'block', margin: '0 0 1rem' }}>
            <span style={{ display: 'block', fontSize: 12, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>{inputLabel}</span>
            <textarea
              ref={inputRef}
              rows={3}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={inputPlaceholder}
              style={{
                width: '100%', boxSizing: 'border-box', resize: 'vertical',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.16)',
                borderRadius: 8, padding: '10px 12px', color: 'var(--paper)', fontSize: 13, outline: 'none',
              }}
            />
          </label>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button
            type="button"
            onClick={() => onCancel?.()}
            disabled={busy}
            style={{
              padding: '8px 14px', borderRadius: 8, cursor: busy ? 'default' : 'pointer',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.16)',
              color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: 600,
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => onConfirm?.(withInput ? value.trim() : undefined)}
            disabled={busy || (withInput && !value.trim())}
            style={{
              padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700,
              cursor: busy ? 'default' : 'pointer', opacity: busy || (withInput && !value.trim()) ? 0.55 : 1,
              background: t.bg, border: `1px solid ${t.border}`, color: t.fg,
            }}
          >
            {busy ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
