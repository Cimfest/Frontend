"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useSongStore } from "@/lib/store";
import { useAiMusicGenerator } from "@/hooks/useAiMusicGenerator";
import {
  Loader2,
  Mic,
  Music,
  FileText,
  Package,
  Sparkles,
  Radio,
  Play,
  Pause,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Interfaces
interface SongData {
  id: string;
  title: string;
  genre: string;
  mood: string;
  artistName: string;
  fileName?: string;
  createdAt?: string;
  status?: "production" | "ready" | "distributed";
  audioUrl?: string;
}

interface EpkData {
  biography: string;
  pressRelease: string;
  socialBlurbs: string[];
  albumArt: string | null;
}

// Configuration for our UI
const STAGES = [
  { name: "Analyzing Vocals", icon: Mic, color: "from-purple-500 to-pink-500" },
  { name: "Generating Beat", icon: Music, color: "from-blue-500 to-cyan-500" },
  {
    name: "Creating Press Kit",
    icon: FileText,
    color: "from-green-500 to-emerald-500",
  },
  {
    name: "Finalizing Track",
    icon: Package,
    color: "from-yellow-500 to-orange-500",
  },
];

export default function ProductionPage() {
  const router = useRouter();
  const params = useParams();
  const { title, genre, vocalFile, artistName, mood } = useSongStore();
  const {
    status,
    progress,
    isReady,
    isReadyToPlay,
    isPlaying,
    generate,
    play,
    pause,
    stop,
  } = useAiMusicGenerator();

  const [songData, setSongData] = useState<SongData | null>(null);
  const [hasStartedProduction, setHasStartedProduction] = useState(false);
  const [isPreparingRelease, setIsPreparingRelease] = useState(false);

  // Initialize song data
  useEffect(() => {
    if (vocalFile && title && genre) {
      const songId = (params?.id as string) || Date.now().toString();
      const newSongData: SongData = {
        id: songId,
        title,
        genre,
        mood: mood || "energetic",
        artistName: artistName || "Artist",
        fileName: vocalFile.name,
        createdAt: new Date().toISOString(),
        status: "production",
      };

      setSongData(newSongData);
      sessionStorage.setItem("currentSong", JSON.stringify(newSongData));

      const allSongsString = localStorage.getItem("allSongs");
      const allSongs: SongData[] = allSongsString
        ? JSON.parse(allSongsString)
        : [];

      const existingIndex = allSongs.findIndex(
        (song) => song.id === newSongData.id
      );
      if (existingIndex >= 0) {
        allSongs[existingIndex] = newSongData;
      } else {
        allSongs.unshift(newSongData);
      }
      localStorage.setItem("allSongs", JSON.stringify(allSongs));
      console.log("✅ Saved song to localStorage with production status");
    } else {
      const storedData = sessionStorage.getItem("currentSong");
      if (storedData) {
        setSongData(JSON.parse(storedData));
      } else {
        console.warn("No song data found, redirecting to dashboard");
        router.push("/dashboard");
      }
    }
  }, [vocalFile, title, genre, mood, artistName, params, router]);

  // Auto-start production when ready
  useEffect(() => {
    if (isReady && vocalFile && genre && !hasStartedProduction && songData) {
      console.log("🎬 Auto-starting production...");
      setHasStartedProduction(true);
      generate(vocalFile, genre);
    }
  }, [isReady, vocalFile, genre, hasStartedProduction, generate, songData]);

  const handleReleaseClick = async () => {
    if (!songData) return;

    setIsPreparingRelease(true);

    // Stop playback if playing
    if (isPlaying) {
      stop();
    }

    console.log("📝 Preparing release...");

    try {
      // Generate EPK
      const requestPayload = {
        title: songData.title,
        genre: songData.genre,
        mood: songData.mood,
        artistName: songData.artistName || "Unknown Artist",
      };

      const response = await fetch("/api/generate-epk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });

      if (!response.ok) {
        throw new Error("Failed to generate EPK");
      }

      const data: EpkData = await response.json();
      console.log("✅ EPK generated successfully");

      sessionStorage.setItem("currentEpk", JSON.stringify(data));

      // Check if we have audio URL from sessionStorage
      const audioUrl = sessionStorage.getItem("currentAudioUrl");
      if (audioUrl) {
        const updatedSongData = {
          ...songData,
          audioUrl,
          status: "ready" as const,
        };
        sessionStorage.setItem("currentSong", JSON.stringify(updatedSongData));
        updateSongStatusAndAudio(songData.id, "ready", audioUrl);
      } else {
        updateSongStatus(songData.id, "ready");
      }

      // Navigate to release page
      setTimeout(() => {
        router.push(`/release/${songData.id}`);
      }, 1000);
    } catch (error) {
      console.error("EPK Generation failed:", error);

      // Create fallback EPK
      const fallbackEpk: EpkData = {
        biography: `${songData.artistName} is an innovative ${songData.genre} artist from Cameroon, creating a unique fusion of traditional African rhythms and contemporary production.`,
        pressRelease: `FOR IMMEDIATE RELEASE\n\n${songData.artistName} Releases "${songData.title}"\n\nAvailable now on all major streaming platforms.`,
        socialBlurbs: [
          `🎵 NEW MUSIC! "${songData.title}" by ${songData.artistName} is OUT NOW! #CameroonMusic #NewMusic`,
        ],
        albumArt: null,
      };

      sessionStorage.setItem("currentEpk", JSON.stringify(fallbackEpk));

      const audioUrl = sessionStorage.getItem("currentAudioUrl");
      if (audioUrl) {
        const updatedSongData = {
          ...songData,
          audioUrl,
          status: "ready" as const,
        };
        sessionStorage.setItem("currentSong", JSON.stringify(updatedSongData));
        updateSongStatusAndAudio(songData.id, "ready", audioUrl);
      } else {
        updateSongStatus(songData.id, "ready");
      }

      setTimeout(() => {
        router.push(`/release/${songData.id}`);
      }, 1000);
    }
  };

  const updateSongStatus = (
    songId: string,
    newStatus: "production" | "ready" | "distributed"
  ) => {
    const allSongsString = localStorage.getItem("allSongs");
    if (allSongsString) {
      const allSongs: SongData[] = JSON.parse(allSongsString);
      const songIndex = allSongs.findIndex((s) => s.id === songId);
      if (songIndex >= 0) {
        allSongs[songIndex].status = newStatus;
        localStorage.setItem("allSongs", JSON.stringify(allSongs));
        console.log(`✅ Updated song ${songId} status to ${newStatus}`);
      }
    }
  };

  const updateSongStatusAndAudio = (
    songId: string,
    newStatus: "production" | "ready" | "distributed",
    audioUrl: string
  ) => {
    const allSongsString = localStorage.getItem("allSongs");
    if (allSongsString) {
      const allSongs: SongData[] = JSON.parse(allSongsString);
      const songIndex = allSongs.findIndex((s) => s.id === songId);
      if (songIndex >= 0) {
        allSongs[songIndex].status = newStatus;
        allSongs[songIndex].audioUrl = audioUrl;
        localStorage.setItem("allSongs", JSON.stringify(allSongs));
        console.log(`✅ Updated song ${songId} with audio URL`);
      }
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const handleRestart = () => {
    stop();
  };

  const currentStageIndex = Math.floor(progress / 25);
  const currentStage = STAGES[Math.min(currentStageIndex, STAGES.length - 1)];

  if (!songData || !isReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e14] via-[#0f1419] to-[#1a1f2e] text-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-ping"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center"></div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Initializing AI Studio</h2>
          <p className="text-gray-400">{status}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e14] via-[#0f1419] to-[#1a1f2e] text-white overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/3 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Radio className="w-8 h-8 text-yellow-500 animate-pulse" />
              <h1 className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-white via-yellow-200 to-yellow-500 bg-clip-text text-transparent">
                {progress < 100 ? "AI Studio" : "Ready to Release!"}
              </h1>
            </div>
            <p className="text-xl sm:text-2xl text-gray-300 font-bold mb-2">
              {songData.title}
            </p>
            <p className="text-sm text-gray-500 uppercase tracking-widest">
              {songData.genre} • {songData.artistName}
            </p>
          </div>

          {/* Main Progress Circle */}
          <div className="relative w-full max-w-md mx-auto mb-12">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`w-80 h-80 rounded-full border-4 border-dashed ${
                  progress < 100
                    ? "border-gray-700 animate-spin-slow"
                    : "border-green-500/30"
                }`}
              ></div>
            </div>

            {/* Progress ring */}
            <svg className="w-80 h-80 mx-auto transform -rotate-90">
              <circle
                cx="160"
                cy="160"
                r="140"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="8"
              />
              <circle
                cx="160"
                cy="160"
                r="140"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 140}`}
                strokeDashoffset={`${2 * Math.PI * 140 * (1 - progress / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
              <defs>
                <linearGradient
                  id="gradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#f97316" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div
                  className={`w-32 h-32 mx-auto mb-4 rounded-full bg-gradient-to-br ${
                    currentStage.color
                  } flex items-center justify-center shadow-2xl ${
                    progress < 100 ? "animate-pulse" : ""
                  }`}
                >
                  {progress >= 100 ? (
                    <Sparkles className="w-16 h-16 text-white" />
                  ) : (
                    <currentStage.icon className="w-16 h-16 text-white" />
                  )}
                </div>
                <div className="text-7xl font-black bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
                  {Math.round(progress)}%
                </div>
                <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">
                  {progress >= 100 ? "Production Complete" : currentStage.name}
                </p>
              </div>
            </div>
          </div>

          {/* Status Message */}
          <div className="text-center mb-8">
            <p className="text-gray-400 text-sm">
              {progress >= 100
                ? "🎉 Your track is ready! Preview it below or proceed to release."
                : status}
            </p>
          </div>

          {/* Stage Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto mb-8">
            {STAGES.map((stage, index) => {
              const stageProgress = (index / STAGES.length) * 100;
              const isActive =
                progress >= stageProgress && progress < stageProgress + 25;
              const isComplete = progress > stageProgress + 25;

              return (
                <div
                  key={stage.name}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-500 ${
                    isActive
                      ? `bg-gradient-to-br ${stage.color} border-transparent shadow-lg scale-105`
                      : isComplete
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-[#1e2936]/30 border-gray-800/50"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        isActive
                          ? "bg-white/20"
                          : isComplete
                          ? "bg-green-500/20"
                          : "bg-[#0a0e14]/50"
                      }`}
                    >
                      <stage.icon
                        className={`w-6 h-6 ${
                          isActive
                            ? "text-white"
                            : isComplete
                            ? "text-green-400"
                            : "text-gray-500"
                        }`}
                      />
                    </div>
                    <p
                      className={`text-xs font-semibold text-center leading-tight ${
                        isActive
                          ? "text-white"
                          : isComplete
                          ? "text-green-300"
                          : "text-gray-500"
                      }`}
                    >
                      {stage.name}
                    </p>
                  </div>
                  {isActive && (
                    <div className="absolute inset-0 bg-white/5 rounded-xl animate-pulse"></div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Waveform Visualization */}
          {progress > 0 && progress < 100 && (
            <div className="flex items-center justify-center gap-1 h-20 mb-8">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-yellow-500 to-orange-500 rounded-full"
                  style={{
                    height: `${20 + Math.random() * 60}%`,
                    animation: `wave 0.8s ease-in-out infinite`,
                    animationDelay: `${i * 0.02}s`,
                  }}
                ></div>
              ))}
            </div>
          )}

          {/* Playback Controls - Show when ready */}
          {progress >= 100 && isReadyToPlay && (
            <div className="text-center mb-8">
              <div className="inline-block p-8 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-2xl backdrop-blur-sm">
                <h2 className="text-2xl font-black text-green-300 mb-4">
                  🎵 Preview Your Track
                </h2>

                {/* Playback Controls */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Button
                    onClick={handleRestart}
                    size="lg"
                    variant="outline"
                    className="border-gray-700 hover:bg-[#1e2936] hover:border-gray-600 text-white"
                    disabled={isPreparingRelease}
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Restart
                  </Button>

                  <Button
                    onClick={handlePlayPause}
                    size="lg"
                    className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-8 shadow-lg hover:shadow-xl transition-all"
                    disabled={isPreparingRelease}
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-6 h-6 mr-2 fill-black" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-6 h-6 mr-2 fill-black" />
                        Play
                      </>
                    )}
                  </Button>
                </div>

                {/* Animated waveform when playing */}
                {isPlaying && (
                  <div className="flex items-center justify-center gap-1 h-16 mb-6">
                    {[...Array(40)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 bg-gradient-to-t from-green-500 to-emerald-400 rounded-full"
                        style={{
                          height: `${30 + Math.random() * 60}%`,
                          animation: `wave 0.6s ease-in-out infinite`,
                          animationDelay: `${i * 0.03}s`,
                        }}
                      ></div>
                    ))}
                  </div>
                )}

                {/* Release Button */}
                <div className="pt-4 border-t border-green-500/20">
                  <p className="text-sm text-gray-400 mb-4">
                    Ready to share your masterpiece with the world?
                  </p>
                  <Button
                    onClick={handleReleaseClick}
                    size="lg"
                    className=" text-white font-bold px-10 py-6 text-lg shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105"
                    disabled={isPreparingRelease}
                  >
                    {isPreparingRelease ? (
                      <>
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                        Preparing Release...
                      </>
                    ) : (
                      <>Proceed to Release Dashboard</>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        @keyframes wave {
          0%,
          100% {
            transform: scaleY(1);
          }
          50% {
            transform: scaleY(1.5);
          }
        }
      `}</style>
    </div>
  );
}
