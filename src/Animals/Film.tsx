import { useCurrentFrame } from "remotion";
import { BAR } from "./theme";

// Franjas negras tipo cine.
export const Letterbox = ({ size = BAR }: { readonly size?: number }) => (
  <>
    <div style={{ position: "absolute", left: 0, right: 0, top: 0, height: size, backgroundColor: "#000" }} />
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: size, backgroundColor: "#000" }} />
  </>
);

// Grano de película: ruido que cambia cada 2 frames.
export const Grain = ({ opacity = 0.07 }: { readonly opacity?: number }) => {
  const frame = useCurrentFrame();
  const seed = Math.floor(frame / 2) % 50;
  return (
    <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity, mixBlendMode: "overlay" }}>
      <filter id={`grain-${seed}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={seed} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#grain-${seed})`} />
    </svg>
  );
};

// Viñeta + tono cálido de documental.
export const Grade = () => (
  <>
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)" }} />
    <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(255,170,90,0.06)", mixBlendMode: "soft-light" }} />
  </>
);
