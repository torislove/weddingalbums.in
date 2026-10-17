import React from 'react';
import { t } from '../../lib/i18n';

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

/**
 * QuoteReceipt — the itemised live quote fed straight from pricing.js output.
 * Used by the Estimator right rail AND the mobile sticky bottom-sheet.
 */
export default function QuoteReceipt({ quote, lang = 'EN' }) {
  if (!quote) return null;
  const chargeLines = quote.lines.filter((l) => l.amount > 0);

  return (
    <div className="wz-receipt">
      {chargeLines.map((l) => (
        <div className="wz-receipt-line" key={l.key}>
          <span className="wz-receipt-lab">
            {l.label}
            {l.detail && <em className="wz-receipt-det">{l.detail}</em>}
          </span>
          <span className="wz-receipt-amt">{fmt(l.amount)}</span>
        </div>
      ))}

      {quote.intent === 'edit_print' && (
        <div className="wz-receipt-line incl">
          <span>{t('receipt.editing_incl', lang)}</span>
          <span>{t('cover.included', lang)}</span>
        </div>
      )}

      {quote.savings > 0 && (
        <div className="wz-receipt-line save">
          <span>👑 {t('receipt.saved', lang)} ({t('service.edit_print', lang)})</span>
          <span>−{fmt(quote.savings)}</span>
        </div>
      )}

      {(quote.warnings || []).map((w, i) => (
        <div className="wz-receipt-warn" key={`w${i}`}>⚠ {w}</div>
      ))}

      <div className="wz-receipt-total">
        <span>{t('receipt.title', lang)}</span>
        <span>{fmt(quote.total)}</span>
      </div>

      <div className="wz-receipt-meta">
        {quote.albumInScope && (
          <span className="wz-receipt-pages">
            {t('receipt.pages_note', lang, { pages: quote.pages, sheets: quote.sheets })}
          </span>
        )}
        <span className="wz-receipt-eta">
          🚚 {quote.deliveryEtaText} · {t('receipt.gst', lang)}
        </span>
      </div>
    </div>
  );
}
