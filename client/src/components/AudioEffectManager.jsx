import { useEffect } from 'react';

const AudioEffectManager = () => {
  useEffect(() => {
    // Respect user preference if sound is disabled
    if (localStorage.getItem('ui_sound_disabled') === 'true') {
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx;

    const playClickSound = () => {
      try {
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        // Gentle, soft luxury tactile click sound
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(750, audioCtx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(320, audioCtx.currentTime + 0.08);
        
        gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.08);
      } catch {
        // Silently ignore if AudioContext is blocked
      }
    };

    const handleGlobalClick = (e) => {
      const target = e.target.closest('button, a, input[type="submit"], input[type="button"], [role="button"], .interactive');
      if (target) {
        playClickSound();
      }
    };

    document.addEventListener('click', handleGlobalClick, { passive: true });
    return () => {
      document.removeEventListener('click', handleGlobalClick);
      if (audioCtx && audioCtx.state !== 'closed') {
        audioCtx.close().catch(() => {});
      }
    };
  }, []);

  return null;
};

export default AudioEffectManager;
