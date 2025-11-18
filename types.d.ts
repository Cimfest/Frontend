// /types/global.d.ts or /global.d.ts (place in root directory)

interface Window {
  essentia?: {
    Essentia: new (wasmModule: any) => any;
    EssentiaWASM: any;
  };
}

declare module "@magenta/music/es6/music_rnn" {
  export class MusicRNN {
    constructor(checkpointUrl: string);
    initialize(): Promise<void>;
    continueSequence(
      seed: any,
      steps: number,
      temperature: number
    ): Promise<any>;
  }
}

declare module "essentia.js" {
  export interface EssentiaInstance {
    arrayToVector(array: Float32Array): any;
    PercivalBpmEstimator(vector: any): { bpm: number };
    KeyExtractor(vector: any): { key: string; scale: string; strength: number };
  }
}
