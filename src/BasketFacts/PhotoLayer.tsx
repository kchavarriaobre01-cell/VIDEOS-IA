import { Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Background } from "./Background";
import type { Photo, Sentence } from "./types";

const origins = ["30% 40%", "70% 45%", "50% 30%", "40% 60%", "60% 50%"];

// Fotos a pantalla completa. Cambia de foto (o de encuadre) en cada frase, con zoom lento.
export const PhotoLayer = ({
  photos,
  sentences,
  split,
}: {
  readonly photos: readonly Photo[];
  readonly sentences: readonly Sentence[];
  readonly split?: boolean;
}) => {
  const frame = useCurrentFrame();
  if (photos.length === 0) return <Background />;
  let idx = 0;
  for (let i = 0; i < sentences.length; i++) if (frame >= sentences[i].from - 2) idx = i;
  const start = idx === 0 ? 0 : sentences[idx].from - 2;
  const end = sentences[idx].from + sentences[idx].frames + 8;
  const local = frame - start;

  const zoom = interpolate(frame, [start, end], [1.06, 1.18], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // pequeño "golpe" al cambiar de toma
  const punch = interpolate(local, [0, 6], [1.06, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });

  const photoAt = (n: number) => photos[n % photos.length];
  const imgStyle = (origin: string): React.CSSProperties => ({
    width: "100%",
    height: "100%",
    objectFit: "cover",
    scale: `${zoom * punch}`,
    transformOrigin: origin,
  });

  if (split && photos.length >= 2) {
    const a = photoAt(idx * 2);
    const b = photoAt(idx * 2 + 1);
    return (
      <div style={{ position: "absolute", inset: 0, display: "flex", gap: 12, backgroundColor: "#000" }}>
        {[a, b].map((p, k) => (
          <div key={k} style={{ flex: 1, overflow: "hidden" }}>
            <Img src={staticFile(p.src)} style={imgStyle(p.focus ?? "50% 40%")} />
          </div>
        ))}
      </div>
    );
  }
  const p = photoAt(idx);
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", backgroundColor: "#000" }}>
      <Img src={staticFile(p.src)} style={imgStyle(p.focus ?? origins[idx % origins.length])} />
    </div>
  );
};

export const PhotoCredit = ({ photos, sentences }: { readonly photos: readonly Photo[]; readonly sentences: readonly Sentence[] }) => {
  const frame = useCurrentFrame();
  if (photos.length === 0) return null;
  let idx = 0;
  for (let i = 0; i < sentences.length; i++) if (frame >= sentences[i].from - 2) idx = i;
  const p = photos[idx % photos.length];
  return (
    <div
      style={{
        position: "absolute",
        left: 24,
        bottom: 14,
        fontFamily: "Inter, sans-serif",
        fontSize: 18,
        color: "rgba(255,255,255,0.75)",
        textShadow: "0 1px 3px #000",
      }}
    >
      Photo: {p.credit} · {p.license}
    </div>
  );
};
