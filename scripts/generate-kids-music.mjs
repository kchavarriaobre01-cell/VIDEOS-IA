// Música infantil alegre, generada por código (sin derechos de autor).
// Uso:  npm run musica:colors  ->  public/music/happy-colors.wav
// Marimba + bajo + bombo suave + palmas + shaker. Loop perfecto.
import { mkdirSync, writeFileSync } from "node:fs";

const SR = 44100;
const BPM = 124;
const BARS = 8;
const beat = 60 / BPM;
const LEN = Math.round(BARS * 4 * beat * SR);
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);

// Un acorde por compás: C, G, Am, F (x2). Melodía de marimba en corcheas (null = silencio).
const chords = [
  { root: 36, tones: [60, 64, 67] },
  { root: 43, tones: [59, 62, 67] },
  { root: 45, tones: [60, 64, 69] },
  { root: 41, tones: [60, 65, 69] },
];
const melody = [
  [72, 76, 79, 76, 72, null, 74, 76],
  [74, 71, 67, 71, 74, null, 76, 74],
  [72, 76, 81, 79, 76, null, 72, 74],
  [77, 76, 74, 72, 74, null, null, null],
  [72, 76, 79, 76, 72, null, 74, 76],
  [79, 77, 74, 71, 74, null, 76, 79],
  [81, 79, 76, 72, 76, null, 79, 81],
  [77, 76, 74, 74, 72, null, null, null],
];

const buf = new Float32Array(LEN);
const add = (start, n, fn) => {
  for (let i = 0; i < n; i++) buf[(start + i) % LEN] += fn(i / SR);
};
let seed = 7;
const noise = () => ((seed = (seed * 16807) % 2147483647) / 2147483647) * 2 - 1;
const bar = 4 * beat;
const at = (b, beats) => Math.round((b * bar + beats * beat) * SR);

for (let b = 0; b < BARS; b++) {
  const c = chords[b % 4];
  // Bajo: negras sobre la raíz con un saltito a la quinta.
  [0, 1, 2, 3].forEach((k) => {
    const f = mtof(c.root + (k % 2 ? 7 : 0));
    add(at(b, k), Math.round(beat * 0.9 * SR), (t) => 0.16 * Math.exp(-t * 3) * Math.min(1, t / 0.005) * (Math.sin(2 * Math.PI * f * t) + 0.3 * Math.sin(4 * Math.PI * f * t)));
  });
  // Acordes suaves tipo ukelele en los contratiempos.
  [0.5, 1.5, 2.5, 3.5].forEach((k) => {
    c.tones.forEach((m, j) => {
      const f = mtof(m);
      add(at(b, k) + j * 260, Math.round(0.5 * SR), (t) => 0.03 * Math.exp(-t * 7) * (Math.sin(2 * Math.PI * f * t) + 0.5 * Math.sin(4 * Math.PI * f * t) + 0.25 * Math.sin(6 * Math.PI * f * t)));
    });
  });
  // Marimba.
  melody[b].forEach((m, k) => {
    if (m === null) return;
    const f = mtof(m);
    add(at(b, k / 2), Math.round(1.2 * SR), (t) => 0.11 * Math.exp(-t * 5) * Math.min(1, t / 0.002) * (Math.sin(2 * Math.PI * f * t) + 0.25 * Math.exp(-t * 20) * Math.sin(2 * Math.PI * f * 4 * t)));
    // Glockenspiel (campanitas de juguete) una octava arriba.
    const g = f * 2;
    add(at(b, k / 2), Math.round(1.5 * SR), (t) => 0.045 * Math.exp(-t * 3.5) * Math.min(1, t / 0.001) * (Math.sin(2 * Math.PI * g * t) + 0.4 * Math.sin(2 * Math.PI * g * 2.76 * t) * Math.exp(-t * 8)));
  });
  // Bombo suave (1 y 3), palmas (2 y 4), shaker en corcheas.
  [0, 2].forEach((k) => add(at(b, k), Math.round(0.3 * SR), (t) => 0.32 * Math.exp(-t * 14) * Math.sin(2 * Math.PI * (55 + 90 * Math.exp(-t * 35)) * t)));
  [1, 3].forEach((k) => add(at(b, k), Math.round(0.2 * SR), (t) => 0.16 * Math.exp(-t * 26) * noise()));
  if (b % 2 === 1) add(at(b, 3.5), Math.round(0.4 * SR), (t) => 0.06 * Math.exp(-t * 6) * Math.sin(2 * Math.PI * (300 + 500 * t) * t));
  for (let k = 0; k < 8; k++) add(at(b, k / 2), Math.round(0.06 * SR), (t) => (k % 2 ? 0.025 : 0.04) * Math.exp(-t * 70) * noise());
}

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
  mix[i] = buf[i] * 0.85 + wet[i] * 0.25;
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
writeFileSync("public/music/happy-colors.wav", data);
console.log(`Listo: public/music/happy-colors.wav (${(LEN / SR).toFixed(2)} s, ${BPM} BPM)`);
