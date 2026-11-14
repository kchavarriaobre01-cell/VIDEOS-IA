// Música ambiental cinematográfica, generada por código (sin derechos de autor).
// Uso:  npm run musica:animals  ->  public/music/wonder-ambient.wav
// Pads suaves + arpegio tipo piano + bajo + campanitas, con reverb. Loop perfecto.
import { mkdirSync, writeFileSync } from "node:fs";

const SR = 44100;
const BPM = 72;
const BARS = 8;
const beat = 60 / BPM;
const LEN = Math.round(BARS * 4 * beat * SR);
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

// Acordes (2 compases cada uno): Cmaj9, Am9, Fmaj7, G(add9)
const chords = [
  { root: 36, tones: [60, 64, 67, 71, 74] },
  { root: 33, tones: [57, 60, 64, 67, 71] },
  { root: 29, tones: [57, 60, 64, 65, 69] },
  { root: 31, tones: [55, 59, 62, 67, 69] },
];

const buf = new Float32Array(LEN);
// Escribe con vuelta al inicio para que el loop sea continuo.
const add = (start, n, fn) => {
  for (let i = 0; i < n; i++) buf[(start + i) % LEN] += fn(i / SR);
};

const env = (t, a, r, dur) => (t < a ? t / a : t > dur - r ? Math.max(0, (dur - t) / r) : 1);

chords.forEach((c, ci) => {
  const start = Math.round(ci * 8 * beat * SR);
  const dur = 8 * beat + 1.5; // se solapa un poco con el siguiente acorde
  const n = Math.round(dur * SR);
  // Pad: dos voces desafinadas por nota, ataque y salida lentos.
  for (const m of c.tones) {
    const f = mtof(m);
    add(start, n, (t) => {
      const e = env(t, 2.2, 2.4, dur);
      const lfo = 1 + 0.15 * Math.sin(2 * Math.PI * 0.2 * t + m);
      return (
        e * lfo * 0.018 *
        (Math.sin(2 * Math.PI * f * 0.997 * t) + Math.sin(2 * Math.PI * f * 1.003 * t) + 0.3 * Math.sin(2 * Math.PI * f * 2 * t))
      );
    });
  }
  // Bajo cálido (cuerdas graves).
  const fb = mtof(c.root + 12);
  add(start, n, (t) => env(t, 1.5, 2, dur) * 0.07 * (Math.sin(2 * Math.PI * fb * t) + 0.25 * Math.sin(4 * Math.PI * fb * t)));

  // Arpegio tipo piano en corcheas.
  const pattern = [0, 2, 4, 2, 1, 3, 4, 3];
  for (let k = 0; k < 16; k++) {
    if (k % 8 === 7 && ci % 2 === 1) continue; // pequeña respiración
    const m = c.tones[pattern[k % 8]] + 12;
    const f = mtof(m);
    const s = start + Math.round(k * (beat / 2) * SR);
    const vel = k % 4 === 0 ? 1 : 0.7;
    add(s, Math.round(2.5 * SR), (t) => {
      const e = Math.exp(-t * 2.2) * Math.min(1, t / 0.004);
      return vel * 0.05 * e * (Math.sin(2 * Math.PI * f * t) + 0.35 * Math.exp(-t * 3) * Math.sin(4 * Math.PI * f * t) + 0.12 * Math.exp(-t * 5) * Math.sin(6 * Math.PI * f * t));
    });
  }
  // Campanita al inicio de cada acorde.
  const fbell = mtof(c.tones[4] + 24);
  add(start, Math.round(4 * SR), (t) => 0.02 * Math.exp(-t * 1.2) * Math.min(1, t / 0.002) * (Math.sin(2 * Math.PI * fbell * t) + 0.4 * Math.sin(2 * Math.PI * fbell * 2.76 * t)));
});

// Reverb Schroeder (4 combs + 2 allpass). Se procesa el loop dos veces para que la cola también haga loop.
const reverb = (input) => {
  const combs = [1557, 1617, 1491, 1422].map((d) => ({ d, b: new Float32Array(d), i: 0 }));
  const aps = [225, 556].map((d) => ({ d, b: new Float32Array(d), i: 0 }));
  const out = new Float32Array(input.length);
  for (let pass = 0; pass < 2; pass++) {
    for (let n = 0; n < input.length; n++) {
      const x = input[n];
      let y = 0;
      for (const c of combs) {
        const v = c.b[c.i];
        c.b[c.i] = x + v * 0.84;
        c.i = (c.i + 1) % c.d;
        y += v;
      }
      y *= 0.25;
      for (const a of aps) {
        const v = a.b[a.i];
        const w = y + v * 0.5;
        a.b[a.i] = w;
        a.i = (a.i + 1) % a.d;
        y = v - w * 0.5;
      }
      if (pass === 1) out[n] = y;
    }
  }
  return out;
};
const wet = reverb(buf);
const mix = new Float32Array(LEN);
let peak = 0;
for (let i = 0; i < LEN; i++) {
  mix[i] = buf[i] * 0.7 + wet[i] * 0.55;
  peak = Math.max(peak, Math.abs(mix[i]));
}
const gain = 0.85 / peak;

const data = Buffer.alloc(44 + LEN * 2);
data.write("RIFF", 0); data.writeUInt32LE(36 + LEN * 2, 4); data.write("WAVE", 8);
data.write("fmt ", 12); data.writeUInt32LE(16, 16); data.writeUInt16LE(1, 20); data.writeUInt16LE(1, 22);
data.writeUInt32LE(SR, 24); data.writeUInt32LE(SR * 2, 28); data.writeUInt16LE(2, 32); data.writeUInt16LE(16, 34);
data.write("data", 36); data.writeUInt32LE(LEN * 2, 40);
for (let i = 0; i < LEN; i++) data.writeInt16LE(Math.round(Math.max(-1, Math.min(1, mix[i] * gain)) * 32767), 44 + i * 2);
mkdirSync("public/music", { recursive: true });
writeFileSync("public/music/wonder-ambient.wav", data);
console.log(`Listo: public/music/wonder-ambient.wav (${(LEN / SR).toFixed(2)} s, ${BPM} BPM)`);
