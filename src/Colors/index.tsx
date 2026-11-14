import { Audio } from "@remotion/media";
import { loadFont } from "@remotion/fonts";
import type React from "react";
import { AbsoluteFill, Easing, interpolate, Series, staticFile, useCurrentFrame } from "remotion";
import type { Segment } from "../BasketFacts/types";
import { ObjectIcon } from "./Objects";
import { OL, Pip } from "./Pip";
import script from "./script.json";
import voice from "./voice.json";

loadFont({ family: "Fredoka", url: staticFile("fonts/Fredoka.woff2"), weight: "700" });
export const round = "Fredoka, sans-serif";

type ColorInfo = (typeof script.colors)[number];
export const colorSegments = voice.segments as unknown as Segment[];
export const colorsTotalFrames = colorSegments.reduce((s, x) => s + x.frames, 0);
const infoById = Object.fromEntries(script.colors.map((c) => [c.id, c])) as Record<string, ColorInfo>;
export const palette = script.colors.map((c) => c.color);

// ---------- utilidades ----------
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const mix = (hex: string, to: string, t: number) => {
  const a = parseInt(hex.slice(1), 16);
  const b = parseInt(to.slice(1), 16);
  const ch = (s: number) => Math.round(((a >> s) & 255) * (1 - t) + ((b >> s) & 255) * t);
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
};
export const tint = (hex: string, t: number) => mix(hex, "#FFFFFF", t);
export const shade = (hex: string, t: number) => mix(hex, "#000000", t);
const pop = (frame: number, start: number, dur = 14) =>
  interpolate(frame, [start, start + dur], [0, 1], { ...clamp, easing: Easing.spring({ damping: 10 }), output: "perceptual-scale" });
const rand = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// ---------- piezas visuales ----------
// Palabra tipo "sticker": color lleno, borde blanco grueso y sombra.
export const BigWord = ({ text, color, size, style }: { readonly text: string; readonly color: string; readonly size: number; readonly style?: React.CSSProperties }) => (
  <div
    style={{
      fontFamily: round,
      fontWeight: 700,
      fontSize: size,
      lineHeight: 1,
      color,
      WebkitTextStroke: `${size * 0.09}px #fff`,
      paintOrder: "stroke fill",
      textShadow: `0 ${size * 0.06}px 0 ${shade(color, 0.45)}, 0 ${size * 0.08}px ${size * 0.12}px rgba(0,0,0,0.25)`,
      whiteSpace: "nowrap",
      ...style,
    }}
  >
    {text}
  </div>
);

// Cuarto neutro (crema) con lunares y piso de madera.
const WallRoom = () => (
  <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 40%, #FFFBF2 0%, #F7E9D4 70%, #EED9BC 100%)" }}>
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 40 }).map((_, i) => (
        <circle key={i} cx={(i % 8) * 260 + (Math.floor(i / 8) % 2) * 130 + 60} cy={Math.floor(i / 8) * 190 + 60} r={14} fill={palette[i % palette.length]} opacity={0.18} />
      ))}
    </svg>
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 170, background: "linear-gradient(#E3B98A, #C99565)", borderTop: `8px solid ${OL}` }} />
  </AbsoluteFill>
);

