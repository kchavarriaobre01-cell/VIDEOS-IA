import type React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";

// A word that rises into place from behind a mask.
export const Word: React.FC<{
  readonly children: React.ReactNode;
  readonly delay: number;
  readonly style?: React.CSSProperties;
}> = ({ children, delay, style }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ overflow: "hidden", paddingBottom: "0.08em" }}>
      <div
        style={{
          ...style,
          translate: interpolate(frame, [delay, delay + 18], ["0px 110%", "0px 0%"], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
        }}
      >
        {children}
      </div>
    </div>
  );
};
