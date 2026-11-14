import { AbsoluteFill, Img, staticFile } from "remotion";
import { colors, displayFont } from "../Intro/theme";
import { Squirrel } from "../BasketFacts/Squirrel";
import { nflPhotos } from "./index";

// Miniatura de YouTube (1280x720).
// Fondo: estadio (intro). Foto destacada: Tom Brady (dato 13).
const bg = nflPhotos.intro?.[0]?.src;
const hero = nflPhotos.f13?.[0]?.src;

export const NFLThumbnail = () => (
  <AbsoluteFill style={{ backgroundColor: colors.ink, overflow: "hidden" }}>
    {/* foto de estadio de fondo */}
    <Img
      src={staticFile(bg ?? "fonts/none.jpg")}
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "saturate(1.2) brightness(0.75)" }}
    />
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(90deg, rgba(14,14,16,0.95) 0%, rgba(14,14,16,0.75) 40%, rgba(14,14,16,0.1) 75%)",
      }}
    />
    {/* foto destacada con marco */}
    <div style={{ position: "absolute", left: 660, top: 60, rotate: "-5deg" }}>
      <Img
        src={staticFile(hero ?? "fonts/none.jpg")}
        style={{ width: 330, height: 420, objectFit: "cover", border: "8px solid #fff", boxShadow: "0 18px 40px rgba(0,0,0,0.7)" }}
      />
      <div
        style={{
          position: "absolute",
          right: -20,
          top: -30,
          whiteSpace: "nowrap",
          padding: "6px 18px 10px",
          backgroundColor: "#F28C28",
          color: "#fff",
          border: "5px solid #fff",
          borderRadius: 12,
          fontFamily: displayFont,
          fontWeight: 800,
          fontSize: 54,
          rotate: "4deg",
          boxShadow: "0 8px 0 rgba(0,0,0,0.5)",
        }}
      >
        7 RINGS?!
      </div>
    </div>
    <div style={{ position: "absolute", right: -40, top: 150, rotate: "6deg" }}>
      <Squirrel mouth={[90]} size={420} sport="football" />
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
        NFL
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
