import React, { useState, useRef, useEffect } from 'react';

/**
 * LazyImage — performance-first image loader for the premium surfaces.
 *
 * Two modes:
 *  1) Plain mode (noWrap): renders an <img> exactly where a raw <img> used to be,
 *     keeping existing CSS selectors (e.g. `.featured-item img`) intact, but adding
 *     viewport-based deferral + a soft blur->sharp arrival. Zero layout shift.
 *  2) Boxed mode (default): wraps in an aspect-ratio box with a shimmering skeleton.
 *
 * Accessibility & UX:
 * - `alt` is REQUIRED (C5): pass a described string for content images, or an
 *   explicit `alt=""` for purely decorative ones. A dev-only warning fires when
 *   `alt` is omitted so the gap is caught before it reaches production.
 * - Respects `prefers-reduced-motion` (no blur/transform, instant reveal).
 * - Defers network request until ~300px before entering the viewport.
 */
const LazyImage = ({ src, alt, ratio, className = '', style = {}, eager = false, noWrap = false, ...rest }) => {
  if (import.meta.env?.DEV && alt === undefined) {
    console.warn(
      '[LazyImage] Missing `alt`. Pass a description for content images, or alt="" for decorative ones.',
      { src }
    );
  }
  const altText = alt ?? '';
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(eager);
  const ref = useRef(null);

  useEffect(() => {
    if (visible) return;
    if (!('IntersectionObserver' in window)) { setVisible(true); return; }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: '300px 0px', threshold: 0.01 }
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [visible, src]);

  const imgProps = {
    src,
    alt: altText,
    loading: eager ? 'eager' : 'lazy',
    decoding: 'async',
    onLoad: () => setLoaded(true),
    'data-lazy': '',
    className: `${className} ${loaded ? 'img-loaded' : ''}`.trim(),
    ...rest,
  };

  if (noWrap) {
    return visible ? <img ref={ref} {...imgProps} /> : <span ref={ref} aria-hidden="true" />;
  }

  return (
    <div
      ref={ref}
      className={`lazy-frame ${loaded ? 'lazy-done' : ''} ${className}`}
      style={{ aspectRatio: ratio, ...style }}
    >
      {visible && <img {...imgProps} />}
    </div>
  );
};

export default LazyImage;
