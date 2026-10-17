/**
 * EstimatorBuilder — extracted from PricingEngine.jsx (UX-3) to keep that file navigable.
 * Estimator product builder — price by sheets, one-tap apply, live engine preview.
 */
import React from 'react';
import { quotePreview } from '../../lib/quotePreview.js';

export default function EstimatorBuilder({ formData, setFormData, contentCat }) {
  return (
                  <div className="rounded-xl border border-[var(--brand)]/30 bg-[var(--brand)]/5 p-4 space-y-4">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <label className="text-sm font-bold text-[var(--brand)]">🧮 Estimator Product Builder (price by sheets)</label>
                      <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={!!(formData.apply && (formData.apply.sizeId || formData.apply.mix))}
                          onChange={e => setFormData({ ...formData, apply: e.target.checked ? { intent: 'edit_print', sizeId: 'size-12x36', pages: 60, finishMode: 'mix', mix: {}, coverId: 'leatherette-box', engrave: false, parentBooks: 0, videos: {} } : null })}
                          className="w-5 h-5 rounded accent-[var(--brand)]"
                        />
                        Wire to Client Estimator (one-tap apply)
                      </label>
                    </div>

                    {formData.apply && (formData.apply.sizeId || formData.apply.mix) ? (() => {
                      const applyCfg = formData.apply;
                      const setApply = (patch) => setFormData({ ...formData, apply: { ...applyCfg, ...patch } });
                      const sheetsN = Math.ceil(Math.min(120, Math.max(20, Number(applyCfg.pages) || 60)) / 2);
                      const preview = quotePreview(applyCfg, contentCat);
                      return (
                        <>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Album Size (client catalog prices)</label>
                              <select
                                className="w-full bg-(--n-900) border border-white/10 rounded-lg p-3 text-white text-sm"
                                value={applyCfg.sizeId || ''}
                                onChange={e => setApply({ sizeId: e.target.value })}
                              >
                                {(contentCat.albumSizes || []).filter(s => s.orientation !== 'pocket').map(s => (
                                  <option key={s.id} value={s.id}>{s.title} — base ₹{s.clientBasePrice}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Pages ({sheetsN} sheets · 60 pages = 30 sheets)</label>
                              <input
                                type="number"
                                min="20" max="120" step="2"
                                className="w-full bg-(--n-900) border border-white/10 rounded-lg p-3 text-white text-sm"
                                value={applyCfg.pages || 60}
                                onChange={e => setApply({ pages: Math.max(20, Math.min(120, Math.round(Number(e.target.value) || 60) / 2) * 2) })}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs text-gray-400 mb-2">Sheet allocation — {sheetsN} sheets (relative mix; couples can refine after applying)</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-2">
                              {(contentCat.sheetStyles || []).map(sh => {
                                const n = (applyCfg.mix || {})[sh.id] || 0;
                                return (
                                  <div key={sh.id} className={`flex items-center gap-2 p-2 rounded-lg border transition ${n > 0 ? 'border-[var(--brand)]/50 bg-[var(--brand)]/10' : 'border-white/10 bg-(--n-900)'}`}>
                                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: sh.color }} />
                                    <span className="flex-1 text-xs text-gray-200 truncate" title={sh.title}>{sh.title}</span>
                                    <span className="text-[10px] text-gray-500 shrink-0">₹{sh.clientPricePerSheet}/sh</span>
                                    <div className="flex items-center gap-1 shrink-0">
                                      <button type="button" onClick={() => setApply({ mix: { ...(applyCfg.mix || {}), [sh.id]: Math.max(0, n - 2) } })} className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded text-white font-bold w-7">−</button>
                                      <span className="w-8 text-center text-sm font-bold text-white">{n}</span>
                                      <button type="button" onClick={() => setApply({ mix: { ...(applyCfg.mix || {}), [sh.id]: n + 2 } })} className="px-2 py-0.5 bg-white/10 hover:bg-white/20 rounded text-white font-bold w-7">+</button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Cover</label>
                              <select
                                className="w-full bg-(--n-900) border border-white/10 rounded-lg p-3 text-white text-sm"
                                value={applyCfg.coverId || ''}
                                onChange={e => setApply({ coverId: e.target.value })}
                              >
                                <option value="matte-hardcover">Standard Hardcover Matte (₹0)</option>
                                {(contentCat.coverFinishes || []).map(c => (
                                  <option key={c.id} value={c.id}>{c.label || c.title} — +₹{c.extra ?? c.clientExtra ?? 0}</option>
                                ))}
                              </select>
                            </div>
                            <div>
                              <label className="block text-xs text-gray-400 mb-1">Parent Pocket Books (gift copies)</label>
                              <input
                                type="number" min="0" max="4"
                                className="w-full bg-(--n-900) border border-white/10 rounded-lg p-3 text-white text-sm"
                                value={Number(applyCfg.parentBooks) || 0}
                                onChange={e => setApply({ parentBooks: Math.max(0, Math.min(4, Number(e.target.value) || 0)) })}
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs text-gray-400 mb-2">Video Services (click to include)</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {(contentCat.videoEditing || []).map(v => {
                                const on = (applyCfg.videos || {})[v.id] > 0;
                                return (
                                  <button
                                    type="button"
                                    key={v.id}
                                    onClick={() => {
                                      const map = { ...(applyCfg.videos || {}) };
                                      if (on) delete map[v.id]; else map[v.id] = 1;
                                      setApply({ videos: map });
                                    }}
                                    className={`p-2 rounded-lg text-xs text-left cursor-pointer border transition flex items-center gap-2 ${on ? 'bg-blue-500/20 border-blue-500 text-white' : 'bg-(--n-900) border-white/10 text-gray-400 hover:bg-white/5'}`}
                                  >
                                    <div className={`w-2.5 h-2.5 rounded-full shrink-0`} style={{ background: on ? '#3B82F6' : 'var(--n-600)' }} />
                                    <span className="truncate flex-1">{v.title.replace(/\s*\(.*\)\s*$/, '')}</span>
                                    <span className="text-[10px] text-gray-500">₹{v.clientPrice ?? v.price}</span>
                                  </button>
                                );
                              })}
                            </div>
                            <label className="flex items-center gap-2 text-xs text-gray-300 cursor-pointer mt-2">
                              <input type="checkbox" checked={!!applyCfg.engrave} onChange={e => setApply({ engrave: e.target.checked })} className="w-4 h-4 rounded accent-[var(--brand)]" />
                              Include 24K cover engraving (+₹800)
                            </label>
                          </div>

                          {/* Live per-sheet preview */}
                          <div className="rounded-lg border border-[var(--brand)]/40 bg-black/40 p-3 space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-400">Live engine preview <em className="text-gray-500">(approximate — client estimator is the final receipt)</em></span>
                              <span className="text-lg font-black text-[var(--brand)]">₹{preview.total.toLocaleString('en-IN')}</span>
                            </div>
                            {preview.lines.map(l => (
                              <div key={l.label} className="flex justify-between text-[11px] text-gray-400">
                                <span className="truncate pr-3">{l.label}</span>
                                <span className="font-bold text-gray-300 shrink-0">₹{l.amount.toLocaleString('en-IN')}</span>
                              </div>
                            ))}
                            <div className="text-[10px] text-[var(--brand)]/80 pt-1 border-t border-[var(--brand)]/20">
                              🧻 {preview.sheets} sheets · avg ₹{preview.avgRate}/sheet · {Object.entries(applyCfg.mix || {}).filter(([, n]) => n > 0).map(([id, n]) => `${n}× ${(contentCat.sheetStyles || []).find(s => s.id === id)?.title?.split('(')[0] || id}`).join(' + ') || 'single finish'}
                            </div>
                          </div>
                        </>
                      );
                    })() : (
                      <p className="text-xs text-gray-500">
                        Not wired — this package stays a marketing card (couples are sent to the booking page). Turn on
                        <span className="text-gray-300"> “Wire to Client Estimator” </span>
                        to make it bookable in the estimator with per-sheet pricing.
                      </p>
                    )}
                  </div>
  );
}
