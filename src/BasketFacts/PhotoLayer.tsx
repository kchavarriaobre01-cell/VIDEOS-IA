import { Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { Background } from "./Background";
import type { Photo, Sentence } from "./types";

// Tamaño exacto para que el marco blanco abrace la foto.
const fit = (w: number, h: number, vertical: boolean) => {
  let height = vertical ? 1080 : 960;
  let width = (height * w) / h;
  const maxW = vertical ? 1000 : 1500;
  if (width > maxW) {
    width = maxW;
    height = (width * h) / w;
  }
  return { width, height };
};

const origins = ["30% 40%", "70% 45%", "50% 30%", "40% 60%", "60% 50%"];

// Fotos a pantalla completa. Cambia de foto (o de encuadre) en cada frase, con zoom lento.
export const PhotoLayer = ({
  photos,
  sentences,
  split,
  vertical = false,
}: {
  readonly photos: readonly Photo[];
  readonly sentences: readonly Sentence[];
  readonly split?: boolean;
  readonly vertical?: boolean;
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
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: vertical ? "column" : "row", gap: 12, backgroundColor: "#000" }}>
        {[a, b].map((p, k) => (
          <div key={k} style={{ flex: 1, overflow: "hidden" }}>
            <Img src={staticFile(p.src)} style={imgStyle(p.focus ?? "50% 40%")} />
          </div>
        ))}
      </div>
    );
  }
  const p = photoAt(idx);
  // Fotos verticales o pequeñas: se muestran enteras sobre una copia desenfocada.
  const framed = !!p.w && !!p.h && (vertical ? p.w > p.h * 0.75 || p.w < 700 : p.h > p.w * 0.8 || p.w < 900);
  if (framed) {
    return (
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", backgroundColor: "#000" }}>
        <Img
          src={staticFile(p.src)}
          style={{ ...imgStyle("50% 50%"), filter: "blur(40px) brightness(0.45)", scale: "1.25" }}
        />
        <div style={{ position: "absolute", inset: vertical ? "400px 0 420px 0" : 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Img
            src={staticFile(p.src)}
            style={{
              ...fit(p.w ?? 1, p.h ?? 1, vertical),
              scale: `${(zoom - 0.06) * punch}`,
              boxShadow: "0 20px 60px rgba(0,0,0,0.7)",
              border: "6px solid #fff",
            }}
          />
        </div>
      </div>
    );
  }
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", backgroundColor: "#000" }}>
      <Img src={staticFile(p.src)} style={imgStyle(p.focus ?? origins[idx % origins.length])} />
    </div>
  );
};

export const PhotoCredit = ({
  photos,
  sentences,
  top,
}: {
  readonly photos: readonly Photo[];
  readonly sentences: readonly Sentence[];
  readonly top?: number;
}) => {
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
        ...(top === undefined ? { bottom: 14 } : { top }),
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
