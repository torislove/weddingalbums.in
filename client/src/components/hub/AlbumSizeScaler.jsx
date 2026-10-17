import React, { useState } from 'react';
import { Maximize2, Sparkles, BookOpen, UserCheck, Coffee, Gift } from 'lucide-react';
import './AlbumSizeScaler.css';

const DEFAULT_INDIAN_SIZES = [
  {
    id: "size-14x40",
    title: "14×40 Magnum Royal Mandap Edition",
    openSpread: "14\" Height × 40\" Width Spread",
    dimensionsCm: "35.5 cm (H) × 101.6 cm (W)",
    closedSize: "14\" × 20\"",
    telugu: "14×40 మాగ్నమ్ రాయల్ ఎడిషన్",
    clientBasePrice: 16500,
    clientPriceBadge: "₹16,500 (30 Sheets / 60 Pages)",
    description: "The most colossal wedding album crafted in South India. Unfolds to an immense 40-inch panoramic vista — perfect for wide stage mandap shots and 100-member family groups.",
    widthRatio: 40,
    heightRatio: 14,
    orientation: "landscape",
    scaleCategory: "big",
    tag: "Colossal Landscape",
    humanScale: "Grand Tabletop Spread (Wider than adult armspan)",
    sampleSpreadImage: "/images/weddingalbums-layflat-album.png"
  },
  {
    id: "size-12x36",
    title: "12×36 Grand Imperial (The Telugu Standard)",
    openSpread: "12\" Height × 36\" Width Spread",
    dimensionsCm: "30.5 cm (H) × 91.4 cm (W)",
    closedSize: "12\" × 18\"",
    telugu: "12×36 గ్రాండ్ ఇంపీరియల్ (స్టాండర్డ్)",
    clientBasePrice: 12500,
    clientPriceBadge: "₹12,500 (30 Sheets / 60 Pages)",
    description: "The definitive gold standard across Andhra Pradesh & Telangana studios. Generous 36-inch cinematic spreads deliver breathtaking edge-to-edge impact.",
    widthRatio: 36,
    heightRatio: 12,
    orientation: "landscape",
    scaleCategory: "big",
    tag: "Definitive AP Standard",
    humanScale: "Full 3-Foot Panoramic Spread",
    sampleSpreadImage: "/images/weddingalbums-talambralu.png"
  },
  {
    id: "size-12x30",
    title: "12×30 Royal Wide Panoramic",
    openSpread: "12\" Height × 30\" Width Spread",
    dimensionsCm: "30.5 cm (H) × 76.2 cm (W)",
    closedSize: "12\" × 15\"",
    telugu: "12×30 రాయల్ వైడ్ స్ప్రెడ్",
    clientBasePrice: 10500,
    clientPriceBadge: "₹10,500 (30 Sheets / 60 Pages)",
    description: "Perfect widescreen proportions with balanced weight and tabletop presence. Ideal for candid storytelling and bridal portrait spreads.",
    widthRatio: 30,
    heightRatio: 12,
    orientation: "landscape",
    scaleCategory: "big",
    tag: "Cinema Landscape",
    humanScale: "2.5-Foot Widescreen Coffee Table Spread",
    sampleSpreadImage: "/images/weddingalbums-layflat-album.png"
  },
  {
    id: "size-10x30",
    title: "10×30 Slim Cinema Landscape",
    openSpread: "10\" Height × 30\" Width Spread",
    dimensionsCm: "25.4 cm (H) × 76.2 cm (W)",
    closedSize: "10\" × 15\"",
    telugu: "10×30 స్లిమ్ సినిమా స్ప్రెడ్",
    clientBasePrice: 9200,
    clientPriceBadge: "₹9,200 (30 Sheets / 60 Pages)",
    description: "Modern ultra-wide aspect ratio with a sleek 10-inch height. Extremely photogenic for outdoor receptions and coastal beach shoots.",
    widthRatio: 30,
    heightRatio: 10,
    orientation: "landscape",
    scaleCategory: "medium",
    tag: "Slim Landscape",
    humanScale: "Sleek 30-Inch Cinematic Vista",
    sampleSpreadImage: "/images/prewedding.jpg"
  },
  {
    id: "size-12x24",
    title: "12×24 Classic Celebration Square",
    openSpread: "12\" Height × 24\" Width Spread",
    dimensionsCm: "30.5 cm (H) × 61.0 cm (W)",
    closedSize: "12\" × 12\" (Square)",
    telugu: "12×24 క్లాసిక్ సెలబ్రేషన్ (స్క్వేర్)",
    clientBasePrice: 8500,
    clientPriceBadge: "₹8,500 (30 Sheets / 60 Pages)",
    description: "Symmetrical 12×12 closed square album opening to a wide 24-inch spread. Sleek, comfortable to hold on laps during family viewings.",
    widthRatio: 24,
    heightRatio: 12,
    orientation: "square",
    scaleCategory: "medium",
    tag: "Square Standard",
    humanScale: "Lap-Friendly 2-Foot Wide Square Edition",
    sampleSpreadImage: "/images/weddingalbums-layflat-album.png"
  },
  {
    id: "size-10x20",
    title: "10×20 Compact Celebration Square",
    openSpread: "10\" Height × 20\" Width Spread",
    dimensionsCm: "25.4 cm (H) × 50.8 cm (W)",
    closedSize: "10\" × 10\" (Square)",
    telugu: "10×20 కాంపాక్ట్ స్క్వేర్",
    clientBasePrice: 7200,
    clientPriceBadge: "₹7,200 (25 Sheets / 50 Pages)",
    description: "Chic 10×10 closed square format opening to 20 inches. A favorite for contemporary couple pre-weddings, mehendi, and sangeet albums.",
    widthRatio: 20,
    heightRatio: 10,
    orientation: "square",
    scaleCategory: "small",
    tag: "Square Compact",
    humanScale: "Compact Square Tabletop Spread",
    sampleSpreadImage: "/images/bridal.jpg"
  },
  {
    id: "size-12x18-vert",
    title: "12×18 Royal Vertical Portrait Spread",
    openSpread: "18\" Height × 24\" Width Spread",
    dimensionsCm: "45.7 cm (H) × 61.0 cm (W)",
    closedSize: "18\" (H) × 12\" (W)",
    telugu: "12×18 రాయల్ వర్టికల్ పోర్ట్రెయిట్",
    clientBasePrice: 9800,
    clientPriceBadge: "₹9,800 (30 Sheets / 60 Pages)",
    description: "Magnificent vertical orientation. Full 18-inch standing height allows full-length bridal Kanjeevaram sarees and royal groom sherwani portraits to shine without horizontal cropping.",
    widthRatio: 24,
    heightRatio: 18,
    orientation: "vertical",
    scaleCategory: "big",
    tag: "Vertical Portrait",
    humanScale: "Majestic 18-Inch High Bridal Portrait Spread",
    sampleSpreadImage: "/images/bride-polished.jpg"
  },
  {
    id: "size-10x15-vert",
    title: "10×15 Editorial Vertical Portrait",
    openSpread: "15\" Height × 20\" Width Spread",
    dimensionsCm: "38.1 cm (H) × 50.8 cm (W)",
    closedSize: "15\" (H) × 10\" (W)",
    telugu: "10×15 ఎడిటోరియల్ వర్టికల్",
    clientBasePrice: 7600,
    clientPriceBadge: "₹7,600 (25 Sheets / 50 Pages)",
    description: "Fashion-forward vertical spread designed like an Italian Vogue fashion magazine. Ideal for Half-Saree (Langa Voni) ceremonies and bridal solo portraits.",
    widthRatio: 20,
    heightRatio: 15,
    orientation: "vertical",
    scaleCategory: "medium",
    tag: "Vertical Editorial",
    humanScale: "15-Inch High Fashion Magazine Spread",
    sampleSpreadImage: "/images/mangalya-dharana.png"
  },
  {
    id: "size-8x12-vert",
    title: "8×12 Traditional Vertical",
    openSpread: "12\" Height × 16\" Width Spread",
    dimensionsCm: "30.5 cm (H) × 40.6 cm (W)",
    closedSize: "12\" (H) × 8\" (W)",
    telugu: "8×12 సాంప్రదాయ వర్టికల్",
    clientBasePrice: 5800,
    clientPriceBadge: "₹5,800 (25 Sheets / 50 Pages)",
    description: "Compact vertical album perfect for cradle ceremonies (Uyyala), Upanayanam, and 1st birthdays. Easy to carry and store on standard home bookshelves.",
    widthRatio: 16,
    heightRatio: 12,
    orientation: "vertical",
    scaleCategory: "small",
    tag: "Vertical Compact",
    humanScale: "Standard Bookshelf Vertical Format",
    sampleSpreadImage: "/images/weddingalbums-home-hero.png"
  },
  {
    id: "size-6x9-pocket",
    title: "6×9 Companion Pocket Parent Mini Book",
    openSpread: "6\" Height × 18\" Width Miniature Spread",
    dimensionsCm: "15.2 cm (H) × 45.7 cm (W)",
    closedSize: "6\" × 9\" Miniature Handheld",
    telugu: "6×9 పేరెంట్స్ పాకెట్ మినీ ఆల్బమ్",
    clientBasePrice: 3200,
    clientPriceBadge: "₹3,200 / book",
    description: "Exact replica of the grand wedding album scaled down into an elegant handheld format to gift parents, grandparents, and close relatives.",
    widthRatio: 18,
    heightRatio: 6,
    orientation: "pocket",
    scaleCategory: "small",
    tag: "Parent Pocket Book",
    humanScale: "Compact Handheld Mini Book (Travel Case Friendly)",
    sampleSpreadImage: "/images/weddingalbums-talambralu.png"
  }
];

