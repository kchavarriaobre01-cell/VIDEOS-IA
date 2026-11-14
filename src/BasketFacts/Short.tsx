import { Audio } from "@remotion/media";
import { AbsoluteFill, Easing, interpolate, staticFile, useCurrentFrame } from "remotion";
import type { CalculateMetadataFunction } from "remotion";
import { z } from "zod";
import { colors, displayFont } from "../Intro/theme";
import { namesFor } from "./index";
import { FactHeader, NameTag, Vignette } from "./Overlays";
import { PhotoCredit, PhotoLayer } from "./PhotoLayer";
import { Squirrel } from "./Squirrel";
import type { Fact, Photo, Segment } from "./types";
import images from "./images.json";
import script from "./script.json";
import voice from "./voice.json";

const segments = voice.segments as Segment[];
const facts = script.facts as Fact[];
const photosBySegment = images as Record<string, Photo[]>;

export const shortSchema = z.object({ fact: z.number().int().min(1).max(25) });
const TAIL = 45; // cierre con "Follow for more"

export const calculateShortMetadata: CalculateMetadataFunction<z.infer<typeof shortSchema>> = ({ props }) => ({
  durationInFrames: segments[props.fact].frames + TAIL,
});

const MUSIC_TALKING = 0.15;
const MUSIC_PAUSE = 0.35;

// Short vertical (1080x1920) de un solo dato, sin subtítulos.
export const BasketShort = ({ fact }: z.infer<typeof shortSchema>) => {
  const frame = useCurrentFrame();
  const seg = segments[fact];
  const info = facts[fact - 1];
  const key = `f${String(fact).padStart(2, "0")}`;
  const photos = photosBySegment[key] ?? [];
  const total = seg.frames + TAIL;

  const talking = (f: number) => seg.sentences.some((s) => f >= s.from - 4 && f < s.from + s.frames + 4);
  const musicVolume = (f: number) => {
    const r = Number.isFinite(f) ? Math.round(f) : 0;
    let sum = 0;
    for (let k = -8; k < 8; k++) sum += talking(r + k) ? 1 : 0;
    const fade = Math.max(0, Math.min(1, (total - r) / 30));
    return (MUSIC_PAUSE - (MUSIC_PAUSE - MUSIC_TALKING) * (sum / 16)) * fade;
  };

  const end = interpolate(frame, [seg.frames, seg.frames + 12], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.spring({ damping: 12 }),
    output: "perceptual-scale",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Audio src={staticFile(seg.audio)} />
      <Audio name="Música" src={staticFile("music/hoops-beat.wav")} loop volume={musicVolume} />
      <PhotoLayer photos={photos} sentences={seg.sentences} split={key === "f25"} vertical />
      <Vignette />
      <FactHeader index={fact} title={info.title} stat={info.stat} vertical />
      <NameTag sentences={seg.sentences} names={namesFor(seg)} bottom={700} />
      <PhotoCredit photos={photos} sentences={seg.sentences} top={110} />
      <div style={{ position: "absolute", left: 30, bottom: 250 }}>
        <Squirrel mouth={seg.mouth} size={320} />
      </div>
      {end > 0 ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 760, display: "flex", justifyContent: "center" }}>
          <div
            style={{
              fontFamily: displayFont,
              fontWeight: 800,
              fontSize: 96,
              color: colors.ink,
              backgroundColor: colors.lime,
              padding: "8px 36px 18px",
              borderRadius: 18,
              border: "6px solid #fff",
              rotate: "-3deg",
              textAlign: "center",
              lineHeight: 1.05,
              scale: end,
            }}
          >
            Follow for
            <br />
            more facts!
          </div>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
