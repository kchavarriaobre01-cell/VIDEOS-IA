import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, displayFont } from "../Intro/theme";

const orange = "#F28C28";
const orangeDark = "#D9711A";
const seam = "#3A2210";

// "Hoops": mascota original con cabeza de balón. La boca sigue el volumen de la voz.
export const Avatar: React.FC<{
  readonly mouth: readonly number[]; // apertura 0-100 por frame
  readonly size: number;
  readonly style?: React.CSSProperties;
}> = ({ mouth, size, style }) => {
  const frame = useCurrentFrame();
  const raw = (i: number) => (mouth[i] ?? 0) / 100;
  // Suavizado para que la boca no tiemble.
  const open = Math.min(1, raw(frame) * 0.6 + raw(frame - 1) * 0.25 + raw(frame + 1) * 0.15);
  const talking = Math.max(raw(frame - 3), raw(frame), raw(frame + 3));

  const blinkPhase = frame % 97;
  const eyeOpen = blinkPhase < 6 ? Math.abs(blinkPhase - 3) / 3 : 1;
  const bob = Math.sin(frame / 9) * 4 - open * 8;
  const tilt = Math.sin(frame / 41) * 3 + Math.sin(frame / 17) * talking * 2;
  const brow = -talking * 10;
  const look = Math.sin(frame / 53) * 6;
  const armSwing = Math.sin(frame / 7) * 6 * talking;

  return (
    <svg viewBox="0 0 400 540" width={size} height={size * 1.35} style={style}>
      {/* sombra */}
      <ellipse cx={200} cy={522} rx={130} ry={14} fill="#000" opacity={0.35} />
      <g style={{ translate: `0px ${bob * 0.5}px` }}>
        {/* brazos */}
        <g style={{ rotate: `${-12 + armSwing}deg`, transformOrigin: "120px 400px" }}>
          <rect x={58} y={392} width={70} height={30} rx={15} fill={orange} />
          <circle cx={60} cy={407} r={20} fill={orange} />
        </g>
        <g style={{ rotate: `${12 - armSwing}deg`, transformOrigin: "280px 400px" }}>
          <rect x={272} y={392} width={70} height={30} rx={15} fill={orange} />
          <circle cx={340} cy={407} r={20} fill={orange} />
        </g>
        {/* camiseta */}
        <path d="M120 372 L280 372 L318 520 L82 520 Z" fill={colors.lime} />
        <path d="M160 372 Q200 410 240 372" fill="none" stroke={colors.ink} strokeWidth={8} />
        <text x={200} y={478} textAnchor="middle" fontFamily={displayFont} fontWeight={800} fontSize={72} fill={colors.ink}>
          25
        </text>
      </g>
      <g style={{ translate: `0px ${bob}px`, rotate: `${tilt}deg`, transformOrigin: "200px 360px" }}>
        {/* cabeza / balón */}
        <circle cx={200} cy={210} r={160} fill={orange} />
        <circle cx={200} cy={210} r={160} fill="none" stroke={orangeDark} strokeWidth={10} />
        <g fill="none" stroke={seam} strokeWidth={6} opacity={0.55}>
          <path d="M200 50 L200 370" />
          <path d="M40 210 L360 210" opacity={0} />
          <path d="M75 95 Q150 210 75 325" />
          <path d="M325 95 Q250 210 325 325" />
        </g>
        {/* cinta */}
        <path d="M58 132 Q200 88 342 132 L350 160 Q200 116 50 160 Z" fill={colors.paper} />
        <path d="M54 146 Q200 102 346 146" fill="none" stroke={colors.lime} strokeWidth={8} />
        {/* mejillas */}
        <ellipse cx={110} cy={268} rx={26} ry={14} fill="#FF5A5A" opacity={0.35} />
        <ellipse cx={290} cy={268} rx={26} ry={14} fill="#FF5A5A" opacity={0.35} />
        {/* cejas */}
        <g style={{ translate: `0px ${brow}px` }} fill={seam}>
          <rect x={112} y={158} width={64} height={12} rx={6} style={{ rotate: "3deg", transformOrigin: "144px 164px" }} />
          <rect x={224} y={158} width={64} height={12} rx={6} style={{ rotate: "-3deg", transformOrigin: "256px 164px" }} />
        </g>
        {/* ojos */}
        {[145, 255].map((cx) => (
          <g key={cx}>
            <ellipse cx={cx} cy={212} rx={34} ry={Math.max(3, 40 * eyeOpen)} fill="#fff" />
            {eyeOpen > 0.3 ? (
              <>
                <circle cx={cx + look} cy={216} r={16} fill={colors.ink} />
                <circle cx={cx + look + 6} cy={209} r={5} fill="#fff" />
              </>
            ) : null}
          </g>
        ))}
        {/* boca */}
        {open > 0.06 ? (
          <g>
            <ellipse cx={200} cy={292} rx={46 - open * 8} ry={6 + open * 34} fill="#3A1206" />
            <ellipse cx={200} cy={292 + open * 22} rx={24} ry={6 + open * 10} fill="#FF6F7D" />
            <rect x={174} y={286 - open * 30} width={52} height={10} rx={4} fill="#fff" opacity={open > 0.35 ? 0.95 : 0} />
          </g>
        ) : (
          <path d="M160 286 Q200 316 240 286" fill="none" stroke="#3A1206" strokeWidth={9} strokeLinecap="round" />
        )}
      </g>
    </svg>
  );
};

export const AvatarEntrance: React.FC<{ readonly children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        translate: interpolate(frame, [0, 14], ["0px 60px", "0px 0px"], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        opacity: interpolate(frame, [0, 8], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}
    >
      {children}
    </div>
  );
};
