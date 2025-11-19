// /hooks/useAiMusicGenerator.ts
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import * as Tone from "tone";
import { MusicRNN } from "@magenta/music/es6/music_rnn";

interface AiPattern {
  kick: (string | null)[];
  snare: (string | null)[];
  hihat: (string | null)[];
}

interface TempoAnalysis {
  bpm: number;
  confidence: number;
  onsetTimes: number[];
}

// Authentic Cameroonian rhythm patterns
const CAMEROON_RHYTHMS = {
  bikutsi: {
    defaultBpm: 160,
    timeSignature: "6/8",
    kickPattern: [
      "C1",
      null,
      null,
      "C1",
      null,
      null,
      "C1",
      null,
      null,
      null,
      null,
      "C1",
      "C1",
      null,
      null,
      "C1",
      null,
      null,
      null,
      null,
      "C1",
      null,
      null,
      "C1",
    ],
    snarePattern: [
      null,
      null,
      "D1",
      null,
      null,
      "D1",
      null,
      "D1",
      null,
      null,
      "D1",
      null,
      null,
      null,
      "D1",
      null,
      null,
      "D1",
      null,
      "D1",
      null,
      "D1",
      null,
      null,
    ],
    hihatPattern: [
      "E1",
      null,
      "E1",
      "E1",
      null,
      "E1",
      "E1",
      "E1",
      null,
      "E1",
      "E1",
      null,
      "E1",
      null,
      "E1",
      "E1",
      null,
      "E1",
      "E1",
      "E1",
      null,
      "E1",
      "E1",
      "E1",
    ],
    description: "Fast syncopated 6/8 rhythm with polyrhythmic layers",
  },
  makossa: {
    defaultBpm: 130,
    timeSignature: "4/4",
    kickPattern: [
      "C1",
      null,
      null,
      null,
      "C1",
      null,
      null,
      null,
      "C1",
      null,
      null,
      "C1",
      null,
      null,
      "C1",
      null,
      "C1",
      null,
      null,
      null,
      "C1",
      null,
      null,
      null,
      "C1",
      null,
      "C1",
      null,
      null,
      null,
      "C1",
      null,
    ],
    snarePattern: [
      null,
      null,
      null,
      null,
      "D1",
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      "D1",
      null,
      null,
      "D1",
      null,
      null,
      null,
      null,
      "D1",
      null,
      null,
      null,
      null,
      null,
      null,
      "D1",
      "D1",
      null,
      null,
      null,
    ],
    hihatPattern: [
      "E1",
      null,
      "E1",
      "E1",
      null,
      "E1",
      "E1",
      null,
      "E1",
      "E1",
      null,
      "E1",
      null,
      "E1",
      "E1",
      null,
      "E1",
      null,
      "E1",
      "E1",
      null,
      "E1",
      "E1",
      null,
      "E1",
      "E1",
      null,
      "E1",
      "E1",
      null,
      "E1",
      "E1",
    ],
    description: "Groove-heavy 4/4 with African swing and syncopation",
  },
  mbole: {
    defaultBpm: 120,
    timeSignature: "12/8",
    kickPattern: [
      "C1",
      null,
      null,
      "C1",
      null,
      null,
      null,
      null,
      "C1",
      null,
      null,
      null,
      "C1",
      null,
      null,
      null,
      "C1",
      null,
      null,
      null,
      "C1",
      null,
      null,
      null,
    ],
    snarePattern: [
      null,
      null,
      "D1",
      null,
      null,
      "D1",
      null,
      "D1",
      null,
      null,
      "D1",
      null,
      null,
      "D1",
      null,
      null,
      "D1",
      null,
      "D1",
      null,
      null,
      "D1",
      null,
      null,
    ],
    hihatPattern: [
      "E1",
      "E1",
      null,
      "E1",
      "E1",
      null,
      "E1",
      null,
      "E1",
      "E1",
      null,
      "E1",
      "E1",
      null,
      "E1",
      "E1",
      null,
      "E1",
      null,
      "E1",
      "E1",
      null,
      "E1",
      "E1",
    ],
    description: "Traditional 12/8 with call-and-response drum conversation",
  },
  afrobeats: {
    defaultBpm: 116,
    timeSignature: "4/4",
    kickPattern: [
      "C1",
      null,
      null,
      null,
      null,
      null,
      "C1",
      null,
      null,
      null,
      "C1",
      null,
      null,
      null,
      null,
      null,
      "C1",
      null,
      null,
      null,
      null,
      null,
      "C1",
      null,
      null,
      null,
      "C1",
      null,
      null,
      "C1",
      null,
      null,
    ],
    snarePattern: [
      null,
      null,
      null,
      null,
      "D1",
      null,
      null,
      null,
      null,
      null,
      null,
      "D1",
      "D1",
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      "D1",
      null,
      null,
      null,
      null,
      "D1",
      null,
      null,
      "D1",
      null,
      null,
      null,
    ],
    hihatPattern: [
      "E1",
      null,
      "E1",
      "E1",
      null,
      "E1",
      null,
      "E1",
      "E1",
      "E1",
      null,
      "E1",
      null,
      "E1",
      "E1",
      null,
      "E1",
      null,
      "E1",
      "E1",
      null,
      "E1",
      null,
      "E1",
      "E1",
      "E1",
      null,
      "E1",
      null,
      "E1",
      "E1",
      "E1",
    ],
    description: "Modern Afrobeats groove with syncopated hi-hats",
  },
};