// Cuarto de color: degradado + formas que flotan.
const ColorRoom = ({ color }: { readonly color: string }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: `radial-gradient(circle at 50% 45%, ${tint(color, 0.55)} 0%, ${tint(color, 0.2)} 55%, ${color} 100%)` }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        {Array.from({ length: 22 }).map((_, i) => {
          const x = rand(i) * 1920;
          const y = ((rand(i + 50) * 1300 - frame * (0.6 + rand(i + 9) * 0.8)) % 1300 + 1300) % 1300 - 110;
          const r = 14 + rand(i + 3) * 26;
          const rot = frame * (rand(i + 7) - 0.5) * 2;
          return i % 2 ? (
            <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={0.25} />
          ) : (
            <path
              key={i}
              d="M0 -1 L0.29 -0.4 L0.95 -0.31 L0.48 0.15 L0.59 0.81 L0 0.5 L-0.59 0.81 L-0.48 0.15 L-0.95 -0.31 L-0.29 -0.4 Z"
              fill="#fff"
              opacity={0.3}
              transform={`translate(${x} ${y}) rotate(${rot}) scale(${r * 1.3})`}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

const Confetti = ({ start, color }: { readonly start: number; readonly color: string }) => {
  const frame = useCurrentFrame();
  const t = frame - start;
  if (t < 0 || t > 110) return null;
  const cols = [color, "#fff", tint(color, 0.5), "#FFD54F"];
  return (
    <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: 70 }).map((_, i) => {
        const x = rand(i + 200) * 1920 + Math.sin(t / 8 + i) * 30;
        const y = -60 + t * (8 + rand(i + 300) * 9) - rand(i + 400) * 300;
        return <rect key={i} x={x} y={y} width={18} height={30} rx={5} fill={cols[i % 4]} transform={`rotate(${t * 8 + i * 40} ${x + 9} ${y + 15})`} />;
      })}
    </svg>
  );
};

// ---------- escena de un color ----------
const BTN = { x: 1300, y: 470, r: 175 };

const ColorScene = ({ seg, info }: { readonly seg: Segment; readonly info: ColorInfo }) => {
  const frame = useCurrentFrame();
  const s = seg.sentences;
  const color = info.color;
  const tCount = s[2].from;
  const tTap = s[2].from + s[2].frames - 2;
  const tHit = tTap + 10;
  const flood = interpolate(frame, [tHit, tHit + 24], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const tWord = s[4].from - 2;
  const tObjs = s[6].from - 4;
  const tParty = s[9].from;

  // Brazo del pincel: se prepara al contar y "pinta" en el tres.
  const swing =
    frame < tTap
      ? interpolate(frame, [tCount, tTap - 4], [0, -0.6], clamp)
      : interpolate(frame, [tTap, tTap + 5, tTap + 20], [-0.6, 0.9, 0], clamp);
  const jump = frame >= tParty ? Math.abs(Math.sin(((frame - tParty) / 14) * Math.PI)) * 0.8 : frame >= tHit + 4 && frame < tHit + 30 ? Math.sin(((frame - tHit - 4) / 26) * Math.PI) * 0.9 : 0;

  // Pip: junto al botón al principio, luego a la izquierda.
  const pipX = interpolate(frame, [tWord - 20, tWord + 10], [520, 110], { ...clamp, easing: Easing.inOut(Easing.cubic) });

  // Proyectil de pintura del pincel al botón.
  const fly = interpolate(frame, [tTap + 2, tHit], [0, 1], clamp);
  const startPt = { x: pipX + 470 * 0.95, y: 520 };
  const px = startPt.x + (BTN.x - startPt.x) * fly;
  const py = startPt.y + (BTN.y - startPt.y) * fly - Math.sin(fly * Math.PI) * 160;
  const btnSquash = interpolate(frame, [tHit, tHit + 4, tHit + 12], [1, 0.82, 1], clamp);
  const glow = 1 + 0.08 * Math.sin(frame / 5);

  // Palabra grande: al centro, luego sube para dejar espacio a los objetos.
  const wordUp = interpolate(frame, [tObjs - 10, tObjs + 14], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const ask = s[5];
  const askPulse = frame > ask.from && frame < tObjs - 10 ? 1 + 0.06 * Math.sin((frame - ask.from) / 4) : 1;

  return (
    <AbsoluteFill>
      {flood < 1 ? <WallRoom /> : null}
      {flood < 1 ? (
        <>
          {/* botón mágico */}
          <div style={{ position: "absolute", left: BTN.x - BTN.r, top: BTN.y - BTN.r, width: BTN.r * 2, height: BTN.r * 2, scale: `${btnSquash}` }}>
            <div style={{ position: "absolute", inset: -40, borderRadius: "50%", background: `radial-gradient(circle, ${tint(color, 0.3)}88 0%, transparent 70%)`, scale: `${glow}` }} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "50%",
                background: `radial-gradient(circle at 35% 30%, ${tint(color, 0.45)} 0%, ${color} 45%, ${shade(color, 0.25)} 100%)`,
                border: `16px solid #fff`,
                boxShadow: `0 0 0 8px ${OL}, 0 22px 0 8px ${shade(color, 0.5)}, 0 30px 50px rgba(0,0,0,0.3)`,
              }}
            />
            <div style={{ position: "absolute", left: "22%", top: "16%", width: "34%", height: "20%", borderRadius: "50%", background: "#fff", opacity: 0.5, rotate: "-25deg" }} />
          </div>
          {/* "1, 2, 3" */}
          {[0, 1, 2].map((k) => {
            const st = tCount + (s[2].frames * k) / 3;
            const o = pop(frame, st, 10);
            return frame >= st && frame < tHit + 6 ? (
              <BigWord key={k} text={String(k + 1)} color={palette[(k * 3 + 1) % 8]} size={150} style={{ position: "absolute", left: 980 + k * 200, top: 760, scale: `${o}` }} />
            ) : null;
          })}
          {fly > 0 && fly < 1 ? (
            <>
              {[0.08, 0.16, 0.24].map((d) => {
                const f2 = Math.max(0, fly - d);
                const x = startPt.x + (BTN.x - startPt.x) * f2;
                const y = startPt.y + (BTN.y - startPt.y) * f2 - Math.sin(f2 * Math.PI) * 160;
                return <div key={d} style={{ position: "absolute", left: x - 10, top: y - 10, width: 20, height: 20, borderRadius: "50%", background: "#fff", opacity: 0.8 - d * 2 }} />;
              })}
              <div style={{ position: "absolute", left: px - 30, top: py - 30, width: 60, height: 60, borderRadius: "50%", background: color, border: `6px solid ${OL}` }} />
            </>
          ) : null}
        </>
      ) : null}

      {/* el color inunda la pantalla desde el botón */}
      {flood > 0 ? (
        <AbsoluteFill style={{ clipPath: `circle(${flood * 2300}px at ${BTN.x}px ${BTN.y}px)` }}>
          <ColorRoom color={color} />
        </AbsoluteFill>
      ) : null}
      {flood > 0 && flood < 1 ? (
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
          {Array.from({ length: 16 }).map((_, i) => {
            const a = (i / 16) * Math.PI * 2;
            const d = 200 + flood * 900 * (0.6 + rand(i) * 0.6);
            return <circle key={i} cx={BTN.x + Math.cos(a) * d} cy={BTN.y + Math.sin(a) * d} r={30 * (1 - flood) + 8} fill={color} stroke={OL} strokeWidth={5} />;
          })}
        </svg>
      ) : null}

      {/* palabra */}
      {frame >= tWord ? (
        <div
          style={{
            position: "absolute",
            left: 760,
            right: 0,
            top: interpolate(wordUp, [0, 1], [300, 60]),
            display: "flex",
            justifyContent: "center",
            scale: `${pop(frame, tWord, 16) * interpolate(wordUp, [0, 1], [1, 0.62]) * askPulse}`,
            transformOrigin: "50% 0%",
          }}
        >
          <BigWord text={info.word} color={color} size={300} />
        </div>
      ) : null}
      {/* signos de pregunta mientras pregunta "Can you say...?" */}
      {frame >= ask.from && frame < tObjs ? (
        <>
          {[0, 1, 2].map((k) => (
            <BigWord
              key={k}
              text="?"
              color={tint(color, 0.15)}
              size={110}
              style={{ position: "absolute", left: 900 + k * 380, top: 700 + Math.sin((frame - ask.from) / 6 + k * 2) * 20, rotate: `${(k - 1) * 14}deg`, scale: `${pop(frame, ask.from + k * 5)}` }}
            />
          ))}
        </>
      ) : null}

      {/* objetos */}
      {info.objects.map((o, k) => {
        const st = s[6 + k].from - 4;
        if (frame < st) return null;
        const speaking = frame < s[6 + k].from + s[6 + k].frames;
        const wiggle = speaking ? Math.sin((frame - st) / 3) * 6 : frame >= tParty ? Math.sin((frame - tParty) / 4 + k) * 8 : 0;
        const hop = frame >= tParty ? -Math.abs(Math.sin(((frame - tParty) / 12 + k * 0.6) * Math.PI)) * 30 : 0;
        return (
          <div
            key={o.icon}
            style={{
              position: "absolute",
              left: 820 + k * 370,
              top: 380 + hop,
              width: 340,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              scale: `${pop(frame, st, 14) * (speaking ? 1.08 : 1)}`,
              rotate: `${wiggle}deg`,
            }}
          >
            <div style={{ width: 300, height: 300, borderRadius: "50%", background: "#fff", border: `8px solid ${OL}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 14px 0 ${shade(color, 0.35)}` }}>
              <ObjectIcon name={o.icon} size={230} />
            </div>
            <BigWord text={o.label} color={color} size={54} style={{ marginTop: 26 }} />
          </div>
        );
      })}

      <Pip mouth={seg.mouth} color={color} size={470} swing={swing} jump={jump} style={{ position: "absolute", left: pipX, top: 1080 - 600 }} />
      <Confetti start={tParty} color={color} />
    </AbsoluteFill>
  );
};

// ---------- intro, repaso y cierre ----------
const Intro = ({ seg }: { readonly seg: Segment }) => {
  const frame = useCurrentFrame();
  const title = "Learn Colors";
  const cycle = palette[Math.floor(frame / 18) % palette.length];
  return (
    <AbsoluteFill>
      <WallRoom />
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        {palette.map((c, i) => {
          const a = (i / 8) * Math.PI * 2 + 0.3;
          const x = 960 + Math.cos(a) * 780;
          const y = 470 + Math.sin(a) * 380;
          const sc = pop(frame, 6 + i * 4, 14);
          return (
            <path
              key={c}
              d="M0 -60 Q40 -70 52 -30 Q80 -10 58 22 Q60 64 16 56 Q-20 80 -44 50 Q-80 30 -60 -6 Q-70 -50 -30 -54 Q-16 -66 0 -60Z"
              fill={c}
              stroke={OL}
              strokeWidth={6}
              transform={`translate(${x} ${y}) scale(${sc * 1.1}) rotate(${i * 40 + Math.sin(frame / 20 + i) * 6})`}
            />
          );
        })}
      </svg>
      <div style={{ position: "absolute", top: 110, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 6 }}>
        {title.split("").map((ch, i) => (
          <BigWord
            key={i}
            text={ch === " " ? " " : ch}
            color={palette[i % palette.length]}
            size={170}
            style={{ scale: `${pop(frame, 4 + i * 3, 14)}`, translate: `0px ${Math.sin(frame / 8 + i * 0.7) * 10}px`, minWidth: ch === " " ? 50 : undefined }}
          />
        ))}
      </div>
      <BigWord text="with Pip!" color="#FF7043" size={110} style={{ position: "absolute", top: 320, left: 0, right: 0, textAlign: "center", scale: `${pop(frame, 50, 16)}` }} />
      <Pip mouth={seg.mouth} color={cycle} size={500} style={{ position: "absolute", left: 960 - 250, top: 1080 - 620 }} />
    </AbsoluteFill>
  );
};

const Review = ({ seg }: { readonly seg: Segment }) => {
  const frame = useCurrentFrame();
  const s = seg.sentences;
  let idx = -1;
  for (let i = 1; i < s.length; i++) if (frame >= s[i].from - 6) idx = i - 1;
  if (idx < 0) {
    return (
      <AbsoluteFill>
        <WallRoom />
        <div style={{ position: "absolute", top: 260, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 30 }}>
          {palette.map((c, i) => (
            <div key={c} style={{ width: 170, height: 170, borderRadius: "50%", background: c, border: `10px solid #fff`, boxShadow: `0 0 0 6px ${OL}, 0 12px 0 6px ${shade(c, 0.4)}`, scale: `${pop(frame, 4 + i * 4)}`, translate: `0px ${Math.sin(frame / 7 + i) * 12}px` }} />
          ))}
        </div>
        <Pip mouth={seg.mouth} color={palette[Math.floor(frame / 12) % 8]} size={420} style={{ position: "absolute", left: 960 - 210, top: 1080 - 530 }} />
      </AbsoluteFill>
    );
  }
  const info = script.colors[idx];
  const st = s[idx + 1].from - 6;
  return (
    <AbsoluteFill>
      <ColorRoom color={info.color} />
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", paddingLeft: 300 }}>
        <BigWord text={info.word} color={info.color} size={340} style={{ scale: `${pop(frame, st, 14)}` }} />
      </div>
      <div style={{ position: "absolute", right: 120, top: 120, display: "flex", gap: 16 }}>
        {info.objects.map((o, k) => (
          <div key={o.icon} style={{ width: 150, height: 150, borderRadius: "50%", background: "#fff", border: `6px solid ${OL}`, display: "flex", alignItems: "center", justifyContent: "center", scale: `${pop(frame, st + 6 + k * 3)}` }}>
            <ObjectIcon name={o.icon} size={110} />
          </div>
        ))}
      </div>
      <Pip mouth={seg.mouth} color={info.color} size={420} jump={Math.abs(Math.sin(((frame - st) / 14) * Math.PI)) * 0.4} style={{ position: "absolute", left: 90, top: 1080 - 530 }} />
    </AbsoluteFill>
  );
};

const Outro = ({ seg }: { readonly seg: Segment }) => {
  const frame = useCurrentFrame();
  const last = seg.sentences[seg.sentences.length - 1];
  return (
    <AbsoluteFill style={{ background: "radial-gradient(circle at 50% 100%, #FFFDF5 0%, #E3F2FD 60%, #BBDEFB 100%)" }}>
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }}>
        {palette.slice(0, 7).map((c, i) => (
          <circle key={c} cx={960} cy={1150} r={(900 - i * 70) * pop(frame, i * 3, 20)} fill="none" stroke={c} strokeWidth={70} />
        ))}
      </svg>
      {frame >= last.from - 6 ? (
        <BigWord text="Bye-bye!" color="#E53935" size={220} style={{ position: "absolute", top: 90, left: 0, right: 0, textAlign: "center", scale: `${pop(frame, last.from - 6, 16)}` }} />
      ) : (
        <BigWord text="You did amazing!" color="#43A047" size={150} style={{ position: "absolute", top: 120, left: 0, right: 0, textAlign: "center", scale: `${pop(frame, 6, 16)}` }} />
      )}
      <Pip mouth={seg.mouth} color={palette[Math.floor(frame / 15) % 8]} size={480} jump={Math.abs(Math.sin((frame / 16) * Math.PI)) * 0.25} style={{ position: "absolute", left: 960 - 240, top: 1080 - 600 }} />
      <Confetti start={last.from} color="#E53935" />
    </AbsoluteFill>
  );
};

