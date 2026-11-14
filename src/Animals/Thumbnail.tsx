import { AbsoluteFill, Img, staticFile } from "remotion";
import type { Photo } from "../BasketFacts/types";
import { Grain } from "./Film";
import { animalPhotos } from "./index";
import { caps, cream, gold, serif } from "./theme";

const pick = (key: string, i = 0): Photo | undefined => animalPhotos[key]?.[i];

// Miniatura (1280x720): foto protagonista + dos fotos pequeñas + título serif.
export const AnimalsThumbnail = () => {
  const hero = pick("a02") ?? pick("intro");
  const side = [pick("a01"), pick("a12")].filter(Boolean) as Photo[];
  return (
    <AbsoluteFill style={{ backgroundColor: "#000", overflow: "hidden" }}>
      {hero ? <Img src={staticFile(hero.src)} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: hero.focus ?? "60% 40%", filter: "contrast(1.1) saturate(1.15)" }} /> : null}
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.55) 45%, transparent 75%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)" }} />
      <div style={{ position: "absolute", left: 70, top: 120 }}>
        <div style={{ fontFamily: caps, fontWeight: 600, fontSize: 30, letterSpacing: "0.35em", color: gold }}>FOR CURIOUS KIDS</div>
        <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 220, lineHeight: 0.85, color: gold, marginTop: 12, textShadow: "0 8px 30px rgba(0,0,0,0.6)" }}>25</div>
        <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 112, lineHeight: 0.95, color: cream, textShadow: "0 6px 30px rgba(0,0,0,0.8)" }}>
          Amazing
          <br />
          Animals
        </div>
      </div>
      <div style={{ position: "absolute", right: 50, bottom: 50, display: "flex", gap: 22 }}>
        {side.map((p, i) => (
          <Img key={p.src} src={staticFile(p.src)} style={{ width: 230, height: 230, objectFit: "cover", borderRadius: "50%", border: `5px solid ${gold}`, boxShadow: "0 12px 30px rgba(0,0,0,0.7)", rotate: `${i ? 4 : -4}deg` }} />
        ))}
      </div>
      <Grain opacity={0.05} />
    </AbsoluteFill>
  );
};
