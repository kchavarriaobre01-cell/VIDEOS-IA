import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Series, staticFile, useCurrentFrame } from "remotion";
import type { Photo, Segment } from "../BasketFacts/types";
import { Grade, Grain, Letterbox } from "./Film";
import { KenBurns, shotPhoto } from "./KenBurns";
import { BarLabels, BigTitle, ChapterCard, Credit, StatCard } from "./Overlays";
import images from "./images.json";
import script from "./script.json";
import voice from "./voice.json";
import "./theme";

export type Animal = (typeof script.animals)[number];
export const animalSegments = voice.segments as unknown as Segment[];
export const animals = script.animals as Animal[];
export const animalPhotos = images as Record<string, Photo[]>;
export const LEAD = 84;
export const animalsTotalFrames = animalSegments.reduce((s, x) => s + x.frames, 0);
export const photoKey = (i: number, n: number) => (i === 0 ? "intro" : i === n - 1 ? "outro" : `a${String(i).padStart(2, "0")}`);

const starts = animalSegments.reduce<number[]>((acc, _s, i) => [...acc, i === 0 ? 0 : acc[i - 1] + animalSegments[i - 1].frames], []);

// Música: más alta en las tarjetas de capítulo, suave bajo la voz.
const speaking = (() => {
  const arr = new Uint8Array(animalsTotalFrames);
  animalSegments.forEach((seg, i) => {
    for (const s of seg.sentences) arr.fill(1, starts[i] + s.from - 6, starts[i] + s.from + s.frames + 6);
  });
  return arr;
})();
export const duckedVolume = (talk: number, f: number, total: number) => {
  const fadeIn = Math.min(1, f / 45);
  const fadeOut = Math.max(0, Math.min(1, (total - f) / 90));
  return (0.42 - 0.3 * talk) * fadeIn * fadeOut;
};
const musicVolume = (frame: number) => {
  const f = Number.isFinite(frame) ? Math.round(frame) : 0;
  let sum = 0;
  for (let k = -12; k < 12; k++) sum += speaking[Math.min(animalsTotalFrames - 1, Math.max(0, f + k))] ?? 0;
  return duckedVolume(sum / 24, f, animalsTotalFrames);
};

const SegmentCredit = ({ photos, seg }: { readonly photos: readonly Photo[]; readonly seg: Segment }) => {
  const frame = useCurrentFrame();
  const p = shotPhoto(photos, seg.sentences, seg.frames, frame);
  return p ? <Credit text={`Photo: ${p.credit} · ${p.license}`} /> : null;
};

const FadeFromBlack = ({ frames }: { readonly frames: number }) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, frames], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return o > 0 ? <div style={{ position: "absolute", inset: 0, backgroundColor: `rgba(0,0,0,${o})` }} /> : null;
};

export const Animals = () => {
  const n = animalSegments.length;
  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Series>
        {animalSegments.map((seg, i) => {
          const key = photoKey(i, n);
          const photos = animalPhotos[key] ?? [];
          const a = animals[i - 1];
          const s1 = seg.sentences[1] ?? seg.sentences[0];
          return (
            <Series.Sequence key={seg.id} name={seg.id} durationInFrames={seg.frames}>
              <Audio src={staticFile(seg.audio)} />
              <KenBurns photos={photos} sentences={seg.sentences} total={seg.frames} />
              <Grade />
              {i === 0 ? (
                <BigTitle kicker="A JOURNEY ACROSS OUR PLANET" title="25 Amazing Animals" subtitle="for curious little explorers" from={0} to={LEAD + 90} />
              ) : i === n - 1 ? (
                <BigTitle kicker="THANK YOU, EXPLORERS" title="Keep Exploring" subtitle="Subscribe for more amazing animals" from={LEAD - 30} to={seg.frames + 30} />
              ) : (
                <>
                  <StatCard stat={a.stat} label={a.statLabel} from={s1.from} to={Math.min(s1.from + 270, seg.frames - 20)} />
                  <ChapterCard chapter={`ANIMAL ${i} OF 25`} name={a.name} place={a.place} end={LEAD} />
                </>
              )}
              <Letterbox />
              {i > 0 && i < n - 1 ? <BarLabels left="25 AMAZING ANIMALS" right={`${String(i).padStart(2, "0")} · ${a.name.toUpperCase()}`} /> : null}
              <SegmentCredit photos={photos} seg={seg} />
              {i === 0 ? <FadeFromBlack frames={45} /> : null}
            </Series.Sequence>
          );
        })}
      </Series>
      <Grain />
      <Audio name="Música" src={staticFile("music/wonder-ambient.wav")} loop volume={musicVolume} />
    </AbsoluteFill>
  );
};
