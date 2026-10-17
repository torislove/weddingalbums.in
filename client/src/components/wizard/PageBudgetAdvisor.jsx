import React from 'react';
import { recommendPages } from '../../lib/pricing';

/**
 * PageBudgetAdvisor — "How many photos will you share?" stepper + quick chips
 * with a one-tap recommendation that feeds SmartPageSlider.
 */
export default function PageBudgetAdvisor({ photos, onPhotos, onApply }) {
  const rec = recommendPages(photos);
  const chips = [200, 400, 600, 800, 1000];
  const set = (v) => onPhotos(Math.max(0, Math.min(20000, Number(v) || 0)));

  return (
    <div className="wz-advisor">
      <div className="wz-advisor-q">📸 How many photos will you share?</div>
      <div className="wz-advisor-row">
        <div className="wz-stepper" role="group" aria-label="Photo count">
          <button type="button" onClick={() => set((Number(photos) || 0) - 50)} aria-label="Fewer photos">−</button>
          <input
            inputMode="numeric"
            className="wz-stepper-val"
            value={photos || ''}
            placeholder="e.g. 400"
            onChange={(e) => set(String(e.target.value).replace(/\D/g, ''))}
          />
          <button type="button" onClick={() => set((Number(photos) || 0) + 50)} aria-label="More photos">+</button>
        </div>
        <div className="wz-advisor-chips">
          {chips.map((c) => (
            <button key={c} type="button" className={`wz-chip ${Number(photos) === c ? 'on' : ''}`} onClick={() => set(c)}>
              {c}+
            </button>
          ))}
        </div>
      </div>
      {rec && Number(photos) > 0 && (
        <div className="wz-advisor-rec">
          <span>
            <strong>{photos} photos</strong> fits best in <strong>{rec} pages</strong>
          </span>
          {onApply && (
            <button type="button" className="wz-chip gold" onClick={() => onApply(rec)}>
              Use {rec} pages
            </button>
          )}
        </div>
      )}
    </div>
  );
}
