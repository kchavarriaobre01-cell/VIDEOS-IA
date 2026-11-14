import { Audio } from "@remotion/media";
import { AbsoluteFill, Series, staticFile, useCurrentFrame } from "remotion";
import { Squirrel } from "./Squirrel";
import { Background } from "./Background";
import { FactScene } from "./FactScene";
import { ProgressBar } from "./ProgressBar";
import { TitleScene } from "./TitleScene";
import type { Fact, Segment } from "./types";
import script from "./script.json";
import voice from "./voice.json";

const segments = voice.segments as Segment[];
const facts = script.facts as Fact[];
export const basketTotalFrames = segments.reduce((s, x) => s + x.frames, 0);

// Inicio de cada escena en el video completo.
const starts = segments.reduce<number[]>((acc, s, i) => [...acc, i === 0 ? 0 : acc[i - 1] + segments[i - 1].frames], []);

const Progress = () => {
  const frame = useCurrentFrame();
  let seg = 0;
  for (let i = 0; i < starts.length; i++) if (frame >= starts[i]) seg = i;
  // seg 0 = intro, 1..25 = datos, 26 = cierre
  if (seg === 0 || seg === segments.length - 1) return null;
  return <ProgressBar current={seg} />;
};

// 1 cuando la voz está hablando, 0 en las pausas (para bajar la música bajo la voz).
const speaking = (() => {
  const arr = new Uint8Array(basketTotalFrames);
  segments.forEach((seg, i) => {
    for (const s of seg.sentences) arr.fill(1, starts[i] + s.from - 4, starts[i] + s.from + s.frames + 4);
  });
  return arr;
})();

const MUSIC_TALKING = 0.07;
const MUSIC_PAUSE = 0.2;

const musicVolume = (f: number) => {
  // Promedio de 16 frames alrededor para que el volumen cambie suave.
  let sum = 0;
  for (let k = -8; k < 8; k++) sum += speaking[Math.min(basketTotalFrames - 1, Math.max(0, f + k))];
  const talk = sum / 16;
  const fadeOut = Math.min(1, (basketTotalFrames - f) / 60);
  return (MUSIC_PAUSE - (MUSIC_PAUSE - MUSIC_TALKING) * talk) * fadeOut;
};

const mouth = segments.flatMap((s) => s.mouth);

export const BasketFacts = () => {
  return (
    <AbsoluteFill>
      <Background />
      <Series>
        {segments.map((seg, i) => (
          <Series.Sequence key={seg.id} name={seg.id} durationInFrames={seg.frames}>
            <Audio src={staticFile(seg.audio)} />
            {i === 0 ? (
              <TitleScene segment={seg} kicker="DID YOU KNOW?" lines={["25 basketball", "facts you"]} accent="never knew" />
            ) : i === segments.length - 1 ? (
              <TitleScene segment={seg} kicker="THAT'S A WRAP" lines={["Thanks for", "watching!"]} accent="Subscribe!" />
            ) : (
              <FactScene fact={facts[i - 1]} index={i} segment={seg} />
            )}
          </Series.Sequence>
        ))}
      </Series>
      <Progress />
      <div style={{ position: "absolute", right: 90, bottom: 30 }}>
        <Squirrel mouth={mouth} size={600} />
      </div>
      <Audio name="Música" src={staticFile("music/hoops-beat.wav")} loop volume={musicVolume} />
    </AbsoluteFill>
  );
};
