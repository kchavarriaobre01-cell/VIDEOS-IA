import { AbsoluteFill } from "remotion";
import { BigWord, palette, tint } from "./index";
import { OL, Pip } from "./Pip";

// Miniatura (1280x720): título de colores + Pip + manchas de pintura.
export const ColorsThumbnail = () => (
  <AbsoluteFill style={{ background: `radial-gradient(circle at 70% 55%, #FFFFFF 0%, ${tint("#FDD835", 0.6)} 45%, #FFB74D 100%)`, overflow: "hidden" }}>
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      {palette.map((c, i) => {
        const pos = [[90, 620], [1180, 90], [640, 60], [1220, 640], [60, 300], [900, 660], [420, 690], [1000, 250]][i];
        return (
          <path
            key={c}
            d="M0 -60 Q40 -70 52 -30 Q80 -10 58 22 Q60 64 16 56 Q-20 80 -44 50 Q-80 30 -60 -6 Q-70 -50 -30 -54 Q-16 -66 0 -60Z"
            fill={c}
            stroke={OL}
            strokeWidth={6}
            transform={`translate(${pos[0]} ${pos[1]}) scale(1.1) rotate(${i * 40})`}
          />
        );
      })}
    </svg>
    <div style={{ position: "absolute", left: 60, top: 110, display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ display: "flex" }}>
        {"Learn".split("").map((ch, i) => (
          <BigWord key={i} text={ch} color={palette[i]} size={170} style={{ rotate: `${(i % 2 ? 4 : -4)}deg` }} />
        ))}
      </div>
      <div style={{ display: "flex" }}>
        {"Colors!".split("").map((ch, i) => (
          <BigWord key={i} text={ch} color={palette[(i + 5) % 8]} size={190} style={{ rotate: `${(i % 2 ? -4 : 4)}deg` }} />
        ))}
      </div>
      <BigWord text="for kids" color="#43A047" size={80} style={{ marginTop: 14, marginLeft: 10, rotate: "-3deg" }} />
    </div>
    <Pip mouth={[80]} color="#E53935" size={470} style={{ position: "absolute", right: 30, top: 140, rotate: "5deg" }} />
  </AbsoluteFill>
);
