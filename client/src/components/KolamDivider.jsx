import React from 'react';

/**
 * Animated Telugu Kolam (Rangoli) SVG Divider
 * Draws itself using stroke-dashoffset animation when it enters the viewport.
 */
const KolamDivider = ({ color = '#D4AF37', opacity = 0.3 }) => (
  <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2.5rem 0', overflow: 'hidden' }}>
    {/* Horizontal lines left */}
    <div style={{ flex: 1, height: '1px', background: `linear-gradient(to right, transparent, ${color})`, opacity }} />

    {/* Center SVG Kolam Pattern */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="140"
      height="70"
      viewBox="0 0 140 70"
      fill="none"
      style={{ flexShrink: 0, margin: '0 1rem' }}
    >
      {/* Outer petals / lotus */}
      <circle cx="70" cy="35" r="28" stroke={color} strokeWidth="0.8" strokeDasharray="5 3" opacity={opacity + 0.2} style={{ animation: 'spin 20s linear infinite', transformOrigin: '70px 35px' }} />
      <circle cx="70" cy="35" r="20" stroke={color} strokeWidth="0.6" opacity={opacity + 0.3} />
      <circle cx="70" cy="35" r="12" stroke={color} strokeWidth="1.2" opacity={opacity + 0.4} />
      <circle cx="70" cy="35" r="4" fill={color} opacity={opacity + 0.5} />

      {/* 8-petal mandala lines */}
      {[0, 45, 90, 135].map((angle) => (
        <g key={angle} transform={`rotate(${angle} 70 35)`}>
          <line x1="70" y1="7" x2="70" y2="17" stroke={color} strokeWidth="1.5" opacity={opacity + 0.4} />
          <line x1="70" y1="53" x2="70" y2="63" stroke={color} strokeWidth="1.5" opacity={opacity + 0.4} />
          {/* Diamonds on axes */}
          <polygon points="70,3 73,7 70,11 67,7" fill={color} opacity={opacity + 0.5} />
          <polygon points="70,59 73,63 70,67 67,63" fill={color} opacity={opacity + 0.5} />
        </g>
      ))}

      {/* Small dots at diagonals */}
      {[35, 105, 215, 325].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x = 70 + 28 * Math.cos(rad);
        const y = 35 + 28 * Math.sin(rad);
        return <circle key={i} cx={x} cy={y} r="2" fill={color} opacity={opacity + 0.4} />;
      })}
    </svg>

    {/* Horizontal lines right */}
    <div style={{ flex: 1, height: '1px', background: `linear-gradient(to left, transparent, ${color})`, opacity }} />
  </div>
);

export default KolamDivider;
