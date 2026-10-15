import React, { useState, useEffect } from 'react';
import { ImageIcon, Video, BookOpen, Flag, Package, ArrowRight, Sparkles, Building2, ExternalLink } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import ScrollReveal from '../components/ScrollReveal';
import KolamDivider from '../components/KolamDivider';
import ServiceTimeline from '../components/ServiceTimeline';
import PackageSection from '../components/PackageSection';
import SheetStylesViewer from '../components/hub/SheetStylesViewer';
import AlbumSizeScaler from '../components/hub/AlbumSizeScaler';
import EventFlexShowcase from '../components/hub/EventFlexShowcase';
import InstantEstimator from '../components/blocks/InstantEstimator';
import './Services.css';

const CATEGORIES = [
  { id: 'photo-editing', label: 'Photo Editing & RAW', telugu: 'ఫొటో ఎడిటింగ్', icon: ImageIcon },
  { id: 'video-editing', label: 'Cinematic Video Post', telugu: 'సినిమాటిక్ వీడియో', icon: Video },
  { id: 'album-printing', label: 'Luxury Album Printing & Sheets', telugu: 'లగ్జరీ ఆల్బమ్స్ & షీట్లు', icon: BookOpen },
  { id: 'invitations-flex', label: 'Invitations & Event Flex', telugu: 'ఆహ్వానాలు & ఫ్లెక్సీలు', icon: Flag },
  { id: 'bundles', label: 'Value Bundles & Packages', telugu: 'ప్యాకేజీలు', icon: Package },
];

const ServiceCard = ({ service, index }) => (
  <ScrollReveal delay={index * 50} className="service-card-v2 glass-3d glow-border">
    <div className="card-accent-line" />
    <span className="card-number">{service.n || `0${index + 1}`}</span>
    <div className="flex justify-between items-start gap-2">
      <h3 style={{ margin: 0 }}>{service.title}</h3>
      {service.clientPriceBadge && (
        <span className="text-xs bg-[#D4AF37]/20 text-[#D4AF37] px-2.5 py-1 rounded-full whitespace-nowrap font-mono font-bold">
          {service.clientPriceBadge}
        </span>
      )}
    </div>
    <span className="telugu-label">{service.telugu}</span>
    <p>{service.desc}</p>
    
    {service.features && (
      <div className="mt-3 pt-2 border-t border-white/5 flex flex-wrap gap-1.5">
        {service.features.map((feat, fIdx) => (
          <span key={fIdx} className="text-[11px] bg-white/5 text-gray-300 px-2 py-0.5 rounded-md">
            ✓ {feat}
          </span>
        ))}
      </div>
    )}

    <div className="flex gap-2 mt-4 pt-3 border-t border-white/10">
      <a href={`/order?service=${service.id || encodeURIComponent(service.title)}`} className="btn btn-gold-3d text-xs py-2 px-3 font-bold flex-1 text-center">
        Order Service →
      </a>
      <a 
        href={`https://wa.me/919876543210?text=${encodeURIComponent(`నమస్కారం! నేను ${service.title} (${service.telugu || ''}) గురించి ఆర్డర్ లేదా సమాచారం తెలుసుకోవాలనుకుంటున్నాను.`)}`}
        target="_blank" 
        rel="noopener noreferrer"
        className="btn btn-outline text-xs py-2 px-3 flex items-center justify-center text-[#25D366] border-[#25D366]/40 hover:bg-[#25D366]/15 font-semibold"
        title="WhatsApp Enquiry"
      >
        WhatsApp
      </a>
    </div>
  </ScrollReveal>
);

