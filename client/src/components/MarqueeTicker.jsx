import React, { useEffect, useRef } from 'react';
import './MarqueeTicker.css';

/**
 * MarqueeTicker — seamless infinite ticker.
 *
 * Bug fixes vs the old version:
 * 1. NO restart on hover — old effect re-ran when isHovered changed and reset
 *    position to 0, causing a visible JUMP every time the mouse touched it.
 * 2. Time-based motion — old code advanced px/per-frame, so speed differed on
 *    60Hz vs 120Hz/144Hz monitors, plus "scroll velocity" injection made it
 *    stutter-jump whenever the user scrolled.
 * 3. Measured-width seam — old CSS forced the track to a fixed 200% width and
 *    each set to 50%; when the item list didn't fill the container a blank gap
 *    band was visible on loop. Now sets are content-sized and the loop wraps
 *    on the measured pixel width of ONE set.
 * 4. Fewer than ~2 visible sets / empty / hidden-only lists no longer render
 *    a broken blank strip.
 * 5. Honours prefers-reduced-motion (renders statically).
 */

// px per second per speed-unit at any refresh rate.
const PX_PER_SEC_PER_SPEED = 18;
const COPIES = 4; // enough sets that wide screens never run out of content

const MarqueeTicker = ({ items, speed = 1, reverse = false }) => {
  const trackRef = useRef(null);

  const visibleItems = (items || []).filter(
    (item) => (typeof item === 'object' && item !== null ? !item.isHidden : true),
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track || visibleItems.length === 0) return undefined;

    const reduceMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    let raf = 0;
    let offset = 0;
    let setWidth = 0;
    let last = performance.now();

    const tick = (now) => {
      const dt = Math.min(96, now - last); // clamp tab-switch jumps
      last = now;
      if (!setWidth) setWidth = track.scrollWidth / COPIES; // measure once rendered
      if (setWidth > 0) {
        const step = (speed * PX_PER_SEC_PER_SPEED * dt) / 1000; // px advance this frame
        const dir = reverse ? -1 : 1;
        offset = (offset + dir * step) % setWidth;
        if (offset < 0) offset += setWidth; // keep positive → seamless wrap both ways
        track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, speed, reverse]);

  if (visibleItems.length === 0) return null;

  const labelText = visibleItems
    .map((i) => (typeof i === 'object' && i !== null ? i.value || i.title || i.text || '' : i))
    .join(', ');

  const renderSet = (copy) => (
    <div className="marquee-content" key={copy} aria-hidden={copy > 0 || undefined}>
      {visibleItems.map((item, index) => {
        const displayText =
          typeof item === 'object' && item !== null ? item.value || item.title || item.text || '' : item;
        return (
          <React.Fragment key={index}>
            <span className="marquee-item">{displayText}</span>
            <span className="marquee-separator">✦</span>
          </React.Fragment>
        );
      })}
    </div>
  );

  return (
    <div className="marquee-container" role="marquee" aria-label={labelText}>
      <div className="marquee-track" ref={trackRef}>
        {Array.from({ length: COPIES }, (_, copy) => renderSet(copy))}
      </div>
    </div>
  );
};

export default MarqueeTicker;
