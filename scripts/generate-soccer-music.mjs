// Genera una pista de música original (sin derechos de autor) para el fondo del video.
// Uso:  npm run musica:soccer
// Crea public/music/samba-goal.wav: groove de estadio con percusión tipo samba, 8 compases a 104 BPM.
import { mkdirSync, writeFileSync } from "node:fs";

const SR = 44100;
export const BPM = 104;
const BEAT = 60 / BPM;
const BARS = 8;
const LEN = Math.round(BARS * 4 * BEAT * SR);
const L = new Float32Array(LEN);
const R = new Float32Array(LEN);

// Ruido determinista (siempre suena igual).
let seed = 12345;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const add = (start, n, fn, pan = 0) => {
  const s0 = Math.round(start * SR);
  for (let i = 0; i < n; i++) {
    const idx = (s0 + i) % LEN; // da la vuelta: el loop queda perfecto
    const v = fn(i / SR);
    L[idx] += v * (1 - Math.max(0, pan));
    R[idx] += v * (1 + Math.min(0, pan));
  }
};
const midi = (n) => 440 * 2 ** ((n - 69) / 12);

const kick = (t0) => add(t0, SR * 0.35, (t) => Math.sin(2 * Math.PI * (45 * t + (75 / 18) * (1 - Math.exp(-18 * t)))) * Math.exp(-7 * t) * 0.9);
const snare = (t0) => add(t0, SR * 0.22, (t) => (rnd() * 0.7 + Math.sin(2 * Math.PI * 190 * t) * 0.4) * Math.exp(-18 * t) * 0.45);
let prev = 0;
const hat = (t0, open, pan) =>
  add(t0, SR * (open ? 0.18 : 0.05), (t) => {
    const n = rnd();
    const hp = n - prev; // filtro paso alto simple
    prev = n;
    return hp * Math.exp(-(open ? 18 : 70) * t) * 0.12;
  }, pan);
const bass = (t0, note, dur) =>
  add(t0, SR * dur, (t) => {
    const f = midi(note);
    const env = Math.min(1, t * 200) * Math.exp(-2.5 * t);
    return Math.tanh(1.6 * (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(4 * Math.PI * f * t))) * env * 0.38;
  });
const stab = (t0, notes, dur, pan) =>
  add(t0, SR * dur, (t) => {
    const env = Math.min(1, t * 300) * Math.exp(-9 * t);
    let v = 0;
    for (const n of notes) {
      const f = midi(n);
      v += Math.sin(2 * Math.PI * f * t) + 0.35 * Math.sin(4 * Math.PI * f * t) + 0.15 * Math.sin(6 * Math.PI * f * t);
    }
    return (v / notes.length) * env * 0.16;
  }, pan);
const pluck = (t0, note, pan) =>
  add(t0, SR * 0.4, (t) => {
    const f = midi(note);
    return (Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(2 * Math.PI * 2 * f * t) * Math.exp(-20 * t)) * Math.exp(-6 * t) * 0.09;
  }, pan);

// Percusión tipo samba.
const surdo = (t0, f0, amp) => add(t0, SR * 0.5, (t) => Math.sin(2 * Math.PI * (f0 * t + (40 / 14) * (1 - Math.exp(-14 * t)))) * Math.exp(-6 * t) * amp);
const shaker = (t0, amp, pan) => add(t0, SR * 0.06, (t) => rnd() * Math.exp(-60 * t) * Math.min(1, t * 400) * amp, pan);
const tamborim = (t0, pan) => add(t0, SR * 0.08, (t) => (Math.sin(2 * Math.PI * 820 * t) * 0.6 + rnd() * 0.4) * Math.exp(-45 * t) * 0.22, pan);
const agogo = (t0, note, pan) => add(t0, SR * 0.25, (t) => {
  const f = midi(note);
  return (Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(2 * Math.PI * f * 2.76 * t)) * Math.exp(-14 * t) * 0.08;
}, pan);
const brass = (t0, notes, dur) =>
  add(t0, SR * dur, (t) => {
    const env = Math.min(1, t * 40) * Math.exp(-3 * t);
    let v = 0;
    for (const n of notes) {
      const f = midi(n);
      for (let h = 1; h <= 6; h++) v += Math.sin(2 * Math.PI * f * h * t) / h;
    }
    return Math.tanh((v / notes.length) * 0.8) * env * 0.22;
  });

