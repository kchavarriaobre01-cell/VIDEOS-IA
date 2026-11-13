// Genera la narración con ElevenLabs para la composición "IntroVoz".
// Uso:  npm run voz
// Necesita ELEVENLABS_API_KEY en el archivo .env.local (nunca lo subas a GitHub).
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Lee .env.local / .env sin dependencias extra.
for (const file of [".env.local", ".env"]) {
  if (!existsSync(file)) continue;
  for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
  console.error("Falta ELEVENLABS_API_KEY. Créala en .env.local así:\nELEVENLABS_API_KEY=tu_clave");
  process.exit(1);
}

// Voz por defecto: "George" (multilingüe). Cámbiala con ELEVENLABS_VOICE_ID en .env.local.
const voiceId = process.env.ELEVENLABS_VOICE_ID || "JBFqnCBsd6RMkjVDRZzb";
const lines = JSON.parse(readFileSync("src/IntroVoz/narration.json", "utf8"));
const outDir = "public/voiceover/intro-voz";
mkdirSync(outDir, { recursive: true });

for (const { id, text } of lines) {
  process.stdout.write(`Generando ${id}... `);
  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: { "xi-api-key": apiKey, "Content-Type": "application/json", Accept: "audio/mpeg" },
    body: JSON.stringify({
      text,
      model_id: "eleven_multilingual_v2",
      voice_settings: { stability: 0.5, similarity_boost: 0.75, style: 0.3 },
    }),
  });
  if (!res.ok) {
    console.error(`\nError ${res.status}: ${await res.text()}`);
    process.exit(1);
  }
  writeFileSync(`${outDir}/${id}.mp3`, Buffer.from(await res.arrayBuffer()));
  console.log("listo");
}
console.log(`\nAudio guardado en ${outDir}. Ahora: npx remotion render IntroVoz out/intro-voz.mp4`);
