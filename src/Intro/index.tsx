import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { useVideoConfig } from "remotion";
import { SceneAI } from "./SceneAI";
import { SceneIdeas } from "./SceneIdeas";
import { SceneLogo } from "./SceneLogo";
import { colors } from "./theme";

export const Intro = () => {
  const { fps } = useVideoConfig();
  return (
    <TransitionSeries name="Escenas">
      <TransitionSeries.Sequence name="Idea, guion, video" durationInFrames={Math.round(3.3 * fps)}>
        <SceneIdeas
          name="Escena ideas"
          style={{ backgroundColor: colors.ink, justifyContent: "center" }}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: Math.round(0.5 * fps) })}
      />
      <TransitionSeries.Sequence name="Hecho con IA" durationInFrames={Math.round(3.3 * fps)}>
        <SceneAI
          name="Escena IA"
          style={{ backgroundColor: colors.lime, justifyContent: "center", alignItems: "center" }}
        />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={wipe({ direction: "from-left" })}
        timing={linearTiming({ durationInFrames: Math.round(0.5 * fps) })}
      />
      <TransitionSeries.Sequence name="Logo" durationInFrames={Math.round(3.4 * fps)}>
        <SceneLogo
          name="Escena logo"
          style={{ backgroundColor: colors.ink, justifyContent: "center", alignItems: "center" }}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
