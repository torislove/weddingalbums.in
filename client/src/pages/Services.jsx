import React, { useState, useEffect } from 'react';
import { ImageIcon, Video, BookOpen, Flag, Package, ArrowRight, Sparkles } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { useT, useLanguage } from '../context/LanguageContext';
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

const ServiceCard = ({ service, index }) => {
  const t = useT();
  return (
    <ScrollReveal delay={index * 50} className="service-card-v2 glass-3d glow-border">
      <div className="card-accent-line" />
      <span className="card-number">{service.n || `0${index + 1}`}</span>
      <div className="flex justify-between items-start gap-2">
        <h3 style={{ margin: 0 }}>{service.title}</h3>
        {service.clientPriceBadge && (
          <span className="text-xs bg-[var(--brand)]/20 text-[var(--brand)] px-2.5 py-1 rounded-full whitespace-nowrap font-mono font-bold">
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
          {t('services.order_service')}
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
};

const Services = () => {
  const t = useT();
  const { lang } = useLanguage();
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand)]/15 border border-[var(--brand)]/30 text-[var(--brand)] text-xs font-bold mb-3 tracking-widest uppercase">
            <Sparkles size={13} />
            <span>{t('services.hero_badge')}</span>
          </div>
          <h1 className="text-gradient font-serif">{t('services.hero_title')}</h1>
          <p className="text-muted" style={{ maxWidth: '680px', margin: '0 auto' }}>
            {t('services.hero_sub')}
          </p>
        </ScrollReveal>
      </div>


      {/* 4 Flexible Pathways Quick Bar */}
      <section className="service-pathways-container" aria-label="Flexible Service Models">
        <div className="pathways-panel">
          <div className="pathways-header">
            <div>
              <span className="pathways-eyebrow">
                {t('services.pathways_eyebrow')}
              </span>
              <h2 className="pathways-title">
                {t('services.pathways_title')}
              </h2>
            </div>
            <span className="pathways-tagline">
              {t('services.pathways_tagline')}
            </span>
          </div>

          <div className="service-pathways-grid">
            {/* Card 1: Complete Suite */}
            <a href="/order?intent=edit_and_print" className="pathway-card pathway-suite">
              <div>
                <span className="pathway-badge badge-gold">{t('services.c1_badge')}</span>
                <div className="pathway-title-text">{t('services.c1_title')}</div>
                <div className="pathway-subtitle-text text-gold">{t('services.c1_sub')}</div>
                <p className="pathway-desc">
                  {t('services.c1_desc')}
                </p>
                <ul className="pathway-points">
                  <li><span>{t('services.lbl_includes')}</span> {t('services.c1_p1')}</li>
                  <li><span>{t('services.lbl_provide')}</span> {t('services.c1_p2')}</li>
                  <li><span>{t('services.lbl_turnaround')}</span> {t('services.c1_p3')}</li>
                </ul>
              </div>
              <div className="pathway-footer">
                <div className="pathway-price">
                  <span className="pathway-price-label">{t('services.starts_from')}</span>
                  <span className="pathway-price-val">₹12,999</span>
                </div>
                <span className="pathway-cta-btn btn-gold-subtle">{t('services.c1_cta')}</span>
              </div>
            </a>

            {/* Card 2: Only Editing */}
            <a href="/order?intent=only_editing" className="pathway-card pathway-editing">
              <div>
                <span className="pathway-badge badge-purple">{t('services.c2_badge')}</span>
                <div className="pathway-title-text">{t('services.c2_title')}</div>
                <div className="pathway-subtitle-text text-purple">{t('services.c2_sub')}</div>
                <p className="pathway-desc">
                  {t('services.c2_desc')}
                </p>
                <ul className="pathway-points">
                  <li><span>{t('services.lbl_includes')}</span> {t('services.c2_p1')}</li>
                  <li><span>{t('services.lbl_provide')}</span> {t('services.c2_p2')}</li>
                  <li><span>{t('services.lbl_turnaround')}</span> {t('services.c2_p3')}</li>
                </ul>
              </div>
              <div className="pathway-footer">
                <div className="pathway-price">
                  <span className="pathway-price-label">{t('services.starts_from')}</span>
                  <span className="pathway-price-val">₹3,499</span>
                </div>
                <span className="pathway-cta-btn btn-purple-subtle">{t('services.c2_cta')}</span>
              </div>
            </a>

            {/* Card 3: Only Printing */}
            <a href="/order?intent=only_printing" className="pathway-card pathway-printing">
              <div>
                <span className="pathway-badge badge-blue">{t('services.c3_badge')}</span>
                <div className="pathway-title-text">{t('services.c3_title')}</div>
                <div className="pathway-subtitle-text text-blue">{t('services.c3_sub')}</div>
                <p className="pathway-desc">
                  {t('services.c3_desc')}
                </p>
                <ul className="pathway-points">
                  <li><span>{t('services.lbl_includes')}</span> {t('services.c3_p1')}</li>
                  <li><span>{t('services.lbl_provide')}</span> {t('services.c3_p2')}</li>
                  <li><span>{t('services.lbl_turnaround')}</span> {t('services.c3_p3')}</li>
                </ul>
              </div>
              <div className="pathway-footer">
                <div className="pathway-price">
                  <span className="pathway-price-label">{t('services.starts_from')}</span>
                  <span className="pathway-price-val">₹6,499</span>
                </div>
                <span className="pathway-cta-btn btn-blue-subtle">{t('services.c3_cta')}</span>
              </div>
            </a>

            {/* Card 4: A-la-Carte */}
            <a href="/order?intent=standalone_services" className="pathway-card pathway-alacarte">
              <div>
                <span className="pathway-badge badge-green">{t('services.c4_badge')}</span>
                <div className="pathway-title-text">{t('services.c4_title')}</div>
                <div className="pathway-subtitle-text text-green">{t('services.c4_sub')}</div>
                <p className="pathway-desc">
                  {t('services.c4_desc')}
                </p>
                <ul className="pathway-points">
                  <li><span>{t('services.lbl_includes')}</span> {t('services.c4_p1')}</li>
                  <li><span>{t('services.lbl_provide')}</span> {t('services.c4_p2')}</li>
                  <li><span>{t('services.lbl_turnaround')}</span> {t('services.c4_p3')}</li>
                </ul>
              </div>
              <div className="pathway-footer">
                <div className="pathway-price">
                  <span className="pathway-price-label">{t('services.starts_from')}</span>
                  <span className="pathway-price-val">₹1,499</span>
                </div>
                <span className="pathway-cta-btn btn-green-subtle">{t('services.c4_cta')}</span>
              </div>
            </a>
          </div>
        </div>
      </section>

      {/* Sticky Tab Navigation with 5 Distinct Pillars */}
      <div className="services-nav">
        {CATEGORIES.map(({ id, label, telugu, icon: Icon }) => (
          <button
            key={id}
            className={`services-nav-btn ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            <Icon size={16} /> <span>{lang === 'TE' ? telugu : label}</span>
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
              <h2 className="text-gradient font-serif mb-2 text-center">{t('services.photo_title')}</h2>
              <p className="text-center text-gray-400 text-sm max-w-xl mx-auto mb-6">
                {t('services.photo_sub')}
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
              <h2 className="text-gradient font-serif mb-2 text-center">{t('services.video_title')}</h2>
              <p className="text-center text-gray-400 text-sm max-w-xl mx-auto mb-6">
                {t('services.video_sub')}
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
            eyebrow={t('services.est_eyebrow')}
            title={t('services.est_title')}
            subtitle={t('services.est_subtitle')}
            ctaText={t('services.est_cta')}
            ctaLink="/booking"
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="container pb-10 text-center">
        <KolamDivider />
        <ScrollReveal>
          <h2 className="text-gradient font-serif mb-4">{t('services.cta_title')}</h2>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
            {t('services.cta_desc')}
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            <a href="/order" className="btn btn-gold-3d px-8 py-3.5 font-bold inline-flex items-center gap-2">
              {t('services.cta_btn1')} <ArrowRight size={16} />
            </a>
            <a href="#estimator" className="btn btn-outline px-6 py-3.5 font-semibold">
              {t('services.cta_btn2')}
            </a>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default Services;
