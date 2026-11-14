import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Word } from "../Intro/Word";
import { colors, displayFont, monoFont } from "../Intro/theme";
import { Caption } from "./Caption";
import type { Segment } from "./types";

export const TitleScene = ({
  segment,
  kicker,
  lines,
  accent,
}: {
  readonly segment: Segment;
  readonly kicker: string;
  readonly lines: readonly string[];
  readonly accent: string;
}) => {
  const frame = useCurrentFrame();
  return (
    <>
      <div style={{ position: "absolute", left: 140, top: 170, width: 1100, display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ fontFamily: monoFont, fontSize: 40, color: colors.muted, letterSpacing: "0.2em", marginBottom: 24 }}>{kicker}</div>
        {lines.map((l, i) => (
          <Word key={l} delay={6 + i * 10} style={{ fontFamily: displayFont, fontWeight: 800, fontSize: 104, lineHeight: 1, letterSpacing: "-0.03em", color: colors.paper }}>
            {l}
          </Word>
        ))}
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 800,
            fontSize: 104,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            color: colors.ink,
            backgroundColor: colors.lime,
            alignSelf: "flex-start",
            padding: "4px 24px 14px",
            marginTop: 12,
            rotate: "-2deg",
            scale: interpolate(frame, [6 + lines.length * 10, 26 + lines.length * 10], [0, 1], {
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
      <Caption sentences={segment.sentences} width={1040} />
    </>
  );
};
