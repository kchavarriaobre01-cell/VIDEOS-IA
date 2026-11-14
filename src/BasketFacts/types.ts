export type Sentence = { readonly text: string; readonly from: number; readonly frames: number };
export type Segment = {
  readonly id: string;
  readonly frames: number;
  readonly audio: string;
  readonly sentences: readonly Sentence[];
  readonly mouth: readonly number[];
};
export type Fact = {
  readonly title: string;
  readonly stat: string;
  readonly statLabel: string;
  readonly narration: string;
};
