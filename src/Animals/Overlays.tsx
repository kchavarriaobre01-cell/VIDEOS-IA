import { Easing, interpolate, useCurrentFrame } from "remotion";
import { BAR, caps, cream, gold, serif } from "./theme";

const fade = (frame: number, a: number, b: number, c: number, d: number) =>
  interpolate(frame, [a, b, c, d], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.inOut(Easing.cubic) });

// Tarjeta de capítulo: aparece sobre negro antes de que hable la narradora.
export const ChapterCard = ({ chapter, name, place, end }: { readonly chapter: string; readonly name: string; readonly place: string; readonly end: number }) => {
  const frame = useCurrentFrame();
  const bg = interpolate(frame, [end - 24, end + 6], [0.85, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const o = fade(frame, 4, 22, end - 20, end + 4);
  const line = interpolate(frame, [10, 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) });
  return (
    <>
      <div style={{ position: "absolute", inset: 0, backgroundColor: `rgba(0,0,0,${bg})` }} />
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: o }}>
        <div style={{ fontFamily: caps, fontWeight: 600, fontSize: 30, letterSpacing: "0.45em", color: gold, marginRight: "-0.45em" }}>{chapter}</div>
        <div style={{ width: 260 * line, height: 2, backgroundColor: gold, margin: "26px 0 18px" }} />
        <div
          style={{
            fontFamily: serif,
            fontWeight: 600,
            fontSize: 150,
            lineHeight: 1,
            color: cream,
            letterSpacing: "0.01em",
            textShadow: "0 6px 30px rgba(0,0,0,0.6)",
            translate: `0px ${interpolate(frame, [4, 40], [24, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: Easing.out(Easing.cubic) })}px`,
          }}
        >
          {name}
        </div>
        <div style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 500, fontSize: 46, color: cream, opacity: 0.85, marginTop: 14 }}>{place}</div>
      </div>
    </>
  );
};

// Ficha del dato, abajo a la izquierda, estilo documental.
export const StatCard = ({ stat, label, from, to, bottom = BAR + 60, left = 110 }: { readonly stat: string; readonly label: string; readonly from: number; readonly to: number; readonly bottom?: number; readonly left?: number }) => {
  const frame = useCurrentFrame();
  const o = fade(frame, from, from + 20, to - 20, to);
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", left, bottom, opacity: o, translate: `${(1 - o) * -20}px 0px`, display: "flex", gap: 24, alignItems: "stretch" }}>
      <div style={{ width: 3, backgroundColor: gold }} />
      <div>
        <div style={{ fontFamily: caps, fontWeight: 600, fontSize: 22, letterSpacing: "0.3em", color: gold }}>DID YOU KNOW?</div>
        <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 96, lineHeight: 1, color: cream, textShadow: "0 4px 20px rgba(0,0,0,0.7)", marginTop: 6 }}>{stat}</div>
        <div style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 500, fontSize: 40, color: cream, opacity: 0.9, textShadow: "0 2px 12px rgba(0,0,0,0.8)" }}>{label}</div>
      </div>
    </div>
  );
};

// Texto pequeño dentro de la franja superior.
export const BarLabels = ({ left, right }: { readonly left: string; readonly right: string }) => (
  <div style={{ position: "absolute", top: 0, left: 60, right: 60, height: BAR, display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: caps, fontWeight: 600, fontSize: 22, letterSpacing: "0.3em", color: gold, opacity: 0.85 }}>
    <span>{left}</span>
    <span>{right}</span>
  </div>
);

export const Credit = ({ text }: { readonly text: string }) => (
  <div style={{ position: "absolute", left: 60, right: 60, bottom: 0, height: BAR, display: "flex", alignItems: "center", fontFamily: "Inter, sans-serif", fontSize: 18, color: "rgba(244,239,230,0.55)" }}>
    {text}
  </div>
);

// Título grande (intro / cierre).
export const BigTitle = ({ kicker, title, subtitle, from, to }: { readonly kicker: string; readonly title: string; readonly subtitle: string; readonly from: number; readonly to: number }) => {
  const frame = useCurrentFrame();
  const o = fade(frame, from, from + 30, to - 30, to);
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", opacity: o, textAlign: "center" }}>
      <div style={{ fontFamily: caps, fontWeight: 600, fontSize: 30, letterSpacing: "0.45em", color: gold, marginRight: "-0.45em" }}>{kicker}</div>
      <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 170, lineHeight: 1, color: cream, marginTop: 18, textShadow: "0 8px 40px rgba(0,0,0,0.7)", scale: `${1 + (frame - from) * 0.0006}` }}>{title}</div>
      <div style={{ fontFamily: serif, fontStyle: "italic", fontWeight: 500, fontSize: 52, color: cream, opacity: 0.9, marginTop: 16, textShadow: "0 2px 16px rgba(0,0,0,0.8)" }}>{subtitle}</div>
    </div>
  );
};
