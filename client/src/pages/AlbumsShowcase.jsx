import React, { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { Camera, Layers, Sparkles, Image as ImageIcon } from 'lucide-react';
import './OrderAlbum.css'; // Reusing some base styles

const ALBUM_TYPES = [
  {
    id: 'karizma',
    name: 'Karizma Royal Spread (12×36)',
    desc: "India's most beloved wedding album. Seamless 36-inch panoramic spreads on high-density Fine Art paper with rich golden lamination.",
    img: '/images/weddingalbums-talambralu.png',
    tags: ['Most Popular in AP ⭐', 'Royal Standard']
  },
  {
    id: 'acrylic',
    name: 'Premium Crystal Acrylic Cover',
    desc: '4mm diamond-polished glass face that makes couple portraits glow with 3D depth and crystalline clarity.',
    img: '/images/weddingalbums-layflat-album.png',
    tags: ['Ultra Luxury', 'Modern 3D']
  },
  {
    id: 'flushmount',
    name: 'Flush Mount Seamless Lay-Flat',
    desc: 'Pages open 100% flat with zero gutter loss. Mounted on heavy archival core sheets designed to resist humidity and sagging.',
    img: '/images/weddingalbums-home-hero.png',
    tags: ['100% Lay-Flat', 'Heirloom']
  },
  {
    id: 'velvet',
    name: 'Royal Velvet Touch Hardcover',
    desc: 'Soft, textured velvet fabric finish with embossed gold foil typography. Feather-touch feel with anti-scratch coating.',
    img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
    tags: ['Trending Luxury', 'Velvet Silk']
  },
  {
    id: 'leather',
    name: 'Classic Embossed Leatherette Box',
    desc: 'Timeless luxury with vegan leather binding, gold corner protectors, and a matching presentation suitcase box.',
    img: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
    tags: ['Traditional Heritage', 'Briefcase Box']
  },
  {
    id: 'parents',
    name: 'Duplicate Pocket Parent Albums',
    desc: 'Miniature luxury replicas of the couple album crafted specifically as sentimental gifts for parents and in-laws.',
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    tags: ['Parent Gift', 'Portable']
  }
];

const PAPER_TYPES = [
  { name: 'Velvet Silk Touch (Scuff-Free)', desc: 'Deep matte finish with a soft, feather-like touch. Scratch resistant and zero fingerprints.' },
  { name: 'Crystal High Gloss', desc: 'Glass-like high gloss reflection, bringing maximum brilliance and vibrancy to colorful sarees.' },
  { name: 'Metallic / Pearl Lustre', desc: '3D iridescent metallic shimmer effect, perfect for golden jewelry and nighttime mandap lighting.' },
  { name: 'Non-Tearable Synthetic (NT)', desc: 'Water-resistant, spill-proof, and virtually indestructible heavy composite sheet.' }
];

const AlbumsShowcase = () => {
  const [activeTab, setActiveTab] = useState('covers');

  return (
    <div className="pt-[120px] pb-[60px] min-h-screen">
      <div className="text-center mb-16">
        <ScrollReveal>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#996515] shadow-lg shadow-yellow-900/20 mb-6">
            <Layers size={32} className="text-black" />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#D4AF37] mb-4">Our Master Album Craftsmanship</h1>
          <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Printed on high-precision European digital presses with archival inks guaranteed to retain color fidelity for 100+ years.
          </p>
        </ScrollReveal>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-center gap-4 mb-12 border-b border-white/10 pb-4">
          <button 
            className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'covers' ? 'bg-[#D4AF37] text-black shadow-lg shadow-yellow-900/30' : 'bg-white/5 text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('covers')}
          >
            Album Types & Covers
          </button>
          <button 
            className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'paper' ? 'bg-[#D4AF37] text-black shadow-lg shadow-yellow-900/30' : 'bg-white/5 text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('paper')}
          >
            Paper Finishes
          </button>
        </div>

        {activeTab === 'covers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALBUM_TYPES.map((album, idx) => (
              <ScrollReveal key={album.id} delay={idx * 80}>
                <div className="group rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:border-[#D4AF37]/50 transition-all flex flex-col h-full">
                  <div className="relative h-56 overflow-hidden">
                    <img src={album.img} alt={album.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-3 right-3 flex flex-wrap gap-1 justify-end">
                      {album.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-0.5 bg-black/70 backdrop-blur-md rounded-full text-[11px] text-[#D4AF37] font-semibold border border-[#D4AF37]/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-serif text-white mb-2 group-hover:text-[#D4AF37] transition-colors">{album.name}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{album.desc}</p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-white/10 flex gap-2">
                      <a href="/order" className="btn btn-gold-3d text-xs py-2 px-3 flex-1 text-center font-bold">
                        Customize & Order →
                      </a>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}


        {activeTab === 'paper' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PAPER_TYPES.map((paper, idx) => (
              <ScrollReveal key={idx} delay={idx * 100}>
                <div className="p-8 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-start gap-4">
                  <div className="p-3 bg-[#D4AF37]/10 text-[#D4AF37] rounded-lg">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl text-white mb-2">{paper.name}</h3>
                    <p className="text-gray-400">{paper.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        <div className="mt-20 text-center p-12 bg-black/40 rounded-3xl border border-white/5">
          <h2 className="text-3xl font-serif text-white mb-4">Ready to print your masterpiece?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">Upload your designs or let our expert editing team create the perfect layout for you.</p>
          <a href="/order" className="btn btn-primary inline-flex items-center gap-2">
            Start Ordering <Camera size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AlbumsShowcase;
