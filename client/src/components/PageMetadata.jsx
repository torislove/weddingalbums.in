import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ROUTE_METADATA = {
  '/': {
    title: 'weddingalbums.in | Andhra Pradesh & Telangana #1 Heirloom Wedding Albums, HP Indigo Printing & 4K Video',
    description: 'Andhra Pradesh & Telangana premier wedding album printing & post-production lab. Transparent Per-Sheet pricing on 12×36 Royal Panoramic, 18×12 Grand Vertical, 4mm 3D Acrylic & Velvet covers, non-tearable waterproof core, and 4K cinematic video editing.'
  },
  '/shop': {
    title: 'Storefront & Catalog | Transparent Per-Sheet Album Pricing – weddingalbums.in',
    description: 'Configure and order custom heirloom wedding albums, archival paper finishes, 4K cinematic video editing, animated WhatsApp invitations, and mandap flex banners with transparent per-sheet pricing.'
  },
  '/store': {
    title: 'Storefront & Catalog | Transparent Per-Sheet Album Pricing – weddingalbums.in',
    description: 'Configure and order custom heirloom wedding albums, archival paper finishes, 4K cinematic video editing, animated WhatsApp invitations, and mandap flex banners with transparent per-sheet pricing.'
  },
  '/albums': {
    title: 'Heirloom Karizma & Lay-Flat Wedding Albums Showcase – weddingalbums.in',
    description: 'Explore our 12×36 Royal Panoramic and 18×12 Grand Vertical albums. 4mm Diamond Acrylic 3D glass, Royal Plush Velvet with 24K gold foil, and Italian Leatherette briefcase boxes.'
  },
  '/services': {
    title: 'Cinematic 4K Video Editing, Reels & Flex Printing – weddingalbums.in',
    description: 'Professional in-house video editing for Telugu weddings. Multi-camera synchronization, licensed Mangala Vaadhyam audio mixing, 9:16 Instagram Reels, and grand mandap flex prints.'
  },
  '/portfolio': {
    title: 'Telugu Wedding Photography & Album Portfolio – weddingalbums.in',
    description: 'Witness master Telugu wedding photography retouched and color-graded by our 20-member post-production unit across Vijayawada, Guntur, Hyderabad, and Visakhapatnam.'
  },
  '/pricing': {
    title: 'Transparent Per-Sheet Pricing Calculator – weddingalbums.in',
    description: 'Honest itemized price calculator for Telugu wedding albums, skin retouching, 4K video editing, and flex printing. Instant quotes for couples and photo studios.'
  },
  '/contact': {
    title: 'Contact Guntur Central Production Lab & Support – weddingalbums.in',
    description: 'Get in touch with weddingalbums.in Central Production Lab in Guntur. Call +91 9346793364 or chat on WhatsApp for album design, printing schedules, and studio partnerships.'
  },
  '/b2b': {
    title: 'B2B Photo Studio Trade Partnership & Wholesale Printing – weddingalbums.in',
    description: 'Join 500+ photo studios across Andhra Pradesh & Telangana. Get up to 40% wholesale discount, priority 48-hour turnarounds, and GST invoicing for wedding albums.'
  },
  '/b2c': {
    title: 'Heirloom Wedding Albums for Couples – weddingalbums.in',
    description: 'Direct-to-couple luxury wedding album creation. Send your raw photos and let our master artists design, color-grade, and print your sacred memories.'
  },
  '/about': {
    title: 'About weddingalbums.in | 12 Years of Wedding Post-Production Excellence',
    description: 'Discover the story behind Andhra Pradesh & Telangana leading in-house wedding post-production lab. 20+ full-time editors, 5,000+ albums delivered, 100% in-house quality.'
  },
  '/blog': {
    title: 'Wedding Album & Telugu Photography Tips & Trends – weddingalbums.in',
    description: 'Expert advice on wedding album preservation, paper finish comparisons, Karizma vs Flush Mount differences, and tips for photo studios.'
  },
  '/muhurtham': {
    title: 'Auspicious Telugu Wedding Muhurtham Calendar 2026-2027 – weddingalbums.in',
    description: 'Check auspicious Telugu wedding muhurtham dates for 2026-2027. Plan your wedding photography, album design, and delivery schedule in advance.'
  },
  '/testimonials': {
    title: 'Client & Studio Reviews across AP & Telangana – weddingalbums.in',
    description: 'Read verified reviews from newlyweds and wedding photographers across Andhra Pradesh and Telangana who trust weddingalbums.in for their sacred wedding albums.'
  },
  '/login': {
    title: 'Client & Studio Sign In | Account Portal – weddingalbums.in',
    description: 'Sign in to your weddingalbums.in client portal to view online album proofs, track production stages, make balance payments, and download high-resolution spreads.'
  },
  '/cart': {
    title: 'Your Order Cart | Configured Wedding Albums & Media – weddingalbums.in',
    description: 'Review your selected album sizes, sheet counts, paper finishes, and master presentation covers before proceeding to secure checkout.'
  },
  '/checkout': {
    title: 'Secure Checkout & Order Placement – weddingalbums.in',
    description: 'Confirm your delivery address, select cloud drive or courier pen drive asset handover, and place your wedding album production order.'
  },
  '/client': {
    title: 'Client Dashboard & Order Proofing – weddingalbums.in',
    description: 'Manage your active wedding album orders, review digital flipbook proofs, approve page layouts, and monitor dispatch tracking.'
  }
};

export default function PageMetadata() {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname.toLowerCase().replace(/\/$/, '') || '/';
    const metadata = ROUTE_METADATA[pathname] || {
      title: 'weddingalbums.in | Andhra Pradesh & Telangana #1 Heirloom Wedding Albums',
      description: 'Andhra Pradesh & Telangana premier wedding album printing & post-production lab.'
    };

    // Update document title
    document.title = metadata.title;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', metadata.description);
    }

    // Update OpenGraph Title & Description
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', metadata.title);
    }

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute('content', metadata.description);
    }

    // Update Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    const fullUrl = `https://weddingalbums.in${location.pathname}`;
    if (canonical) {
      canonical.setAttribute('href', fullUrl);
    }

    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.setAttribute('content', fullUrl);
    }
  }, [location]);

  return null;
}
