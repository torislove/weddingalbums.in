/**
 * CatalogHints — extracted from PricingEngine.jsx (UX-3) to keep that file navigable.
 * CMS-first pricing hints for the services and sizes/sheets tabs.
 */
import React from 'react';
import { matchCount } from '../../lib/catalogMatch';

export default function CatalogHints({ activeTab, albumSizes, sheets, services, contentCat }) {
  return (
    <>
      {(activeTab === 'sizes' || activeTab === 'sheets') && (
        <div className="text-xs text-[var(--brand)]/80 mb-6 -mt-4">
          <p className="m-0">
            🧮 <b className="text-[var(--brand)]">Customer prices here feed the live estimator</b> — but the
            <b className="text-[var(--brand)]"> CMS Studio catalog wins</b>: a size/sheet is priced by your CMS
            Studio value, and these builder rows only <b className="text-[var(--brand)]">fill the ones you left blank</b>.
            Prices are for the sheets only; covers/videos are separate panels or <span className="text-gray-300">Pre-Bundled Packages</span>.
          </p>
          {(() => {
            const c = matchCount(activeTab === 'sizes' ? albumSizes : sheets, contentCat, activeTab);
            return (
              <p className="m-0 mt-1 text-gray-300">
                ✓ <b className="text-green-400">{c.live} of {c.total}</b> rows fill a blank CMS price
                {c.cmsWins > 0 && <> · <b className="text-amber-400">{c.cmsWins}</b> eclipsed by a CMS Studio price</>}
                {c.unmatched > 0 && <> · <b className="text-gray-400">{c.unmatched}</b> with no CMS match</>}.
              </p>
            );
          })()}
        </div>
      )}

      {activeTab === 'services' && (
        <div className="text-xs text-[var(--brand)]/80 mb-6 -mt-4">
          <p className="m-0">
            🎬 <b className="text-[var(--brand)]">Video editing, cover and flex prices here feed the couple estimator</b>
            {' '}(and therefore package totals). The <b className="text-[var(--brand)]">CMS Studio catalog wins</b> —
            these rows only price items you have left blank in CMS Studio.
          </p>
          {(() => {
            const c = matchCount(services, contentCat, 'services');
            return (
              <p className="m-0 mt-1 text-gray-300">
                ✓ <b className="text-green-400">{c.live} of {c.total}</b> rows fill a blank CMS price
                {c.cmsWins > 0 && <> · <b className="text-amber-400">{c.cmsWins}</b> eclipsed by a CMS Studio price</>}
                {c.unmatched > 0 && <> · <b className="text-gray-400">{c.unmatched}</b> with no CMS match</>}.
              </p>
            );
          })()}
        </div>
      )}
    </>
  );
}
