import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fonts are bundled in public/fonts so rendering works offline.
loadFont({ family: "Syne", url: staticFile("fonts/Syne.woff2"), weight: "400 800" });
loadFont({ family: "Inter", url: staticFile("fonts/Inter-SemiBold.woff2"), weight: "600" });
loadFont({ family: "DM Mono", url: staticFile("fonts/DMMono-Regular.woff2"), weight: "400" });

export const displayFont = "Syne, sans-serif";
export const bodyFont = "Inter, sans-serif";
export const monoFont = "'DM Mono', monospace";

export const colors = {
  ink: "#0E0E10",
  paper: "#F2EFE8",
  lime: "#D4FF3A",
  muted: "#8A877F",
};
