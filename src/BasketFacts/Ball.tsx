import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "../Intro/theme";

export const MUSIC_BPM = 110;

// Balón de basketball dibujado en SVG (sin cara).
export const BallSvg: React.FC<{ readonly size: number; readonly rotate?: number }> = ({ size, rotate = 0 }) => (
  <svg viewBox="0 0 400 400" width={size} height={size} style={{ rotate: `${rotate}deg` }}>
    <defs>
      <radialGradient id="ballShade" cx="38%" cy="32%" r="75%">
        <stop offset="0%" stopColor="#FFA552" />
        <stop offset="60%" stopColor="#F28C28" />
        <stop offset="100%" stopColor="#B85A12" />
      </radialGradient>
      <clipPath id="ballClip">
        <circle cx={200} cy={200} r={190} />
      </clipPath>
    </defs>
    <circle cx={200} cy={200} r={190} fill="url(#ballShade)" />
    <g clipPath="url(#ballClip)" fill="none" stroke="#2B1608" strokeWidth={9} strokeLinecap="round">
      <path d="M200 0 L200 400" />
      <path d="M0 200 L400 200" />
      <path d="M62 40 Q170 200 62 360" />
      <path d="M338 40 Q230 200 338 360" />
    </g>
    <circle cx={200} cy={200} r={190} fill="none" stroke="#2B1608" strokeWidth={6} opacity={0.5} />
  </svg>
);

// El balón rebota en cada pulso de la música.
export const BouncingBall = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beatFrames = (60 / MUSIC_BPM) * fps;
  const phase = (frame % beatFrames) / beatFrames; // 0 = golpe en el suelo
  const height = Math.sin(Math.PI * phase); // 0 en el suelo, 1 arriba
  const squash = phase < 0.08 || phase > 0.95 ? 0.12 : 0;
  const ballSize = 380;
  return (
    <div style={{ position: "absolute", right: 170, bottom: 120, width: ballSize, height: 720 }}>
      {/* sombra */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          bottom: 0,
          width: ballSize * (0.9 - height * 0.4),
          height: 34,
          translate: "-50% 50%",
          borderRadius: "50%",
          backgroundColor: "#000",
          opacity: 0.45 - height * 0.25,
          filter: "blur(6px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: height * 300,
          width: ballSize,
          height: ballSize,
          scale: `${1 + squash} ${1 - squash}`,
          transformOrigin: "center bottom",
        }}
      >
        <BallSvg size={ballSize} rotate={frame * 2.2} />
      </div>
      {/* aro decorativo */}
      <div
        style={{
          position: "absolute",
          left: -40,
          right: -40,
          bottom: -6,
          height: 6,
          borderRadius: 3,
          backgroundColor: colors.lime,
          opacity: 0.25,
        }}
      />
    </div>
  );
};
