import type React from "react";
import { useCurrentFrame } from "remotion";

export const OL = "#3B2F4A"; // contorno

// "Pip": pintorcito original. Boina, moño y pincel toman el color de la lección.
export const Pip: React.FC<{
  readonly mouth: readonly number[]; // apertura 0-100 por frame (de la voz)
  readonly color: string;
  readonly size: number;
  readonly swing?: number; // 0-1: brazo del pincel hacia atrás (-) / adelante (+)
  readonly jump?: number; // 0-1 altura del salto
  readonly offset?: number; // frame del inicio de la escena dentro de `mouth`
  readonly style?: React.CSSProperties;
}> = ({ mouth, color, size, swing = 0, jump = 0, offset = 0, style }) => {
  const frame = useCurrentFrame();
  const f = frame + offset;
  const raw = (i: number) => (mouth[i] ?? 0) / 100;
  const open = Math.min(1, raw(f) * 0.6 + raw(f - 1) * 0.25 + raw(f + 1) * 0.15);
  const talking = Math.max(raw(f - 4), raw(f), raw(f + 4));

  const blink = (frame + 17) % 97;
  const eye = blink < 6 ? Math.abs(blink - 3) / 3 : 1;
  const bob = Math.sin(frame / 9) * 4;
  const tilt = Math.sin(frame / 31) * 3 + Math.sin(frame / 11) * talking * 2;
  const wave = Math.sin(frame / 5) * 14 * talking;
  const squash = 1 + Math.sin(frame / 9) * 0.015;
  const lift = -jump * 70;

  return (
    <svg viewBox="0 0 400 470" width={size} height={(size * 470) / 400} style={{ overflow: "visible", ...style }}>
      <defs>
        <radialGradient id="pipBody" cx="40%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#F6F1EA" />
          <stop offset="100%" stopColor="#DDD4C8" />
        </radialGradient>
        <radialGradient id="pipShine" cx="35%" cy="25%" r="60%">
          <stop offset="0%" stopColor="#fff" stopOpacity={0.55} />
          <stop offset="100%" stopColor="#fff" stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={200} cy={455} rx={110 - jump * 40} ry={12} fill="#000" opacity={0.22 - jump * 0.1} />
      <g style={{ translate: `0px ${lift + bob * 0.4}px` }}>
        {/* pies */}
        <ellipse cx={150} cy={430} rx={42} ry={24} fill="url(#pipBody)" stroke={OL} strokeWidth={7} />
        <ellipse cx={250} cy={430} rx={42} ry={24} fill="url(#pipBody)" stroke={OL} strokeWidth={7} />
        {/* cuerpo */}
        <g style={{ scale: `${2 - squash} ${squash}`, transformOrigin: "200px 440px" }}>
          <ellipse cx={200} cy={350} rx={108} ry={92} fill="url(#pipBody)" stroke={OL} strokeWidth={7} />
          {/* manchita de pintura en la panza */}
          <ellipse cx={235} cy={375} rx={20} ry={14} fill={color} opacity={0.9} />
          <circle cx={258} cy={393} r={6} fill={color} opacity={0.9} />
        </g>
        {/* brazo izquierdo (saluda) */}
        <g style={{ rotate: `${-20 - wave}deg`, transformOrigin: "118px 318px" }}>
          <path d="M118 318 Q80 345 78 385" fill="none" stroke={OL} strokeWidth={40} strokeLinecap="round" />
          <path d="M118 318 Q80 345 78 385" fill="none" stroke="#F8F4EE" strokeWidth={26} strokeLinecap="round" />
        </g>
        {/* brazo derecho con pincel */}
        <g style={{ rotate: `${swing * 55}deg`, transformOrigin: "282px 318px" }}>
          <path d="M282 318 Q318 340 330 372" fill="none" stroke={OL} strokeWidth={40} strokeLinecap="round" />
          <path d="M282 318 Q318 340 330 372" fill="none" stroke="#F8F4EE" strokeWidth={26} strokeLinecap="round" />
          <g style={{ rotate: "-35deg", transformOrigin: "332px 372px" }}>
            <rect x={322} y={250} width={20} height={130} rx={10} fill="#C98B4E" stroke={OL} strokeWidth={6} />
            <rect x={318} y={232} width={28} height={30} rx={6} fill="#B9B9C6" stroke={OL} strokeWidth={6} />
            <path d="M318 236 Q332 170 346 236 Z" fill={color} stroke={OL} strokeWidth={6} strokeLinejoin="round" />
          </g>
        </g>
        {/* moño */}
        <g>
          <path d="M200 268 L160 248 Q150 270 160 290 Z" fill={color} stroke={OL} strokeWidth={6} strokeLinejoin="round" />
          <path d="M200 268 L240 248 Q250 270 240 290 Z" fill={color} stroke={OL} strokeWidth={6} strokeLinejoin="round" />
          <circle cx={200} cy={269} r={13} fill={color} stroke={OL} strokeWidth={6} />
        </g>
        {/* cabeza */}
        <g style={{ rotate: `${tilt}deg`, transformOrigin: "200px 260px" }}>
          {/* orejas */}
          <path d="M92 110 Q78 40 120 52 Q150 62 152 82 Z" fill="url(#pipBody)" stroke={OL} strokeWidth={7} strokeLinejoin="round" />
          <path d="M308 110 Q322 40 280 52 Q250 62 248 82 Z" fill="url(#pipBody)" stroke={OL} strokeWidth={7} strokeLinejoin="round" />
          <path d="M105 95 Q100 66 122 70 Q136 76 138 86 Z" fill="#F8B7C4" />
          <path d="M295 95 Q300 66 278 70 Q264 76 262 86 Z" fill="#F8B7C4" />
          <ellipse cx={200} cy={170} rx={142} ry={128} fill="url(#pipBody)" stroke={OL} strokeWidth={7} />
          <ellipse cx={200} cy={170} rx={142} ry={128} fill="url(#pipShine)" />
          {/* boina */}
          <g style={{ rotate: "-12deg", transformOrigin: "200px 60px" }}>
            <ellipse cx={190} cy={62} rx={105} ry={38} fill={color} stroke={OL} strokeWidth={7} />
            <ellipse cx={170} cy={52} rx={50} ry={12} fill="#fff" opacity={0.25} />
            <path d="M188 26 Q192 6 204 10" fill="none" stroke={OL} strokeWidth={8} strokeLinecap="round" />
          </g>
          {/* mejillas */}
          <ellipse cx={108} cy={215} rx={26} ry={16} fill="#FF8FA3" opacity={0.55} />
          <ellipse cx={292} cy={215} rx={26} ry={16} fill="#FF8FA3" opacity={0.55} />
          {/* ojos */}
          {[148, 252].map((cx) => (
            <g key={cx} style={{ scale: `1 ${Math.max(0.08, eye)}`, transformOrigin: `${cx}px 178px` }}>
              <ellipse cx={cx} cy={178} rx={27} ry={35} fill="#2B2340" />
              <circle cx={cx + 9} cy={164} r={11} fill="#fff" />
              <circle cx={cx - 9} cy={192} r={5} fill="#fff" />
            </g>
          ))}
          {/* boca */}
          {open > 0.06 ? (
            <g>
              <path d={`M172 222 Q200 ${226 + open * 6} 228 222 Q226 ${238 + open * 36} 200 ${240 + open * 38} Q174 ${238 + open * 36} 172 222 Z`} fill="#7A2238" stroke={OL} strokeWidth={5} strokeLinejoin="round" />
              <ellipse cx={200} cy={236 + open * 28} rx={14} ry={4 + open * 6} fill="#FF7F95" />
            </g>
          ) : (
            <path d="M174 222 Q200 246 226 222" fill="none" stroke={OL} strokeWidth={6} strokeLinecap="round" />
          )}
        </g>
      </g>
    </svg>
  );
};
