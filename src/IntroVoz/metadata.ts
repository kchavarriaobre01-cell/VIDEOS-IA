import { ALL_FORMATS, Input, UrlSource } from "mediabunny";
import { CalculateMetadataFunction, staticFile } from "remotion";
import narration from "./narration.json";

export type IntroVozProps = {
  readonly scenes: { readonly frames: number; readonly audio: string | null }[];
};

// Match the fps on the <Composition> registration.
const fps = 30;
export const transitionFrames = 15;
const minSceneSeconds = 2.5;
const paddingSeconds = 0.8; // pausa al final de cada frase
const fallbackSeconds = [3.3, 3.3, 3.4]; // si aún no se generó el audio

const getDuration = async (src: string) => {
  const input = new Input({ formats: ALL_FORMATS, source: new UrlSource(src) });
  try {
    return await input.computeDuration();
  } finally {
    input.dispose();
  }
};

export const calculateIntroVozMetadata: CalculateMetadataFunction<
  IntroVozProps
> = async () => {
  const scenes = await Promise.all(
    narration.map(async ({ id }, i) => {
      // Kokoro guarda .wav; ElevenLabs guarda .mp3. Se usa el que exista.
      for (const ext of ["wav", "mp3"]) {
        const audio = staticFile(`voiceover/intro-voz/${id}.${ext}`);
        try {
          const seconds = await getDuration(audio);
          // La voz empieza tras la transición de entrada (excepto la primera escena).
          const lead = i === 0 ? 0.3 : transitionFrames / fps;
          return {
            frames: Math.ceil(
              Math.max(minSceneSeconds, lead + seconds + paddingSeconds) * fps,
            ),
            audio,
          };
        } catch {
          // Probar la siguiente extensión.
        }
      }
      return { frames: Math.round(fallbackSeconds[i] * fps), audio: null };
    }),
  );
  const total =
    scenes.reduce((sum, s) => sum + s.frames, 0) -
    transitionFrames * (scenes.length - 1);
  return { durationInFrames: total, props: { scenes } };
};
