import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Calendar, User, Clock } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import LazyImage from '../components/LazyImage';
import { ARTICLES } from './Blog';
import { useT } from '../context/LanguageContext';
import './Blog.css';

const BODIES = {
  'top-5-telugu-wedding-photography-trends-2026': {
    minutes: 6,
    sections: [
      ['The Return of the Muhurtham Frame', 'Tight, reverent compositions of the exact muhurtham second — Jeelakarra Bellam and Mangalya Dharanam frozen mid-ritual — are once again the anchor spread of premium Telugu albums. Photographers are pairing a 200mm compression shot with a wide mandap context frame so the couple can feel both the intimacy and the scale.'],
      ['Drone Light Shows Over the Reception', 'Night-time drone formations now open most Vizag and Vijayawada reception edits. The winning move is exposing for the drones, not the crowd — a 2-stop underexposure keeps the gold word-art crisp against the sky.'],
      ['Vintage Film Edits for Sangeet', 'Warm, grainy Portra-style grades are dominating sangeet and haldi galleries, giving those events a distinctly nostalgic identity that separates them from the polish of the muhurtham spreads.'],
      ['Candid Talambralu Bursts', 'The talambralu shower is the single most requested frame in Andhra weddings. Burst capture at 10fps plus AI-enabled eye-af culling means studios deliver 8–12 usable frames where they used to deliver two.'],
      ['Vertical Reels Deliver First', 'Couples now judge delivery speed by how fast reels arrive. Studios that publish a 60-second vertical teaser within 48 hours of the event report measurably higher referral rates.'],
    ],
  },
  'karizma-vs-flush-mount-albums': {
    minutes: 5,
    sections: [
      ['What "Karizma" Actually Means', 'Karizma refers to a premium paper surface with an almost metallic luster and deep blacks. It is our most requested sheet for jewel-toned Telugu bridal couture — silks and gold zari simply render richer on it than on any matte stock.'],
      ['Flush Mount Spreads', 'Flush mount albums mount photographs edge-to-edge on rigid boards with a continuous gutter, so a single image can flow across the full double-page spread without losing the couple in the fold. Layflat technology keeps that gutter visually invisible.'],
      ['Durability & Weight', 'A 40-sheet flush mount weighs roughly three times a traditional loop-bound album. The board core protects the sheets for decades — a genuine keepsake consideration for Telugu families where the album is viewed generations later.'],
      ['Cost & When to Choose Which', 'Karizma sheets hit the sweet spot on price for galleries above 60 sheets. Flush mount command a premium but pay off when you want hero full-bleed ritual spreads. Many of our studio partners order both: a flush-mount main album plus parent pocket books in Karizma.'],
    ],
  },
  'how-to-choose-b2b-editing-partner': {
    minutes: 7,
    sections: [
      ['Your Retainer Is Only as Good as Your QC Gate', 'Outsourcing fails when deliverables come back unreviewed. Choose a partner whose workflow includes a formal QC review step with revision notes — not just a handoff that returns a Drive link.'],
      ['Cull Ratios Are a Commercial Decision', 'A 1,000-photo wedding should not automatically return 1,000 edits. Agree the story rhythm: muhurtham and wedding get top coverage, sangeet and reception get identity beats. A publisher-grade editing partner should discuss cull ratios before Eid, not after delivery.'],
      ['Pricing Yours Is About Bulk Until Delivery', ' Wholesale per-sheet and per-photo pricing only works when the turn-around SLA is contractual. Tie a 10% service credit to missed delivery windows and you make retention automatic.'],
      ['White-Label Rather than Refer', 'Never forward your client to the editing partner. White-label delivery — your logo on the proofing gallery, your tone in the cover note — protects the relationship and is worth the margin cost.'],
      ['The Numbers', 'Studios on a retainer with us capacity for 30% more bookings within two wedding seasons without hiring a single in-house editor. The extra revenue is compounding because you re-bid peak-season dates with confidence.'],
    ],
  },
};

const FALLBACK_SECTIONS = [
  ['Wedding Albums, Done Right', 'A wedding album is the one artefact from your wedding that grows more valuable every year. Our studio-grade pipeline treats every spread like a page in a printed storybook — pacing, colour, and ritual sequencing first.']];
