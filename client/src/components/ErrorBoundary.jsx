import React, { Component } from 'react';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary caught error]', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '75vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: 'var(--bg-dark, #0a0908)',
          color: '#fff',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '520px',
            background: 'rgba(24, 20, 16, 0.85)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '24px',
            padding: '40px 32px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
            backdropFilter: 'blur(20px)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.1)',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              color: 'var(--color-secondary, #D4AF37)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <AlertTriangle size={32} />
            </div>

            <div style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '2px',
              color: 'var(--color-secondary, #D4AF37)',
              marginBottom: '8px'
            }}>
              ✦ HEIRLOOM RECOVERY ✦
            </div>

            <h2 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.8rem',
              margin: '0 0 10px 0',
              fontWeight: 700
            }}>
              Momentary Interruption
            </h2>

            <p style={{
              color: '#C8C0B5',
              fontSize: '0.9rem',
              lineHeight: 1.6,
              marginBottom: '8px'
            }}>
              We couldn't render this section smoothly. Your cart and selections are safe.
            </p>

            <p style={{
              color: 'rgba(212, 175, 55, 0.85)',
              fontSize: '0.85rem',
              fontFamily: "'Noto Serif Telugu', serif",
              marginBottom: '28px'
            }}>
              ఈ పేజీని లోడ్ చేయడంలో చిన్న అంతరాయం ఏర్పడింది. దయచేసి రీలోడ్ చేయండి.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={this.handleReload}
                className="btn btn-gold-3d"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '0.9rem'
                }}
              >
                <RefreshCw size={16} />
                <span>Reload Page</span>
              </button>

              <a
                href="/"
                className="btn btn-outline"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  borderColor: 'rgba(255,255,255,0.15)'
                }}
              >
                <Home size={16} />
                <span>Return to Home</span>
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
