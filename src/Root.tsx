import { Composition, Folder, Still } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";
import { BasketFacts, basketTotalFrames } from "./BasketFacts";
import { BasketShort, calculateShortMetadata, shortSchema } from "./BasketFacts/Short";
import { Thumbnail } from "./BasketFacts/Thumbnail";
import { NFLFacts, nflTotalFrames } from "./NFLFacts";
import { calculateNflShortMetadata, NFLShort, nflShortSchema } from "./NFLFacts/Short";
import { NFLThumbnail } from "./NFLFacts/Thumbnail";
import { SoccerFacts, soccerTotalFrames } from "./SoccerFacts";
import { calculateSoccerShortMetadata, SoccerShort, soccerShortSchema } from "./SoccerFacts/Short";
import { SoccerThumbnail } from "./SoccerFacts/Thumbnail";
import { Colors, colorsTotalFrames } from "./Colors";
import { ColorsThumbnail } from "./Colors/Thumbnail";
import { Animals, animalsTotalFrames } from "./Animals";
import { AnimalShort, animalShortSchema, calculateAnimalShortMetadata } from "./Animals/Short";
import { AnimalsThumbnail } from "./Animals/Thumbnail";
import { Intro } from "./Intro";
import { IntroVoz } from "./IntroVoz";
import { calculateIntroVozMetadata } from "./IntroVoz/metadata";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Still id="ColorsThumbnail" component={ColorsThumbnail} width={1280} height={720} />
      <Composition id="SoccerFacts" component={SoccerFacts} durationInFrames={soccerTotalFrames} fps={30} width={1920} height={1080} />
      <Composition
        id="SoccerShort"
        component={SoccerShort}
        schema={soccerShortSchema}
        calculateMetadata={calculateSoccerShortMetadata}
        defaultProps={{ fact: 25 }}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
      />
      <Still id="SoccerThumbnail" component={SoccerThumbnail} width={1280} height={720} />
      <Composition id="NFLFacts" component={NFLFacts} durationInFrames={nflTotalFrames} fps={30} width={1920} height={1080} />
      <Composition
        id="NFLShort"
        component={NFLShort}
        schema={nflShortSchema}
        calculateMetadata={calculateNflShortMetadata}
        defaultProps={{ fact: 1 }}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
      />
      <Still id="NFLThumbnail" component={NFLThumbnail} width={1280} height={720} />
      <Composition id="Colors" component={Colors} durationInFrames={colorsTotalFrames} fps={30} width={1920} height={1080} />
      <Composition id="Animals" component={Animals} durationInFrames={animalsTotalFrames} fps={30} width={1920} height={1080} />
      <Composition
        id="AnimalShort"
        component={AnimalShort}
        schema={animalShortSchema}
        calculateMetadata={calculateAnimalShortMetadata}
        defaultProps={{ animal: 1 }}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
      />
      <Still id="AnimalsThumbnail" component={AnimalsThumbnail} width={1280} height={720} />
      <Composition
        id="BasketFacts"
        component={BasketFacts}
        durationInFrames={basketTotalFrames}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="BasketShort"
        component={BasketShort}
        schema={shortSchema}
        calculateMetadata={calculateShortMetadata}
        defaultProps={{ fact: 1 }}
        durationInFrames={600}
        fps={30}
        width={1080}
        height={1920}
      />
      <Still id="BasketThumbnail" component={Thumbnail} width={1280} height={720} />
      <Composition
        id="Intro"
        component={Intro}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="IntroVoz"
        component={IntroVoz}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ scenes: [] }}
        calculateMetadata={calculateIntroVozMetadata}
      />
      <Folder name="Elements">
        <Composition
          id="Logo"
          component={Logo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            logoColor1: "#91EAE4",
            logoColor2: "#86A8E7",
          }}
        />
        <Composition
          id="Title"
          component={Title}
          durationInFrames={115}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            titleText: "Welcome to Remotion",
            titleColor: "#000000",
          }}
        />
      </Folder>
      <Composition
        // You can take the "id" to render a video:
        // bunx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
        }}
      />

    </>
  );
};
