import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowRight, ArrowLeft, Crown, Scissors, Printer, Film,
  Truck, MessageCircle, CheckCircle2, Sparkles,
} from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import ScrollReveal from '../ScrollReveal';
import OptionCard from '../wizard/OptionCard';
import SmartPageSlider from '../wizard/SmartPageSlider';
import PageBudgetAdvisor from '../wizard/PageBudgetAdvisor';
import QuoteReceipt from '../wizard/QuoteReceipt';
import {
  priceQuote, normaliseCatalog, scaleMixToSheets, pageCapacity,
  perSheetOfSize,
  SERVICE_INTENTS, PRICE_RULES,
} from '../../lib/pricing';
import { DEFAULT_B2C_PACKAGES, loadPackages, pkgQuote, resolveVideoMap } from '../../lib/packages';
import './InstantEstimator.css';

/* Video service groups for the dedicated video panel */
const VIDEO_GROUPS = [
  { id: 'social', icon: '📱', en: 'Reels & Social teasers', te: 'రీల్స్ & సోషల్ టీజ‌ర్లు' },
  { id: 'film', icon: '🎬', en: 'Cinematic wedding films', te: '4K సినిమాటిక్ ఫిల్మ్స్' },
  { id: 'live', icon: '🎥', en: 'Live & same-day edits', te: 'లైవ్ & సేమ్-డే యిడిట్స్' },
  { id: 'audio', icon: '🎚️', en: 'Audio & post-production', te: 'ఆడియో & పోస్ట్-ప్రొడ‌క్షన్' },
];

/* ────────────────────────── tiny shared atoms ────────────────────────── */

/** Compact quantity control (reels packs, patrika, flex pieces, mix sheets). */
const Qty = ({ value, onChange, max = 9, min = 0, step = 1, label = 'Quantity' }) => (
  <div className="wz-stepper tiny" role="group" aria-label={label}>
    <button type="button" onClick={() => onChange(Math.max(min, (Number(value) || 0) - step))} aria-label="Less">−</button>
    <span className="wz-qty" aria-live="polite">{Number(value) || 0}</span>
    <button type="button" onClick={() => onChange(Math.min(max, (Number(value) || 0) + step))} aria-label="More">+</button>
  </div>
);

/** Gold switch row (engraving / express). Real switch semantics. */
const ToggleRow = ({ checked, onChange, icon, title, badge, sub, testid }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    data-testid={testid}
    onClick={() => onChange(!checked)}
    className={`wz-toggle-row ${checked ? 'on' : ''}`}
  >
    <span className="wz-toggle-track" aria-hidden="true"><span className="wz-toggle-knob" /></span>
    <span className="wz-toggle-icon">{icon}</span>
    <span className="wz-toggle-main">
      <span className="wz-toggle-title">{title} {badge && <em className="wz-toggle-badge">{badge}</em>}</span>
      {sub && <span className="wz-toggle-sub">{sub}</span>}
    </span>
  </button>
);

