import React from 'react';

/**
 * OptionCard — the standard selectable card for the B2C wizard steps.
 * Renders as a real button (role=radio inside a parent role=radiogroup)
 * with a mockup photo, colour swatch or icon, plus badge/price/meta slots.
 */
export default function OptionCard({
  selected = false,
  onClick,
  icon = null,
  title,
  sub,
  meta = null,
  badge = null,
  price = null,
  swatch = null,
  mockup = null,
  disabled = false,
  children = null,
  ariaLabel,
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={ariaLabel || title}
      disabled={disabled}
      onClick={onClick}
      className={`wz-card ${selected ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
    >
      {badge && <span className="wz-card-badge">{badge}</span>}
      <div className="wz-card-top">
        {mockup ? (
          <img src={mockup} alt="" className="wz-card-mockup" loading="lazy" />
        ) : swatch ? (
          <span className="wz-card-swatch" style={{ background: swatch }} aria-hidden="true" />
        ) : icon ? (
          <span className="wz-card-icon">{icon}</span>
        ) : null}
        <span className="wz-card-main">
          <span className="wz-card-title">{title}</span>
          {sub && <span className="wz-card-sub">{sub}</span>}
          {meta && <span className="wz-card-meta">{meta}</span>}
        </span>
        <span className={`wz-card-check ${selected ? 'on' : ''}`} aria-hidden="true">✓</span>
      </div>
      {price && <div className="wz-card-price">{price}</div>}
      {children}
    </button>
  );
}
