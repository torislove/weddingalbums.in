import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Clock, CheckCircle2, ArrowRight, Sparkles, Shield, Truck } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import './InstantEstimator.css';

const SIZES = [
  { id: '12x18', label: '12×18 Mini', sub: 'Compact Portability', basePrice: 4200 },
  { id: '12x24', label: '12×24 Standard', sub: 'Popular Choice', basePrice: 5800 },
  { id: '12x30', label: '12×30 Grand', sub: 'Luxury Panoramic', basePrice: 7400 },
  { id: '12x36', label: '12×36 Royal', sub: 'Ultimate Heirloom', basePrice: 8900 }
];

const COVERS = [
  { id: 'acrylic', label: 'Diamond Acrylic 3D', sub: '+₹2,500', extra: 2500 },
  { id: 'velvet', label: 'Plush Royal Velvet', sub: '+₹1,800', extra: 1800 },
  { id: 'briefcase', label: 'Leatherette + Briefcase', sub: '+₹3,200', extra: 3200 },
  { id: 'classic', label: 'Classic Linen Deboss', sub: '+₹1,200', extra: 1200 }
];

const ADDONS = [
  { id: 'reels', label: '5-Pack Viral 9:16 Cinematic Reels', price: 2999 },
  { id: 'drone', label: '4K Drone Footage Color Correction', price: 1999 },
  { id: 'express', label: 'Priority Express Delivery (48 Hours)', price: 1499 }
];

