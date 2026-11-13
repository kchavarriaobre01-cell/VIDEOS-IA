export type Lang = "es" | "en";

export const texts = {
  es: {
    ideasLabel: "01 — de la idea al video",
    ideas: ["Idea.", "Guion.", "Video."],
    madeWith: "hecho con",
    ai: "IA",
    tools: "Remotion × Claude × ElevenLabs",
    tagline: "Tu estudio de video automático",
  },
  en: {
    ideasLabel: "01 — from idea to video",
    ideas: ["Idea.", "Script.", "Video."],
    madeWith: "made with",
    ai: "AI",
    tools: "Remotion × Claude × Kokoro",
    tagline: "Your automatic video studio",
  },
} as const;

export const langSchema = {
  lang: { type: "string", default: "es", description: "Idioma (es / en)" },
} as const;
