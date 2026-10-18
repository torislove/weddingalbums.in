import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logo = ({ 
  size = 38, 
  showText = true, 
  portalTag = '', 
  className = '', 
  href = '/', 
  to,
  onClick,
  style = {} 
}) => {
  let navigate = null;
  try {
    navigate = useNavigate();
  } catch {
    navigate = null;
  }

  const destination = to || href || '/';

  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented) {
      if (navigate && destination) {
        navigate(destination);
      } else if (destination) {
        window.location.href = destination;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div 
      className={`brand-logo-wrap ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { handleClick(e); } }}
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '11px', 
        textDecoration: 'none',
        userSelect: 'none',
        flexShrink: 0,
        cursor: 'pointer',
        ...style
      }}
    >
      {/* Animated Gold Aperture Emblem */}
      <div 
        className="brand-logo-icon"
        style={{
          width: size,
          height: size,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <svg 
          width={size} 
          height={size} 
          viewBox="0 0 36 36" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="brand-logo-svg"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="weddingGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="25%" stopColor="#FFF2A3" />
              <stop offset="50%" stopColor="#AA7C11" />
              <stop offset="75%" stopColor="#F9E274" />
              <stop offset="100%" stopColor="#996515" />
            </linearGradient>
            <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#D4AF37" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Solid Outer Gold Ring */}
          <circle 
            cx="18" 
            cy="18" 
            r="16" 
            stroke="url(#weddingGoldGrad)" 
            strokeWidth="1.5" 
            filter="url(#goldGlow)"
          />

          {/* Smooth Continuously Rotating Concentric Dashed Ring */}
          <circle 
            cx="18" 
            cy="18" 
            r="12" 
            stroke="url(#weddingGoldGrad)" 
            strokeWidth="1.2" 
            strokeDasharray="4 4" 
            className="brand-logo-spin-slow"
            style={{ transformOrigin: '18px 18px' }}
          />

          {/* 6 Precision Golden Camera Aperture Blades */}
          <g className="brand-logo-aperture" style={{ transformOrigin: '18px 18px' }}>
            {[0, 60, 120, 180, 240, 300].map((deg, i) => {
              const rad = (deg * Math.PI) / 180;
              const x1 = 18 + 7 * Math.cos(rad);
              const y1 = 18 + 7 * Math.sin(rad);
              const x2 = 18 + 14 * Math.cos(rad + Math.PI / 4.5);
              const y2 = 18 + 14 * Math.sin(rad + Math.PI / 4.5);
              return (
                <line 
                  key={i} 
                  x1={x1} 
                  y1={y1} 
                  x2={x2} 
                  y2={y2} 
                  stroke="url(#weddingGoldGrad)" 
                  strokeWidth="1.2" 
                  opacity="0.85" 
                />
              );
            })}
          </g>

          {/* Pulsating Pure Gold Center Jewel */}
          <circle 
            cx="18" 
            cy="18" 
            r="4" 
            fill="url(#weddingGoldGrad)" 
            className="brand-logo-pulse-center"
            style={{ transformOrigin: '18px 18px' }}
          />
        </svg>
      </div>

      {/* Brand Typography with Liquid Metallic Flow */}
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', lineHeight: 1 }}>
          <span 
            className="brand-logo-text"
            style={{ 
              fontFamily: "'Playfair Display', Georgia, serif", 
              fontWeight: 800, 
              fontSize: `${Math.round(size * 0.44)}px`,
              background: 'linear-gradient(90deg, #bf953f 0%, #fcf6ba 25%, #b38728 50%, #fbf5b7 75%, #aa771c 100%)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.2px',
              display: 'inline-block',
              animation: 'brandGoldShimmer 5s linear infinite'
            }}
          >
            weddingalbums.in
          </span>
          {portalTag && (
            <span 
              className="brand-logo-tag"
              style={{
                fontSize: '8.5px',
                fontWeight: 700,
                letterSpacing: '1.8px',
                color: 'var(--brand, #0ea5e9)',
                opacity: 0.75,
                textTransform: 'uppercase',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                marginTop: '3px'
              }}
            >
              {portalTag}
            </span>
          )}
        </div>
      )}

      {/* Embedded High-Performance Animations */}
      <style>{`
        @keyframes brandLogoSpinSlow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes brandGoldShimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        @keyframes brandLogoPulseCenter {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.18); opacity: 1; }
        }
        .brand-logo-spin-slow {
          animation: brandLogoSpinSlow 16s linear infinite;
        }
        .brand-logo-pulse-center {
          animation: brandLogoPulseCenter 2.8s ease-in-out infinite;
        }
        .brand-logo-wrap {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), filter 0.25s ease;
        }
        .brand-logo-wrap:hover {
          transform: translateY(-1px) scale(1.02);
          filter: drop-shadow(0 2px 8px rgba(212, 175, 55, 0.3));
        }
        .brand-logo-wrap:hover .brand-logo-spin-slow {
          animation-duration: 4s;
        }
        .brand-logo-wrap:hover .brand-logo-aperture {
          transform: rotate(30deg);
          transition: transform 0.4s ease;
        }
      `}</style>
    </div>
  );
};

export default React.memo(Logo);