export default function AlbumSizeScaler({ sizes = DEFAULT_INDIAN_SIZES }) {
  const activeSizes = sizes && sizes.length ? sizes : DEFAULT_INDIAN_SIZES;
  const [selectedSizeId, setSelectedSizeId] = useState(activeSizes[1]?.id || activeSizes[0]?.id);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'landscape' | 'vertical' | 'square' | 'pocket'
  const [scaleReference, setScaleReference] = useState('hands'); // 'hands' | 'table' | 'box'

  const filteredSizes = activeSizes.filter(s => {
    if (activeFilter === 'all') return true;
    return s.orientation === activeFilter;
  });

  const selectedSize = activeSizes.find(s => s.id === selectedSizeId) || activeSizes[0];

  // Aspect ratio calculations for SVG spread rendering
  const aspectRatio = (selectedSize.widthRatio / selectedSize.heightRatio) || (36 / 12);
  const maxContainerWidth = 600;
  const computedHeight = Math.min(320, maxContainerWidth / aspectRatio);

  return (
    <div className="album-scaler-container">
      {/* Header */}
      <div className="album-scaler-header text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 border border-[var(--brand)]/30 text-[var(--brand)] text-xs font-semibold mb-3 tracking-widest uppercase">
          <Maximize2 size={13} />
          <span>Interactive Dimensions Scaler</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">
          Compare All 10 Indian Market Album Sizes
        </h2>
        <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto font-sans">
          From colossal 40-inch stage mandap spreads and Andhra's flagship 12×36 Karizma to 18-inch vertical bridal portrait books and pocket parent gifts.
        </p>
      </div>

      {/* Orientation Category Filter Buttons */}
      <div className="scaler-orientation-filters">
        {[
          { id: 'all', label: '🌟 All Dimensions (10)' },
          { id: 'landscape', label: '🌅 Landscape & Panoramic (4)' },
          { id: 'vertical', label: '📱 Royal Vertical / Portrait (3)' },
          { id: 'square', label: '📐 Square Formats (2)' },
          { id: 'pocket', label: '🎁 Pocket Parent Books (1)' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`scaler-filter-tab ${activeFilter === filter.id ? 'active' : ''}`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Main Interactive Stage */}
      <div className="scaler-stage-grid">
        {/* Left Column: Visual Aspect Ratio Simulator */}
        <div className="scaler-display-card">
          {/* Reference Scale Switcher */}
          <div className="scaler-reference-bar">
            <span className="reference-label">Visual Size Reference:</span>
            <div className="reference-buttons">
              <button
                onClick={() => setScaleReference('hands')}
                className={`ref-btn ${scaleReference === 'hands' ? 'active' : ''}`}
                title="Compare against human hands & armspan"
              >
                <UserCheck size={14} /> <span>Hands</span>
              </button>
              <button
                onClick={() => setScaleReference('table')}
                className={`ref-btn ${scaleReference === 'table' ? 'active' : ''}`}
                title="Compare against coffee table"
              >
                <Coffee size={14} /> <span>Tabletop</span>
              </button>
              <button
                onClick={() => setScaleReference('box')}
                className={`ref-btn ${scaleReference === 'box' ? 'active' : ''}`}
                title="Compare against presentation box"
              >
                <Gift size={14} /> <span>Gift Box</span>
              </button>
            </div>
          </div>

          {/* Interactive Open Spread Container */}
          <div className="scaler-spread-view-box">
            <div
              className={`album-open-spread-mockup ${selectedSize.orientation}`}
              style={{
                aspectRatio: `${selectedSize.widthRatio} / ${selectedSize.heightRatio}`,
                maxHeight: '340px'
              }}
            >
              {/* Left Page Half */}
              <div className="album-page-half left-page">
                <img
                  src={selectedSize.sampleSpreadImage || '/images/weddingalbums-layflat-album.png'}
                  alt="Left spread"
                  className="spread-img"
                  loading="lazy"
                />
                <div className="page-shimmer" />
              </div>

              {/* Seamless Center Layflat Gutter */}
              <div className="layflat-center-gutter">
                <div className="gutter-spine-shadow" />
              </div>

              {/* Right Page Half */}
              <div className="album-page-half right-page">
                <img
                  src={selectedSize.sampleSpreadImage || '/images/weddingalbums-talambralu.png'}
                  alt="Right spread"
                  className="spread-img"
                  loading="lazy"
                />
                <div className="page-shimmer" />
              </div>

              {/* Spread Dimensions Overlay Tag */}
              <div className="spread-dimension-tag">
                <span>{selectedSize.openSpread}</span>
                <span className="dimension-sub">{selectedSize.dimensionsCm}</span>
              </div>
            </div>

            {/* Scale Comparison Reference Illustration */}
            <div className="scaler-reference-backdrop">
              {scaleReference === 'hands' && (
                <div className="reference-visual hands-visual">
                  <div className="human-armspan-line" />
                  <span className="ref-note">🖐️ Human Armspan Comparison: {selectedSize.humanScale}</span>
                </div>
              )}
              {scaleReference === 'table' && (
                <div className="reference-visual table-visual">
                  <div className="coffee-table-outline" />
                  <span className="ref-note">☕ Standard 48×24" Living Room Coffee Table</span>
                </div>
              )}
              {scaleReference === 'box' && (
                <div className="reference-visual box-visual">
                  <div className="gift-box-outline" />
                  <span className="ref-note">🎁 Matching Handcrafted Presentation Box Included</span>
                </div>
              )}
            </div>
          </div>

          {/* Size Dimension Specs Bar */}
          <div className="scaler-metrics-row">
            <div className="scaler-metric">
              <span className="m-label">Open Panoramic Spread</span>
              <span className="m-val text-[var(--brand)] font-mono">{selectedSize.openSpread}</span>
            </div>
            <div className="scaler-metric">
              <span className="m-label">Closed Book Dimensions</span>
              <span className="m-val text-white font-mono">{selectedSize.closedSize}</span>
            </div>
            <div className="scaler-metric">
              <span className="m-label">Metric Centimeters</span>
              <span className="m-val text-cyan-400 font-mono">{selectedSize.dimensionsCm}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Size Selection List & Details */}
        <div className="scaler-sizes-list-column">
          <div className="scaler-cards-scrollable">
            {filteredSizes.map(s => {
              const isSelected = s.id === selectedSize.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedSizeId(s.id)}
                  className={`scaler-size-item-card ${isSelected ? 'active' : ''}`}
                >
                  <div className="item-card-top">
                    <span className="item-card-tag">{s.tag}</span>
                    <span className="item-card-price">{s.clientPriceBadge?.split(' ')[0]}</span>
                  </div>
                  <h4 className="item-card-title">{s.title}</h4>
                  <div className="item-card-telugu">{s.telugu}</div>
                  <div className="item-card-spread font-mono">{s.openSpread}</div>
                  <p className="item-card-desc">{s.description}</p>
                </div>
              );
            })}
          </div>

          {/* Selected Size Action Bar */}
          <div className="scaler-action-card">
            <div className="flex justify-between items-center mb-3">
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Selected Edition</div>
                <div className="font-serif text-lg text-white font-bold">{selectedSize.title}</div>
              </div>
              <div className="font-mono text-base font-bold text-[var(--brand)] bg-[var(--brand)]/15 px-3 py-1 rounded-full border border-[var(--brand)]/30">
                {selectedSize.clientPriceBadge}
              </div>
            </div>

            <div className="flex gap-2">
              <a
                href={`/order?size=${selectedSize.id}`}
                className="btn btn-gold-3d flex-1 text-center py-2.5 font-bold text-sm"
              >
                Configure This Size →
              </a>
              <a
                href="#estimator"
                className="btn btn-outline py-2.5 px-3 text-xs font-semibold"
              >
                Estimate Cost
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
