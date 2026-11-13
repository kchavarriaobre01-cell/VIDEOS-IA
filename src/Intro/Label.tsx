import type React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { colors, monoFont } from "./theme";

export const Label: React.FC<{
  readonly children: React.ReactNode;
  readonly delay: number;
}> = ({ children, delay }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        fontFamily: monoFont,
        fontSize: 40,
        letterSpacing: "0.2em",
        color: colors.muted,
        textTransform: "uppercase",
        opacity: interpolate(frame, [delay, delay + 15], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      {children}
    </div>
  );
};
