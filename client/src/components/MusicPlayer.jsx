import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import './MusicPlayer.css';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    // We use the uploaded audio from the user's downloads folder
    const audio = new Audio("/bgm.mp3");
    audio.loop = true;
    audio.volume = 0.5;
    audioRef.current = audio;

    const handleAppEntered = () => {
      audio.play().then(() => {
        setIsPlaying(true);
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 5000);
      }).catch(e => console.log("Audio play blocked by browser:", e));
    };

    window.addEventListener('appEntered', handleAppEntered);

    return () => {
      window.removeEventListener('appEntered', handleAppEntered);
      audio.pause();
      audio.src = '';
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play blocked by browser:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <button 
      className={`music-toggle ${isPlaying ? 'playing' : ''}`} 
      onClick={togglePlay}
      aria-label="Toggle Background Music"
    >
      <div className="music-pulse"></div>
      {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      <span className={`music-tooltip ${showTooltip ? 'force-show' : ''}`}>
        {isPlaying ? "Playing - Click to Pause" : "Play Wedding BGM"}
      </span>
    </button>
  );
};

export default MusicPlayer;
