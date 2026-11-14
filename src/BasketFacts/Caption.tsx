import { interpolate, useCurrentFrame } from "remotion";
import { bodyFont, colors } from "../Intro/theme";
import type { Sentence } from "./types";

// Muestra la frase que se está diciendo (tiempos exactos de la voz).
export const Caption = ({ sentences, width }: { readonly sentences: readonly Sentence[]; readonly width: number }) => {
  const frame = useCurrentFrame();
  const idx = sentences.findIndex((s, i) => frame >= s.from - 2 && (i === sentences.length - 1 || frame < sentences[i + 1].from - 2));
  if (idx < 0) return null;
  const s = sentences[idx];
  const local = frame - (s.from - 2);
  return (
    <div
      style={{
        position: "absolute",
        left: 140,
        bottom: 56,
        width,
        fontFamily: bodyFont,
        fontWeight: 600,
        fontSize: 38,
        lineHeight: 1.28,
        color: colors.paper,
        padding: "20px 28px",
        borderRadius: 18,
        backgroundColor: "rgba(0,0,0,0.45)",
        borderLeft: `8px solid ${colors.lime}`,
        opacity: interpolate(local, [0, 5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
        translate: interpolate(local, [0, 6], ["0px 14px", "0px 0px"], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}
    >
      {s.text}
    </div>
  );
};
