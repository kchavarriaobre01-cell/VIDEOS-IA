// Genera una pista de música original (sin derechos de autor) para el fondo del video.
// Uso:  npm run musica:animalfacts
// Crea public/music/jungle-trek.wav: groove de aventura (marimba + tambores tribales), 8 compases a 100 BPM.
import { mkdirSync, writeFileSync } from "node:fs";

const SR = 44100;
export const BPM = 100;
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

// Tambores tribales, marimba y flauta.
const tom = (t0, f0, amp, pan) => add(t0, SR * 0.45, (t) => Math.sin(2 * Math.PI * (f0 * t + (30 / 12) * (1 - Math.exp(-12 * t)))) * Math.exp(-7 * t) * amp, pan);
const shaker = (t0, amp, pan) => add(t0, SR * 0.06, (t) => rnd() * Math.exp(-60 * t) * Math.min(1, t * 400) * amp, pan);
const marimba = (t0, note, amp, pan) => add(t0, SR * 0.6, (t) => {
  const f = midi(note);
  return (Math.sin(2 * Math.PI * f * t) + 0.25 * Math.sin(2 * Math.PI * f * 4 * t) * Math.exp(-30 * t)) * Math.exp(-7 * t) * Math.min(1, t * 600) * amp;
}, pan);
const flute = (t0, note, dur) => add(t0, SR * dur, (t) => {
  const f = midi(note) * (1 + 0.004 * Math.sin(2 * Math.PI * 5 * t) * Math.min(1, t * 3));
  const env = Math.min(1, t * 12) * Math.min(1, (dur - t) * 10);
  return (Math.sin(2 * Math.PI * f * t) + 0.12 * Math.sin(4 * Math.PI * f * t) + rnd() * 0.02) * env * 0.09;
});

// Progresión aventurera: Em - C - G - D (dos vueltas).
const chords = [
  { root: 40, notes: [64, 67, 71, 76] },
  { root: 36, notes: [64, 67, 72, 76] },
  { root: 43, notes: [62, 67, 71, 74] },
  { root: 38, notes: [62, 66, 69, 74] },
];
const flutePhrase = [[76, 1], [79, 0.5], [78, 0.5], [76, 1], [71, 1], [72, 1], [74, 0.5], [76, 0.5], [79, 2]];

for (let bar = 0; bar < BARS; bar++) {
  const t = bar * 4 * BEAT;
  const ch = chords[bar % 4];
  kick(t); kick(t + 2.5 * BEAT);
  // Tambores tribales con patrón sincopado.
  for (const [off, f0, amp] of [[0, 90, 0.5], [0.75, 120, 0.35], [1.5, 90, 0.4], [2, 70, 0.55], [3, 120, 0.35], [3.5, 150, 0.3]]) tom(t + off * BEAT, f0, amp, f0 > 100 ? 0.3 : -0.2);
  snare(t + BEAT); snare(t + 3 * BEAT);
  for (let s = 0; s < 16; s++) shaker(t + s * BEAT * 0.25, s % 4 === 2 ? 0.15 : 0.07, s % 2 ? 0.35 : -0.35);
  // Bajo.
  bass(t, ch.root, 0.4); bass(t + 1.5 * BEAT, ch.root + 7, 0.25); bass(t + 2 * BEAT, ch.root, 0.35); bass(t + 3.5 * BEAT, ch.root + 12, 0.25);
  // Marimba en corcheas (arpegio).
  const pat = [0, 2, 1, 3, 2, 1, 3, 2];
  for (let e = 0; e < 8; e++) marimba(t + e * BEAT * 0.5, ch.notes[pat[e]] + 12, e % 2 ? 0.07 : 0.1, e % 2 ? 0.3 : -0.3);
  // Acordes suaves.
  stab(t + 0.5 * BEAT, ch.notes, 0.3, -0.2); stab(t + 2.5 * BEAT, ch.notes, 0.3, 0.2);
}
// Flauta en la segunda mitad del loop.
let ft = 4 * 4 * BEAT;
for (let r = 0; r < 2; r++) for (const [n, d] of flutePhrase) { flute(ft, n + 12, d * BEAT * 0.95); ft += d * BEAT; }

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
writeFileSync("public/music/jungle-trek.wav", buf);
// Se guarda en WAV para que el loop sea exacto (sin silencios añadidos por la compresión).
console.log(`Música lista: public/music/jungle-trek.wav (${(LEN / SR).toFixed(2)} s por loop, ${BPM} BPM)`);
