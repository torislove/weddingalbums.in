import React, { useState } from 'react';
import { Smartphone, Flag, Sparkles, Image, CheckCircle, ArrowRight, MessageCircle } from 'lucide-react';
import './EventFlexShowcase.css';

const DEFAULT_FLEX_ITEMS = [
  {
    id: "whatsapp-video-invite",
    title: "60s 4K Animated WhatsApp Video Invitation",
    telugu: "వాట్సాప్ వీడియో ఆహ్వాన పత్రిక (4K)",
    desc: "Cinematic animated vertical 9:16 invitation video with sacred devotional chants or romantic melodies, Muhurtham timing, bride & groom photos, and embedded Google Maps venue QR code link.",
    clientPriceBadge: "from ₹1,800",
    turnaround: "24 Hours SLA",
    features: ["4K 9:16 vertical smartphone format", "Sacred Mangala Vaadhyam audio sync", "Auspicious Muhurtham details", "Google Maps venue location link"],
    image: "/images/weddingalbums-home-hero.png",
    formatType: "Digital Video (9:16)"
  },
  {
    id: "mandap-entrance-flex",
    title: "Grand Mandap Entrance Flex Banners (10×8 / 12×10 ft)",
    telugu: "కళ్యాణ మండపం స్వాగత ఫ్లెక్స్ బ్యానర్లు",
    desc: "High-DPI vector design and HD star flex printing for Kalyana Mandapam entrance arches. Custom Lord Venkateswara, floral rangoli, and temple arch motifs.",
    clientPriceBadge: "from ₹1,800",
    turnaround: "24 Hours",
    features: ["10×8 ft & 12×10 ft standard venue sizes", "Tirupati Balaji & Padmavathi motifs", "High-gauge weatherproof star flex", "Reinforced metal eyelets for easy hanging"],
    image: "/images/weddingalbums-talambralu.png",
    formatType: "Large Format Flex"
  },
  {
    id: "highway-hoarding",
    title: "Highway & Roadside Wedding Hoarding (up to 40×20 ft)",
    telugu: "హైవే & సిటీ రోడ్ సైడ్ హోర్డింగ్ డిజైన్",
    desc: "Ultra-large format billboard designs up to 40×20 ft. Rendered in high-resolution vector lines ensuring crystal-sharp viewing from highways and city circles.",
    clientPriceBadge: "from ₹4,200",
    turnaround: "48 Hours",
    features: ["Up to 40×20 ft vector rendering", "Vibrant colors visible at 80 km/h", "Print-ready high-DPI TIFF/PDF", "Custom city landmark guides"],
    image: "/images/weddingalbums-layflat-album.png",
    formatType: "Billboard Hoarding"
  },
  {
    id: "rollup-standees",
    title: "Welcome Roll-Up Standees with Aluminum Stand (6×2.5 ft)",
    telugu: "వెల్కమ్ రోల్-అప్ స్టాండీలు (6×2.5 ft)",
    desc: "Heavy-duty aluminum pull-up banner stands with anti-curl non-tearable printed film. Portable and easy to place at dining halls, mandap doors, and stage stairs.",
    clientPriceBadge: "from ₹1,400",
    turnaround: "24 Hours",
    features: ["6×2.5 ft portable display", "Non-curl anti-tear film", "Heavy aluminum base & carry bag", "Reusable hardware mechanism"],
    image: "/images/prewedding.jpg",
    formatType: "Roll-Up Standee"
  },
  {
    id: "telugu-patrika-foil",
    title: "Traditional Gold Foil Wedding Patrika & Cards",
    telugu: "బంగారు ఫాయిల్ వివాహ ఆహ్వాన పత్రికలు (శుభలేఖ)",
    desc: "Authentic Telugu typography (శుభలేఖ) embossed with 24K gold hot-foil stamping on thick 400 GSM imported cardstock, acrylic cards, and regal velvet envelopes.",
    clientPriceBadge: "from ₹4,500 (100 cards)",
    turnaround: "3-5 Days",
    features: ["Traditional Telugu Shloka & script", "24K hot-stamped gold foil", "Laser-cut floral jaali envelopes", "Custom wax seal monograms"],
    image: "/images/luxury-album-craftsmanship.jpg",
    formatType: "Physical Invitation"
  },
  {
    id: "lifesize-cutouts",
    title: "Life-Size Couple Photo Cutouts (Sunboard)",
    telugu: "లైఫ్ సైజ్ కపుల్ ఫోటో కటౌట్లు",
    desc: "Life-size 5.5 to 6-ft rigid sunboard cutouts of the bride and groom in reception attire with sturdy collapsible back easels. Major attraction for selfie zones.",
    clientPriceBadge: "from ₹2,600",
    turnaround: "48 Hours",
    features: ["CNC contour cut around couple", "5mm high-density sunboard", "Reinforced back easel stand", "Popular selfie point centerpiece"],
    image: "/images/bride-polished.jpg",
    formatType: "Photo Cutout"
  }
];

export default function EventFlexShowcase({ items = DEFAULT_FLEX_ITEMS }) {
  const activeItems = items && items.length ? items : DEFAULT_FLEX_ITEMS;
  const [selectedItemId, setSelectedItemId] = useState(activeItems[0].id);

  const selectedItem = activeItems.find(i => i.id === selectedItemId) || activeItems[0];

  return (
    <div className="flex-showcase-container">
      {/* Header */}
      <div className="flex-showcase-header text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/10 border border-[var(--brand)]/30 text-[var(--brand)] text-xs font-semibold mb-3 tracking-widest uppercase">
          <Flag size={13} />
          <span>Separated Category: Invitations & Signage</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-serif text-white mb-2">
          Wedding Invitations, Mandap Flexies & Hoardings
        </h2>
        <p className="text-sm md:text-base text-gray-300 max-w-2xl mx-auto font-sans">
          From 60-second 4K WhatsApp animated invitations with Google Maps links to colossal 40-foot roadside highway hoardings and sacred Kalyana Mandapam entrance flex banners.
        </p>
      </div>

      {/* Grid of Items */}
      <div className="flex-items-grid">
        {activeItems.map((item, idx) => {
          const isSelected = item.id === selectedItem.id;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedItemId(item.id)}
              className={`flex-card ${isSelected ? 'active' : ''}`}
            >
              <div className="flex-card-image-box">
                <img src={item.image} alt={item.title} className="flex-card-img" loading="lazy" />
                <span className="flex-card-format-tag">{item.formatType}</span>
                <span className="flex-card-price-badge">{item.clientPriceBadge}</span>
              </div>
              <div className="flex-card-body">
                <h3 className="flex-card-title">{item.title}</h3>
                <div className="flex-card-telugu">{item.telugu}</div>
                <p className="flex-card-desc">{item.desc}</p>

                <div className="flex-features-list">
                  {item.features?.slice(0, 3).map((feat, fIdx) => (
                    <div key={fIdx} className="flex-feature-row">
                      <CheckCircle size={13} className="text-[var(--brand)] shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <div className="flex-card-footer">
                  <span className="flex-turnaround-badge">⏱️ {item.turnaround}</span>
                  <a
                    href={`https://wa.me/919876543210?text=${encodeURIComponent(`నమస్కారం! నేను ${item.title} (${item.telugu}) గురించి తెలుసుకోవాలనుకుంటున్నాను.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-whatsapp-link"
                    title="WhatsApp Enquiry"
                  >
                    <MessageCircle size={15} />
                    <span>Enquire</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
