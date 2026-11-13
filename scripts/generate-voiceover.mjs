// Genera la narración GRATIS con Kokoro (voz de IA de código abierto, corre en tu computadora).
// Uso:  npm run voz
// La primera vez descarga el modelo (~90 MB) desde Hugging Face; después funciona sin internet.
//
// Cambia la voz o la velocidad aquí. Voces en inglés con energía: am_puck, af_bella, af_heart, am_fenrir.
const VOICE = process.env.KOKORO_VOICE || "am_puck";
const SPEED = Number(process.env.KOKORO_SPEED || 1.12);

import { existsSync, mkdirSync, readdirSync, readFileSync, unlinkSync } from "node:fs";
import { KokoroTTS } from "kokoro-js";

const lines = JSON.parse(readFileSync("src/IntroVoz/narration.json", "utf8"));
const outDir = "public/voiceover/intro-voz";
mkdirSync(outDir, { recursive: true });
// Borra audios anteriores (por ejemplo, mp3 de ElevenLabs) para no mezclar versiones.
for (const f of readdirSync(outDir)) if (/\.(mp3|wav)$/.test(f)) unlinkSync(`${outDir}/${f}`);

console.log(`Cargando voz ${VOICE}...`);
const tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", {
  dtype: "q8",
  device: "cpu",
});

for (const { id, text } of lines) {
  process.stdout.write(`Generando ${id}... `);
  const audio = await tts.generate(text, { voice: VOICE, speed: SPEED });
  audio.save(`${outDir}/${id}.wav`);
  console.log("listo");
}
console.log(`\nAudio guardado en ${outDir}. Ahora: npx remotion render IntroVoz out/intro-voz.mp4`);
if (!existsSync(`${outDir}/${lines[0].id}.wav`)) process.exit(1);
