// Genera la voz de Pip para el video "Colors" con Kokoro (gratis, local).
// Uso:  npm run voz:colors
// Crea un audio por escena en public/voiceover/colors/ y el archivo de tiempos
// src/Colors/voice.json (frases, duración y boca de Pip).
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { KokoroTTS } from "kokoro-js";

const VOICE = process.env.KOKORO_VOICE || "af_heart";
const SPEED = Number(process.env.KOKORO_SPEED || 0.95);
// Tono: 1 = normal, 1.19 = caricatura suave, 1.33 = caricatura, 1.5 = ardilla. No cambia la duración.
const HAS_FFMPEG = (() => {
  try {
    execFileSync("ffmpeg", ["-hide_banner", "-h", "filter=acompressor"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
})();
const PUNCH = "equalizer=f=3000:t=q:w=1:g=2,acompressor=threshold=-20dB:ratio=2.5:makeup=2";
const PITCH = Number(process.env.VOICE_PITCH || 1.12);
const FPS = 30;
const LEAD = 20; // frames de silencio al inicio de cada escena
const GAP = 10; // frames extra entre frases
const TAIL = 24; // frames al final de cada escena

const script = JSON.parse(readFileSync("src/Colors/script.json", "utf8"));
const outDir = "public/voiceover/colors";
mkdirSync(outDir, { recursive: true });
for (const f of readdirSync(outDir)) if (/\.(mp3|wav)$/.test(f)) unlinkSync(`${outDir}/${f}`);

const segments = [
  { id: "intro", list: script.intro },
  ...script.colors.map((c) => ({ id: c.id, list: c.sentences })),
  { id: "review", list: script.review },
  { id: "outro", list: script.outro },
];
// Pausas extra (frames): para que el niño repita, y para las animaciones.
const pauseAfter = (t) => {
  if (t.endsWith("?")) return 66;
  if (t.startsWith("One, two, three")) return 40;
  if (/^[A-Z][a-z]+!$/.test(t)) return 30; // "Red!"
  if (/ is | are /.test(t) && t.endsWith(".")) return 24; // objetos
  return 0;
};
const splitSentences = (t) => t.match(/[^.!?]+[.!?]+["')]*\s*/g).map((s) => s.trim()).filter(Boolean);

const writeWav = (path, samples, sr) => {
  const buf = Buffer.alloc(44 + samples.length * 2);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + samples.length * 2, 4); buf.write("WAVE", 8);
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(1, 22);
  buf.writeUInt32LE(sr, 24); buf.writeUInt32LE(sr * 2, 28); buf.writeUInt16LE(2, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(samples.length * 2, 40);
  for (let i = 0; i < samples.length; i++) {
    buf.writeInt16LE(Math.round(Math.max(-1, Math.min(1, samples[i])) * 32767), 44 + i * 2);
  }
  writeFileSync(path, buf);
};

console.log(`Cargando voz ${VOICE}...`);
const tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", { dtype: "q8", device: "cpu" });

const manifest = { fps: FPS, voice: VOICE, speed: SPEED, pitch: PITCH, segments: [] };
for (const seg of segments) {
  const parts = [];
  for (const text of seg.list) {
    const audio = await tts.generate(text, { voice: VOICE, speed: SPEED });
    parts.push({ text, samples: audio.audio, sr: audio.sampling_rate });
  }
  const sr = parts[0].sr;
  const spf = sr / FPS; // muestras por frame
  let frame = LEAD;
  const sentences = parts.map((p) => {
    const frames = Math.ceil(p.samples.length / spf);
    const s = { text: p.text, from: frame, frames };
    frame += frames + GAP + pauseAfter(p.text);
    return s;
  });
  const totalFrames = frame - GAP + TAIL;
  const mix = new Float32Array(Math.ceil(totalFrames * spf));
  parts.forEach((p, i) => mix.set(p.samples, Math.round(sentences[i].from * spf)));

  // Envolvente de volumen por frame -> apertura de la boca (0-100).
  const rms = [];
  for (let f = 0; f < totalFrames; f++) {
    let sum = 0;
    const a = Math.floor(f * spf), b = Math.min(mix.length, Math.floor((f + 1) * spf));
    for (let i = a; i < b; i++) sum += mix[i] * mix[i];
    rms.push(Math.sqrt(sum / Math.max(1, b - a)));
  }
  const peak = [...rms].sort((x, y) => x - y)[Math.floor(rms.length * 0.97)] || 1;
  const mouth = rms.map((v) => Math.round(Math.min(1, v / peak) * 100));

  const wav = `${outDir}/${seg.id}.wav`;
  writeWav(wav, mix, sr);
  // Con ffmpeg del sistema: brillo + compresión para una voz más enérgica.
  const filters = [PITCH === 1 ? null : `asetrate=${sr}*${PITCH},aresample=${sr},atempo=${1 / PITCH}`, HAS_FFMPEG ? PUNCH : null].filter(Boolean);
  const af = filters.length ? ["-af", filters.join(",")] : [];
  const args = ["-y", "-loglevel", "error", "-i", wav, ...af, "-b:a", "96k", `${outDir}/${seg.id}.mp3`];
  if (HAS_FFMPEG) execFileSync("ffmpeg", args);
  else execFileSync("npx", ["remotion", "ffmpeg", ...args]);
  unlinkSync(wav);

  manifest.segments.push({ id: seg.id, frames: totalFrames, audio: `voiceover/basket/${seg.id}.mp3`, sentences, mouth });
  console.log(`${seg.id}: ${(totalFrames / FPS).toFixed(1)} s`);
}
writeFileSync("src/Colors/voice.json", JSON.stringify(manifest));
const total = manifest.segments.reduce((s, x) => s + x.frames, 0) / FPS;
console.log(`\nListo: ${Math.floor(total / 60)} min ${Math.round(total % 60)} s de narración.`);