export function useAiMusicGenerator() {
  const [status, setStatus] = useState("Initializing...");
  const [progress, setProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [isReadyToPlay, setIsReadyToPlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<any[]>([]);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const musicRnnRef = useRef<MusicRNN | null>(null);
  const isInitializing = useRef(false);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    async function loadModels() {
      if (isInitializing.current) return;
      isInitializing.current = true;

      try {
        setStatus("Loading AI Music Generator...");
        setProgress(5);

        if (!musicRnnRef.current) {
          console.log("🎵 Loading MusicRNN...");
          const rnn = new MusicRNN(
            "https://storage.googleapis.com/magentadata/js/checkpoints/music_rnn/drum_kit_rnn"
          );
          await rnn.initialize();
          musicRnnRef.current = rnn;
          console.log("✅ MusicRNN loaded successfully");
        }

        setStatus("Ready to produce!");
        setProgress(0);
        setIsReady(true);
        console.log("✅ System ready for Cameroonian music production");
      } catch (error) {
        console.error("Failed to load AI models:", error);
        setStatus(
          `Error: ${
            error instanceof Error ? error.message : "Could not load AI models"
          }`
        );
        setProgress(0);
      } finally {
        isInitializing.current = false;
      }
    }

    loadModels();
  }, []);

  // Monitor Tone.js Transport state
  useEffect(() => {
    const checkPlayState = () => {
      if (Tone.Transport.state === "started") {
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    };

    const interval = setInterval(checkPlayState, 100);
    return () => clearInterval(interval);
  }, []);

  const detectVocalTempo = useCallback(
    async (audioBuffer: AudioBuffer): Promise<number> => {
      console.log("🎼 Detecting vocal tempo...");

      const channelData = audioBuffer.getChannelData(0);
      const sampleRate = audioBuffer.sampleRate;

      const windowSize = Math.floor(sampleRate * 0.05);
      const hopSize = Math.floor(windowSize / 2);
      const energies: number[] = [];

      for (let i = 0; i < channelData.length - windowSize; i += hopSize) {
        let energy = 0;
        for (let j = 0; j < windowSize; j++) {
          energy += channelData[i + j] * channelData[i + j];
        }
        energies.push(Math.sqrt(energy / windowSize));
      }

      const threshold =
        (energies.reduce((a, b) => a + b, 0) / energies.length) * 1.5;
      const onsets: number[] = [];

      for (let i = 1; i < energies.length - 1; i++) {
        if (
          energies[i] > threshold &&
          energies[i] > energies[i - 1] &&
          energies[i] > energies[i + 1]
        ) {
          onsets.push((i * hopSize) / sampleRate);
        }
      }

      if (onsets.length < 2) {
        console.warn("⚠️ Could not detect tempo, using genre default");
        return 0;
      }

      const intervals: number[] = [];
      for (let i = 1; i < onsets.length; i++) {
        intervals.push(onsets[i] - onsets[i - 1]);
      }

      intervals.sort((a, b) => a - b);
      const medianInterval = intervals[Math.floor(intervals.length / 2)];
      const bpm = Math.round(60 / medianInterval);

      let adjustedBpm = bpm;
      if (bpm < 60) adjustedBpm = bpm * 2;
      if (bpm > 200) adjustedBpm = bpm / 2;

      console.log(`🎯 Detected vocal tempo: ${adjustedBpm} BPM`);
      return adjustedBpm;
    },
    []
  );

  const getGenreRhythm = useCallback(
    (genre: string): typeof CAMEROON_RHYTHMS.bikutsi => {
      const normalizedGenre = genre.toLowerCase();
      if (normalizedGenre in CAMEROON_RHYTHMS) {
        return CAMEROON_RHYTHMS[
          normalizedGenre as keyof typeof CAMEROON_RHYTHMS
        ];
      }
      return CAMEROON_RHYTHMS.afrobeats;
    },
    []
  );

  const expandPattern = useCallback(
    (
      shortPattern: (string | null)[],
      variations: number = 2
    ): (string | null)[] => {
      const fullPattern: (string | null)[] = [];
      const patternLength = shortPattern.length;
      const repetitions = Math.ceil(64 / patternLength);

      for (let rep = 0; rep < repetitions; rep++) {
        for (let i = 0; i < patternLength && fullPattern.length < 64; i++) {
          if (rep % 2 === 1 && Math.random() > 0.7) {
            if (shortPattern[i] && Math.random() > 0.5) {
              fullPattern.push(null);
            } else if (!shortPattern[i] && Math.random() > 0.8) {
              fullPattern.push(
                shortPattern[Math.floor(Math.random() * patternLength)] || null
              );
            } else {
              fullPattern.push(shortPattern[i]);
            }
          } else {
            fullPattern.push(shortPattern[i]);
          }
        }
      }

      return fullPattern.slice(0, 64);
    },
    []
  );

  const analyzeVocalIntensity = useCallback(
    (audioBuffer: AudioBuffer): number[] => {
      const channelData = audioBuffer.getChannelData(0);
      const segmentSize = Math.floor(channelData.length / 16);
      const intensities: number[] = [];

      for (let i = 0; i < 16; i++) {
        const start = i * segmentSize;
        const end = Math.min(start + segmentSize, channelData.length);
        let rms = 0;

        for (let j = start; j < end; j++) {
          rms += channelData[j] * channelData[j];
        }

        intensities.push(Math.sqrt(rms / (end - start)));
      }

      const max = Math.max(...intensities);
      return intensities.map((i) => (max > 0 ? i / max : 0));
    },
    []
  );

  const startRecording = useCallback(async () => {
    try {
      const dest = Tone.getDestination();
      const stream = (
        dest as any
      ).context.rawContext.createMediaStreamDestination().stream;

      recordedChunksRef.current = [];
      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        console.log("🎵 Audio recording saved:", url);
      };

      recorderRef.current = recorder;
      recorder.start();
      console.log("🔴 Started recording...");
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
      console.log("⏹️ Stopped recording");
    }
  }, []);

  const cleanup = useCallback(() => {
    try {
      Tone.Transport.stop();
      Tone.Transport.cancel();
      generatedAudio.forEach((obj) => {
        if (obj && typeof obj.dispose === "function") {
          obj.dispose();
        }
      });
      setGeneratedAudio([]);
      setIsReadyToPlay(false);
      setIsPlaying(false);
    } catch (error) {
      console.error("Cleanup error:", error);
    }
  }, [generatedAudio]);

  const generate = useCallback(
    async (vocalFile: File, genre: string) => {
      if (!vocalFile || !isReady) {
        console.warn("Generate called before AI is ready or without a file.");
        return;
      }

      cleanup();

      try {
        console.log(`🎬 Starting ${genre.toUpperCase()} production...`);

        const genreRhythm = getGenreRhythm(genre);
        console.log(
          `🥁 Using authentic ${genre} rhythm: ${genreRhythm.description}`
        );

        setStatus(`Analyzing vocals for ${genre} production...`);
        setProgress(10);

        const vocalFileURL = URL.createObjectURL(vocalFile);
        const audioContext = new AudioContext();
        const audioData = await fetch(vocalFileURL).then((res) =>
          res.arrayBuffer()
        );
        const audioBuffer = await audioContext.decodeAudioData(audioData);

        setStatus("Detecting tempo...");
        setProgress(25);

        const detectedBpm = await detectVocalTempo(audioBuffer);
        const finalBpm =
          detectedBpm > 60 ? detectedBpm : genreRhythm.defaultBpm;

        console.log(
          `🎼 Final tempo: ${finalBpm} BPM (${genreRhythm.timeSignature} time)`
        );

        setStatus("Analyzing vocal intensity...");
        setProgress(35);

        const intensities = analyzeVocalIntensity(audioBuffer);

        setStatus(`Creating authentic ${genre} rhythm...`);
        setProgress(50);

        const kickPattern = expandPattern(genreRhythm.kickPattern);
        const snarePattern = expandPattern(genreRhythm.snarePattern);
        const hihatPattern = expandPattern(genreRhythm.hihatPattern);

        const adaptedPattern: AiPattern = {
          kick: kickPattern.map((hit, i) => {
            const section = Math.floor(i / 4);
            const intensity = intensities[section] || 0.5;
            if (hit && intensity < 0.3 && Math.random() > 0.7) return null;
            return hit;
          }),
          snare: snarePattern.map((hit, i) => {
            const section = Math.floor(i / 4);
            const intensity = intensities[section] || 0.5;
            if (!hit && intensity > 0.8 && Math.random() > 0.85) return "D1";
            return hit;
          }),
          hihat: hihatPattern,
        };

        setStatus("Loading authentic drum sounds...");
        setProgress(65);

        await Tone.start();
        Tone.Transport.bpm.value = finalBpm;

        const kitPath = `/drum_kits/${genre}_kit/`;

        const drumSampler = new Tone.Sampler({
          urls: {
            C1: "kick.mp3",
            D1: "snare.mp3",
            E1: "hi-hat.mp3",
          },
          baseUrl: kitPath,
          onload: () => console.log(`✅ ${genre} drum kit loaded`),
        }).toDestination();

        const vocalPlayer = new Tone.Player(vocalFileURL).toDestination();

        const bassSynth = new Tone.MonoSynth({
          oscillator: { type: "sawtooth" },
          envelope: {
            attack: genre === "bikutsi" ? 0.005 : 0.01,
            release: genre === "bikutsi" ? 0.3 : 0.8,
          },
        }).toDestination();
        bassSynth.volume.value = -8;

        const padSynth = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: "triangle" },
          envelope: { attack: 0.5, release: 2 },
        }).toDestination();
        padSynth.volume.value = -16;

        setStatus(`Arranging ${genre} track...`);
        setProgress(80);

        const progressions = {
          C_Major: {
            chords: [
              { time: "0:0", notes: ["C3", "E3", "G3", "C4"] },
              { time: "2:0", notes: ["F3", "A3", "C4", "F4"] },
            ],
            bass: [
              { time: "0:0", note: "C2" },
              { time: "1:0", note: "C2" },
              { time: "2:0", note: "F2" },
              { time: "3:0", note: "F2" },
            ],
          },
        };

        const selectedProgression = progressions.C_Major;

        const kickSeq = new Tone.Sequence(
          (time, note) => {
            if (note) drumSampler.triggerAttack(note, time, 0.9);
          },
          adaptedPattern.kick,
          "16n"
        ).start(0);

        const snareSeq = new Tone.Sequence(
          (time, note) => {
            if (note) drumSampler.triggerAttack(note, time, 0.8);
          },
          adaptedPattern.snare,
          "16n"
        ).start(0);

        const hihatSeq = new Tone.Sequence(
          (time, note) => {
            if (note) drumSampler.triggerAttack(note, time, 0.6);
          },
          adaptedPattern.hihat,
          "16n"
        ).start(0);

        const bassPart = new Tone.Part((time, value) => {
          bassSynth.triggerAttackRelease(value.note, "8n", time);
        }, selectedProgression.bass).start(0);
        bassPart.loop = 32;
        bassPart.loopEnd = "4m";

        const padPart = new Tone.Part((time, value) => {
          padSynth.triggerAttackRelease(value.notes, "2m", time);
        }, selectedProgression.chords).start(0);
        padPart.loop = 32;
        padPart.loopEnd = "4m";

        setStatus("Finalizing production...");
        setProgress(95);

        await Tone.loaded();

        setGeneratedAudio([
          vocalPlayer,
          drumSampler,
          bassSynth,
          padSynth,
          kickSeq,
          snareSeq,
          hihatSeq,
          bassPart,
          padPart,
        ]);

        setStatus(
          `${genre.toUpperCase()} Production Complete! 🎉 (${finalBpm} BPM)`
        );
        setProgress(100);
        setIsReadyToPlay(true);

        vocalPlayer.sync().start(0);

        console.log(`🎊 Authentic ${genre} production complete!`);
      } catch (error) {
        console.error("❌ Generation error:", error);
        setStatus(
          `Error: ${
            error instanceof Error ? error.message : "Production failed"
          }`
        );
        setProgress(0);
      }
    },
    [
      isReady,
      cleanup,
      detectVocalTempo,
      getGenreRhythm,
      expandPattern,
      analyzeVocalIntensity,
    ]
  );

  const play = async () => {
    if (isReadyToPlay) {
      try {
        await Tone.start();

        // Start recording when playback starts
        if (!audioUrl) {
          await startRecording();
        }

        Tone.Transport.start();
        setIsPlaying(true);
        console.log("▶️ Playback started");
      } catch (error) {
        console.error("Play error:", error);
      }
    }
  };

  const pause = () => {
    if (isReadyToPlay && isPlaying) {
      try {
        Tone.Transport.pause();
        setIsPlaying(false);
        console.log("⏸️ Playback paused");
      } catch (error) {
        console.error("Pause error:", error);
      }
    }
  };

  const stop = () => {
    if (isReadyToPlay) {
      try {
        Tone.Transport.stop();
        Tone.Transport.position = 0;
        setIsPlaying(false);

        // Stop recording when playback stops
        stopRecording();

        console.log("⏹️ Playback stopped");
      } catch (error) {
        console.error("Stop error:", error);
      }
    }
  };

  const getAudioUrl = useCallback(() => {
    return audioUrl;
  }, [audioUrl]);

  return {
    status,
    progress,
    isReady,
    isReadyToPlay,
    isPlaying,
    generate,
    play,
    pause,
    stop,
    getAudioUrl,
  };
}
