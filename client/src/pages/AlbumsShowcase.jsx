import React, { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import LazyImage from '../components/LazyImage';
import { Camera, Layers, Sparkles, Image as ImageIcon } from 'lucide-react';
import { useT, useLanguage } from '../context/LanguageContext';
import './OrderAlbum.css'; // Reusing some base styles

const ALBUM_TYPES = [
  {
    id: 'karizma',
    name: 'Karizma Royal Spread (12×36)',
    nameTe: 'కరిజ్మా రాయల్ స్ప్రెడ్ (12×36)',
    desc: "India's most beloved wedding album. Seamless 36-inch panoramic spreads on high-density Fine Art paper with rich golden lamination.",
    descTe: 'భారతదేశంలో అత్యధికంగా ఇష్టపడే వెడ్డింగ్ ఆల్బమ్. సాంద్రమైన ఫైన్ ఆర్ట్ పేపర్‌పై సీమ్‌లెస్ 36-అంగుళాల పనోరమిక్ స్ప్రెడ్‌లు, గొప్ప బంగారు లామినేషన్‌తో.',
    img: '/images/weddingalbums-talambralu.png',
    tags: ['Most Popular in AP ⭐', 'Royal Standard'],
    tagsTe: ['APలో అత్యంత ప్రజాదరణ ⭐', 'రాయల్ స్టాండర్డ్']
  },
  {
    id: 'acrylic',
    name: 'Premium Crystal Acrylic Cover',
    nameTe: 'ప్రీమియం క్రిస్టల్ యాక్రిలిక్ కవర్',
    desc: '4mm diamond-polished glass face that makes couple portraits glow with 3D depth and crystalline clarity.',
    descTe: 'జంట పోర్ట్రెయిట్‌లను 3D లోతు, స్ఫటిక స్పష్టతతో మెరిసేలా చేసే 4mm వజ్రం-పాలిష్ గ్లాస్ ముఖం.',
    img: '/images/weddingalbums-layflat-album.png',
    tags: ['Ultra Luxury', 'Modern 3D'],
    tagsTe: ['అల్ట్రా లగ్జరీ', 'మోడరన్ 3D']
  },
  {
    id: 'flushmount',
    name: 'Flush Mount Seamless Lay-Flat',
    nameTe: 'ఫ్లష్ మౌంట్ సీమ్‌లెస్ లే-ఫ్లాట్',
    desc: 'Pages open 100% flat with zero gutter loss. Mounted on heavy archival core sheets designed to resist humidity and sagging.',
    descTe: 'పేజీలు 100% ఫ్లాట్‌గా తెరుచుకుంటాయి, గట్టర్ నష్టం శూన్యం. తేమను, వంగడాన్ని తట్టుకునేలా రూపొందించిన బరువైన ఆర్కైవల్ కోర్ షీట్లపై మౌంట్ చేయబడింది.',
    img: '/images/weddingalbums-home-hero.png',
    tags: ['100% Lay-Flat', 'Royal Archival'],
    tagsTe: ['100% లే-ఫ్లాట్', 'రాయల్ ఆర్కైవల్']
  },
  {
    id: 'velvet',
    name: 'Royal Velvet Touch Hardcover',
    nameTe: 'రాయల్ వెల్వెట్ టచ్ హార్డ్‌కవర్',
    desc: 'Soft, textured velvet fabric finish with embossed gold foil typography. Feather-touch feel with anti-scratch coating.',
    descTe: 'ఎంబాస్ చేసిన గోల్డ్ ఫాయిల్ అక్షరాలతో మృదువైన, విన్యాసమైన వెల్వెట్ ఫ్యాబ్రిక్ ఫినిష్. యాంటీ-స్క్రాచ్ కోటింగ్‌తో ఫెదర్-టచ్ అనుభూతి.',
    img: '/images/mockup-velvet-gold-foil.svg',
    tags: ['Trending Luxury', 'Velvet Silk'],
    tagsTe: ['ట్రెండింగ్ లగ్జరీ', 'వెల్వెట్ సిల్క్']
  },
  {
    id: 'leather',
    name: 'Classic Embossed Leatherette Box',
    nameTe: 'క్లాసిక్ ఎంబాస్డ్ లెదరెట్ బాక్స్',
    desc: 'Timeless luxury with vegan leather binding, gold corner protectors, and a matching presentation suitcase box.',
    descTe: 'వీగన్ లెదర్ బైండింగ్, గోల్డ్ కార్నర్ ప్రొటెక్టర్లు, సరిపోలే ప్రజెంటేషన్ సూట్‌కేస్ బాక్స్‌తో కాలాతీత లగ్జరీ.',
    img: '/images/mockup-leatherette-embossed.svg',
    tags: ['Traditional Heritage', 'Briefcase Box'],
    tagsTe: ['సాంప్రదాయ వారసత్వం', 'బ్రీఫ్‌కేస్ బాక్స్']
  },
  {
    id: 'parents',
    name: 'Duplicate Pocket Parent Albums',
    nameTe: 'డూప్లికేట్ పాకెట్ పేరెంట్ ఆల్బమ్‌లు',
    desc: 'Miniature luxury replicas of the couple album crafted specifically as sentimental gifts for parents and in-laws.',
    descTe: 'తల్లిదండ్రులు, అత్తవారికి భావనాత్మక బహుమతులుగా ప్రత్యేకంగా తయారు చేసిన జంట ఆల్బమ్ చిన్న లగ్జరీ ప్రతిరూపాలు.',
    img: '/images/mockup-pocket-mini-book.svg',
    tags: ['Parent Gift', 'Portable'],
    tagsTe: ['పేరెంట్ గిఫ్ట్', 'పోర్టబుల్']
  }
];

const PAPER_TYPES = [
  { name: 'Velvet Silk Touch (Scuff-Free)', nameTe: 'వెల్వెట్ సిల్క్ టచ్ (స్కఫ్-ఫ్రీ)', desc: 'Deep matte finish with a soft, feather-like touch. Scratch resistant and zero fingerprints.', descTe: 'మృదువైన, ఈకలాంటి స్పర్శతో లోతైన మ్యాట్ ఫినిష్. గీతలు పడకుండా, వేలిముద్రలు లేకుండా.' },
  { name: 'Crystal High Gloss', nameTe: 'క్రిస్టల్ హై గ్లాస్', desc: 'Glass-like high gloss reflection, bringing maximum brilliance and vibrancy to colorful sarees.', descTe: 'గాజులాంటి హై గ్లాస్ ప్రతిబింబం, రంగుల చీరలకు గరిష్ఠ కాంతి, జీవకళ ఇస్తుంది.' },
  { name: 'Metallic / Pearl Lustre', nameTe: 'మెటాలిక్ / పెర్ల్ లస్టర్', desc: '3D iridescent metallic shimmer effect, perfect for golden jewelry and nighttime mandap lighting.', descTe: '3D ఇరిడెసెంట్ మెటాలిక్ మెరుపు ప్రభావం — బంగారు నగలు, రాత్రి మండప లైటింగ్‌కు పరిపూర్ణం.' },
  { name: 'Non-Tearable Synthetic (NT)', nameTe: 'చిరగని సింథటిక్ (NT)', desc: 'Water-resistant, spill-proof, and virtually indestructible heavy composite sheet.', descTe: 'నీటి నిరోధకం, పోసినా చెడనిది, దాదాపు ధ్వంసం కాని బరువైన కాంపోజిట్ షీట్.' }
];

const AlbumsShowcase = () => {
  const t = useT();
  const { lang } = useLanguage();
  const [activeTab, setActiveTab] = useState('covers');
  const te = lang === 'TE';

  return (
    <div className="albums-showcase-page" style={{ padding: '0 1rem 4rem', minHeight: '80vh' }}>
      <div className="text-center mb-12">
        <ScrollReveal>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand), #996515)', marginBottom: '1.25rem', boxShadow: '0 8px 24px rgba(212, 175, 55, 0.25)' }}>
            <Layers size={28} color="#000" />
          </div>
          <h1 className="font-serif text-[var(--brand)] mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>{t('albums.title')}</h1>
          <p className="text-gray-400 mx-auto" style={{ maxWidth: '640px', fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)', lineHeight: 1.6 }}>
            {t('albums.sub')}
          </p>
        </ScrollReveal>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '2.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', flexWrap: 'wrap' }}>
          <button 
            className="btn"
            style={{ 
              borderRadius: '50px', 
              padding: '0.6rem 1.5rem', 
              fontSize: '0.9rem',
              background: activeTab === 'covers' ? 'var(--color-secondary)' : 'rgba(255,255,255,0.06)',
              color: activeTab === 'covers' ? 'var(--n-1000)' : 'var(--n-300)',
              border: 'none',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('covers')}
          >
            {t('albums.tab_covers')}
          </button>
          <button 
            className="btn"
            style={{ 
              borderRadius: '50px', 
              padding: '0.6rem 1.5rem', 
              fontSize: '0.9rem',
              background: activeTab === 'paper' ? 'var(--color-secondary)' : 'rgba(255,255,255,0.06)',
              color: activeTab === 'paper' ? 'var(--n-1000)' : 'var(--n-300)',
              border: 'none',
              cursor: 'pointer'
            }}
            onClick={() => setActiveTab('paper')}
          >
            {t('albums.tab_paper')}
          </button>
        </div>

        {activeTab === 'covers' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ALBUM_TYPES.map((album, idx) => (
              <ScrollReveal key={album.id} delay={idx * 80}>
                <div className="group rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:border-[var(--brand)]/50 transition-all flex flex-col h-full">
                  <div className="relative h-56 overflow-hidden">
                    <LazyImage noWrap className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={album.img} alt={album.name} />
                    <div className="absolute top-3 right-3 flex flex-wrap gap-1 justify-end">
                      {(te && album.tagsTe ? album.tagsTe : album.tags).map(tag => (
                        <span key={tag} className="px-2.5 py-0.5 bg-black/70 backdrop-blur-md rounded-full text-[11px] text-[var(--brand)] font-semibold border border-[var(--brand)]/30">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-serif text-white mb-2 group-hover:text-[var(--brand)] transition-colors">{te && album.nameTe ? album.nameTe : album.name}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{te && album.descTe ? album.descTe : album.desc}</p>
                    </div>
                    <div className="mt-5 pt-4 border-t border-white/10 flex gap-2">
                      <a href="/order" className="btn btn-gold-3d text-xs py-2 px-3 flex-1 text-center font-bold">
                        {t('albums.customize')}
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
                  <div className="p-3 bg-[var(--brand)]/10 text-[var(--brand)] rounded-lg">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl text-white mb-2">{te && paper.nameTe ? paper.nameTe : paper.name}</h3>
                    <p className="text-gray-400">{te && paper.descTe ? paper.descTe : paper.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        )}

        <div className="mt-20 text-center p-12 bg-black/40 rounded-3xl border border-white/5">
          <h2 className="text-3xl font-serif text-white mb-4">{t('albums.cta_title')}</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">{t('albums.cta_desc')}</p>
          <a href="/order" className="btn btn-primary inline-flex items-center gap-2">
            {t('albums.cta_btn')} <Camera size={18} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AlbumsShowcase;
