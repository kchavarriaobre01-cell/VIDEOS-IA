import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { bodyFont, colors, displayFont } from "../Intro/theme";
import type { Sentence } from "./types";

const orange = "#F28C28";

// Cuenta regresiva arriba a la derecha (tiempo que falta del video).
export const Countdown = ({ total }: { readonly total: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const left = Math.max(0, Math.ceil((total - frame) / fps));
  const text = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
  return (
    <div
      style={{
        position: "absolute",
        top: 36,
        right: 40,
        padding: "6px 26px 10px",
        borderRadius: 16,
        backgroundColor: orange,
        border: "5px solid #fff",
        boxShadow: "0 8px 0 rgba(0,0,0,0.35)",
        fontFamily: displayFont,
        fontWeight: 800,
        fontSize: 72,
        color: "#fff",
        textShadow: "0 4px 0 rgba(0,0,0,0.25)",
        fontVariantNumeric: "tabular-nums",
        minWidth: 230,
        textAlign: "center",
      }}
    >
      {text}
    </div>
  );
};

const currentSentence = (sentences: readonly Sentence[], frame: number) =>
  sentences.findIndex((s, i) => frame >= s.from - 2 && (i === sentences.length - 1 || frame < sentences[i + 1].from - 2));

// Subtítulos centrados abajo, con fondo oscuro detrás de cada línea.
export const CenterCaption = ({ sentences }: { readonly sentences: readonly Sentence[] }) => {
  const frame = useCurrentFrame();
  const idx = currentSentence(sentences, frame);
  if (idx < 0) return null;
  const local = frame - (sentences[idx].from - 2);
  return (
    <div
      style={{
        position: "absolute",
        left: 360,
        right: 360,
        bottom: 70,
        textAlign: "center",
        opacity: interpolate(local, [0, 4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
      }}
    >
      <span
        style={{
          fontFamily: bodyFont,
          fontWeight: 600,
          fontSize: 46,
          lineHeight: 1.45,
          color: "#fff",
          backgroundColor: "rgba(0,0,0,0.72)",
          padding: "4px 14px",
          boxDecorationBreak: "clone",
          WebkitBoxDecorationBreak: "clone",
          borderRadius: 8,
        }}
      >
        {sentences[idx].text}
      </span>
    </div>
  );
};

// Etiqueta con el nombre de la persona mencionada en la frase actual.
export const NameTag = ({ sentences, names }: { readonly sentences: readonly Sentence[]; readonly names: readonly (string | null)[] }) => {
  const frame = useCurrentFrame();
  const idx = currentSentence(sentences, frame);
  const name = idx >= 0 ? names[idx] : null;
  if (!name) return null;
  const local = frame - (sentences[idx].from - 2);
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 300, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          fontFamily: displayFont,
          fontWeight: 800,
          fontSize: 44,
          color: "#fff",
          backgroundColor: orange,
          padding: "6px 26px 10px",
          borderRadius: 12,
          border: "4px solid #fff",
          boxShadow: "0 6px 0 rgba(0,0,0,0.35)",
          scale: interpolate(local, [0, 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.spring({ damping: 12 }),
            output: "perceptual-scale",
          }),
        }}
      >
        {name}
      </div>
    </div>
  );
};

// Cabecera: número del dato + título + cifra clave.
export const FactHeader = ({ index, title, stat }: { readonly index: number; readonly title: string; readonly stat: string }) => {
  const frame = useCurrentFrame();
  const pop = (d: number) =>
    interpolate(frame, [d, d + 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.spring({ damping: 13 }),
      output: "perceptual-scale",
    });
  return (
    <div style={{ position: "absolute", top: 36, left: 40, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, scale: pop(0), transformOrigin: "left center" }}>
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 800,
            fontSize: 54,
            color: colors.ink,
            backgroundColor: colors.lime,
            padding: "2px 20px 8px",
            borderRadius: 12,
            border: "4px solid #fff",
            boxShadow: "0 6px 0 rgba(0,0,0,0.35)",
          }}
        >
          #{index}
        </div>
        <div
          style={{
            fontFamily: displayFont,
            fontWeight: 800,
            fontSize: 44,
            color: "#fff",
            backgroundColor: "rgba(0,0,0,0.72)",
            padding: "6px 20px 10px",
            borderRadius: 12,
            maxWidth: 1150,
          }}
        >
          {title}
        </div>
      </div>
      <div
        style={{
          fontFamily: displayFont,
          fontWeight: 800,
          fontSize: 64,
          color: colors.lime,
          backgroundColor: "rgba(0,0,0,0.72)",
          padding: "2px 22px 8px",
          borderRadius: 12,
          rotate: "-3deg",
          scale: pop(20),
          transformOrigin: "left center",
        }}
      >
        {stat}
      </div>
    </div>
  );
};

export const Vignette = () => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      background: "linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, transparent 25%, transparent 60%, rgba(0,0,0,0.6) 100%)",
    }}
  />
);
