import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Label } from "./Label";
import { Word } from "./Word";
import { colors, displayFont } from "./theme";

const Bar = () => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        height: 18,
        width: 1400,
        backgroundColor: colors.lime,
        transformOrigin: "left center",
        scale: `${interpolate(frame, [14, 40], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.bezier(0.65, 0, 0.35, 1),
        })} 1`,
      }}
    />
  );
};

const SceneLogoInner = () => (
  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 36 }}>
    <Word
      delay={0}
      style={{
        fontFamily: displayFont,
        fontWeight: 800,
        fontSize: 200,
        whiteSpace: "nowrap",
        lineHeight: 1,
        letterSpacing: "-0.04em",
        color: colors.paper,
      }}
    >
      VIDEOS<span style={{ color: colors.lime }}>-</span>IA
    </Word>
    <Bar />
    <Label delay={30}>Tu estudio de video automático</Label>
  </div>
);

export const SceneLogo = Interactive.create({
  Component: SceneLogoInner,
  layout: "absolute-fill",
  schema: { ...Interactive.backgroundSchema },
});
