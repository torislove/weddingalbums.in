import React from 'react';
import { useContent } from '../context/ContentContext';
import registry from '../registry';

const DynamicPage = ({ pageId }) => {
  const { content } = useContent();
  
  if (!content || !content.pages || !content.pages[pageId]) {
    return <div className="p-8 text-center text-muted">No content available for this page.</div>;
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
