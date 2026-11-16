import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, Series, staticFile, useCurrentFrame } from "remotion";
import { colors, displayFont } from "../Intro/theme";
import { Countdown, FactHeader, NameTag, Vignette } from "../BasketFacts/Overlays";
import { PhotoCredit, PhotoLayer } from "../BasketFacts/PhotoLayer";
import { Squirrel } from "../BasketFacts/Squirrel";
import { EndScreen, END_SCREEN_FRAMES } from "../NFLFacts/EndScreen";
import type { Fact, Photo, Segment } from "../BasketFacts/types";
import images from "./images.json";
import script from "./script.json";
import voice from "./voice.json";

export const SOCCER_BPM = 104;
// El cierre dura al menos 20 s para la pantalla final de YouTube.
const segments = (voice.segments as Segment[]).map((s, i, all) =>
  i === all.length - 1 ? { ...s, frames: Math.max(s.frames, END_SCREEN_FRAMES) } : s,
);
export const soccerSegments = segments;
export const soccerFacts = script.facts as Fact[];
export const soccerPhotos = images as Record<string, Photo[]>;
export const soccerTotalFrames = segments.reduce((s, x) => s + x.frames, 0);

const starts = segments.reduce<number[]>((acc, _s, i) => [...acc, i === 0 ? 0 : acc[i - 1] + segments[i - 1].frames], []);

// Nombres que aparecen en etiqueta cuando la voz los menciona.
export const NAMES: [RegExp, string][] = [
  [/William McCrum/, "William McCrum"],
  [/Ken Aston/, "Ken Aston"],
  [/Barassi/, "Ottorino Barassi"],
  [/Pickles/, "Pickles the dog"],
  [/Pelé/, "Pelé"],
  [/Lev Yashin/, "Lev Yashin"],
  [/Maradona/, "Diego Maradona"],
  [/Paul/, "Paul the Octopus"],
  [/Hakan/, "Hakan Şükür"],
  [/Messi/, "Lionel Messi"],
  [/Ronaldo/, "Cristiano Ronaldo"],
];
export const namesFor = (seg: Segment) => {
  const shown = new Set<string>();
  return seg.sentences.map((s) => {
    const hit = NAMES.find(([re, name]) => re.test(s.text) && !shown.has(name));
    if (!hit) return null;
    shown.add(hit[1]);
    return hit[1];
  });
};

// Música más baja mientras habla la voz.
const speaking = (() => {
  const arr = new Uint8Array(soccerTotalFrames);
  segments.forEach((seg, i) => {
    for (const s of seg.sentences) arr.fill(1, starts[i] + s.from - 4, starts[i] + s.from + s.frames + 4);
  });
  return arr;
})();
const MUSIC_TALKING = 0.17;
const MUSIC_PAUSE = 0.4;
const musicVolume = (frame: number) => {
  const f = Number.isFinite(frame) ? Math.round(frame) : 0;
  let sum = 0;
  for (let k = -8; k < 8; k++) sum += speaking[Math.min(soccerTotalFrames - 1, Math.max(0, f + k))] ?? 0;
  const talk = sum / 16;
  const fadeOut = Math.max(0, Math.min(1, (soccerTotalFrames - f) / 60));
  return (MUSIC_PAUSE - (MUSIC_PAUSE - MUSIC_TALKING) * talk) * fadeOut;
};

const BigTitle = ({ lines, accent }: { readonly lines: readonly string[]; readonly accent: string }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: 230, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      {lines.map((l, i) => (
        <div
          key={l}
          style={{
            fontFamily: displayFont,
            fontWeight: 800,
            fontSize: 120,
            lineHeight: 1,
            color: "#fff",
            textShadow: "0 8px 0 rgba(0,0,0,0.6), 0 0 40px rgba(0,0,0,0.6)",
            scale: interpolate(frame, [i * 8, i * 8 + 14], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: Easing.spring({ damping: 12 }),
              output: "perceptual-scale",
            }),
          }}
        >
          {l}
        </div>
      ))}
      <div
        style={{
          fontFamily: displayFont,
          fontWeight: 800,
          fontSize: 100,
          color: colors.ink,
          backgroundColor: colors.lime,
          padding: "4px 30px 14px",
          borderRadius: 16,
          border: "6px solid #fff",
          rotate: "-3deg",
          marginTop: 16,
          scale: interpolate(frame, [lines.length * 8 + 4, lines.length * 8 + 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 12 }),
            output: "perceptual-scale",
          }),
        }}
      >
        {accent}
      </div>
    </div>
  );
};

const mouth = segments.flatMap((s) => s.mouth);

// La cuenta regresiva termina justo cuando empieza la pantalla final.
const MainCountdown = () => {
  const frame = useCurrentFrame();
  const end = soccerTotalFrames - segments[segments.length - 1].frames;
  return frame < end ? <Countdown total={end} /> : null;
};

export const SoccerFacts = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Series>
        {segments.map((seg, i) => {
          const key = i === 0 ? "intro" : i === segments.length - 1 ? "outro" : `f${String(i).padStart(2, "0")}`;
          const photos = soccerPhotos[key] ?? [];
          const fact = soccerFacts[i - 1];
          return (
            <Series.Sequence key={seg.id} name={seg.id} durationInFrames={seg.frames}>
              <Audio src={staticFile(seg.audio)} />
              <PhotoLayer photos={photos} sentences={seg.sentences} />
              <Vignette />
              {i === 0 ? (
                <BigTitle lines={["25 SOCCER", "FACTS"]} accent="you never knew!" />
              ) : i === segments.length - 1 ? (
                <EndScreen />
              ) : (
                <FactHeader index={i} title={fact.title} stat={fact.stat} />
              )}
              <NameTag sentences={seg.sentences} names={namesFor(seg)} />
              <PhotoCredit photos={photos} sentences={seg.sentences} />
            </Series.Sequence>
          );
        })}
      </Series>
      <MainCountdown />
      <div style={{ position: "absolute", right: 10, bottom: 0 }}>
        <Squirrel mouth={mouth} size={330} sport="soccer" bpm={SOCCER_BPM} />
      </div>
      <Audio name="Música" src={staticFile("music/samba-goal.wav")} loop volume={musicVolume} />
    </AbsoluteFill>
  );
};
