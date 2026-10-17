import React, { Component } from 'react';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

/**
 * ErrorBoundary — catches render errors in a subtree and shows a friendly
 * recovery screen instead of a blank page.
 * Props: label (app name shown to the user), accent (hex for the icon/CTA).
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  handleReload = () => window.location.reload();

  render() {
    const accent = this.props.accent || '#D4AF37';
    const label = this.props.label || 'This portal';

    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '2rem', background: '#050505', color: '#fff', textAlign: 'center',
        }}>
          <div style={{
            maxWidth: 480, width: '100%', background: 'rgba(20,18,16,0.9)',
            border: `1px solid ${accent}40`, borderRadius: 20,
            padding: 'clamp(1.5rem, 5vw, 2.5rem)', boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', background: `${accent}1a`,
              border: `1px solid ${accent}55`, color: accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px',
            }}>
              <AlertTriangle size={28} />
            </div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', margin: '0 0 8px' }}>
              Something went wrong
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', lineHeight: 1.6, margin: '0 0 22px' }}>
              {label} hit an unexpected error while rendering. Nothing was saved or lost — reload to continue.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 20px',
                  borderRadius: 10, border: 'none', cursor: 'pointer', fontWeight: 700,
                  fontSize: '0.9rem', background: accent, color: '#000',
                }}
              >
                <RefreshCw size={16} /> Reload
              </button>
              <a
                href="/"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8, padding: '11px 18px',
                  borderRadius: 10, textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600,
                  border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.85)',
                }}
              >
                <Home size={16} /> Go home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
