import React from 'react';

const GoldenMandala = ({ size = 120, opacity = 1, style = {}, className = '' }) => {
  const outerPetals = Array.from({ length: 16 });
  const middlePetals = Array.from({ length: 12 });
  const innerPetals = Array.from({ length: 8 });

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 200 200" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ 
        ...style, 
        opacity, 
        filter: 'drop-shadow(0 0 15px rgba(212, 175, 55, 0.8)) drop-shadow(0 0 30px rgba(212, 175, 55, 0.4))' 
      }}
      className={className}
    >
      {/* 1. Outer Decorative Rings */}
      <circle cx="100" cy="100" r="96" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="4 6" opacity="0.9" />
      <circle cx="100" cy="100" r="90" stroke="#D4AF37" strokeWidth="2" opacity="0.7" />
      <circle cx="100" cy="100" r="86" stroke="#D4AF37" strokeWidth="0.5" opacity="0.5" />
      
      {/* 2. Outer Kalamkari Scallops (16 petals) */}
      <g transform="translate(100, 100)">
        {outerPetals.map((_, i) => (
          <g key={`outer-${i}`} transform={`rotate(${i * (360 / 16)})`}>
            {/* Scallop shape */}
            <path d="M 0 -86 Q 12 -65 0 -50 Q -12 -65 0 -86" fill="rgba(212, 175, 55, 0.1)" stroke="#D4AF37" strokeWidth="1" />
            {/* Inner dot for Kalamkari aesthetic */}
            <circle cx="0" cy="-78" r="2" fill="#D4AF37" />
            {/* Separator line */}
            <line x1="0" y1="-86" x2="0" y2="-96" stroke="#D4AF37" strokeWidth="1" opacity="0.5" />
          </g>
        ))}
      </g>

      {/* 3. Traditional Telugu Geometric Stars (Muggu style) */}
      <g transform="translate(100, 100)">
        <rect x="-42" y="-42" width="84" height="84" fill="rgba(212, 175, 55, 0.05)" stroke="#D4AF37" strokeWidth="1.5" transform="rotate(0)" />
        <rect x="-42" y="-42" width="84" height="84" fill="rgba(212, 175, 55, 0.05)" stroke="#D4AF37" strokeWidth="1.5" transform="rotate(30)" />
        <rect x="-42" y="-42" width="84" height="84" fill="rgba(212, 175, 55, 0.05)" stroke="#D4AF37" strokeWidth="1.5" transform="rotate(60)" />
      </g>

      {/* 4. Middle Lotus Petals (12 petals) */}
      <g transform="translate(100, 100)">
        {middlePetals.map((_, i) => (
          <g key={`middle-${i}`} transform={`rotate(${i * (360 / 12)})`}>
            <path d="M 0 -48 C 15 -25, 8 -15, 0 0 C -8 -15, -15 -25, 0 -48" fill="rgba(212, 175, 55, 0.2)" stroke="#D4AF37" strokeWidth="1" />
          </g>
        ))}
      </g>

      {/* 5. Inner Concentric Circles */}
      <circle cx="100" cy="100" r="24" fill="#111" stroke="#D4AF37" strokeWidth="2" />
      <circle cx="100" cy="100" r="20" stroke="#D4AF37" strokeWidth="1" strokeDasharray="2 3" />
      
      {/* 6. Deep Center Star (8 petals) */}
      <g transform="translate(100, 100)">
        {innerPetals.map((_, i) => (
          <g key={`inner-${i}`} transform={`rotate(${i * (360 / 8)})`}>
            <polygon points="0,-18 4,-6 0,0 -4,-6" fill="#D4AF37" />
          </g>
        ))}
      </g>

      {/* 7. The Core */}
      <circle cx="100" cy="100" r="5" fill="#D4AF37" />
      <circle cx="100" cy="100" r="2" fill="#fff" />
    </svg>
  );
};

export default GoldenMandala;