// Progresión alegre: D - Bm - G - A (dos vueltas).
const chords = [
  { root: 38, notes: [62, 66, 69, 74] },
  { root: 35, notes: [62, 66, 71, 74] },
  { root: 43, notes: [62, 67, 71, 74] },
  { root: 45, notes: [61, 64, 69, 73] },
];
const melody = [74, 76, 78, 81, 78, 76, 74, 71, 74, 79, 78, 76, 73, 76, 81, 78];

for (let bar = 0; bar < BARS; bar++) {
  const t = bar * 4 * BEAT;
  const ch = chords[bar % 4];
  // Surdo: suave en 1 y 3, fuerte en 2 y 4 (como en la samba).
  for (let b = 0; b < 4; b++) surdo(t + b * BEAT, b % 2 ? 55 : 62, b % 2 ? 0.75 : 0.4);
  kick(t);
  snare(t + BEAT); snare(t + 3 * BEAT);
  // Shaker en semicorcheas con acento.
  for (let s = 0; s < 16; s++) shaker(t + s * BEAT * 0.25, s % 4 === 2 ? 0.16 : 0.08, s % 2 ? 0.35 : -0.35);
  // Tamborim sincopado.
  for (const off of [0, 0.75, 1.5, 2.5, 3.25]) tamborim(t + off * BEAT, 0.4);
  // Agogó (dos tonos).
  agogo(t + 0.5 * BEAT, 84, -0.5); agogo(t + 1 * BEAT, 79, -0.5); agogo(t + 2.5 * BEAT, 84, -0.5); agogo(t + 3 * BEAT, 79, -0.5);
  // Bajo saltarín.
  bass(t, ch.root, 0.3); bass(t + 0.75 * BEAT, ch.root + 7, 0.2); bass(t + 1.5 * BEAT, ch.root + 12, 0.25);
  bass(t + 2 * BEAT, ch.root, 0.3); bass(t + 2.75 * BEAT, ch.root + 7, 0.2); bass(t + 3.5 * BEAT, ch.root + 12, 0.25);
  // Acordes a contratiempo.
  for (const off of [0.5, 1.25, 2.5, 3.25]) stab(t + off * BEAT, ch.notes, 0.22, off % 1 ? 0.25 : -0.25);
  // Metales de estadio.
  brass(t, ch.notes.slice(0, 3), 0.5);
  if (bar % 2 === 1) { brass(t + 2.5 * BEAT, ch.notes.slice(1), 0.3); brass(t + 3 * BEAT, ch.notes.slice(1), 0.45); }
  // Melodía en la segunda mitad del loop.
  if (bar >= 4) for (let k = 0; k < 4; k++) pluck(t + k * BEAT, melody[((bar - 4) * 4 + k) % melody.length], k % 2 ? -0.4 : 0.4);
}

// Normaliza y guarda.
let peak = 0;
for (let i = 0; i < LEN; i++) peak = Math.max(peak, Math.abs(L[i]), Math.abs(R[i]));
const g = 0.89 / peak;
const buf = Buffer.alloc(44 + LEN * 4);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + LEN * 4, 4); buf.write("WAVE", 8); buf.write("fmt ", 12);
buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(LEN * 4, 40);
for (let i = 0; i < LEN; i++) {
  buf.writeInt16LE(Math.round(L[i] * g * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(R[i] * g * 32767), 46 + i * 4);
}
mkdirSync("public/music", { recursive: true });
writeFileSync("public/music/samba-goal.wav", buf);
// Se guarda en WAV para que el loop sea exacto (sin silencios añadidos por la compresión).
console.log(`Música lista: public/music/samba-goal.wav (${(LEN / SR).toFixed(2)} s por loop, ${BPM} BPM)`);
