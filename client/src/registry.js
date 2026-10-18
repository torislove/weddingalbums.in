import Hero from './components/blocks/Hero';
import MarqueeTicker from './components/MarqueeTicker';
import StatsBar from './components/blocks/StatsBar';
import InHouseAdvantage from './components/blocks/InHouseAdvantage';
import AboutTeaser from './components/blocks/AboutTeaser';
import ServicesTeaser from './components/blocks/ServicesTeaser';
import KolamDivider from './components/KolamDivider';
import RitualsScroll from './components/blocks/RitualsScroll';
import FeaturedGallery from './components/blocks/FeaturedGallery';
import TestimonialsCarousel from './components/blocks/TestimonialsCarousel';
import ReviewsBar from './components/ReviewsBar';
import CTABanner from './components/blocks/CTABanner';
import PageHero from './components/blocks/PageHero';
import PillarsList from './components/blocks/PillarsList';
import SimpleCTA from './components/blocks/SimpleCTA';

// New Visual Showcase & Interactive Blocks
import VisualPillarsShowcase from './components/blocks/VisualPillarsShowcase';
import InteractiveBeforeAfter from './components/blocks/InteractiveBeforeAfter';
import CraftsmanshipDetails from './components/blocks/CraftsmanshipDetails';
import InstantEstimator from './components/blocks/InstantEstimator';

// Registry maps component string names to the actual React components
const componentRegistry = {
  Hero,
  MarqueeTicker,
  StatsBar,
  InHouseAdvantage,
  AboutTeaser,
  ServicesTeaser,
  KolamDivider,
  RitualsScroll,
  FeaturedGallery,
  TestimonialsCarousel,
  ReviewsBar,
  CTABanner,
  StudioCtaBanner: CTABanner,
  PageHero,
  PillarsList,
  SimpleCTA,
  VisualPillarsShowcase,
  InteractiveBeforeAfter,
  CraftsmanshipDetails,
  Craftsmanship: CraftsmanshipDetails,
  TeluguRituals: RitualsScroll,
  Testimonials: TestimonialsCarousel,
  TestimonialsCarousel,
  InstantEstimator,
};

export default componentRegistry;
