import { Interactive } from "remotion";
import { Label } from "./Label";
import { Word } from "./Word";
import { colors, displayFont } from "./theme";
import { Lang, langSchema, texts } from "./texts";

const word = {
  fontFamily: displayFont,
  fontWeight: 800,
  fontSize: 190,
  lineHeight: 1,
  letterSpacing: "-0.03em",
};

const SceneIdeasInner = ({ lang = "es" }: { readonly lang?: string }) => {
  const t = texts[lang as Lang] ?? texts.es;
  return (
  <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12, padding: "0 160px" }}>
    <Label delay={0}>{t.ideasLabel}</Label>
    <div style={{ height: 24 }} />
    <Word delay={6} style={{ ...word, color: colors.paper }}>{t.ideas[0]}</Word>
    <Word delay={20} style={{ ...word, color: colors.paper }}>{t.ideas[1]}</Word>
    <Word delay={34} style={{ ...word, color: colors.lime }}>{t.ideas[2]}</Word>
  </div>
  );
};

export const SceneIdeas = Interactive.create({
  Component: SceneIdeasInner,
  layout: "absolute-fill",
  schema: { ...Interactive.backgroundSchema, ...langSchema },
});
