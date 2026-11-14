import { colors, monoFont } from "../Intro/theme";

// 25 segmentos arriba; se ilumina el dato actual.
export const ProgressBar = ({ current }: { readonly current: number }) => (
  <div style={{ position: "absolute", top: 64, left: 140, right: 140, display: "flex", alignItems: "center", gap: 24 }}>
    <div style={{ fontFamily: monoFont, fontSize: 28, color: colors.muted, letterSpacing: "0.15em", whiteSpace: "nowrap" }}>
      25 BASKETBALL FACTS
    </div>
    <div style={{ flex: 1, display: "flex", gap: 6 }}>
      {Array.from({ length: 25 }, (_, i) => (
        <div
          key={i}
          style={{
            flex: 1,
            height: 8,
            borderRadius: 4,
            backgroundColor: i + 1 < current ? colors.paper : i + 1 === current ? colors.lime : "rgba(242,239,232,0.15)",
            opacity: i + 1 < current ? 0.5 : 1,
          }}
        />
      ))}
    </div>
  </div>
);
