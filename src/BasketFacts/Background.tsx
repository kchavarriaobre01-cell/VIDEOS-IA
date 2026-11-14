import { AbsoluteFill, useCurrentFrame } from "remotion";
import { colors } from "../Intro/theme";

// Líneas de cancha muy sutiles que se desplazan lentamente.
export const Background = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      <svg
        viewBox="0 0 1920 1080"
        style={{ position: "absolute", inset: 0, translate: `${Math.sin(frame / 300) * 30}px 0px` }}
      >
        <g fill="none" stroke={colors.lime} strokeWidth={4} opacity={0.07}>
          <circle cx={1480} cy={540} r={180} />
          <path d="M1480 -40 L1480 1120" />
          <path d="M-60 140 Q520 540 -60 940" />
          <rect x={-40} y={360} width={420} height={360} />
          <circle cx={380} cy={540} r={180} />
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 77% 60%, rgba(212,255,58,0.10), transparent 55%)",
        }}
      />
    </AbsoluteFill>
  );
};
