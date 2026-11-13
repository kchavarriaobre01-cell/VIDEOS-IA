import { Audio } from "@remotion/media";
import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { Sequence, useVideoConfig } from "remotion";
import { SceneAI } from "../Intro/SceneAI";
import { SceneIdeas } from "../Intro/SceneIdeas";
import { SceneLogo } from "../Intro/SceneLogo";
import { colors } from "../Intro/theme";
import { IntroVozProps, transitionFrames } from "./metadata";

const Voice = ({ src, delay }: { readonly src: string | null; readonly delay: number }) =>
  src ? (
    <Sequence from={delay} layout="none" name="Voz">
      <Audio src={src} />
    </Sequence>
  ) : null;

export const IntroVoz = ({ scenes }: IntroVozProps) => {
  const { fps } = useVideoConfig();
  const [s1, s2, s3] = scenes;
  return (
    <TransitionSeries name="Escenas">
      <TransitionSeries.Sequence name="Idea, guion, video" durationInFrames={s1.frames}>
        <SceneIdeas
          name="Escena ideas"
          lang="en"
          style={{ backgroundColor: colors.ink, justifyContent: "center" }}
        />
        <Voice src={s1.audio} delay={Math.round(0.3 * fps)} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={slide({ direction: "from-bottom" })}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />
      <TransitionSeries.Sequence name="Hecho con IA" durationInFrames={s2.frames}>
        <SceneAI
          name="Escena IA"
          lang="en"
          style={{ backgroundColor: colors.lime, justifyContent: "center", alignItems: "center" }}
        />
        <Voice src={s2.audio} delay={transitionFrames} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={wipe({ direction: "from-left" })}
        timing={linearTiming({ durationInFrames: transitionFrames })}
      />
      <TransitionSeries.Sequence name="Logo" durationInFrames={s3.frames}>
        <SceneLogo
          name="Escena logo"
          lang="en"
          style={{ backgroundColor: colors.ink, justifyContent: "center", alignItems: "center" }}
        />
        <Voice src={s3.audio} delay={transitionFrames} />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