const FALLBACK_MINUTES = 4;

const BlogPost = () => {
  const t = useT();
  const { slug } = useParams();
  const article = ARTICLES.find(a => a.slug === slug);

  const { sections, minutes } = useMemo(() => {
    const body = BODIES[slug];
    if (body) return body;
    return { sections: FALLBACK_SECTIONS, minutes: FALLBACK_MINUTES };
  }, [slug]);

  if (!article) {
    return (
      <div className="page-container blog-page" style={{ paddingTop: '150px', textAlign: 'center' }}>
        <h1 className="hero-title">{t('blog.notfound_title1')} <span>{t('blog.notfound_title2')}</span></h1>
        <p className="hero-subtitle text-muted">{t('blog.notfound_sub')}</p>
        <Link to="/blog" className="btn btn-outline glow-border" style={{ marginTop: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <ArrowLeft size={18} /> {t('blog.back')}
        </Link>
      </div>
    );
  }

  const related = ARTICLES.filter(a => a.slug !== slug).slice(0, 2);

  return (
    <div className="page-container blog-page">
      <section className="section bg-gradient" style={{ paddingTop: '150px', paddingBottom: '40px' }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <ScrollReveal>
            <Link to="/blog" style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              <ArrowLeft size={16} /> {t('blog.all_stories')}
            </Link>
            <h1 className="hero-title" style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>{article.title}</h1>
            <div className="blog-meta" style={{ margin: '1.25rem 0 0' }}>
              <span><Calendar size={14} /> {article.date}</span>
              <span><User size={14} /> {article.author}</span>
              <span><Clock size={14} /> {t('blog.min_read', { n: minutes })}</span>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ maxWidth: '860px' }}>
          <ScrollReveal>
            <div className="blog-card glass-3d" style={{ overflow: 'hidden' }}>
              <div className="blog-image" style={{ aspectRatio: '16/9' }}>
                <LazyImage noWrap src={article.image} alt={article.title} />
              </div>
            </div>
          </ScrollReveal>

          <div className="article-body" style={{ marginTop: '2.5rem' }}>
            {sections.map(([heading, paragraph], i) => (
              <ScrollReveal key={i} delay={i * 60}>
                <h2 style={{
                  color: 'var(--primary)', fontFamily: "'Playfair Display', serif",
                  fontSize: '1.5rem', margin: '2.25rem 0 0.85rem',
                }}>{heading}</h2>
                <p style={{ color: 'var(--text, #eee)', lineHeight: 1.9, fontSize: '1.02rem' }}>{paragraph}</p>
              </ScrollReveal>
            ))}

            <ScrollReveal>
              <div className="glass-3d" style={{
                padding: '1.75rem', marginTop: '3rem', borderRadius: '16px',
                border: '1px solid rgba(212,175,55,0.25)', textAlign: 'center',
              }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", marginBottom: '0.5rem' }}>
                  {t('blog.cta_title_pre')} <span style={{ color: 'var(--primary)' }}>{t('blog.cta_title_post')}</span>?
                </h3>
                <p className="text-muted" style={{ marginBottom: '1.25rem' }}>{t('blog.cta_desc')}</p>
                <Link to="/order" className="btn btn-gold" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  {t('blog.cta_btn')} <ArrowRight size={18} />
                </Link>
              </div>
            </ScrollReveal>
          </div>

          <div style={{ marginTop: '3.5rem' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.4rem', marginBottom: '1.25rem' }}>{t('blog.more')}</h2>
            <div className="blog-grid">
              {related.map(a => (
                <Link to={`/blog/${a.slug}`} key={a.slug} className="blog-card glass-3d" style={{ textDecoration: 'none' }}>
                  <div className="blog-image">
                    <LazyImage noWrap src={a.image} alt={a.title} />
                  </div>
                  <div className="blog-content">
                    <div className="blog-meta"><span><Calendar size={14} /> {a.date}</span></div>
                    <h3 style={{ color: 'var(--text, var(--paper))' }}>{a.title}</h3>
                    <span style={{ color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '0.5rem', fontSize: '0.9rem' }}>
                      {t('blog.read_short')} <ArrowRight size={15} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
