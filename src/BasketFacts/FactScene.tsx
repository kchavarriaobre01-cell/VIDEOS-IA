import { Easing, interpolate, useCurrentFrame } from "remotion";
import { Word } from "../Intro/Word";
import { colors, displayFont, monoFont } from "../Intro/theme";
import { Caption } from "./Caption";
import type { Fact, Segment } from "./types";

const CONTENT_W = 1040;

const Stat = ({ text }: { readonly text: string }) => {
  const frame = useCurrentFrame();
  const fontSize = Math.min(180, CONTENT_W / (text.length * 0.82));
  return (
    <div
      style={{
        fontFamily: displayFont,
        fontWeight: 800,
        fontSize,
        lineHeight: 1,
        letterSpacing: "-0.03em",
        color: colors.lime,
        whiteSpace: "nowrap",
        transformOrigin: "left center",
        scale: interpolate(frame, [22, 42], [0.4, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.spring({ damping: 12 }),
          output: "perceptual-scale",
        }),
        opacity: interpolate(frame, [22, 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}
    >
      {text}
    </div>
  );
};

const FadeIn = ({ delay, children }: { readonly delay: number; readonly children: React.ReactNode }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ opacity: interpolate(frame, [delay, delay + 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) }}>
      {children}
    </div>
  );
};

export const FactScene = ({ fact, index, segment }: { readonly fact: Fact; readonly index: number; readonly segment: Segment }) => (
  <>
    <div style={{ position: "absolute", left: 140, top: 160, width: CONTENT_W, display: "flex", flexDirection: "column", gap: 18 }}>
      <FadeIn delay={0}>
        <div style={{ fontFamily: monoFont, fontSize: 34, color: colors.muted, letterSpacing: "0.2em" }}>
          FACT <span style={{ color: colors.lime }}>{String(index).padStart(2, "0")}</span> / 25
        </div>
      </FadeIn>
      <Word delay={4} style={{ fontFamily: displayFont, fontWeight: 800, fontSize: 68, lineHeight: 1.05, color: colors.paper, letterSpacing: "-0.02em" }}>
        {fact.title}
      </Word>
      <div style={{ height: 4 }} />
      <Stat text={fact.stat} />
      <FadeIn delay={34}>
        <div style={{ fontFamily: monoFont, fontSize: 30, color: colors.muted, letterSpacing: "0.08em", textTransform: "uppercase" }}>
          {fact.statLabel}
        </div>
      </FadeIn>
    </div>
    <Caption sentences={segment.sentences} width={CONTENT_W} />
  </>
);
