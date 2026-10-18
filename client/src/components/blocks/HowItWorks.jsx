import React from 'react';
import { Link } from 'react-router-dom';
import { UploadCloud, Palette, Eye, Truck, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import ScrollReveal from '../ScrollReveal';
import './HowItWorks.css';

const DEFAULT_STEPS = [
  {
    step: '01',
    title: 'Choose Service & Share RAW Files',
    subtitle: 'Pure editing, heirloom album printing, 4K video, or custom flex banner.',
    desc: 'Select your exact service, sheets, or dimensions in our store. Share your high-res photos or footage via Google Drive / Dropbox link, or courier pen drives/cards directly to our Vijayawada lab.',
    icon: UploadCloud,
    badge: 'Cloud Link or Lab Courier'
  },
  {
    step: '02',
    title: '100% In-House Post-Production',
    subtitle: '20-member specialized editing unit with zero third-party outsourcing.',
    desc: 'Master skin frequency separation, 24K jewelry specular enhancement, Telugu cultural ritual synchronization (Talambralu, Mangala Snanam), and cinematic color grading.',
    icon: Palette,
    badge: '12+ Years Legacy'
  },
  {
    step: '03',
    title: 'Digital Proofing & Refinements',
    subtitle: 'Inspect high-res digital flipbook spreads and video previews online.',
    desc: 'Review every single spread or video cut with your couple or studio clients. Request unlimited minor revisions until 100% satisfied before we send to the physical press.',
    icon: Eye,
    badge: 'Zero-Delay Turnaround'
  },
  {
    step: '04',
    title: 'Archival Lab Printing & Delivery',
    subtitle: 'Printed on European digital presses with 100-year archival inks.',
    desc: 'Handcrafted binding with 4mm 3D Acrylic Glass, Royal Velvet, or Italian Leatherette. Waterproof packaging with live dispatch tracking delivered directly to your doorstep.',
    icon: Truck,
    badge: 'Safe Doorstep Courier'
  }
];

export default function HowItWorks({
  eyebrow = '✦ SEAMLESS PRODUCTION WORKFLOW ✦',
  title = 'How It Works: From RAW Frames to Master Heirlooms',
  subtitle = 'Whether you need pure digital editing, complete album printing, cinematic video grading, or venue flex of any size — our 4-step lab journey ensures flawless execution.',
  steps = DEFAULT_STEPS,
  ctaText = 'Browse All Services in Store',
  ctaLink = '/shop'
}) {
  const stepList = Array.isArray(steps) && steps.length > 0 ? steps : DEFAULT_STEPS;

  return (
    <section className="how-it-works-section" id="how-it-works">
      <div className="container">
        {/* Header */}
        <div className="text-center hiw-header">
          <ScrollReveal>
            <div className="hiw-eyebrow">{eyebrow}</div>
            <h2 className="hiw-title font-serif text-gradient">{title}</h2>
            <p className="hiw-subtitle">{subtitle}</p>
          </ScrollReveal>
        </div>

        {/* Steps Grid */}
        <div className="hiw-grid">
          {stepList.map((item, idx) => {
            const Icon = item.icon || Sparkles;
            return (
              <ScrollReveal key={idx} delay={idx * 120} className="hiw-step-col">
                <div className="hiw-card glass-3d">
                  <div className="hiw-step-top">
                    <span className="hiw-number font-serif">{item.step || `0${idx + 1}`}</span>
                    <span className="hiw-badge">{item.badge}</span>
                  </div>

                  <div className="hiw-icon-wrap">
                    <Icon size={28} className="hiw-icon" />
                  </div>

                  <h3 className="hiw-step-title font-serif">{item.title}</h3>
                  <div className="hiw-step-sub">{item.subtitle}</div>
                  <p className="hiw-step-desc">{item.desc}</p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Trust Bottom Banner */}
        <ScrollReveal delay={450}>
          <div className="hiw-bottom-bar glass-3d">
            <div className="hiw-trust-item">
              <ShieldCheck size={20} className="text-brand" />
              <span>100% Confidentiality & Data Privacy Guaranteed</span>
            </div>
            <div className="hiw-trust-sep" />
            <div className="hiw-trust-item">
              <Sparkles size={20} className="text-brand" />
              <span>Direct Per-Sheet & Upfront Transparent Pricing</span>
            </div>
            <div className="hiw-cta-wrap">
              <Link to={ctaLink} className="btn btn-gold-3d hiw-btn">
                {ctaText} <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
