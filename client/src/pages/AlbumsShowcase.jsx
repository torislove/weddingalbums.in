import React, { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { Camera, Layers, Sparkles, Image as ImageIcon } from 'lucide-react';
import './OrderAlbum.css'; // Reusing some base styles

const ALBUM_TYPES = [
  {
    id: 'acrylic',
    name: 'Premium Acrylic Cover',
    desc: 'Crystal clear glass-like finish that makes colors pop. Edge-to-edge printing for a modern look.',
    img: 'https://images.unsplash.com/photo-1544641979-51478546b3f7?auto=format&fit=crop&q=80&w=800',
    tags: ['Best Seller', 'Modern']
  },
  {
    id: 'leather',
    name: 'Classic Leather Bound',
    desc: 'Timeless luxury with genuine or vegan leather options. Custom embossing available in gold or silver.',
    img: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800',
    tags: ['Traditional', 'Premium']
  },
  {
    id: 'velvet',
    name: 'Royal Velvet Touch',
    desc: 'Soft, textured finish that screams luxury. Perfect for opulent Indian wedding aesthetics.',
    img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800',
    tags: ['Luxury', 'Trending']
  },
  {
    id: 'wooden',
    name: 'Rustic Wooden Engraved',
    desc: 'Eco-friendly wooden covers with custom laser-engraved names and dates.',
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    tags: ['Eco-Friendly', 'Unique']
  }
];

const PAPER_TYPES = [
  { name: 'Luster (Standard)', desc: 'Slight gloss, fingerprint resistant, vibrant colors.' },
  { name: 'Metallic / Pearl', desc: '3D shimmer effect, perfect for high-contrast nighttime wedding shots.' },
  { name: 'Velvet (Scuff-Free)', desc: 'Deep matte finish with a soft, feather-like touch. Scratch resistant.' },
  { name: 'Non-Tearable (NT)', desc: 'Water-resistant, extremely durable synthetic paper.' }
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
          <h1 className="text-5xl md:text-6xl font-serif text-[#D4AF37] mb-6">Our Craftsmanship</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover our premium range of wedding albums, featuring high-end materials, exquisite binding, and archival-quality paper types.
          </p>
        </ScrollReveal>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="flex justify-center gap-4 mb-12 border-b border-white/10 pb-4">
          <button 
            className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'covers' ? 'bg-[#D4AF37] text-black shadow-lg shadow-yellow-900/30' : 'bg-white/5 text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('covers')}
          >
            Cover Options
          </button>
          <button 
            className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'paper' ? 'bg-[#D4AF37] text-black shadow-lg shadow-yellow-900/30' : 'bg-white/5 text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('paper')}
          >
            Paper Finishes
          </button>
        </div>

        {activeTab === 'covers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {ALBUM_TYPES.map((album, idx) => (
              <ScrollReveal key={album.id} delay={idx * 100}>
                <div className="group rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:border-[#D4AF37]/50 transition-all cursor-pointer">
                  <div className="relative h-64 overflow-hidden">
                    <img src={album.img} alt={album.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute top-4 right-4 flex gap-2">
                      {album.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-full text-xs text-[#D4AF37] font-medium border border-[#D4AF37]/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-serif text-white mb-3 group-hover:text-[#D4AF37] transition-colors">{album.name}</h3>
                    <p className="text-gray-400 leading-relaxed">{album.desc}</p>
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
