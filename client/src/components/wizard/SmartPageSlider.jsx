import React from 'react';
import { pagesToSheets } from '../../lib/pricing';

/**
 * SmartPageSlider — the headline PAGES control (pages primary, sheets secondary).
 * Range snaps to even page counts; tick buttons jump to common album lengths.
 */
export default function SmartPageSlider({
  pages,
  onChange,
  min = 20,
  max = 120,
  step = 2,
  label,
  help,
}) {
  const sheets = pagesToSheets(pages);
  const clamped = Math.max(min, Math.min(max, Number(pages) || 60));
  const ticks = [20, 40, 60, 80, 100, 120].filter((n) => n >= min && n <= max);

  return (
    <div className="wz-pageslider">
      <div className="wz-pageslider-head">
        <span className="wz-pageslider-value">
          <strong>{clamped}</strong> pages
          <span className="wz-pageslider-eq">= {sheets} sheets</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={clamped}
        onChange={(e) => onChange(Number(e.target.value))}
        className="wz-range"
        aria-label={label || 'Album pages'}
      />
      <div className="wz-range-ticks">
        {ticks.map((n) => (
          <button
            key={n}
            type="button"
            className={`wz-tick ${clamped === n ? 'now' : clamped > n ? 'past' : ''}`}
            onClick={() => onChange(n)}
          >
            {n}
          </button>
        ))}
      </div>
      {help && <div className="wz-range-help">{help}</div>}
    </div>
  );
}
