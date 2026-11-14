import { Easing, interpolate, useCurrentFrame } from "remotion";
import { colors, displayFont } from "../Intro/theme";

export const END_SCREEN_FRAMES = 600; // 20 s, el máximo que permite YouTube
const orange = "#F28C28";

// Pantalla final de YouTube: dos espacios de video y uno de suscripción.
// En YouTube Studio coloca los elementos encima de estos recuadros.
export const EndScreen = () => {
  const frame = useCurrentFrame();
  const pop = (d: number) =>
    interpolate(frame, [d, d + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.spring({ damping: 12 }), output: "perceptual-scale" });
  const pulse = 1 + 0.04 * Math.sin(frame / 6);
  const Box = ({ left, label, d }: { readonly left: number; readonly label: string; readonly d: number }) => (
    <div
      style={{
        position: "absolute",
        left,
        top: 250,
        width: 680,
        height: 383,
        borderRadius: 18,
        border: `6px solid ${orange}`,
        backgroundColor: "rgba(0,0,0,0.55)",
        boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        scale: `${pop(d)}`,
      }}
    >
      <div style={{ fontFamily: displayFont, fontWeight: 800, fontSize: 54, color: "rgba(255,255,255,0.35)" }}>{label}</div>
    </div>
  );
  return (
    <>
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.55)" }} />
      <div style={{ position: "absolute", top: 90, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 800,
            fontSize: 110,
            color: "#fff",
            backgroundColor: orange,
            padding: "0px 40px 14px",
            borderRadius: 18,
            border: "6px solid #fff",
            rotate: "-2deg",
            boxShadow: "0 10px 0 rgba(0,0,0,0.4)",
            scale: `${pop(0)}`,
          }}
        >
          WATCH NEXT!
        </div>
      </div>
      <Box left={150} label="VIDEO" d={8} />
      <Box left={960} label="VIDEO" d={14} />
      {/* espacio para el botón de suscribirse */}
      <div style={{ position: "absolute", left: 960 - 110, top: 720, width: 220, height: 220, borderRadius: "50%", border: `6px dashed ${colors.lime}`, backgroundColor: "rgba(0,0,0,0.5)", scale: `${pop(20) * pulse}` }} />
      <div
        style={{
          position: "absolute",
          right: 1920 - (960 - 140),
          top: 790,
          fontFamily: displayFont,
          fontWeight: 800,
          fontSize: 56,
          color: colors.ink,
          backgroundColor: colors.lime,
          padding: "0px 24px 8px",
          borderRadius: 12,
          rotate: "-3deg",
          scale: `${pop(26)}`,
        }}
      >
        SUBSCRIBE! →
      </div>
    </>
  );
};
