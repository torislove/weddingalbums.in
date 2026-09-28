import { useEffect, useRef } from 'react';

const AudioEffectManager = () => {
  const hasSpokenWelcome = useRef(false);

  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx;

    const playClickSound = () => {
      try {
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        // A pleasant, soft UI click sound
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.1);
      } catch (e) {
        console.error("Audio API not supported");
      }
    };

    const speakWelcome = () => {
      if (!hasSpokenWelcome.current && window.speechSynthesis) {
        const msg = new SpeechSynthesisUtterance("Welcome to Wedding Albums");
        msg.rate = 1;
        msg.pitch = 1.1; // Slightly higher pitch for a friendly tone
        msg.volume = 0.8;
        window.speechSynthesis.speak(msg);
        hasSpokenWelcome.current = true;
      }
    };

    const handleGlobalClick = (e) => {
      // Speak welcome on VERY FIRST interaction
      speakWelcome();
      
      // Play click sound if a button or link is clicked
      const target = e.target.closest('button, a, input[type="submit"], input[type="button"], [role="button"]');
      if (target) {
        playClickSound();
      }
    };

    document.addEventListener('click', handleGlobalClick);
    return () => {
      document.removeEventListener('click', handleGlobalClick);
    };
  }, []);

  return null;
};

export default AudioEffectManager;