const fmt = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`;

/* Bilingual micro-dictionary (module scope — avoids TDZ issues in useMemo) */
function tService(key, lang) {
  const M = {
    edit_print: lang === 'TE' ? 'ఎడిటింగ్ + ప్రింటింగ్' : 'Editing + Printing',
    only_editing: lang === 'TE' ? 'ఫోటో ఎడిటింగ్ మాత్రమే' : 'Photo Editing only',
    only_printing: lang === 'TE' ? 'ఆల్బమ్ ప్రింటింగ్ మాత్రమే' : 'Album Printing only',
    standalone_services: lang === 'TE' ? 'వీడియో / ఇన్విటేషన్ / ఫ్లెక్స్' : 'Video / Invitation / Flex',
  };
  return M[key] || key;
}

const tIncluded = (lang) => (lang === 'TE' ? 'ఇన్‌క్లూడెడ్' : 'Included');

/* ─────────────────────────── main component ─────────────────────────── */

export default function InstantEstimator({
  eyebrow = '✦ ANDHRA PRADESH #1 POST-PRODUCTION HUB ✦',
  title = 'Wedding Album & Video — Instant Quote',
  subtitle = 'Answer 3 simple questions. Get an honest, itemised price — edited, printed and delivered to your home.',
  ctaText = 'Start My Order',
  ctaLink = '/booking',
}) {
  const { content } = useContent();
  const catalog = content?.global?.servicesCatalog || content?.servicesCatalog;
  const cat = useMemo(() => normaliseCatalog(catalog), [catalog]);

  const { lang, toggleLang } = useLanguage();
  const [step, setStep] = useState(1);
  const [intent, setIntent] = useState(SERVICE_INTENTS.EDIT_PRINT);

  /* SysAdmin bundled packages (fallback to curated estimator presets when offline) */
  const [livePackages, setLivePackages] = useState([]);
  const [appliedPackage, setAppliedPackage] = useState(null);
  useEffect(() => {
    let alive = true;
    loadPackages().then((rows) => { if (alive && rows.length) setLivePackages(rows); }).catch(() => {});
    return () => { alive = false; };
  }, []);

  /* Album setup */
  const [sizeFilter, setSizeFilter] = useState('all');
  const [sizeId, setSizeId] = useState('size-12x36');
  const [pages, setPages] = useState(60);
  const [photos, setPhotos] = useState('');
  const [finishMode, setFinishMode] = useState('mix'); // 'single' | 'mix'
  const [singleSheetId, setSingleSheetId] = useState('metallic-gold');
  const [mix, setMix] = useState({ 'metallic-gold': 12, 'royal-velvet': 12, 'pure-silk': 6 });

  /* Cover & extras */
  const [coverId, setCoverId] = useState('acrylic');
  const [engrave, setEngrave] = useState(false);
  const [parentBooks, setParentBooks] = useState(0);
  const [express, setExpress] = useState(false);
  const [videos, setVideos] = useState({});
  const [flex, setFlex] = useState({});

  /* Contact (optional; flows into booking + WhatsApp) */
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');

  const [mobileOpen, setMobileOpen] = useState(false);
  const cardRef = useRef(null);

  const albumIntent = intent !== SERVICE_INTENTS.STANDALONE;
  const printingIntent = intent === SERVICE_INTENTS.EDIT_PRINT || intent === SERVICE_INTENTS.ONLY_PRINTING;

  /* Live quote — ONE source of truth (lib/pricing.js) */
  const quote = useMemo(
    () => priceQuote(
      { intent, sizeId, pages, photos: Number(photos) || 0, finishMode, singleSheetId, mix, coverId, engrave, parentBooks, express, videos, flex },
      catalog,
    ),
    [intent, sizeId, pages, photos, finishMode, singleSheetId, mix, coverId, engrave, parentBooks, express, videos, flex, catalog],
  );

  /* Pages are the master; in mix mode groups auto-scale to the new sheet count */
  const changePages = (p) => {
    setPages(p);
    if (finishMode === 'mix') setMix((prev) => scaleMixToSheets(prev, Math.ceil(p / 2)));
  };

  /* Absolute-count setter for a mix row (kept even; ≥1 group guaranteed) */
  const setMixCount = (id, count) => {
    if ((Number(count) || 0) === 0 && Object.keys(mix).length <= 1) return;
    let v = Math.max(0, Math.min(60, Number(count) || 0));
    if (v % 2 !== 0) v += 1;
    const next = { ...mix };
    if (v === 0) delete next[id]; else next[id] = v;
    setMix(next);
    setPages(Object.values(next).reduce((s, n) => s + n, 0) * 2);
  };

  const applyPreset = (preset) => {
    const presets = {
      'royal-ap': { 'metallic-gold': 14, 'royal-velvet': 12, 'pure-silk': 6 },
      archival: { 'royal-velvet': 18, 'non-tearable': 12 },
      fashion: { 'crystal-gloss': 15, 'matte-linen': 15 },
      // How most AP studios actually allocate: ~26 standard sheets + a few premium
      'standard-30': { 'ntr-matte': 24, 'non-tearable': 2, 'metallic-gold': 2, 'royal-velvet': 2 },
    };
    setMix(scaleMixToSheets(presets[preset], Math.ceil(pages / 2)));
    setFinishMode('mix');
  };

  const toggleVideo = (id) => {
    setVideos((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id]; else next[id] = 1;
      return next;
    });
  };

  /* Scroll near the card top (not the page top) when the step changes */
  useEffect(() => {
    if (cardRef.current && step > 1) {
      const y = cardRef.current.getBoundingClientRect().top + window.scrollY - 110;
      if (Math.abs(window.scrollY - y) > 40) window.scrollTo({ top: y, behavior: 'smooth' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  /* Deep-link contract → /booking (BookingPage parses ?service&size&pages&…) */
  const orderUrl = useMemo(() => {
    const p = new URLSearchParams();
    p.set('service', intent);
    p.set('size', sizeId);
    p.set('pages', String(pages));
    p.set('sheets', String(quote.sheets));
    if (photos) p.set('photos', String(photos));
    p.set('finishmode', finishMode);
    p.set('finish', finishMode === 'mix'
      ? Object.entries(mix).filter(([, n]) => n > 0).map(([id, n]) => `${id}:${n}`).join('+')
      : singleSheetId);
    p.set('cover', coverId);
    if (engrave) p.set('engrave', '1');
    if (parentBooks > 0) p.set('parentbooks', String(parentBooks));
    if (express) p.set('express', '1');
    if (name) p.set('name', name);
    if (phone) p.set('phone', phone);
    if (city) p.set('city', city);
    p.set('price', String(quote.total));
    return `${ctaLink}?${p.toString()}`;
  }, [intent, sizeId, pages, photos, finishMode, mix, singleSheetId, coverId, engrave, parentBooks, express, name, phone, city, quote, ctaLink]);

  /* WhatsApp-able quote (Telugu when lang=TE) */
  const waText = useMemo(() => {
    const L = lang === 'TE';
    const mixLines = (quote.allocation || [])
      .map((a) => `• ${a.count} sh — ${a.title}${a.ritualSection ? ` (${a.ritualSection})` : ''}`)
      .join('\n');
    const lines = [
      L ? 'నమస్కారం! WeddingAlbums.in లో నా కొటేషన్:' : 'Namaste! My quote from WeddingAlbums.in:',
      `📌 ${tService(intent, lang)}`,
      quote.albumInScope
        ? `📖 ${quote.size.title} · ${quote.pages} pages (${quote.sheets} sheets)`
        : (L ? '📖 ఆల్బమ్ లేదు — అదనపు సేవలు' : '📖 No album — extras only'),
      quote.albumInScope && mixLines ? `✨ ${L ? 'పేజీ ఫినిష్' : 'Page finish'}:\n${mixLines}` : null,
      quote.albumInScope ? `💎 ${L ? 'కవర్' : 'Cover'}: ${quote.cover.label}` : null,
      engrave ? (L ? '🖊 24K పేరు ఎన్‌గ్రేవింగ్' : '24K name engraving') : null,
      parentBooks > 0 ? (L ? `📚 పేరెంట్ బుక్స్ × ${parentBooks}` : `Parent books × ${parentBooks}`) : null,
      express ? (L ? '⚡ 48 గంటల ఎక్స్‌ప్రెస్' : '48h Express') : null,
      city ? `📍 ${city}` : null,
      name ? `🙂 ${name}${phone ? ` · ${phone}` : ''}` : null,
      `💰 ${fmt(quote.total)} (${L ? 'GST తో' : 'incl. GST'})`,
      `🕒 ${quote.deliveryEtaText}`,
    ].filter(Boolean);
    return lines.join('\n');
  }, [lang, quote, engrave, parentBooks, express, city, name, phone, intent]);

  const steps = albumIntent
    ? [lang === 'TE' ? 'మీకు ఏమి కావాలి' : 'What you need',
       lang === 'TE' ? 'మీ ఆల్బమ్' : 'Your album',
       lang === 'TE' ? 'కవర్ & అదనపు' : 'Cover & extras']
    : [lang === 'TE' ? 'మీకు ఏమి కావాలి' : 'What you need',
       lang === 'TE' ? 'వీడియో సేవలు' : 'Video services',
       lang === 'TE' ? 'సేవలు & మోతాదు' : 'Extras & delivery'];

  /* ────────────────────────── step renderers ────────────────────────── */

  const renderSizes = () => {
    const sizes = cat.albumSizes.filter((s) => s.orientation !== 'pocket');
    const filtered = sizeFilter === 'all' ? sizes : sizes.filter((s) => s.orientation === sizeFilter);
    const filters = [
      { id: 'all', en: 'All', te: 'అన్నీ' },
      { id: 'landscape', en: 'Landscape', te: 'ల్యాండ్‌స్కేప్' },
      { id: 'vertical', en: 'Portrait', te: 'పోర్ట్రెయిట్' },
      { id: 'square', en: 'Square', te: 'స్క్వేర్' },
    ];
    const sel = filtered.find((s) => s.id === sizeId) || filtered[0];
    return (
      <div className="est-block">
        <div className="est-block-label">
          <span>{lang === 'TE' ? 'ఆల్బమ్ సైజు' : 'Album size'}</span>
          <span className="est-block-hint">
            {`${sizes.length} ${lang === 'TE' ? 'ఫార్మాట్లు · నిజమైన కొలతలు' : 'formats · true proportions'}`}
          </span>
        </div>
        <div className="est-pills" role="group" aria-label="Orientation filter">
          {filters.map((f) => (
            <button key={f.id} type="button" className={`wz-chip ${sizeFilter === f.id ? 'on' : ''}`} onClick={() => setSizeFilter(f.id)}>
              {lang === 'TE' ? f.te : f.en}
            </button>
          ))}
        </div>
        <div className="est-size-grid" role="radiogroup" aria-label="Album size">
          {filtered.map((s) => (
            <OptionCard
              key={s.id}
              selected={sizeId === s.id}
              onClick={() => setSizeId(s.id)}
              title={lang === 'TE' && s.telugu ? s.telugu : s.title}
              sub={s.closedSize ? `${s.openSpread} → ${s.closedSize}` : s.openSpread}
              meta={`${fmt(s.clientBasePrice)}${s.tag ? ` · ${s.tag}` : ''} · ≈${fmt(perSheetOfSize(s.clientBasePrice))}/${lang === 'TE' ? 'షీట్' : 'sh'}`}
              badge={s.popular ? (lang === 'TE' ? 'జనప్రియం' : 'Popular') : null}
            />
          ))}
        </div>
        {sel && (
          <div className="est-size-detail" key={sel.id}>
            <div className="est-size-detail-head">
              <strong>{lang === 'TE' && sel.telugu ? sel.telugu : sel.title}</strong>
              {sel.tradeName && <em className="est-trade-tag">✦ {sel.tradeName}</em>}
            </div>
            <div className="est-size-meta">
              {sel.closedSize && (
                <span>{lang === 'TE' ? `మూసిన పుస్తకం: ${sel.closedSize}` : `Closed book: ${sel.closedSize}`}</span>
              )}
              <span>{lang === 'TE' ? `బేస్: ${fmt(sel.clientBasePrice)}` : `Base: ${fmt(sel.clientBasePrice)}`}</span>
              <span className="est-size-sheets">
                {lang === 'TE'
                  ? `≈ ${fmt(perSheetOfSize(sel.clientBasePrice))}/షీట్ · 30 షీట్లు ఇందులో`
                  : `≈ ${fmt(perSheetOfSize(sel.clientBasePrice))}/sheet · 30 sheets in base`}
              </span>
            </div>
            {(lang === 'TE' ? (sel.teluguNote || sel.description) : sel.description) && (
              <p>{lang === 'TE' ? (sel.teluguNote || sel.description) : sel.description}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  const renderPagesBlock = () => (
    <div className="est-block">
      <div className="est-block-label">
        <span>{lang === 'TE' ? 'ఎన్ని పేజీలు?' : 'How many pages?'}</span>
        <span className="est-block-hint">{lang === 'TE' ? '60 పేజీలు = 30 షీట్లు ప్రింటింగ్' : '60 pages = 30 printed sheets'}</span>
      </div>
      <SmartPageSlider
        pages={pages}
        onChange={changePages}
        min={PRICE_RULES.PAGE_MIN}
        max={PRICE_RULES.PAGE_MAX}
        help={lang === 'TE'
          ? `${pages} పేజీల ఆల్బమ్‌లో సుమారు ${pageCapacity(pages).photosComfort}-${pageCapacity(pages).photosComfort + 120} ఫోటోలు ఆరామంగా ఉంటాయి.`
          : `A ${pages}-page album holds about ${pageCapacity(pages).photosComfort}-${pageCapacity(pages).photosComfort + 120} photos comfortably.`}
      />
    </div>
  );

  const renderFinish = () => {
    if (!printingIntent) return null;
    const sel = cat.sheetStyles.find((x) => x.id === singleSheetId) || cat.sheetStyles[0];
    return (
      <div className="est-block">
        <div className="est-block-label">
          <span>{lang === 'TE' ? 'పేజీ ఫినిష్ · షీట్ టైప్' : 'Page finish · sheet type'}</span>
          <div className="est-pills inline">
            <button type="button" className={`wz-chip ${finishMode === 'single' ? 'on' : ''}`} onClick={() => setFinishMode('single')}>
              {lang === 'TE' ? 'ఒకే ఫినిష్' : 'Single finish'}
            </button>
            <button type="button" className={`wz-chip ${finishMode === 'mix' ? 'on' : ''}`} onClick={() => setFinishMode('mix')}>
              {lang === 'TE' ? 'రిచువల్ మిక్స్' : 'Ritual mix'}
            </button>
          </div>
        </div>

        {/* Honesty note: what other studios give vs what WE let you choose */}
        <p className="est-standard-note">
          {lang === 'TE'
            ? '💡 ఫోటోగ్రాఫర్లు సాధారణంగా 30 షీట్లలో ~26 స్టాండ‌ర్డ్ (NTR మ్యాట్) + ~4 ప్రీమియం ఇస్తూ ఉంటారు — మేమైతే ఆ విభజన మొత్తం మీ చేతుల్లో.'
            : '💡 Most AP photographers give 30 sheets as ~26 standard (NTR Matte style) + ~4 premium. Here, the split is entirely your choice.'}
        </p>

        {finishMode === 'single' ? (
          <>
            <div className="est-finish-grid" role="radiogroup" aria-label="Page finish">
              {cat.sheetStyles.map((s) => (
                <OptionCard
                  key={s.id}
                  selected={singleSheetId === s.id}
                  onClick={() => setSingleSheetId(s.id)}
                  swatch={s.color}
                  title={lang === 'TE' && s.telugu ? s.telugu : s.title}
                  sub={s.alias || s.gsm}
                  meta={`${fmt(s.clientPricePerSheet)}/${lang === 'TE' ? 'షీట్' : 'sheet'}`}
                />
              ))}
            </div>
            {sel && (
              <div className="est-sheet-detail" key={sel.id}>
                <div className="est-sheet-detail-head">
                  <span className="est-sheet-swatch" style={{ background: sel.color }} aria-hidden="true" />
                  <strong>{lang === 'TE' && sel.telugu ? sel.telugu : sel.title}</strong>
                  {sel.tier && (
                    <span className={`est-tier tier-${sel.tier}`}>
                      {sel.tier === 'luxury' ? (lang === 'TE' ? 'లగ్జరీ' : 'Luxury')
                        : sel.tier === 'special' ? (lang === 'TE' ? 'స్పెషల్' : 'Special')
                          : (lang === 'TE' ? 'స్టాండ‌ర్డ్' : 'Standard')}
                    </span>
                  )}
                  <span className="est-sheet-rate">
                    {fmt(sel.clientPricePerSheet)}
                    <i> /{lang === 'TE' ? 'షీట్' : 'sheet'}</i>
                  </span>
                </div>
                {sel.alias && <em className="est-sheet-alias">{sel.alias}</em>}
                {(lang === 'TE' ? (sel.teluguDesc || sel.description) : sel.description) && (
                  <p>{lang === 'TE' ? (sel.teluguDesc || sel.description) : sel.description}</p>
                )}
                {Array.isArray(sel.points) && sel.points.length > 0 && (
                  <ul className="est-sheet-points">
                    {sel.points.map((pt) => (
                      <li key={pt}><CheckCircle2 size={13} /> {pt}</li>
                    ))}
                  </ul>
                )}
                <div className="est-sheet-mini">
                  {sel.gsm && <span>📄 {sel.gsm}</span>}
                  {sel.waterResistance && <span>💧 {sel.waterResistance}</span>}
                  {sel.bestFor && <span>✦ {lang === 'TE' ? 'సరైనది' : 'Best for'}: {sel.bestFor}</span>}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="est-mix">
            <p className="est-mix-note">
              {lang === 'TE'
                ? 'గోల్డ్ = ముహూర్తం · వెల్వెట్ = రిసెప్షన్ · సిల్క్ = సప్తపది — ఆంధ్ర ఆల్బమ్స్ ఇలానే తయారవుతాయి.'
                : 'Gold for Muhurtham · Velvet for Reception · Silk for Saptapadi — how AP albums are traditionally made.'}
            </p>
            <div className="est-pills">
              <span className="est-pills-label">{lang === 'TE' ? 'AP కాంబోలు:' : 'AP combos:'}</span>
              <button type="button" className="wz-chip" onClick={() => applyPreset('royal-ap')}>👑 {lang === 'TE' ? 'రాయల్ ట్రయో' : 'Royal Trio'}</button>
              <button type="button" className="wz-chip" onClick={() => applyPreset('standard-30')}>🧑‍🔧 {lang === 'TE' ? 'ఫోటోగ్రాఫర్ స్టాండ‌ర్డ్' : 'Photographer Standard'}</button>
              <button type="button" className="wz-chip" onClick={() => applyPreset('archival')}>🛡 {lang === 'TE' ? 'యాంటీ-టియర్' : 'Anti-tear'}</button>
              <button type="button" className="wz-chip" onClick={() => applyPreset('fashion')}>🎨 {lang === 'TE' ? 'ఫ్యాషన్' : 'Fashion'}</button>
            </div>
            <div className="est-mix-rows">
              {cat.sheetStyles.map((s) => {
                const count = mix[s.id] || 0;
                return (
                  <div key={s.id} className={`est-mix-row ${count > 0 ? 'active' : ''}`} title={s.description || s.alias || ''}>
                    <span className="est-mix-dot" style={{ background: s.color }} aria-hidden="true" />
                    <span className="est-mix-name">
                      {lang === 'TE' && s.telugu ? s.telugu : s.title}
                      <em>{s.ritualSection || s.bestFor}</em>
                    </span>
                    <span className="est-mix-money">
                      <em>{count > 0 ? `${count} ${lang === 'TE' ? 'షీట్లు' : 'sh'} · ${count * 2} ${lang === 'TE' ? 'పేజీలు' : 'pg'} · ${fmt(count * s.clientPricePerSheet)}` : `${fmt(s.clientPricePerSheet)}/${lang === 'TE' ? 'షీట్' : 'sh'}`}</em>
                    </span>
                    <Qty value={count} onChange={(n) => setMixCount(s.id, n)} max={30} step={2} label={`${s.title} sheets`} />
                  </div>
                );
              })}
            </div>
            <p className="est-mix-sync">
              {lang === 'TE'
                ? 'పేజీల స్లయిడర్ కదిలిస్తే మిక్స్ తానంతట తానే నిష్పత్తిగా అనుగుణంగా మారుతుంది.'
                : 'Drag the pages slider — your mix scales automatically and stays balanced.'}
            </p>
          </div>
        )}

        {/* Included lay-flat binding explainer (industry standard, always shown) */}
        <div className="est-binding-note">
          <strong>📐 {lang === 'TE' ? '100% పానరామిక్ లే-ఫ్లాట్ బైండింగ్ — ఉచితం' : '100% Panoramic Lay-Flat Binding — included free'}</strong>
          <span>
            {lang === 'TE'
              ? 'యూరపియన్ హింజ్ 180° ఫ్లాట్‌గా తెరుచుకుంటుంది — సెంటర్ గట్టర్ లాస్ శూన్యం. పెద్ద మండప గ్రూప్ ఫోటోలు రెండు పేజీలలో సీమ్ లేకుండా నడుస్తాయి.'
              : 'Patented European hinge mechanism opens completely flat at 180°. Zero center-gutter loss — big mandap group shots run across both pages without seam cuts.'}
          </span>
        </div>
      </div>
    );
  };

  /* Live editing price for the editing panel (mirrors engine tiers) */
  const editingTierInfo = () => {
    const ph = Number(photos) || 0;
    if (!ph) return null;
    const last = PRICE_RULES.EDITING_TIERS[PRICE_RULES.EDITING_TIERS.length - 1];
    const tier = PRICE_RULES.EDITING_TIERS.find((t) => ph <= t.maxPhotos) || last;
    const over = Math.max(0, ph - last.maxPhotos);
    return tier.price + over * PRICE_RULES.EDITING_PER_PHOTO_ABOVE;
  };

  /* ✍️ SECTION: Album Editing — photo count + its live price (bundle-aware) */
  const renderEditingPanel = () => {
    const tier = editingTierInfo();
    return (
      <div className="est-panel">
        <div className="est-panel-head">
          <span className="est-panel-title">✍️ {lang === 'TE' ? 'ఆల్బమ్ ఎడిటింగ్' : 'Album Editing'}</span>
          {intent === SERVICE_INTENTS.EDIT_PRINT && (
            <span className="est-panel-chip">
              {lang === 'TE' ? 'బండిల్‌లో అంతర్భాగం · విలువ' : 'Included in bundle · worth'} {fmt(PRICE_RULES.EDITING_IN_BUNDLE)}
            </span>
          )}
          {intent === SERVICE_INTENTS.ONLY_EDITING && tier ? (
            <span className="est-panel-chip gold">{lang === 'TE' ? 'ఎడిటింగ్ కొటేషన్' : 'Editing quote'}: {fmt(tier)}</span>
          ) : null}
        </div>

        {intent === SERVICE_INTENTS.ONLY_PRINTING ? (
          <div className="est-panel-note warn">
            <span>{lang === 'TE' ? 'మీరు "ప్రింటింగ్ మాత్రమే" ఎన్నుకున్నారు — మా టీమే ఎడిటింగ్ కూడా చేయాలా?' : 'You chose Printing only — want the same team to edit as well?'}</span>
            <button type="button" className="wz-chip gold" onClick={() => setIntent(SERVICE_INTENTS.EDIT_PRINT)}>
              ✍️ {lang === 'TE' ? 'ఎడిటింగ్ చేర్చండి — ఆదా ₹1,500' : 'Add editing — bundle & save ₹1,500'}
            </button>
          </div>
        ) : (
          <>
            <PageBudgetAdvisor photos={photos} onPhotos={setPhotos} onApply={(p) => changePages(p)} />
            <p className="est-panel-foot">
              {lang === 'TE'
                ? 'కటింగ్ · రిటచ్ · కలర్ గ్రేడింగ్ · ఆల్బమ్ డిజైన్ — RAW & JPEG అందుకుంటాం.'
                : 'Culling · retouch · colour grading · album design — we accept RAW & JPEG.'}
            </p>
          </>
        )}
      </div>
    );
  };

  /* 🖨️ SECTION: Album Printing — size + PAGES + sheet types (all first-class) */
  const renderPrintingPanel = () => (
    <div className="est-panel">
      <div className="est-panel-head">
        <span className="est-panel-title">🖨️ {lang === 'TE' ? 'ఆల్బమ్ ప్రింటింగ్' : 'Album Printing'}</span>
        <span className="est-panel-chip">
          {quote.albumInScope ? `${fmt(quote.size.clientBasePrice)} ${lang === 'TE' ? 'బేస్' : 'base'}` : ''}
        </span>
      </div>
      <p className="est-panel-sub">
        {lang === 'TE'
          ? 'ధరలు షీట్లకు మాత్రమే — ప్రతి బేస్‌లో 30 షీట్లు ఇందులో; అదనపు షీట్ 2 పేజీలు = ఫినిష్ ₹/షీట్ ఫీజు.'
          : 'Prices are for the sheets only — every base includes 30 sheets (60 pages); extra sheets are billed at the finish\'s ₹/sheet rate.'}
      </p>
      {renderSizes()}
      {renderPagesBlock()}
      {renderFinish()}
    </div>
  );

  const renderAlbumStep = () => {
    if (intent === SERVICE_INTENTS.ONLY_EDITING) {
      return <>{renderEditingPanel()}{renderPagesBlock()}</>;
    }
    return <>{renderEditingPanel()}{renderPrintingPanel()}</>;
  };

  /* 🎬 PANEL: Video services — grouped by deliverable type, each pickable separately */
  const renderVideoList = () => (
    <div className="est-panel">
      <div className="est-panel-head">
        <span className="est-panel-title">🎬 {lang === 'TE' ? 'వీడియో సేవలు — ఏదైనా కాంబినేషన్' : 'Video services — any combination'}</span>
        <span className="est-panel-chip">{lang === 'TE' ? 'వేరుగా ఎన్నుకోండి' : 'Pick separately'}</span>
      </div>
      {VIDEO_GROUPS.map((g) => {
        const rows = cat.videos.filter((v) => (v.group || 'film') === g.id);
        if (!rows.length) return null;
        return (
          <div key={g.id} className="est-vg">
            <div className="est-vg-head">{g.icon} {lang === 'TE' ? g.te : g.en}</div>
            <div className="est-extras">
              {rows.map((v) => {
                const qty = videos[v.id] || 0;
                const maxQ = Number(v.qtyMax) > 1 ? Number(v.qtyMax) : (v.id === 'video-reels' ? PRICE_RULES.VIDEO_REELS_QTY_MAX : 1);
                return (
                  <div key={v.id} className={`est-extra-row ${qty > 0 ? 'active' : ''}`}>
                    <button
                      type="button"
                      role={maxQ > 1 ? 'switch' : 'radio'}
                      aria-checked={qty > 0}
                      className="est-extra-main"
                      onClick={() => {
                        if (maxQ > 1) setVideos((p) => (qty ? { ...p, [v.id]: 0 } : { ...p, [v.id]: 1 }));
                        else toggleVideo(v.id);
                      }}
                    >
                      <span className="est-extra-check" aria-hidden="true">{qty > 0 ? '✓' : ''}</span>
                      <span className="est-extra-title">
                        {lang === 'TE' && v.telugu ? v.telugu : v.title}
                        {(lang === 'TE' ? (v.descTe || v.desc) : v.desc) && (
                          <i className="est-extra-desc">{lang === 'TE' ? (v.descTe || v.desc) : v.desc}</i>
                        )}
                        {v.turnaround && <em>{lang === 'TE' ? 'రెడీ' : 'Ready'}: {v.turnaround}</em>}
                      </span>
                      <span className="est-extra-price">+{fmt(v.price)}</span>
                    </button>
                    {qty > 0 && maxQ > 1 && (
                      <Qty value={qty} onChange={(n) => setVideos((p) => ({ ...p, [v.id]: n }))} max={maxQ} label={`${v.title} qty`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
      <p className="est-panel-foot">
        {lang === 'TE'
          ? 'వీడియోలు ఆల్బమ్‌తో లేదా వేరుగా — రెండూ ఒకే ఆర్డర్‌లో దారితీస్తాయి.'
          : 'Videos ride the same order as your album, or stand alone — both lead to one checkout.'}
      </p>
    </div>
  );

  /* 📦 PANEL: Bundled packages — owner-configured in CMS Studio (uiadmin) or SysAdmin,
     engine-priced per sheet (no marketing numbers). */
  const renderPackagesPanel = () => {
    const pkgs = (livePackages.length ? livePackages : DEFAULT_B2C_PACKAGES);
    return (
      <div className="est-panel est-packages">
        <div className="est-panel-head">
          <span className="est-panel-title">📦 {lang === 'TE' ? 'బండిల్ ప్యాకేజీలు' : 'Bundled packages'}</span>
          <span className="est-panel-chip">
            {livePackages.length ? (lang === 'TE' ? 'అడ్మిన్‌లో సెట్ చేయబడింది' : 'Set in Admin') : (lang === 'TE' ? 'క్యూరేటెడ్ ప్రిసెట్స్' : 'Curated presets')}
          </span>
        </div>
        <p className="est-panel-note">
          {lang === 'TE'
            ? 'మీ టీమ్ ధరలు — CMS స్టూడియో · సిస్‌అడ్మిన్‌లో సెట్ చేయబడతాయి. ప్రతి కాంబో షీట్ లెక్కన లెక్కించబడుతుంది — అప్లై చేశాక ప్రతి ప్యానెల్ (ఎడిటింగ్ · ప్రింటింగ్ · షీట్లు · వీడియో) మీరే విడివిడిగా సరిచూసుకోవచ్చు.'
            : 'Priced by you in CMS Studio · SysAdmin. Every combo is engine-priced per sheet — after applying, each panel (editing · printing · sheets · video) stays separately yours to tweak.'}
        </p>
        <div className="est-pkg-grid">
          {pkgs.map((pkg) => {
            const cfg = pkg.apply;
            const quote = cfg ? pkgQuote(pkg, catalog) : null;
            const alloc = cfg?.mix ? Object.entries(cfg.mix)
              .map(([id, n]) => { const s = cat.sheetStyles.find((x) => x.id === id); return s ? `${n} ${s.title.replace(/\(.*/, '')}` : null; })
              .filter(Boolean).join(' + ') : null;
            const tierName = lang === 'TE' && pkg.tierTe ? pkg.tierTe : (pkg.tier || pkg.category || 'Package');
            return (
              <div key={pkg.id || pkg._id || tierName} className={`est-pkg ${appliedPackage === (pkg.id || pkg.tier) ? 'on' : ''}`} style={{ '--pkg-c': pkg.color || 'var(--brand)' }}>
                <div className="est-pkg-top">
                  <span className="est-pkg-tier">{tierName}</span>
                  {pkg.popular && <span className="est-pkg-pop">⭐ {lang === 'TE' ? 'జనప్రియం' : 'Most popular'}</span>}
                </div>
                {quote ? (
                  <div className="est-pkg-price">
                    {fmt(quote.total)}
                    <i> {lang === 'TE' ? '· ఇంజన్ షీట్‌-మేథ్స్' : '· priced by sheet math'}</i>
                  </div>
                ) : (
                  <div className="est-pkg-price">{pkg.price || ''}<i> {pkg.suffix || ''}</i></div>
                )}
                {pkg.sysadmin && !quote && <span className="est-pkg-src">{lang === 'TE' ? 'సిస్‌అడ్మిన్ సూట్' : 'SysAdmin suite'}</span>}
                {(lang === 'TE' ? (pkg.descTe || pkg.desc) : pkg.desc) && (
                  <p className="est-pkg-desc">{lang === 'TE' ? (pkg.descTe || pkg.desc) : pkg.desc}</p>
                )}
                {alloc && (
                  <div className="est-pkg-sheets">
                    🧻 {alloc} · {Math.round((cfg.pages || 60) / 2)} {lang === 'TE' ? 'షీట్లు' : 'sheets'}
                  </div>
                )}
                <ul className="est-pkg-feat">
                  {(lang === 'TE' ? (pkg.featuresTe || pkg.features) : pkg.features || []).slice(0, 6).map((f) => (
                    <li key={f}><CheckCircle2 size={13} /> {f}</li>
                  ))}
                </ul>
                <div className="est-pkg-actions">
                  {cfg ? (
                    <button type="button" className="est-pkg-apply" onClick={() => applyPackage(pkg)}>
                      ✨ {appliedPackage === (pkg.id || pkg.tier)
                        ? (lang === 'TE' ? 'ప్యాకేజీ అప్లయి అయింది — సవరించండి' : 'Package applied — edit anything')
                        : (lang === 'TE' ? 'అప్లై చేసి కస్టమైజ్' : 'Apply & customize')}
                    </button>
                  ) : (
                    <a className="est-pkg-apply" href="/booking">
                      {lang === 'TE' ? 'బుకింగ్ పేజీలో ఎంచుకోండి' : 'Select on the booking page'} →
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  /* One-tap package application — pre-wires every field, everything stays editable */
  const applyPackage = (pkg) => {
    const cfg = pkg.apply;
    if (!cfg) return;
    setIntent(cfg.intent || SERVICE_INTENTS.EDIT_PRINT);
    if (cfg.sizeId) setSizeId(cfg.sizeId);
    if (cfg.pages) setPages(cfg.pages);
    if (cfg.mix) { setMix({ ...cfg.mix }); setFinishMode('mix'); }
    if (cfg.videos) setVideos(resolveVideoMap(cfg.videos, cat.videos));
    if (cfg.coverId) setCoverId(cfg.coverId);
    setEngrave(!!cfg.engrave);
    setParentBooks(Number(cfg.parentBooks) || 0);
    setAppliedPackage(pkg.id || pkg.tier);
    setStep(2);
  };

  const renderFlexList = () => (
    <div className="est-block">
      <div className="est-block-label"><span>{lang === 'TE' ? 'ఇన్విటేషన్స్ & ఫ్లెక్స్' : 'Invitations & flex'}</span></div>
      <div className="est-extras">
        {cat.flex.map((f) => {
          const qty = flex[f.id] || 0;
          const maxQ = Number(f.qtyMax) > 1 ? Number(f.qtyMax) : 1;
          return (
            <div key={f.id} className={`est-extra-row ${qty > 0 ? 'active' : ''}`}>
              <button
                type="button"
                role={maxQ > 1 ? 'switch' : 'radio'}
                aria-checked={qty > 0}
                className="est-extra-main"
                onClick={() => setFlex((p) => ({ ...p, [f.id]: qty ? 0 : 1 }))}
              >
                <span className="est-extra-check" aria-hidden="true">{qty > 0 ? '✓' : ''}</span>
                <span className="est-extra-title">
                  {f.title}
                  {f.qtyLabel && <em>{f.qtyLabel}</em>}
                </span>
                <span className="est-extra-price">
                  +{fmt(f.price)}{f.qtyUnit > 1 ? <small> / {f.qtyLabel || `${f.qtyUnit} cards`}</small> : null}
                </span>
              </button>
              {qty > 0 && maxQ > 1 && (
                <Qty value={qty} onChange={(n) => setFlex((p) => ({ ...p, [f.id]: n }))} max={maxQ} label={`${f.title} qty`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderContactBlock = () => (
    <div className="est-block">
      <div className="est-block-label"><span>{lang === 'TE' ? 'మీ వివరాలు (ఐచ్ఛికం)' : 'Your details (optional)'}</span></div>
      <div className="est-contact-grid">
        <input className="est-input" value={name} onChange={(e) => setName(e.target.value)} placeholder={lang === 'TE' ? 'మీ పేరు' : 'Your name'} />
        <input className="est-input" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d+ ]/g, ''))} inputMode="tel" type="tel" placeholder={lang === 'TE' ? 'వాట్సాప్ నంబర్' : 'WhatsApp number'} />
        <input className="est-input" value={city} onChange={(e) => setCity(e.target.value)} placeholder={lang === 'TE' ? 'మీ నగరం (విజయవాడ…)' : 'Your city (Vijayawada…)'} />
      </div>
      <p className="est-trust-line">
        <CheckCircle2 size={14} />
        {lang === 'TE'
          ? 'AP & TS అంతా ఇన్స్యూర్డ్ కొరియర్ ఫ్రీ · ప్రింటింగ్ ముందు WhatsApp-లో సాఫ్ట్-ప్రూఫ్ ఫ్రీ'
          : 'Free insured courier across AP & TS · Free WhatsApp soft-proof before anything prints'}
      </p>
    </div>
  );

  const renderCoverStep = () => (
    <>
      {printingIntent && (
        <div className="est-block">
          <div className="est-block-label"><span>{lang === 'TE' ? 'కవర్ ఎంచుకోండి' : 'Pick your cover'}</span></div>
          <div className="est-cover-grid" role="radiogroup" aria-label="Cover finish">
            {cat.covers.map((c) => (
              <OptionCard
                key={c.id}
                selected={quote.cover.id === c.id}
                onClick={() => setCoverId(c.id)}
                mockup={c.mockup}
                title={c.label}
                price={c.extra > 0 ? `+${fmt(c.extra)}` : tIncluded(lang)}
              />
            ))}
          </div>
          <ToggleRow
            checked={engrave}
            onChange={setEngrave}
            title={lang === 'TE' ? '24K గోల్డ్ పేరు ఎన్‌గ్రేవింగ్' : '24K gold name engraving'}
            sub={lang === 'TE' ? 'కవర్ పై జంట పేర్లు గోల్డ్ ఫాయిల్‌లో' : 'Couple names in gold foil on the cover'}
            badge={`+${fmt(PRICE_RULES.ENGRAVE_FEE)}`}
            icon="🖊"
          />
        </div>
      )}

      <div className="est-block">
        <div className="est-block-label"><span>{lang === 'TE' ? 'కుటుంబ కాపీలు & డెలివరీ' : 'Family copies & delivery'}</span></div>

        {printingIntent && (
          <div className="est-parent-box">
            <span className="est-parent-label">
              {lang === 'TE' ? 'తల్లిదండ్రుల కోసం మినీ కాపీలు?' : 'Mini copies for parents & in-laws?'}
              <em>{fmt(PRICE_RULES.PARENT_BOOK_PRICE)} · {lang === 'TE' ? 'బుక్' : 'book'} · {lang === 'TE' ? '2 లేదా ఎక్కువపై 10% ఆఫ్' : '10% off on 2+'}</em>
            </span>
            <Qty value={parentBooks} onChange={(n) => setParentBooks(n)} max={4} label="Parent books" />
          </div>
        )}

        <ToggleRow
          checked={express}
          onChange={setExpress}
          icon={<Truck size={16} />}
          title={lang === 'TE' ? 'ఎక్స్‌ప్రెస్ ప్రొడక్షన్ (48 గంటలు)' : 'Express production (48h)'}
          sub={`${lang === 'TE' ? 'సిద్ధం' : 'Ready by'}: ${quote.deliveryEtaText}`}
          badge={`+${fmt(PRICE_RULES.EXPRESS_FEE)}`}
        />
      </div>

      {albumIntent && renderVideoList()}
      {renderFlexList()}
      {renderContactBlock()}
    </>
  );

  /* ─────────────────────────────── view ─────────────────────────────── */

  const stepBody = step === 1
    ? null
    : step === 2
      ? (albumIntent ? renderAlbumStep() : renderVideoList())
      : renderCoverStep();

  return (
    <section className="est-section" id="estimator" ref={cardRef}>
      <div className="container">
        <div className="text-center est-header">
          <ScrollReveal>
            <div className="est-eyebrow">{eyebrow}</div>
            <h2 className="est-title font-serif text-gradient">{title}</h2>
            <p className="est-subtitle">{subtitle}</p>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={100}>
          <div className="est-card">
            {/* ── Controls ── */}
            <div className="est-controls">
              <div className="est-lang-row">
                <div className="est-steps" aria-label={`Step ${step} of 3`}>
                  {steps.map((label, i) => (
                    <button
                      key={label}
                      type="button"
                      className={`est-stepdot ${step === i + 1 ? 'now' : step > i + 1 ? 'done' : ''}`}
                      onClick={() => setStep(i + 1)}
                      aria-current={step === i + 1 ? 'step' : undefined}
                    >
                      <span className="est-stepdot-n">{step > i + 1 ? '✓' : i + 1}</span>
                      <span className="est-stepdot-l">{label}</span>
                    </button>
                  ))}
                </div>
                <button type="button" className="est-lang-btn" onClick={toggleLang} aria-label="Toggle language">
                  {lang === 'EN' ? 'తెలుగు' : 'English'}
                </button>
              </div>

              {/* STEP 1 — service intent */}
              {step === 1 && (
                <div className="est-block" role="radiogroup" aria-label="Service type">
                  <div className="est-block-label">
                    <span>{lang === 'TE' ? 'మీకు ఏమి కావాలి?' : 'What do you need?'}</span>
                    <span className="est-block-hint">{lang === 'TE' ? 'చెల్లింపు ముందు ఎప్పుడైనా మార్చుకోవచ్చు' : 'Change it any time before payment'}</span>
                  </div>
                  <div className="est-intent-grid">
                    <OptionCard
                      selected={intent === SERVICE_INTENTS.EDIT_PRINT}
                      onClick={() => setIntent(SERVICE_INTENTS.EDIT_PRINT)}
                      icon={<Crown size={20} />}
                      title={tService(SERVICE_INTENTS.EDIT_PRINT, lang)}
                      sub={lang === 'TE' ? 'ఒకే చోట — జట్టు లేదు. AP జంటల్లో 10 పేర్ 9 ఇదే.' : 'One roof, zero coordination. 9 in 10 AP couples choose this.'}
                      badge={lang === 'TE' ? 'మంచి వ్యాల్యూ' : 'BEST VALUE'}
                    />
                    <OptionCard
                      selected={intent === SERVICE_INTENTS.ONLY_EDITING}
                      onClick={() => setIntent(SERVICE_INTENTS.ONLY_EDITING)}
                      icon={<Scissors size={20} />}
                      title={tService(SERVICE_INTENTS.ONLY_EDITING, lang)}
                      sub={lang === 'TE' ? 'ప్రింట్ లోకల్‌లో చేస్తారు / డిజైన్ సిద్ధం' : 'You print locally, or design is ready.'}
                    />
                    <OptionCard
                      selected={intent === SERVICE_INTENTS.ONLY_PRINTING}
                      onClick={() => setIntent(SERVICE_INTENTS.ONLY_PRINTING)}
                      icon={<Printer size={20} />}
                      title={tService(SERVICE_INTENTS.ONLY_PRINTING, lang)}
                      sub={lang === 'TE' ? 'మీ డిజైన్ — మా రాయల్ ప్రెస్' : 'Your design, our Royal press & luxury finishes.'}
                    />
                    <OptionCard
                      selected={intent === SERVICE_INTENTS.STANDALONE}
                      onClick={() => setIntent(SERVICE_INTENTS.STANDALONE)}
                      icon={<Film size={20} />}
                      title={tService(SERVICE_INTENTS.STANDALONE, lang)}
                      sub={lang === 'TE' ? 'ఆల్బమ్ కాదు — వీడియో, ఇన్విట్స్, ఫ్లెక్స్' : 'No album — just video, invites or flex.'}
                    />
                  </div>
                  <p className="est-intent-foot">
                    {lang === 'TE'
                      ? 'క్లబ్ లేదా వేరు? ప్యాకేజీలు కింద ఉన్నాయి — లేదా ప్రతి సేవను వేరుగా ఎన్నుకోండి.'
                      : 'Club it or split it? Packages are ready below — or configure each service separately.'}
                  </p>
                </div>
              )}

              {/* 📦 SysAdmin bundled packages (step 1) */}
              {step === 1 && renderPackagesPanel()}

              {/* STEP 2 & 3 */}
              {step > 1 && <div className="est-stepbody">{stepBody}</div>}

              {/* nav */}
              <div className="est-stepnav">
                <button
                  type="button"
                  className="btn btn-outline est-back"
                  style={{ visibility: step === 1 ? 'hidden' : 'visible' }}
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                >
                  <ArrowLeft size={15} /> {lang === 'TE' ? 'వెనుకకు' : 'Back'}
                </button>
                {step < 3 ? (
                  <button type="button" className="btn btn-gold-3d est-next" onClick={() => setStep((s) => s + 1)}>
                    {lang === 'TE' ? 'ముందుకు' : 'Continue'} <ArrowRight size={15} />
                  </button>
                ) : (
                  <Link to={orderUrl} className="btn btn-gold-3d est-next">
                    {lang === 'TE' ? 'ఆర్డర్ మొదలుపెట్టండి' : ctaText} <ArrowRight size={15} />
                  </Link>
                )}
              </div>
            </div>

            {/* ── Desktop receipt rail ── */}
            <div className="est-output">
              <div className="est-output-badge">
                <Sparkles size={14} />
                <span>{lang === 'TE' ? 'లైవ్ కొటేషన్' : 'Live itemised quote'}</span>
              </div>
              <div className="est-price-box">
                <div className="est-price-val" aria-live="polite">{fmt(quote.total)}</div>
                {quote.savings > 0 && (
                  <div className="est-save-chip">
                    👑 {lang === 'TE' ? 'ఆదా' : 'You save'} {fmt(quote.savings)} ({lang === 'TE' ? 'బండిల్' : 'bundle'})
                  </div>
                )}
                {appliedPackage && (() => {
                  const pkg = livePackages.find((p) => (p.id || p.tier) === appliedPackage)
                    || DEFAULT_B2C_PACKAGES.find((p) => (p.id || p.tier) === appliedPackage);
                  return (
                    <button
                      type="button"
                      className="est-pkg-chip"
                      title={lang === 'TE' ? 'ప్యాకేజీ అనుబంధం తీసివేయి' : 'Detach package'}
                      onClick={() => setAppliedPackage(null)}
                    >
                      📦 {lang === 'TE' && pkg?.tierTe ? pkg.tierTe : (pkg?.tier || appliedPackage)} ✕
                    </button>
                  );
                })()}
                <div className="est-price-meta">
                  {quote.albumInScope
                    ? `${quote.pages} ${lang === 'TE' ? 'పేజీలు' : 'pages'} · ${quote.sheets} ${lang === 'TE' ? 'షీట్లు' : 'sheets'}`
                    : (lang === 'TE' ? 'అదనపు సేవలు' : 'Add-ons quote')}
                </div>
              </div>

              <QuoteReceipt quote={quote} lang={lang} />

              <div className="est-output-actions">
                <Link to={orderUrl} className="btn btn-gold-3d est-cta-btn">
                  {lang === 'TE' ? 'ఆర్డర్ మొదలుపెట్టండి' : ctaText} <ArrowRight size={16} />
                </Link>
                <a
                  href={`https://wa.me/919876543210?text=${encodeURIComponent(waText)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn btn-outline est-whatsapp-quote-btn"
                >
                  <MessageCircle size={16} /> {lang === 'TE' ? 'వాట్సాప్‌కి పంపండి' : 'Send to WhatsApp'}
                </a>
                <div className="est-nopay-note">
                  {lang === 'TE'
                    ? 'ఇప్పుడు చెల్లింపు అవసరం లేదు — మొదట ఫోటోలు షేర్ చేసి ఫ్రీ ప్రివ్యూ తీసుకోండి.'
                    : 'No payment needed now — share photos first, get a free preview.'}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* ── Mobile sticky bar + expandable sheet ── */}
        <div className="est-mobilebar" data-open={mobileOpen}>
          <button type="button" className="est-mobilebar-main" onClick={() => setMobileOpen((v) => !v)} aria-expanded={mobileOpen}>
            <span className="est-mobilebar-cap">
              {quote.albumInScope ? `${quote.pages} ${lang === 'TE' ? 'పేజీలు' : 'pages'}` : (lang === 'TE' ? 'కొటేషన్' : 'Quote')}
              <em>{lang === 'TE' ? 'మీ కొటేషన్' : 'Your quote'} · {quote.deliveryEtaText}</em>
            </span>
            <span className="est-mobilebar-total">{fmt(quote.total)}</span>
            <span className="est-mobilebar-cta">
              {mobileOpen ? (lang === 'TE' ? 'మూసివేయి ▲' : 'Close ▲') : (lang === 'TE' ? 'వివరాలు ▼' : 'Breakdown ▼')}
            </span>
          </button>
          <div className="est-mobile-sheet">
            <QuoteReceipt quote={quote} lang={lang} />
            <div className="est-mobile-sheet-actions">
              <a
                href={`https://wa.me/919876543210?text=${encodeURIComponent(waText)}`}
                target="_blank" rel="noopener noreferrer"
                className="btn btn-outline est-whatsapp-quote-btn"
              >
                <MessageCircle size={15} /> {lang === 'TE' ? 'వాట్సాప్' : 'WhatsApp'}
              </a>
              <Link to={orderUrl} className="btn btn-gold-3d est-cta-btn">
                {lang === 'TE' ? 'ఆర్డర్ మొదలుపెట్టండి' : ctaText} <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
