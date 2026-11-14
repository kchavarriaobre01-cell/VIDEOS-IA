import { Audio } from "@remotion/media";
import { useMemo } from "react";
import { AbsoluteFill, Series, staticFile, useCurrentFrame } from "remotion";
import { Avatar, AvatarEntrance } from "./Avatar";
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

export const BasketFacts = () => {
  const mouth = useMemo(() => segments.flatMap((s) => s.mouth), []);
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
      <div style={{ position: "absolute", right: 120, bottom: 40 }}>
        <AvatarEntrance>
          <Avatar mouth={mouth} size={560} />
        </AvatarEntrance>
      </div>
    </AbsoluteFill>
  );
};
