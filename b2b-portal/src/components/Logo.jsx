import React from 'react';

const Logo = ({ size = 40, showText = true }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="14" stroke="url(#goldGradient)" strokeWidth="1.5" />
        <circle cx="16" cy="16" r="10" stroke="url(#goldGradient)" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="16" cy="16" r="4" fill="url(#goldGradient)" />
        {[0,60,120,180,240,300].map((a,i)=>{
          const r = (a * Math.PI) / 180;
          const x1 = 16 + 8 * Math.cos(r);
          const y1 = 16 + 8 * Math.sin(r);
          const x2 = 16 + 13 * Math.cos(r + Math.PI/6);
          const y2 = 16 + 13 * Math.sin(r + Math.PI/6);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#goldGradient)" strokeWidth="1" opacity="0.8" />;
        })}
        <defs>
          <linearGradient id="goldGradient" x1="0" y1="0" x2="32" y2="32">
            <stop offset="0%" stopColor="#bf953f" />
            <stop offset="50%" stopColor="#fcf6ba" />
            <stop offset="100%" stopColor="#aa771c" />
          </linearGradient>
        </defs>
      </svg>
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontWeight: 700, 
            fontSize: size * 0.45,
            background: 'linear-gradient(to right, #bf953f, #fcf6ba, #b38728, #fbf5b7, #aa771c)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '1px'
          }}>
            weddingalbums.in
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
