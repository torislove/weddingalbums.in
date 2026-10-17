/**
 * sysadmin/src/lib/quotePreview.js — APPROXIMATE quote preview for the SysAdmin
 * package builder.
 *
 * This mirrors the client engine (client/src/lib/pricing.js · P-C1) so the owner can
 * see what a package will price at BEFORE saving. The authoritative number shown to
 * couples is always recomputed by the client engine — keep rule constants in sync.
 *
 * Marked TODO(sync): add a CI drift test that asserts quotePreview totals == priceQuote
 * totals for a fixed config matrix.
 */

const RULES = {
  BASE_SHEETS_INCLUDED: 30,
  EDITING_IN_BUNDLE: 4500,
  PRINT_ONLY_FACTOR: 0.65,
  ENGRAVE_FEE: 800,
  PARENT_BOOK_PRICE: 3200,
  PARENT_BOOK_DISCOUNT: 0.10,
};

export const quotePreview = (cfg = {}, catalog = {}) => {
  const sizes = catalog.albumSizes && catalog.albumSizes.length ? catalog.albumSizes : [];
  const sheetList = catalog.sheetStyles && catalog.sheetStyles.length ? catalog.sheetStyles : [];
  const covers = catalog.coverFinishes && catalog.coverFinishes.length ? catalog.coverFinishes : [];
  const videos = catalog.videoEditing && catalog.videoEditing.length ? catalog.videoEditing : [];

  const size = sizes.find((s) => s.id === cfg.sizeId)
    || sizes.find((s) => s.popular)
    || sizes[1]
    || sizes[0]
    || {};
  const base = Number(size.clientBasePrice) || 0;

  const pages = Math.min(120, Math.max(20, Number(cfg.pages) || 60));
  const sheetsFromPages = Math.ceil(pages / 2);

  let alloc = [];
  if (cfg.finishMode === 'mix' && cfg.mix && Object.keys(cfg.mix).length > 0) {
    alloc = Object.entries(cfg.mix)
      .filter(([, n]) => Number(n) > 0)
      .map(([id, n]) => {
        const s = sheetList.find((x) => x.id === id) || {};
        return { title: s.title || id, count: Number(n), rate: Number(s.clientPricePerSheet ?? s.pricePerSheet ?? 0) };
      });
  } else {
    const s = sheetList.find((x) => x.id === cfg.singleSheetId) || sheetList[0] || {};
    alloc = [{ title: s.title || '', count: sheetsFromPages, rate: Number(s.clientPricePerSheet ?? s.pricePerSheet ?? 0) }];
  }

  const totalSheets = alloc.reduce((sum, a) => sum + a.count, 0) || sheetsFromPages;
  const extras = Math.max(0, totalSheets - RULES.BASE_SHEETS_INCLUDED);
  const avgRate = alloc.length ? alloc.reduce((sum, a) => sum + a.rate, 0) / alloc.length : 0;
  const extraCost = Math.round(extras * avgRate);

  const coverObj = covers.find((c) => c.id === cfg.coverId);
  const coverExtra = Number(coverObj && (coverObj.extra ?? coverObj.clientExtra)) || 0;
  const engraveCost = cfg.engrave ? RULES.ENGRAVE_FEE : 0;
  const pbQty = Number(cfg.parentBooks) || 0;
  const pbGross = pbQty * RULES.PARENT_BOOK_PRICE;
  const pbCost = pbQty > 0 ? Math.round(pbGross * (pbQty >= 2 ? 1 - RULES.PARENT_BOOK_DISCOUNT : 1)) : 0;
  const videoTotal = Object.entries(cfg.videos || {}).reduce((sum, [id, qty]) => {
    const v = videos.find((x) => x.id === id);
    const price = Number(v && (v.clientPrice ?? v.price)) || 0;
    return sum + price * (Number(qty) || 0);
  }, 0);

  const lines = [
    { label: `${size.title || 'Album'} base (includes first ${RULES.BASE_SHEETS_INCLUDED} sheets)`, amount: base },
    extras > 0 && { label: `Extra pages (${extras * 2} pages / ${extras} sheets × ₹${Math.round(avgRate)})`, amount: extraCost },
    coverExtra > 0 && { label: `Cover premium — ${coverObj.label || coverObj.title}`, amount: coverExtra },
    engraveCost > 0 && { label: '24K cover engraving', amount: engraveCost },
    pbCost > 0 && { label: `Parent pocket books × ${pbQty}`, amount: pbCost },
    videoTotal > 0 && { label: 'Video services', amount: videoTotal },
  ].filter(Boolean);

  return {
    total: lines.reduce((sum, l) => sum + l.amount, 0),
    lines,
    sheets: totalSheets,
    pages,
    alloc,
    avgRate: Math.round(avgRate),
  };
};
