import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, User } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import LazyImage from '../components/LazyImage';
import { useT } from '../context/LanguageContext';
import './Blog.css';

export const ARTICLES = [
  {
    id: 1,
    slug: 'top-5-telugu-wedding-photography-trends-2026',
    title: 'Top 5 Telugu Wedding Photography Trends in 2026',
    excerpt: 'From drone light shows to vintage film edits, see what is trending in Andhra and Telangana weddings this year.',
    image: '/images/weddingalbums-talambralu.png',
    date: 'Sep 24, 2026',
    author: 'Admin'
  },
  {
    id: 2,
    slug: 'karizma-vs-flush-mount-albums',
    title: 'Karizma vs Flush Mount Albums: What is the difference?',
    excerpt: 'Trying to choose the right album for your big day? We break down the differences in durability, cost, and look.',
    image: '/images/mockup-acrylic-cover.svg',
    date: 'Sep 15, 2026',
    author: 'Print Studio Team'
  },
  {
    id: 3,
    slug: 'how-to-choose-b2b-editing-partner',
    title: 'How Photographers Can Scale by Outsourcing Editing',
    excerpt: 'A guide for wedding studios on how outsourcing your culling, photo editing, and video highlights can double your booking capacity.',
    image: '/images/luxury-album-craftsmanship.jpg',
    date: 'Aug 30, 2026',
    author: 'B2B Manager'
  }
];

const Blog = () => {
  const t = useT();
  return (
    <div className="page-container blog-page">
      <section className="section bg-gradient text-center" style={{ paddingTop: '150px' }}>
        <div className="container">
          <ScrollReveal>
            <h1 className="hero-title">{t('blog.title1')} <span>{t('blog.title2')}</span></h1>
            <p className="hero-subtitle text-muted">{t('blog.sub')}</p>
          </ScrollReveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="blog-grid">
            {ARTICLES.map((article, idx) => (
              <ScrollReveal key={article.id} delay={idx * 100} className="blog-card glass-3d">
                <div className="blog-image">
                  <LazyImage noWrap src={article.image} alt={article.title} />
                </div>
                <div className="blog-content">
                  <div className="blog-meta">
                    <span><Calendar size={14} /> {article.date}</span>
                    <span><User size={14} /> {article.author}</span>
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.excerpt}</p>
                  <Link to={`/blog/${article.slug}`} className="btn btn-outline glow-border">
                    {t('blog.read')} <ArrowRight size={18} />
                  </Link>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
