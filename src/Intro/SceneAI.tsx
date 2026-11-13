import { Easing, Interactive, interpolate, useCurrentFrame } from "remotion";
import { Label } from "./Label";
import { Word } from "./Word";
import { colors, displayFont } from "./theme";
import { Lang, langSchema, texts } from "./texts";

const BigAI = ({ text }: { readonly text: string }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: displayFont,
        fontWeight: 800,
        fontSize: 520,
        lineHeight: 0.85,
        letterSpacing: "-0.05em",
        color: colors.ink,
        scale: interpolate(frame, [10, 40], [0.6, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.spring({ damping: 14 }),
          output: "perceptual-scale",
        }),
        opacity: interpolate(frame, [10, 18], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      {text}
    </div>
  );
};

const SceneAIInner = ({ lang = "es" }: { readonly lang?: string }) => {
  const t = texts[lang as Lang] ?? texts.es;
  return (
  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 20 }}>
    <Word
      delay={0}
      style={{ fontFamily: displayFont, fontWeight: 700, fontSize: 110, color: colors.ink }}
    >
      {t.madeWith}
    </Word>
    <BigAI text={t.ai} />
    <Label delay={40}>{t.tools}</Label>
  </div>
  );
};

export const SceneAI = Interactive.create({
  Component: SceneAIInner,
  layout: "absolute-fill",
  schema: { ...Interactive.backgroundSchema, ...langSchema },
});