// ---------- composición ----------
const starts = colorSegments.reduce<number[]>((acc, _s, i) => [...acc, i === 0 ? 0 : acc[i - 1] + colorSegments[i - 1].frames], []);
const speaking = (() => {
  const arr = new Uint8Array(colorsTotalFrames);
  colorSegments.forEach((seg, i) => {
    for (const s of seg.sentences) arr.fill(1, starts[i] + s.from - 4, starts[i] + s.from + s.frames + 4);
  });
  return arr;
})();
const musicVolume = (frame: number) => {
  const f = Number.isFinite(frame) ? Math.round(frame) : 0;
  let sum = 0;
  for (let k = -8; k < 8; k++) sum += speaking[Math.min(colorsTotalFrames - 1, Math.max(0, f + k))] ?? 0;
  const fadeOut = Math.max(0, Math.min(1, (colorsTotalFrames - f) / 60));
  return (0.6 - 0.28 * (sum / 16)) * fadeOut;
};

export const Colors = () => (
  <AbsoluteFill style={{ backgroundColor: "#fff" }}>
    <Series>
      {colorSegments.map((seg) => (
        <Series.Sequence key={seg.id} name={seg.id} durationInFrames={seg.frames}>
          <Audio src={staticFile(seg.audio)} />
          {seg.id === "intro" ? <Intro seg={seg} /> : seg.id === "review" ? <Review seg={seg} /> : seg.id === "outro" ? <Outro seg={seg} /> : <ColorScene seg={seg} info={infoById[seg.id]} />}
        </Series.Sequence>
      ))}
    </Series>
    <Audio name="Música" src={staticFile("music/happy-colors.wav")} loop volume={musicVolume} />
  </AbsoluteFill>
);
