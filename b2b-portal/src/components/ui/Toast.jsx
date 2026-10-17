import React, { useEffect, useRef } from 'react';

/**
 * Toast — non-blocking, auto-dismissing status message (replaces native alert()).
 *
 * Props:
 *   message   string | null   (null/'' renders nothing)
 *   tone      'default' | 'success' | 'danger'
 *   duration  ms before auto-dismiss (default 3200)
 *   onDone()  called when the toast auto-dismisses (clear your state)
 */
const COLORS = {
  default: { fg: '#38bdf8', bd: 'rgba(56,189,248,0.35)' },
  success: { fg: '#34d399', bd: 'rgba(52,211,153,0.35)' },
  danger: { fg: '#f87171', bd: 'rgba(248,113,113,0.35)' },
};

export default function Toast({ message, tone = 'default', duration = 3200, onDone }) {
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!message) return undefined;
    const t = setTimeout(() => onDoneRef.current?.(), duration);
    return () => clearTimeout(t);
  }, [message, duration]);

  if (!message) return null;
  const c = COLORS[tone] || COLORS.default;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed', right: '1.25rem', bottom: '1.25rem', zIndex: 1300,
        display: 'flex', alignItems: 'center', gap: 8, maxWidth: 'min(360px, 90vw)',
        padding: '10px 14px', borderRadius: 10,
        background: '#0b1220', border: `1px solid ${c.bd}`, color: c.fg,
        fontSize: 13, fontWeight: 600, boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
      }}
    >
      {message}
    </div>
  );
}
