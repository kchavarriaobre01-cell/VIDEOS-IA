import { AbsoluteFill } from "remotion";
import { colors, displayFont } from "../Intro/theme";
import { Squirrel } from "./Squirrel";

// Miniatura de YouTube (1280x720).
export const Thumbnail = () => (
  <AbsoluteFill style={{ backgroundColor: colors.ink, overflow: "hidden" }}>
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(circle at 78% 50%, rgba(242,140,40,0.55), transparent 50%), radial-gradient(circle at 15% 100%, rgba(212,255,58,0.18), transparent 45%)",
      }}
    />
    {/* líneas de velocidad */}
    <svg viewBox="0 0 1280 720" style={{ position: "absolute", inset: 0 }}>
      <g stroke={colors.paper} strokeWidth={10} strokeLinecap="round" opacity={0.35}>
        <path d="M620 250 L720 300" />
        <path d="M600 380 L710 395" />
        <path d="M630 510 L725 480" />
      </g>
    </svg>
    <div style={{ position: "absolute", right: -10, top: 40, rotate: "4deg" }}>
      <Squirrel mouth={[90]} size={520} />
    </div>
    <div style={{ position: "absolute", left: 64, top: 70, display: "flex", flexDirection: "column" }}>
      <div
        style={{
          fontFamily: displayFont,
          fontWeight: 800,
          fontSize: 330,
          lineHeight: 0.82,
          color: colors.lime,
          letterSpacing: "-0.05em",
          textShadow: "0 10px 0 rgba(0,0,0,0.5)",
        }}
      >
        25
      </div>
      <div
        style={{
          fontFamily: displayFont,
          fontWeight: 800,
          fontSize: 92,
          lineHeight: 0.95,
          color: colors.paper,
          letterSpacing: "-0.03em",
          marginTop: 18,
          textShadow: "0 6px 0 rgba(0,0,0,0.6)",
        }}
      >
        BASKETBALL
        <br />
        FACTS
      </div>
      <div
        style={{
          alignSelf: "flex-start",
          marginTop: 22,
          padding: "8px 22px 12px",
          backgroundColor: colors.lime,
          color: colors.ink,
          fontFamily: displayFont,
          fontWeight: 800,
          fontSize: 58,
          rotate: "-3deg",
          boxShadow: "0 8px 0 rgba(0,0,0,0.5)",
        }}
      >
        you never knew!
      </div>
    </div>
  </AbsoluteFill>
);
