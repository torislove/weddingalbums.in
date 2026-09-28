import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Camera, Film, BookOpen } from 'lucide-react';
import './PageTransition.css';

const PageTransition = ({ children }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [renderChildren, setRenderChildren] = useState(children);
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  // 1. Trigger transition ONLY on path change
  useEffect(() => {
    if (location.pathname !== currentPath) {
      setIsTransitioning(true);
      setCurrentPath(location.pathname);
      window.scrollTo(0, 0);

      const swapTimeout = setTimeout(() => {
        // We use an updater function to avoid capturing stale children 
        // wait, we can just use the children from the current render closure,
        // because we want the children of the *new* route.
      }, 500);

      const endTimeout = setTimeout(() => {
        setIsTransitioning(false);
      }, 1400);

      return () => {
        clearTimeout(swapTimeout);
        clearTimeout(endTimeout);
      };
    }
  }, [location.pathname, currentPath]);

  // 2. Handle children updates (e.g. data loading) and swapping
  useEffect(() => {
    if (isTransitioning) {
      // If we are currently transitioning, wait until the curtain is closed (500ms) to swap children
      const swapTimeout = setTimeout(() => {
        setRenderChildren(children);
      }, 500);
      return () => clearTimeout(swapTimeout);
    } else {
      // If no transition is happening, update children immediately
      setRenderChildren(children);
    }
  }, [children, isTransitioning]);

  return (
    <>
      {isTransitioning && (
        <div className="curtain-container">
          <div className="curtain-left"></div>
          <div className="curtain-right"></div>
          <div className="rope rope-left"></div>
          <div className="rope rope-right"></div>
          
          <div className="curtain-icons">
            <Film className="curtain-icon icon-video" size={48} />
            <Camera className="curtain-icon icon-camera" size={64} />
            <BookOpen className="curtain-icon icon-album" size={48} />
          </div>
          
          <div className="curtain-shutter-line"></div>
        </div>
      )}
      {renderChildren}
    </>
  );
};

export default PageTransition;
