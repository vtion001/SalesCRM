import React, { useEffect } from 'react';

/**
 * DialerSound
 * - Attaches click listeners to dialer buttons and plays a short DTMF-like tone using WebAudio API.
 * - Does not modify components/Dialer.tsx; it finds buttons by grid container and button structure.
 * - Safe to mount at app root; cleans up listeners on unmount.
 */

const TONE_MAP: Record<string, number> = {
  '1': 697 + 1200, // not real DTMF pairing but distinct pitches
  '2': 770 + 1200,
  '3': 852 + 1200,
  '4': 697 + 1400,
  '5': 770 + 1400,
  '6': 852 + 1400,
  '7': 697 + 1600,
  '8': 770 + 1600,
  '9': 852 + 1600,
  '*': 941 + 1200,
  '0': 941 + 1400,
  '#': 941 + 1600,
};

// Small helper to play a short click/DTMF-like tone
function playTone(freq: number, duration = 0.12) {
  try {
    const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = freq;
    g.gain.value = 0.12;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    // ramp down to avoid clicks
    g.gain.setTargetAtTime(0, ctx.currentTime + duration * 0.9, 0.01);
    setTimeout(() => {
      try { o.stop(); ctx.close(); } catch (e) {}
    }, duration * 1000 + 50);
  } catch (e) {
    // ignore audio errors
    // console.warn('Audio failed', e);
  }
}

export const DialerSound: React.FC = () => {
  useEffect(() => {
    const container = document.querySelector('.grid.grid-cols-3');
    if (!container) return;

    // Find all buttons under the container
    const buttons = Array.from(container.querySelectorAll('button')) as HTMLButtonElement[];
    if (!buttons.length) return;

    const handler = (ev: MouseEvent) => {
      const target = ev.currentTarget as HTMLElement;
      // Find inner span with large digit text
      const span = target.querySelector('span.text-2xl, span');
      const digit = span?.textContent?.trim() || '';
      if (!digit) return;

      // Play mapped tone or short click
      const freq = TONE_MAP[digit] || 1200;
      playTone(freq);

      // Add a quick active visual if needed
      target.classList.add('ring', 'ring-blue-200');
      setTimeout(() => target.classList.remove('ring', 'ring-blue-200'), 180);
    };

    buttons.forEach((btn) => btn.addEventListener('click', handler));

    return () => {
      buttons.forEach((btn) => btn.removeEventListener('click', handler));
    };
  }, []);

  return null; // invisible helper mounted in the tree
};

export default DialerSound;
