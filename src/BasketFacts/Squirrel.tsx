import type React from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { colors, displayFont } from "../Intro/theme";
import { MUSIC_BPM } from "./Ball";

const fur = "#C47A3D";
const furDark = "#9A5A26";
const furLight = "#F1D2A8";
const tailInner = "#E09A5A";
const outline = "#3A2210";

// "Nutty": ardilla original con ropa de basketball.
// La boca sigue el volumen de la voz y bota el balón al ritmo de la música.
export const Squirrel: React.FC<{
  readonly mouth: readonly number[]; // apertura 0-100 por frame
  readonly size: number;
  readonly style?: React.CSSProperties;
}> = ({ mouth, size, style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const raw = (i: number) => (mouth[i] ?? 0) / 100;
  const open = Math.min(1, raw(frame) * 0.6 + raw(frame - 1) * 0.25 + raw(frame + 1) * 0.15);
  const talking = Math.max(raw(frame - 3), raw(frame), raw(frame + 3));

  // Bote del balón sincronizado con la música (toca el suelo en cada pulso).
  const beatFrames = (60 / MUSIC_BPM) * fps;
  const phase = (frame % beatFrames) / beatFrames;
  const height = Math.sin(Math.PI * phase); // 0 = suelo, 1 = mano
  const floorY = 584;
  const ballR = 40;
  const ballX = 372;
  const ballY = floorY - ballR - height * 150;
  const pawX = ballX - 4;
  // La mano solo baja un poco; el balón es el que viaja hasta el suelo.
  const handTop = floorY - ballR * 2 - 150 - 6;
  const pawY = handTop + (1 - height) * 36;
  const squash = phase < 0.07 || phase > 0.96 ? 0.12 : 0;

  const blinkPhase = (frame + 31) % 103;
  const eyeOpen = blinkPhase < 6 ? Math.abs(blinkPhase - 3) / 3 : 1;
  const bob = Math.sin(phase * Math.PI * 2) * 3 - open * 5;
  const tilt = Math.sin(frame / 37) * 3 + Math.sin(frame / 13) * talking * 2.5;
  const tailSway = Math.sin(frame / 14) * 6;
  const brow = -talking * 9;
  const look = Math.sin(frame / 53) * 5;
  const wave = Math.sin(frame / 6) * 10 * talking;

  return (
    <svg viewBox="0 0 460 600" width={size} height={(size * 600) / 460} style={style}>
      {/* sombras */}
      <ellipse cx={200} cy={588} rx={120} ry={11} fill="#000" opacity={0.35} />
      <ellipse cx={ballX} cy={588} rx={ballR * (1 - height * 0.4)} ry={7} fill="#000" opacity={0.35 - height * 0.2} />

      {/* cola esponjosa */}
      <g style={{ rotate: `${tailSway}deg`, transformOrigin: "150px 470px" }}>
        <path
          d="M150 480 C40 470 10 360 50 270 C80 200 30 150 70 100 C120 40 210 90 180 170 C160 230 210 300 200 380 C195 430 180 470 150 480 Z"
          fill={fur}
          stroke={outline}
          strokeWidth={5}
        />
        <path d="M150 455 C80 440 60 360 85 290 C105 230 75 180 100 140 C125 110 160 130 150 180 C140 240 180 300 175 370 C170 420 165 445 150 455 Z" fill={tailInner} />
      </g>

      <g style={{ translate: `0px ${bob * 0.5}px` }}>
        {/* piernas y zapatillas */}
        <rect x={150} y={490} width={34} height={70} rx={14} fill={fur} stroke={outline} strokeWidth={4} />
        <rect x={216} y={490} width={34} height={70} rx={14} fill={fur} stroke={outline} strokeWidth={4} />
        <path d="M132 568 Q132 548 160 548 L190 548 Q196 568 190 580 L136 580 Q130 576 132 568 Z" fill="#fff" stroke={outline} strokeWidth={4} />
        <path d="M210 548 L240 548 Q268 548 268 568 Q270 576 264 580 L210 580 Q204 568 210 548 Z" fill="#fff" stroke={outline} strokeWidth={4} />
        <path d="M140 572 L188 572 M212 572 L260 572" stroke={colors.lime} strokeWidth={5} />

        {/* pantalón corto */}
        <path d="M138 438 L262 438 L270 512 L208 512 L200 482 L192 512 L130 512 Z" fill={colors.ink} stroke={outline} strokeWidth={4} />
        <path d="M134 470 L139 512 M266 470 L261 512" stroke={colors.lime} strokeWidth={8} />

        {/* camiseta de tirantes */}
        <path d="M145 300 L170 300 Q200 330 230 300 L255 300 L268 448 L132 448 Z" fill={colors.lime} stroke={outline} strokeWidth={4} />
        <path d="M170 300 Q200 334 230 300" fill="none" stroke={colors.ink} strokeWidth={7} />
        <text x={200} y={415} textAnchor="middle" fontFamily={displayFont} fontWeight={800} fontSize={62} fill={colors.ink}>
          25
        </text>

        {/* brazo izquierdo (saluda cuando habla) */}
        <g style={{ rotate: `${-wave}deg`, transformOrigin: "142px 320px" }}>
          <path d="M142 320 Q100 360 96 410" fill="none" stroke={outline} strokeWidth={30} strokeLinecap="round" />
          <path d="M142 320 Q100 360 96 410" fill="none" stroke={fur} strokeWidth={22} strokeLinecap="round" />
          <circle cx={96} cy={414} r={17} fill={furLight} stroke={outline} strokeWidth={4} />
        </g>

        {/* brazo derecho (bota el balón) */}
        <path d={`M258 320 Q${(258 + pawX) / 2 + 20} ${(320 + pawY) / 2 - 10} ${pawX} ${pawY}`} fill="none" stroke={outline} strokeWidth={30} strokeLinecap="round" />
        <path d={`M258 320 Q${(258 + pawX) / 2 + 20} ${(320 + pawY) / 2 - 10} ${pawX} ${pawY}`} fill="none" stroke={fur} strokeWidth={22} strokeLinecap="round" />
      </g>

      {/* balón */}
      <g style={{ scale: `${1 + squash} ${1 - squash}`, transformOrigin: `${ballX}px ${ballY + ballR}px` }}>
        <circle cx={ballX} cy={ballY} r={ballR} fill="#F28C28" stroke={outline} strokeWidth={4} />
        <g fill="none" stroke={outline} strokeWidth={3.5} style={{ rotate: `${frame * 6}deg`, transformOrigin: `${ballX}px ${ballY}px` }}>
          <path d={`M${ballX} ${ballY - ballR} L${ballX} ${ballY + ballR}`} />
          <path d={`M${ballX - ballR} ${ballY} L${ballX + ballR} ${ballY}`} />
          <path d={`M${ballX - 28} ${ballY - 28} Q${ballX - 8} ${ballY} ${ballX - 28} ${ballY + 28}`} />
          <path d={`M${ballX + 28} ${ballY - 28} Q${ballX + 8} ${ballY} ${ballX + 28} ${ballY + 28}`} />
        </g>
      </g>
      {/* pata encima del balón */}
      <circle cx={pawX} cy={pawY} r={17} fill={furLight} stroke={outline} strokeWidth={4} style={{ translate: `0px ${bob * 0.5}px` }} />

      {/* cabeza */}
      <g style={{ translate: `0px ${bob}px`, rotate: `${tilt}deg`, transformOrigin: "200px 300px" }}>
        {/* orejas con mechones */}
        <path d="M105 120 L95 30 Q120 40 150 95 Z" fill={fur} stroke={outline} strokeWidth={5} />
        <path d="M95 30 Q85 12 100 6 Q104 24 112 36 Z" fill={furDark} />
        <path d="M112 100 L104 55 Q122 65 136 96 Z" fill={tailInner} />
        <path d="M295 120 L305 30 Q280 40 250 95 Z" fill={fur} stroke={outline} strokeWidth={5} />
        <path d="M305 30 Q315 12 300 6 Q296 24 288 36 Z" fill={furDark} />
        <path d="M288 100 L296 55 Q278 65 264 96 Z" fill={tailInner} />

        <ellipse cx={200} cy={190} rx={128} ry={118} fill={fur} stroke={outline} strokeWidth={5} />
        {/* cara clara */}
        <ellipse cx={200} cy={240} rx={86} ry={64} fill={furLight} />
        {/* cinta */}
        <path d="M78 140 Q200 92 322 140 L326 166 Q200 118 74 166 Z" fill={colors.paper} stroke={outline} strokeWidth={4} />
        <path d="M76 154 Q200 106 324 154" fill="none" stroke={colors.lime} strokeWidth={8} />
        {/* mejillas */}
        <ellipse cx={112} cy={238} rx={24} ry={14} fill="#FF5A5A" opacity={0.35} />
        <ellipse cx={288} cy={238} rx={24} ry={14} fill="#FF5A5A" opacity={0.35} />
        {/* cejas */}
        <g style={{ translate: `0px ${brow}px` }} fill={outline}>
          <rect x={118} y={165} width={52} height={10} rx={5} style={{ rotate: "6deg", transformOrigin: "144px 170px" }} />
          <rect x={230} y={165} width={52} height={10} rx={5} style={{ rotate: "-6deg", transformOrigin: "256px 170px" }} />
        </g>
        {/* ojos */}
        {[150, 250].map((cx) => (
          <g key={cx}>
            <ellipse cx={cx} cy={205} rx={30} ry={Math.max(3, 34 * eyeOpen)} fill="#fff" stroke={outline} strokeWidth={4} />
            {eyeOpen > 0.3 ? (
              <>
                <circle cx={cx + look} cy={208} r={16} fill={colors.ink} />
                <circle cx={cx + look + 6} cy={201} r={5} fill="#fff" />
              </>
            ) : null}
          </g>
        ))}
        {/* nariz */}
        <path d="M186 232 Q200 224 214 232 Q208 246 200 248 Q192 246 186 232 Z" fill={outline} />
        {/* boca + dientes de ardilla */}
        {open > 0.06 ? (
          <g>
            <ellipse cx={200} cy={268 + open * 8} rx={34 - open * 6} ry={6 + open * 26} fill="#3A1206" />
            <ellipse cx={200} cy={274 + open * 22} rx={18} ry={5 + open * 8} fill="#FF6F7D" />
          </g>
        ) : (
          <path d="M172 262 Q186 274 200 262 Q214 274 228 262" fill="none" stroke={outline} strokeWidth={5} strokeLinecap="round" />
        )}
        <rect x={188} y={256} width={11} height={18} rx={3} fill="#fff" stroke={outline} strokeWidth={2.5} />
        <rect x={201} y={256} width={11} height={18} rx={3} fill="#fff" stroke={outline} strokeWidth={2.5} />
      </g>
    </svg>
  );
};
