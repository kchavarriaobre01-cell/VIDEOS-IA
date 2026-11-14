import { Audio } from "@remotion/media";
import { AbsoluteFill, interpolate, Sequence, staticFile, useCurrentFrame } from "remotion";
import type { CalculateMetadataFunction } from "remotion";
import { z } from "zod";
import { Grade, Grain } from "./Film";
import { KenBurns } from "./KenBurns";
import { StatCard } from "./Overlays";
import { animalPhotos, animals, animalSegments, duckedVolume, LEAD } from "./index";
import { caps, cream, gold, serif } from "./theme";

export const animalShortSchema = z.object({ animal: z.number().int().min(1).max(25) });
const SKIP = LEAD - 20; // el Short arranca casi directo con la voz
const END = 75; // tarjeta final

export const calculateAnimalShortMetadata: CalculateMetadataFunction<z.infer<typeof animalShortSchema>> = ({ props }) => ({
  durationInFrames: animalSegments[props.animal].frames - SKIP + END,
});

// Short vertical (1080x1920) de un animal, mismo estilo documental.
export const AnimalShort = ({ animal }: z.infer<typeof animalShortSchema>) => {
  const frame = useCurrentFrame();
  const seg = animalSegments[animal];
  const a = animals[animal - 1];
  const photos = animalPhotos[`a${String(animal).padStart(2, "0")}`] ?? [];
  const total = seg.frames - SKIP + END;
  const segEnd = seg.frames - SKIP;
  const s1 = seg.sentences[1] ?? seg.sentences[0];

  const talking = (f: number) => seg.sentences.some((s) => f + SKIP >= s.from - 6 && f + SKIP < s.from + s.frames + 6);
  const musicVolume = (f: number) => {
    const r = Number.isFinite(f) ? Math.round(f) : 0;
    let sum = 0;
    for (let k = -12; k < 12; k++) sum += talking(r + k) ? 1 : 0;
    return duckedVolume(sum / 24, r + 45, total + 45);
  };
  const titleIn = interpolate(frame, [0, 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const endIn = interpolate(frame, [segEnd - 10, segEnd + 15], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Sequence from={-SKIP}>
        <Audio src={staticFile(seg.audio)} />
        <KenBurns photos={photos} sentences={seg.sentences} total={seg.frames + END} vertical />
      </Sequence>
      <Audio name="Música" src={staticFile("music/wonder-ambient.wav")} loop volume={musicVolume} />
      <Grade />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, transparent 28%, transparent 62%, rgba(0,0,0,0.75) 100%)" }} />
      <div style={{ position: "absolute", top: 210, left: 0, right: 0, textAlign: "center", opacity: titleIn * (1 - endIn) }}>
        <div style={{ fontFamily: caps, fontWeight: 600, fontSize: 30, letterSpacing: "0.4em", color: gold, marginRight: "-0.4em" }}>
          AMAZING ANIMALS · {String(animal).padStart(2, "0")}
        </div>
        <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 130, lineHeight: 1.05, color: cream, marginTop: 14, textShadow: "0 6px 30px rgba(0,0,0,0.7)" }}>{a.name}</div>
        <div style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 500, fontSize: 44, color: cream, opacity: 0.85 }}>{a.place}</div>
      </div>
      <StatCard stat={a.stat} label={a.statLabel} from={s1.from - SKIP} to={Math.min(s1.from - SKIP + 300, segEnd - 10)} bottom={520} left={80} />
      {endIn > 0 ? (
        <div style={{ position: "absolute", inset: 0, backgroundColor: `rgba(0,0,0,${0.6 * endIn})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", opacity: endIn }}>
          <div style={{ fontFamily: caps, fontWeight: 600, fontSize: 30, letterSpacing: "0.4em", color: gold, marginRight: "-0.4em" }}>FOLLOW FOR MORE</div>
          <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 120, lineHeight: 1.05, color: cream, marginTop: 16 }}>
            Amazing
            <br />
            Animals
          </div>
        </div>
      ) : null}
      <Grain />
    </AbsoluteFill>
  );
};
