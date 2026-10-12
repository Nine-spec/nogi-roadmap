import confetti from 'canvas-confetti';

let ctx: AudioContext | null = null;

function tone(freq: number, start: number, dur: number, type: OscillatorType = 'sine', gain = 0.08) {
  if (!ctx) return;
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, ctx.currentTime + start);
  g.gain.linearRampToValueAtTime(gain, ctx.currentTime + start + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
  o.connect(g).connect(ctx.destination);
  o.start(ctx.currentTime + start);
  o.stop(ctx.currentTime + start + dur + 0.05);
}

export type Sfx = 'tick' | 'master' | 'level' | 'achievement' | 'belt';

export function playSfx(kind: Sfx, enabled: boolean) {
  if (!enabled) return;
  try {
    ctx = ctx ?? new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    switch (kind) {
      case 'tick':
        tone(660, 0, 0.08, 'triangle', 0.05);
        break;
      case 'master':
        tone(660, 0, 0.1, 'triangle');
        tone(990, 0.08, 0.16, 'triangle');
        break;
      case 'level':
        [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.09, 0.22, 'square', 0.04));
        break;
      case 'achievement':
        [784, 988, 1175].forEach((f, i) => tone(f, i * 0.07, 0.3, 'sine', 0.07));
        break;
      case 'belt':
        [392, 523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.11, 0.4, 'triangle', 0.06));
        break;
    }
  } catch {
    /* audio indisponible */
  }
}

const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const COLORS = ['#2563EB', '#38BDF8', '#22D3EE', '#F8FAFC', '#22C55E'];

export function burst() {
  if (reduced()) return;
  confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 }, colors: COLORS, disableForReducedMotion: true });
}

export function beltCelebration() {
  if (reduced()) return;
  const end = Date.now() + 2200;
  (function frame() {
    confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0 }, colors: COLORS });
    confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1 }, colors: COLORS });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
