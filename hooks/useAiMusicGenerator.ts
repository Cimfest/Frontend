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
    // Fast, syncopated 6/8 pattern - characteristic Bikutsi groove
    kickPattern: [
      "C1",
      null,
      null,
      "C1",
      null,
      null, // Bar 1
      "C1",
      null,
      null,
      null,
      null,
      "C1", // Bar 2
      "C1",
      null,
      null,
      "C1",
      null,
      null, // Bar 3
      null,
      null,
      "C1",
      null,
      null,
      "C1", // Bar 4
    ],
    // Bikutsi snare: emphasizes the polyrhythm
    snarePattern: [
      null,
      null,
      "D1",
      null,
      null,
      "D1", // Bar 1
      null,
      "D1",
      null,
      null,
      "D1",
      null, // Bar 2
      null,
      null,
      "D1",
      null,
      null,
      "D1", // Bar 3
      null,
      "D1",
      null,
      "D1",
      null,
      null, // Bar 4
    ],
    // Fast hi-hat pattern characteristic of Bikutsi
    hihatPattern: [
      "E1",
      null,
      "E1",
      "E1",
      null,
      "E1", // Bar 1
      "E1",
      "E1",
      null,
      "E1",
      "E1",
      null, // Bar 2
      "E1",
      null,
      "E1",
      "E1",
      null,
      "E1", // Bar 3
      "E1",
      "E1",
      null,
      "E1",
      "E1",
      "E1", // Bar 4
    ],
    description: "Fast syncopated 6/8 rhythm with polyrhythmic layers",
  },

  makossa: {
    defaultBpm: 130,
    timeSignature: "4/4",
    // Makossa's signature groove - emphasis on 2 and 4 with African swing
    kickPattern: [
      "C1",
      null,
      null,
      null,
      "C1",
      null,
      null,
      null, // Bar 1
      "C1",
      null,
      null,
      "C1",
      null,
      null,
      "C1",
      null, // Bar 2
      "C1",
      null,
      null,
      null,
      "C1",
      null,
      null,
      null, // Bar 3
      "C1",
      null,
      "C1",
      null,
      null,
      null,
      "C1",
      null, // Bar 4
    ],
    // Classic Makossa snare pattern
    snarePattern: [
      null,
      null,
      null,
      null,
      "D1",
      null,
      null,
      null, // Bar 1
      null,
      null,
      null,
      null,
      "D1",
      null,
      null,
      "D1", // Bar 2
      null,
      null,
      null,
      null,
      "D1",
      null,
      null,
      null, // Bar 3
      null,
      null,
      null,
      "D1",
      "D1",
      null,
      null,
      null, // Bar 4
    ],
    // Makossa hi-hat with swing feel
    hihatPattern: [
      "E1",
      null,
      "E1",
      "E1",
      null,
      "E1",
      "E1",
      null, // Bar 1
      "E1",
      "E1",
      null,
      "E1",
      null,
      "E1",
      "E1",
      null, // Bar 2
      "E1",
      null,
      "E1",
      "E1",
      null,
      "E1",
      "E1",
      null, // Bar 3
      "E1",
      "E1",
      null,
      "E1",
      "E1",
      null,
      "E1",
      "E1", // Bar 4
    ],
    description: "Groove-heavy 4/4 with African swing and syncopation",
  },

  mbole: {
    defaultBpm: 120,
    timeSignature: "12/8",
    // Mbolé traditional pattern - talking drum conversation style
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
      null, // Bar 1
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
      null, // Bar 2
    ],
    // Mbolé snare mimics call-and-response
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
      null, // Bar 1
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
      null, // Bar 2
    ],
    // Traditional African hi-hat pattern
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
      "E1", // Bar 1
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
      "E1", // Bar 2
    ],
    description: "Traditional 12/8 with call-and-response drum conversation",
  },

  afrobeats: {
    defaultBpm: 116,
    timeSignature: "4/4",
    // Modern Afrobeats pattern (for comparison)
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
  const [generatedAudio, setGeneratedAudio] = useState<any[]>([]);

  const musicRnnRef = useRef<MusicRNN | null>(null);
  const isInitializing = useRef(false);

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

  /**
   * Detects tempo from vocal track
   */
  const detectVocalTempo = useCallback(
    async (audioBuffer: AudioBuffer): Promise<number> => {
      console.log("🎼 Detecting vocal tempo...");

      const channelData = audioBuffer.getChannelData(0);
      const sampleRate = audioBuffer.sampleRate;

      // Simple onset detection
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

      // Find peaks
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
        return 0; // Will use genre default
      }

      // Calculate intervals
      const intervals: number[] = [];
      for (let i = 1; i < onsets.length; i++) {
        intervals.push(onsets[i] - onsets[i - 1]);
      }

      // Get median interval
      intervals.sort((a, b) => a - b);
      const medianInterval = intervals[Math.floor(intervals.length / 2)];
      const bpm = Math.round(60 / medianInterval);

      // Ensure reasonable range
      let adjustedBpm = bpm;
      if (bpm < 60) adjustedBpm = bpm * 2;
      if (bpm > 200) adjustedBpm = bpm / 2;

      console.log(`🎯 Detected vocal tempo: ${adjustedBpm} BPM`);
      return adjustedBpm;
    },
    []
  );

  /**
   * Gets the authentic rhythm pattern for the genre
   */
  const getGenreRhythm = useCallback(
    (genre: string): typeof CAMEROON_RHYTHMS.bikutsi => {
      const normalizedGenre = genre.toLowerCase();
      if (normalizedGenre in CAMEROON_RHYTHMS) {
        return CAMEROON_RHYTHMS[
          normalizedGenre as keyof typeof CAMEROON_RHYTHMS
        ];
      }
      // Default to afrobeats if genre not found
      return CAMEROON_RHYTHMS.afrobeats;
    },
    []
  );

  /**
   * Expands short pattern to full 64-step pattern with variations
   */
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
          // Add variation every other repetition
          if (rep % 2 === 1 && Math.random() > 0.7) {
            // Occasionally skip or add a hit for variation
            if (shortPattern[i] && Math.random() > 0.5) {
              fullPattern.push(null); // Skip this hit
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

  /**
   * Analyzes vocal energy to adjust pattern intensity
   */
  const analyzeVocalIntensity = useCallback(
    (audioBuffer: AudioBuffer): number[] => {
      const channelData = audioBuffer.getChannelData(0);
      const segmentSize = Math.floor(channelData.length / 16); // 16 segments
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

      // Normalize
      const max = Math.max(...intensities);
      return intensities.map((i) => (max > 0 ? i / max : 0));
    },
    []
  );

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

        // Get authentic rhythm for this genre
        const genreRhythm = getGenreRhythm(genre);
        console.log(
          `🥁 Using authentic ${genre} rhythm: ${genreRhythm.description}`
        );

        // Stage 1: Analyze vocals
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

        // Stage 2: Create authentic Cameroonian rhythm pattern
        setStatus(`Creating authentic ${genre} rhythm...`);
        setProgress(50);

        // Expand genre-specific patterns to full 64 steps
        const kickPattern = expandPattern(genreRhythm.kickPattern);
        const snarePattern = expandPattern(genreRhythm.snarePattern);
        const hihatPattern = expandPattern(genreRhythm.hihatPattern);

        // Adjust pattern density based on vocal intensity
        const adaptedPattern: AiPattern = {
          kick: kickPattern.map((hit, i) => {
            const section = Math.floor(i / 4); // Which of 16 sections
            const intensity = intensities[section] || 0.5;
            // Keep hits during high intensity, sometimes remove during low
            if (hit && intensity < 0.3 && Math.random() > 0.7) return null;
            return hit;
          }),
          snare: snarePattern.map((hit, i) => {
            const section = Math.floor(i / 4);
            const intensity = intensities[section] || 0.5;
            // Add extra snares during high intensity
            if (!hit && intensity > 0.8 && Math.random() > 0.85) return "D1";
            return hit;
          }),
          hihat: hihatPattern,
        };

        // Stage 3: Create instruments
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

        // Bass line appropriate for the genre
        const bassSynth = new Tone.MonoSynth({
          oscillator: { type: "sawtooth" },
          envelope: {
            attack: genre === "bikutsi" ? 0.005 : 0.01,
            release: genre === "bikutsi" ? 0.3 : 0.8,
          },
        }).toDestination();
        bassSynth.volume.value = -8;

        // Atmospheric synth
        const padSynth = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: "triangle" },
          envelope: { attack: 0.5, release: 2 },
        }).toDestination();
        padSynth.volume.value = -16;

        // Stage 4: Arrange with genre-specific patterns
        setStatus(`Arranging ${genre} track...`);
        setProgress(80);

        // African-influenced chord progressions
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
          G_Major: {
            chords: [
              { time: "0:0", notes: ["G3", "B3", "D4", "G4"] },
              { time: "2:0", notes: ["C3", "E3", "G3", "C4"] },
            ],
            bass: [
              { time: "0:0", note: "G2" },
              { time: "1:0", note: "G2" },
              { time: "2:0", note: "C2" },
              { time: "3:0", note: "C2" },
            ],
          },
        };

        const selectedProgression = progressions.C_Major;

        // Create sequences with authentic patterns
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

        // Final stage
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
        Tone.Transport.start();
        console.log("▶️ Playback started");
      } catch (error) {
        console.error("Play error:", error);
      }
    }
  };

  const stop = () => {
    if (isReadyToPlay) {
      try {
        Tone.Transport.stop();
        Tone.Transport.position = 0;
        console.log("⏹️ Playback stopped");
      } catch (error) {
        console.error("Stop error:", error);
      }
    }
  };

  return { status, progress, isReady, isReadyToPlay, generate, play, stop };
}