const InstantEstimator = ({
  eyebrow = '✦ TRANSPARENT STUDIO PRICING ✦',
  title = 'Instant Album & Video Cost Estimator',
  subtitle = 'Customize your dimensions, cover finishes, and post-production add-ons to get a real-time price and delivery schedule.',
  ctaText = 'Lock In Estimate & Start Order',
  ctaLink = '/order'
}) => {
  const [selectedSize, setSelectedSize] = useState('12x36');
  const [sheets, setSheets] = useState(40);
  const [selectedCover, setSelectedCover] = useState('acrylic');
  const [selectedAddons, setSelectedAddons] = useState(['reels']);

  const toggleAddon = (id) => {
    setSelectedAddons(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const calculation = useMemo(() => {
    const sizeObj = SIZES.find(s => s.id === selectedSize) || SIZES[3];
    const coverObj = COVERS.find(c => c.id === selectedCover) || COVERS[0];
    
    // Base sheets included is 30. Extra sheets are ₹120 each.
    const extraSheets = Math.max(0, sheets - 30);
    const sheetsCost = extraSheets * 120;

    const addonsCost = selectedAddons.reduce((sum, id) => {
      const match = ADDONS.find(a => a.id === id);
      return sum + (match ? match.price : 0);
    }, 0);

    const total = sizeObj.basePrice + coverObj.extra + sheetsCost + addonsCost;
    const isExpress = selectedAddons.includes('express');

    return {
      total,
      turnaround: isExpress ? '2-3 Business Days (Express Air)' : '5-7 Business Days (Standard)',
      photosCapacity: sheets * 5
    };
  }, [selectedSize, sheets, selectedCover, selectedAddons]);

  return (
    <section className="est-section">
      <div className="container">
        {/* Section Header */}
        <div className="text-center est-header">
          <ScrollReveal>
            <div className="est-eyebrow">{eyebrow}</div>
            <h2 className="est-title font-serif text-gradient">{title}</h2>
            <p className="est-subtitle">{subtitle}</p>
          </ScrollReveal>
        </div>

        {/* 2-Column Calculator Card */}
        <ScrollReveal delay={120}>
          <div className="est-card">
            {/* Left Column: Interactive Controls */}
            <div className="est-controls">
              {/* Size Selector */}
              <div className="est-control-group">
                <div className="est-control-label">
                  <span>1. Choose Panoramic Album Size</span>
                  <span className="est-label-highlight">{selectedSize} Spreads</span>
                </div>
                <div className="est-choices">
                  {SIZES.map(s => (
                    <button
                      key={s.id}
                      type="button"
                      className={`est-choice-btn ${selectedSize === s.id ? 'active' : ''}`}
                      onClick={() => setSelectedSize(s.id)}
                    >
                      <span>{s.label}</span>
                      <span className="est-choice-sub">{s.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sheets Slider */}
              <div className="est-control-group">
                <div className="est-control-label">
                  <span>2. Album Sheets (Pages = Sheets × 2)</span>
                  <span className="est-label-highlight">{sheets} Sheets ({sheets * 2} Pages · ~{calculation.photosCapacity} Photos)</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="70"
                  step="5"
                  value={sheets}
                  onChange={e => setSheets(Number(e.target.value))}
                  className="est-range-input"
                />
                <div className="est-range-ticks">
                  <span>20 Sheets (40 Pgs)</span>
                  <span>40 Sheets (80 Pgs)</span>
                  <span>70 Sheets (140 Pgs)</span>
                </div>
              </div>

              {/* Cover Finish */}
              <div className="est-control-group">
                <div className="est-control-label">
                  <span>3. Master Cover Finish</span>
                  <span className="est-label-highlight">
                    {COVERS.find(c => c.id === selectedCover)?.label}
                  </span>
                </div>
                <div className="est-choices">
                  {COVERS.map(c => (
                    <button
                      key={c.id}
                      type="button"
                      className={`est-choice-btn ${selectedCover === c.id ? 'active' : ''}`}
                      onClick={() => setSelectedCover(c.id)}
                    >
                      <span>{c.label}</span>
                      <span className="est-choice-sub">{c.sub}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Addons */}
              <div className="est-control-group" style={{ marginBottom: 0 }}>
                <div className="est-control-label">
                  <span>4. Optional Post-Production Add-ons</span>
                  <span className="est-label-highlight">Selected ({selectedAddons.length})</span>
                </div>
                <div className="est-addons">
                  {ADDONS.map(addon => {
                    const isChecked = selectedAddons.includes(addon.id);
                    return (
                      <div
                        key={addon.id}
                        className={`est-addon-item ${isChecked ? 'selected' : ''}`}
                        onClick={() => toggleAddon(addon.id)}
                      >
                        <div className="est-addon-label">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}} // handled by parent onClick
                            className="est-checkbox"
                          />
                          <span>{addon.label}</span>
                        </div>
                        <span className="est-addon-price">+₹{addon.price.toLocaleString('en-IN')}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Live Price & Guarantee Output */}
            <div className="est-output">
              <div>
                <div className="est-output-badge">
                  <Sparkles size={14} />
                  <span>Real-time Studio Quote</span>
                </div>

                <div className="est-price-box">
                  <div className="est-price-caption">Estimated Investment</div>
                  <div className="est-price-val">₹{calculation.total.toLocaleString('en-IN')}</div>
                  <div className="text-xs text-gray-400">All Taxes & Custom Monogramming Included</div>
                </div>

                <div className="est-turnaround-box">
                  <Clock size={22} className="est-turnaround-icon" />
                  <div>
                    <div className="est-turnaround-title">Estimated Turnaround</div>
                    <div className="est-turnaround-days">{calculation.turnaround}</div>
                  </div>
                </div>

                <ul className="est-perks-list">
                  <li className="est-perk-item">
                    <CheckCircle2 size={16} className="est-perk-check" />
                    <span>Free 3D Digital Flipbook Preview before print</span>
                  </li>
                  <li className="est-perk-item">
                    <CheckCircle2 size={16} className="est-perk-check" />
                    <span>Free Doorstep Insured Courier (AP & Telangana)</span>
                  </li>
                  <li className="est-perk-item">
                    <CheckCircle2 size={16} className="est-perk-check" />
                    <span>Protective archival briefcase/cradle box included</span>
                  </li>
                  <li className="est-perk-item">
                    <CheckCircle2 size={16} className="est-perk-check" />
                    <span>Unlimited design revisions on spreads</span>
                  </li>
                </ul>
              </div>

              <div>
                <Link 
                  to={`${ctaLink}?size=${selectedSize}&sheets=${sheets}&cover=${selectedCover}&price=${calculation.total}`} 
                  className="btn btn-gold-3d est-cta-btn"
                >
                  {ctaText} <ArrowRight size={16} />
                </Link>
                <div className="text-center mt-3 text-xs text-gray-500">
                  No payment required to submit files and request a soft proof
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default InstantEstimator;
