import React from 'react';
import { useContent } from '../context/ContentContext';
import registry from '../registry';

const DynamicPage = ({ pageId }) => {
  const { content } = useContent();
  
  if (!content || !content.pages || !content.pages[pageId]) {
    return (
      <div className="dynamic-page-skeleton" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div style={{ height: '48px', width: '220px', borderRadius: '999px', background: 'rgba(212,175,55,0.08)', margin: '0 auto 20px', animation: 'skeletonShimmer 1.5s infinite' }} />
        <div style={{ height: '56px', width: '65%', borderRadius: '16px', background: 'rgba(255,255,255,0.06)', margin: '0 auto 16px', animation: 'skeletonShimmer 1.5s infinite' }} />
        <div style={{ height: '24px', width: '45%', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', margin: '0 auto 40px', animation: 'skeletonShimmer 1.5s infinite' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[1, 2, 3].map((n) => (
            <div key={n} style={{ height: '320px', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,175,55,0.12)', padding: '24px', animation: 'skeletonShimmer 1.5s infinite' }} />
          ))}
        </div>
        <style>{`
          @keyframes skeletonShimmer {
            0% { opacity: 0.5; }
            50% { opacity: 0.9; }
            100% { opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  const blocks = (content.pages[pageId] || []).filter(b => !b.isHidden);

  return (
    <div className={`dynamic-page page-${pageId}`}>
      {blocks.map((block) => {
        const Component = registry[block.type];
        
        if (!Component) {
          console.warn(`Component ${block.type} not found in registry`);
          return null; // or a fallback component
        }
        
        return <Component key={block.id} {...block.props} />;
      })}
    </div>
  );
};

export default DynamicPage;
