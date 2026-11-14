import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

loadFont({ family: "Cormorant Garamond", url: staticFile("fonts/CormorantGaramond-SemiBold.woff2"), weight: "600" });
loadFont({ family: "Cormorant Garamond", url: staticFile("fonts/CormorantGaramond-MediumItalic.woff2"), weight: "500", style: "italic" });
loadFont({ family: "Cinzel", url: staticFile("fonts/Cinzel.woff2"), weight: "600" });
loadFont({ family: "Inter", url: staticFile("fonts/Inter-SemiBold.woff2"), weight: "600" });

export const serif = "'Cormorant Garamond', serif";
export const caps = "Cinzel, serif";
export const sans = "Inter, sans-serif";
export const gold = "#D9B26F";
export const cream = "#F4EFE6";
export const BAR = 120; // franjas negras de cine (arriba y abajo)
