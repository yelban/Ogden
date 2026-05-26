let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx ??= new Ctor();
  return ctx;
}

function tone(
  freq: number,
  durationMs: number,
  type: OscillatorType = 'sine',
  gain = 0.15,
  delayMs = 0,
): void {
  const ac = getCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  osc.connect(g).connect(ac.destination);
  const t = ac.currentTime + delayMs / 1000;
  const end = t + durationMs / 1000;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, end);
  osc.start(t);
  osc.stop(end + 0.05);
}

export function playCorrect(): void {
  tone(659.25, 90, 'sine', 0.14, 0);
  tone(987.77, 140, 'sine', 0.14, 70);
}

export function playWrong(): void {
  tone(220, 110, 'sawtooth', 0.1, 0);
  tone(165, 180, 'sawtooth', 0.1, 90);
}

export type CheerLevel = 'small' | 'medium' | 'big';

export function playCheer(level: CheerLevel): void {
  if (level === 'small') {
    [523, 659, 784, 1047].forEach((f, i) => tone(f, 150, 'triangle', 0.15, i * 70));
  } else if (level === 'medium') {
    [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 180, 'triangle', 0.16, i * 65));
    tone(2093, 100, 'sine', 0.08, 360);
    tone(2637, 130, 'sine', 0.08, 440);
  } else {
    [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => tone(f, 200, 'triangle', 0.18, i * 60));
    [659, 784, 1047, 1319, 1568, 2093].forEach((f, i) => tone(f, 230, 'sine', 0.13, 400 + i * 65));
  }
}
