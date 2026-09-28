import React, { useState } from 'react';
import './IntroScreen.css';
import GoldenMandala from './GoldenMandala';

const IntroScreen = ({ onEnter }) => {
  const [isLeaving, setIsLeaving] = useState(false);

  const handleEnter = () => {
    setIsLeaving(true);
    window.dispatchEvent(new Event('appEntered'));
    setTimeout(() => {
      if (onEnter) onEnter();
    }, 1000); // Wait for fade out animation
  };

  return (
    <div className={`intro-screen ${isLeaving ? 'leaving' : ''}`} onClick={handleEnter}>
      <div className="intro-content">
        <GoldenMandala size={150} className="intro-mandala" />
        <h1 className="intro-title font-serif text-gradient mt-4">WeddingAlbums.in</h1>
        <p className="intro-subtitle">Andhra's Premium Post-Production Studio</p>
        <button className="btn btn-primary mt-4 enter-btn">
          Click to Enter Studio
        </button>
      </div>
    </div>
  );
};

export default IntroScreen;
