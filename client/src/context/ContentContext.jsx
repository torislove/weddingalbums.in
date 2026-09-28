import React, { createContext, useContext, useState, useEffect } from 'react';

const ContentContext = createContext(null);

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/content')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load content from API');
        return res.json();
      })
      .then(data => {
        setContent(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading content:', err);
        // Fallback to empty state, components will handle defaults or rendering nothing
        setContent({ pages: {}, global: {} });
        setLoading(false);
      });

    // Listen for live preview updates from the Admin Panel
    const channel = new BroadcastChannel('cms-preview');
    channel.onmessage = (event) => {
      if (event.data && event.data.type === 'PREVIEW_UPDATE') {
        setContent(event.data.content);
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  if (loading) {
    return <div className="loading-screen" style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-darker)', color: 'var(--color-gold)'}}>Loading Cinematic Weddings...</div>;
  }

  return (
    <ContentContext.Provider value={{ content }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
