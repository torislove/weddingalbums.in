import React, { useRef } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import './Flipbook.css';

const Page = React.forwardRef((props, ref) => {
  return (
    <div className={`demoPage ${props.isCover ? 'cover' : ''}`} ref={ref} data-density={props.isCover ? "hard" : "soft"}>
      <img 
        src={props.image} 
        alt="Page" 
        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
      />
    </div>
  );
});

const Flipbook = ({ pages }) => {
  const { content } = useContent();
  const book = useRef();
  
  // Add cover pages
  const coverImg = content?.global?.siteImages?.flipbookCoverImage || 'https://images.unsplash.com/photo-1544641979-51478546b3f7?auto=format&fit=crop&q=80&w=800'; // Leather-ish texture
  const backCoverImg = content?.global?.siteImages?.flipbookBackCoverImage || 'https://images.unsplash.com/photo-1544641979-51478546b3f7?auto=format&fit=crop&q=80&w=800';

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="flipbook-container">
      <motion.div 
        className="album-wrapper"
        style={{ rotateX, rotateY, perspective: 2000 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <HTMLFlipBook 
          width={400} 
          height={300} 
          size="stretch"
          minWidth={300}
          maxWidth={600}
          minHeight={200}
          maxHeight={450}
          maxShadowOpacity={0.8}
          showCover={true}
          mobileScrollSupport={true}
          flippingTime={1200}
          usePortrait={false}
          drawShadow={true}
          ref={book}
        >
          {/* Front Cover */}
          <Page image={coverImg} isCover={true} />
          
          {/* Inner Pages */}
          {pages.map((img, index) => (
            <Page key={index} image={img} isCover={false} />
          ))}
          
          {/* Back Cover */}
          <Page image={backCoverImg} isCover={true} />
        </HTMLFlipBook>
      </motion.div>
    </div>
  );
};

export default Flipbook;