const Services = () => {
  const { content } = useContent();
  const [activeTab, setActiveTab] = useState('photo-editing');

  const catalog = content?.global?.servicesCatalog || content?.servicesCatalog;

  const servicesHeroImage = content?.global?.siteImages?.servicesHeroImage || '/images/weddingalbums-home-hero.png';

  const photoServices = catalog?.photoEditing || [];
  const videoServices = catalog?.videoEditing || [];
  const sheetStyles = catalog?.albumPrinting?.sheetStyles || [];
  const albumSizes = catalog?.albumPrinting?.albumSizes || [];
  const flexItems = catalog?.invitationsAndFlex || [];
  const bundleItems = catalog?.bundles || [];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="services-page">
      {/* Hero */}
      <div className="page-hero parallax-bg" style={{ backgroundImage: `url('${servicesHeroImage}')`, backgroundBlendMode: 'overlay' }}>
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] text-xs font-bold mb-3 tracking-widest uppercase">
            <Sparkles size={13} />
            <span>Andhra Pradesh's #1 Post-Production Facility</span>
          </div>
          <h1 className="text-gradient font-serif">All Editing, Video & Printing Services in One Place</h1>
          <p className="text-muted" style={{ maxWidth: '680px', margin: '0 auto' }}>
            A state-of-the-art 20-member in-house production engine delivering color-calibrated wedding albums, 4K films, and grand event signage across Vijayawada, Vizag, Guntur, and all AP & TS.
          </p>
        </ScrollReveal>
      </div>

      {/* B2B Studio Partner Trade Notice Banner */}
      <div className="studio-partner-trade-strip">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#D4AF37] shrink-0 font-bold">
              <Building2 size={18} />
            </div>
            <div>
              <div className="text-sm font-bold text-white">
                Are you a professional Photo Studio or Freelance Editor in AP / TS?
              </div>
              <div className="text-xs text-gray-400">
                Studio Trade Partners receive exclusive wholesale price per sheet, white-label packaging, and 48-hour turnarounds.
              </div>
            </div>
          </div>
          <a
            href="/portal/login?portal=b2b"
            className="btn btn-outline text-xs py-2 px-4 whitespace-nowrap text-[#D4AF37] border-[#D4AF37]/50 hover:bg-[#D4AF37]/15 flex items-center gap-1.5 font-bold"
          >
            <span>Access Studio Wholesale Portal</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Sticky Tab Navigation with 5 Distinct Pillars */}
      <div className="services-nav">
        {CATEGORIES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            className={`services-nav-btn ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={16} /> <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Active Tab Content */}
      <div className="container section" style={{ minHeight: '50vh', paddingTop: '2rem' }}>
        {/* PILLAR 1: PHOTO EDITING */}
        {activeTab === 'photo-editing' && (
          <div className="service-category">
            <KolamDivider />
            <ScrollReveal>
              <h2 className="text-gradient font-serif mb-2 text-center">Photo Retouching, Culling & Color Grading</h2>
              <p className="text-center text-gray-400 text-sm max-w-xl mx-auto mb-6">
                From high-volume camera RAW culling to high-fashion skin retouching and golden Telugu wedding color grading.
              </p>
            </ScrollReveal>
            <div className="grid grid-2">
              {photoServices.map((s, i) => (
                <ServiceCard key={`photo-${s.id || i}`} service={s} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* PILLAR 2: VIDEO EDITING */}
        {activeTab === 'video-editing' && (
          <div className="service-category">
            <KolamDivider />
            <ScrollReveal>
              <h2 className="text-gradient font-serif mb-2 text-center">Cinematic 4K Video Post-Production</h2>
              <p className="text-center text-gray-400 text-sm max-w-xl mx-auto mb-6">
                Story-driven cinematic wedding films, traditional Muhurtham documentaries, same-day reception edits, and viral 9:16 vertical reels.
              </p>
            </ScrollReveal>
            <div className="grid grid-2">
              {videoServices.map((s, i) => (
                <ServiceCard key={`video-${s.id || i}`} service={s} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* PILLAR 3: LUXURY ALBUM PRINTING & SHEET STYLES */}
        {activeTab === 'album-printing' && (
          <div className="service-category">
            <KolamDivider />
            
            {/* Showstopping Interactive Sheet Textures Simulator */}
            <SheetStylesViewer sheets={sheetStyles} />

            <div className="my-10">
              <KolamDivider />
            </div>

            {/* Interactive All Indian Market Album Dimensions Scaler */}
            <AlbumSizeScaler sizes={albumSizes} />
          </div>
        )}

        {/* PILLAR 4: INVITATIONS & EVENT FLEX */}
        {activeTab === 'invitations-flex' && (
          <div className="service-category">
            <KolamDivider />
            <EventFlexShowcase items={flexItems} />
          </div>
        )}

        {/* PILLAR 5: BUNDLES & PACKAGES */}
        {activeTab === 'bundles' && (
          <div className="service-category">
            <KolamDivider />
            <PackageSection />
          </div>
        )}
      </div>

      {/* Production Process Journey Timeline */}
      <div className="bg-darker section">
        <div className="container">
          <ServiceTimeline />
        </div>
      </div>

      {/* Instant Album & Video Cost Estimator Hub */}
      <div id="estimator" className="section bg-black/60 border-t border-b border-white/5" style={{ scrollMarginTop: '100px' }}>
        <div className="container">
          <InstantEstimator
            eyebrow="✦ ANDHRA PRADESH #1 POST-PRODUCTION HUB ✦"
            title="Instant Album & Video Cost Estimator"
            subtitle="Customize your dimensions, multi-sheet material mix, cover finishes, and cinema video options for real-time pricing and guaranteed SLA schedules."
            ctaText="Lock In Estimate & Start Custom Order"
            ctaLink="/order"
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="container pb-10 text-center">
        <KolamDivider />
        <ScrollReveal>
          <h2 className="text-gradient font-serif mb-4">Ready to elevate your memories?</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
            Get your albums designed, printed, and delivered with 100% color accuracy guarantee and lifetime archival durability.
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <a href="/order" className="btn btn-gold-3d px-8 py-3.5 font-bold inline-flex items-center gap-2">
              Start Custom Order <ArrowRight size={16} />
            </a>
            <a href="#estimator" className="btn btn-outline px-6 py-3.5 font-semibold">
              Instant Cost Estimator
            </a>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Services;
