import { useState, useEffect, useRef } from 'react';

export const useAdminContent = (token) => {
  const [content, setContent] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const channelRef = useRef(null);

  useEffect(() => {
    channelRef.current = new BroadcastChannel('cms-preview');
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        setContent(data);
        setIsDirty(false);
      });

    return () => {
      if (channelRef.current) {
        channelRef.current.close();
      }
    };
  }, []);

  // Sync function to emit changes immediately
  const broadcastPreview = (newContent) => {
    if (channelRef.current) {
      channelRef.current.postMessage({ type: 'PREVIEW_UPDATE', content: newContent });
    }
  };

  const updatePage = (pageId, newBlocks) => {
    setContent(prev => {
      const newContent = {
        ...prev,
        pages: {
          ...prev.pages,
          [pageId]: newBlocks
        }
      };
      broadcastPreview(newContent);
      return newContent;
    });
    setIsDirty(true);
  };

  const updateGlobal = (section, newData) => {
    setContent(prev => {
      const newContent = {
        ...prev,
        global: {
          ...prev.global,
          [section]: newData
        }
      };
      broadcastPreview(newContent);
      return newContent;
    });
    setIsDirty(true);
  };

  // Directly set full content
  const setContentState = (newContent) => {
    setContent(newContent);
    broadcastPreview(newContent);
  };

  const saveContent = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/content', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(content)
      });
      if (res.ok) {
        setIsDirty(false);
      }
    } catch (err) {
      console.error("Failed to save", err);
    }
    setSaving(false);
  };

  return { content, setContent: setContentState, updatePage, updateGlobal, saveContent, isDirty, setIsDirty, saving };
};
