import React from 'react';

/**
 * Floating Flower Petal SVG decoration.
 * Place anywhere to add ambient marigold / jasmine atmosphere.
 */
const FlowerPetal = ({ size = 60, style = {}, color = '#D4AF37', delay = 0 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 100 100"
    style={{
      position: 'absolute',
      opacity: 0.15,
      animation: `float ${6 + delay * 2}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
      pointerEvents: 'none',
      ...style
    }}
  >
    {/* 8-petal flower */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
      const rad = (angle * Math.PI) / 180;
      const cx = 50 + 22 * Math.cos(rad);
      const cy = 50 + 22 * Math.sin(rad);
      return (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx="12"
          ry="7"
          transform={`rotate(${angle} ${cx} ${cy})`}
          fill={color}
          opacity="0.7"
        />
      );
    })}
    {/* Center */}
    <circle cx="50" cy="50" r="8" fill={color} />
    <circle cx="50" cy="50" r="4" fill="#fff" opacity="0.5" />
  </svg>
);

export default FlowerPetal;
