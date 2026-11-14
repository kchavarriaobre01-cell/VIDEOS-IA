import { Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import type { Photo, Sentence } from "../BasketFacts/types";

const FADE = 24;

// Límites de cada toma: una por frase (las frases largas se parten en tomas de ~7 s).
const shotBounds = (sentences: readonly Sentence[], total: number, frame: number) => {
  const starts = sentences.map((s, i) => (i === 0 ? 0 : s.from - 10));
  const bounds: number[] = [];
  starts.forEach((s, i) => {
    const e = i + 1 < starts.length ? starts[i + 1] : total;
    const parts = Math.max(1, Math.round((e - s) / 210));
    for (let k = 0; k < parts; k++) bounds.push(Math.round(s + ((e - s) * k) / parts));
  });
  let cur = 0;
  for (let i = 0; i < bounds.length; i++) if (frame >= bounds[i]) cur = i;
  return { bounds, cur };
};
const moves = [
  { x: [-30, 30], y: [10, -10] },
  { x: [30, -20], y: [-10, 15] },
  { x: [0, 0], y: [20, -20] },
  { x: [-20, 25], y: [-15, 5] },
];

// Una "toma" por frase: zoom lento + paneo, con fundido cruzado entre tomas.
const Shot = ({ photo, index, start, end, vertical }: { readonly photo: Photo; readonly index: number; readonly start: number; readonly end: number; readonly vertical: boolean }) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [start, end + FADE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const m = moves[index % moves.length];
  const zoom = index % 2 === 0 ? 1.06 + p * 0.1 : 1.16 - p * 0.1;
  const tx = m.x[0] + (m.x[1] - m.x[0]) * p;
  const ty = m.y[0] + (m.y[1] - m.y[0]) * p;
  const opacity = interpolate(frame, [start, start + FADE], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const portrait = !!photo.w && !!photo.h && (vertical ? photo.w > photo.h * 1.25 : photo.h > photo.w * 0.9);
  const src = staticFile(photo.src);
  const look = { filter: "contrast(1.06) saturate(1.08)" };
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", opacity }}>
      {portrait ? (
        <>
          <Img src={src} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", filter: "blur(40px) brightness(0.5)", scale: "1.2" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Img
              src={src}
              style={{
                ...look,
                ...(vertical ? { width: "100%", height: "auto" } : { height: "86%", width: "auto" }),
                boxShadow: "0 30px 80px rgba(0,0,0,0.7)",
                scale: `${zoom}`,
                translate: `${tx * 0.4}px ${ty * 0.4}px`,
              }}
            />
          </div>
        </>
      ) : (
        <Img
          src={src}
          style={{ ...look, width: "100%", height: "100%", objectFit: "cover", objectPosition: photo.focus ?? "50% 50%", scale: `${zoom}`, translate: `${tx}px ${ty}px` }}
        />
      )}
    </div>
  );
};

export const KenBurns = ({
  photos,
  sentences,
  total,
  vertical = false,
}: {
  readonly photos: readonly Photo[];
  readonly sentences: readonly Sentence[];
  readonly total: number;
  readonly vertical?: boolean;
}) => {
  const frame = useCurrentFrame();
  if (photos.length === 0) return null;
  const { bounds, cur } = shotBounds(sentences, total, frame);
  const shots = [cur - 1, cur].filter((i) => i >= 0);
  return (
    <>
      {shots.map((i) => (
        <Shot
          key={i}
          photo={photos[i % photos.length]}
          index={i}
          start={i === 0 ? -FADE : bounds[i]}
          end={i + 1 < bounds.length ? bounds[i + 1] : total}
          vertical={vertical}
        />
      ))}
    </>
  );
};

export const shotPhoto = (photos: readonly Photo[], sentences: readonly Sentence[], total: number, frame: number) => {
  const { cur } = shotBounds(sentences, total, frame);
  return photos.length ? photos[cur % photos.length] : null;
};
