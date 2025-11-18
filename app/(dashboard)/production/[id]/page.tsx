"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Mic,
  Music,
  FileText,
  Package,
  CheckCircle,
  Check,
} from "lucide-react";

// Interfaces
interface SongData {
  id: string;
  title: string;
  genre: string;
  mood: string;
  artistName: string;
  fileName?: string;
  createdAt?: string;
}

interface EpkData {
  biography: string;
  pressRelease: string;
  socialBlurbs: string[];
  albumArt: string | null;
}

// Configuration for our UI
const STAGES = [
  // ... (STAGES array remains the same)
  { name: "Analyzing Vocal", icon: Mic, start: 0, end: 20 },
  { name: "Generating Instrumental", icon: Music, start: 20, end: 60 },
  { name: "Creating Press Kit", icon: FileText, start: 60, end: 90 },
  {
    name: "Preparing Distribution Package",
    icon: Package,
    start: 90,
    end: 100,
  },
];

export default function ProductionPage() {
  const router = useRouter();
  const [songData, setSongData] = useState<SongData | null>(null);
  const [progress, setProgress] = useState(0);
  const [isGeneratingEpk, setIsGeneratingEpk] = useState(false);

  useEffect(() => {
    const storedData = sessionStorage.getItem("currentSong");
    if (storedData) {
      const parsedData: SongData = JSON.parse(storedData);
      console.log("Loaded song data:", parsedData);
      setSongData(parsedData);

      // --- THIS IS THE FIX ---
      // Save the newly created song to our persistent list in localStorage.
      // This ensures the dashboard will see it.
      const allSongsString = localStorage.getItem("allSongs");
      const allSongs: SongData[] = allSongsString
        ? JSON.parse(allSongsString)
        : [];

      // Avoid adding duplicates if the page is reloaded
      if (!allSongs.find((song) => song.id === parsedData.id)) {
        allSongs.unshift(parsedData); // Add new song to the beginning of the list
        localStorage.setItem("allSongs", JSON.stringify(allSongs));
        console.log("Saved new song to localStorage. All songs:", allSongs);
      }
      // --------------------
    } else {
      console.warn("No song data found, redirecting to dashboard");
      router.push("/dashboard");
      return;
    }

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 120);

    return () => clearInterval(progressInterval);
  }, [router]);

  // ... (the rest of the component remains exactly the same)

  useEffect(() => {
    if (progress >= 100 && !isGeneratingEpk && songData) {
      generateEpkAndRedirect();
    }
  }, [progress, isGeneratingEpk, songData]);

  const generateEpkAndRedirect = async () => {
    if (!songData) {
      console.error("No song data available for EPK generation");
      return;
    }

    setIsGeneratingEpk(true);
    console.log("Starting EPK generation with data:", songData);

    try {
      // Ensure we have all required fields
      const requestPayload = {
        title: songData.title,
        genre: songData.genre,
        mood: songData.mood,
        artistName: songData.artistName || "Unknown Artist", // Fallback
      };

      console.log("Sending EPK request with payload:", requestPayload);

      const response = await fetch("/api/generate-epk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });

      console.log("EPK response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("EPK API error:", errorData);
        throw new Error(errorData.error || "Failed to fetch EPK data");
      }

      const data: EpkData = await response.json();
      console.log("EPK generated successfully:", data);

      sessionStorage.setItem("currentEpk", JSON.stringify(data));

      // Small delay for user experience
      setTimeout(() => {
        router.push(`/release/${songData.id}`);
      }, 1000);
    } catch (error) {
      console.error("EPK Generation failed:", error);

      // Create fallback EPK with better messaging
      const fallbackEpk: EpkData = {
        biography: `${songData.artistName} is an innovative ${songData.genre} artist from Cameroon, creating a unique fusion of traditional African rhythms and contemporary production. Their latest track "${songData.title}" showcases a ${songData.mood} atmosphere that captures the vibrant essence of Cameroonian musical heritage.`,
        pressRelease: `FOR IMMEDIATE RELEASE\n\n${songData.artistName} Releases "${songData.title}"\n\nCameroonian artist ${songData.artistName} today unveiled their latest single "${songData.title}", a captivating ${songData.genre} track that masterfully blends traditional African rhythms with contemporary production. The ${songData.mood} atmosphere showcases their ability to honor cultural heritage while innovating for modern audiences.\n\nAvailable now on all major streaming platforms.`,
        socialBlurbs: [
          `🎵 NEW MUSIC! "${songData.title}" by ${songData.artistName} is OUT NOW! Experience ${songData.mood} ${songData.genre} vibes from Cameroon 🇨🇲✨ #CameroonMusic #NewMusic`,
          `From my heart to your speakers. My new track "${
            songData.title
          }" is here! Stream it now! 💫 #${songData.genre.replace(/\s+/g, "")}`,
          `Ready for your new favorite song? "${songData.title}" is live! Turn it up! 🚀 #MusicDiscovery #StreamNow`,
        ],
        albumArt: null,
      };

      sessionStorage.setItem("currentEpk", JSON.stringify(fallbackEpk));

      // Still redirect to release page
      setTimeout(() => {
        router.push(`/release/${songData.id}`);
      }, 1000);
    }
  };

  const currentStageIndex = STAGES.findIndex(
    (s) => progress >= s.start && progress < s.end
  );
  const currentStage = STAGES[currentStageIndex] || STAGES[STAGES.length - 1];

  if (!songData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e14] to-[#1a1f2e] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e14] to-[#1a1f2e] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">
        {/* Header */}
        <h1 className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-yellow-300 bg-clip-text text-transparent">
          {progress < 100 ? "Creation in Progress..." : "Creation Complete!"}
        </h1>
        <p className="text-lg text-gray-400 mb-12">
          Your track{" "}
          <span className="font-bold text-yellow-400">{songData.title}</span> is
          coming to life.
        </p>

        {/* Central Animation */}
        <div className="relative w-full h-48 flex justify-center items-center mb-12">
          {/* Pulsing Background Glow */}
          <div
            className={`absolute w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl transition-opacity duration-1000 ${
              progress < 100 ? "animate-pulse" : "opacity-0"
            }`}
          ></div>

          {/* Center Icon Circle */}
          <div className="relative z-10 w-32 h-32 bg-[#1e2936] rounded-full flex items-center justify-center border-4 border-yellow-500 shadow-2xl shadow-yellow-500/20">
            {progress < 100 ? (
              <currentStage.icon className="w-16 h-16 text-yellow-500 animate-in fade-in duration-500" />
            ) : (
              <CheckCircle className="w-20 h-20 text-green-400 animate-in fade-in scale-110 duration-500" />
            )}
          </div>

          {/* Rotating Ring with Progress Indicator */}
          <div className="absolute w-64 h-64 border-2 border-dashed border-gray-700 rounded-full animate-spin-slow">
            <div
              className="absolute -top-2 left-1/2 -ml-2 w-4 h-4 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50 transition-transform duration-300"
              style={{
                transform: `rotate(${
                  progress * 3.6
                }deg) translateX(128px) rotate(-${progress * 3.6}deg)`,
              }}
            ></div>
          </div>
        </div>

        {/* Progress Number */}
        <div className="mb-8">
          <div className="text-6xl font-bold text-yellow-500 mb-2">
            {progress}%
          </div>
          <div className="text-sm text-gray-400 uppercase tracking-wider">
            {currentStage.name}
          </div>
        </div>

        {/* Stage List */}
        <div className="space-y-4 w-full max-w-md mx-auto">
          {STAGES.map((stage, index) => {
            const isActive = index === currentStageIndex;
            const isComplete = progress >= stage.end;
            return (
              <div
                key={stage.name}
                className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 ${
                  isActive
                    ? "bg-yellow-500/10 border-yellow-500"
                    : isComplete
                    ? "bg-green-500/10 border-green-500/30"
                    : "bg-[#1e2936]/50 border-gray-700"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                    isActive
                      ? "bg-yellow-500"
                      : isComplete
                      ? "bg-green-500"
                      : "bg-gray-600"
                  }`}
                >
                  {isComplete ? (
                    <Check className="w-5 h-5 text-black" />
                  ) : (
                    <stage.icon
                      className={`w-5 h-5 ${
                        isActive ? "text-black" : "text-white"
                      }`}
                    />
                  )}
                </div>
                <p
                  className={`font-medium transition-colors duration-300 ${
                    isActive
                      ? "text-yellow-300"
                      : isComplete
                      ? "text-green-300"
                      : "text-gray-400"
                  }`}
                >
                  {stage.name}
                </p>
                {isActive && (
                  <Loader2 className="w-5 h-5 ml-auto text-yellow-400 animate-spin" />
                )}
              </div>
            );
          })}
        </div>

        {/* Completion Message */}
        {progress >= 100 && (
          <div className="mt-12 animate-in fade-in duration-700">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-6 mb-4">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="text-lg font-semibold text-green-300 mb-2">
                Your track is ready! 🎉
              </p>
              <p className="text-sm text-gray-400">
                {isGeneratingEpk
                  ? "Generating your press kit and distribution package..."
                  : "Redirecting to your Release Dashboard..."}
              </p>
            </div>
          </div>
        )}
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
          animation: spin-slow 15s linear infinite;
        }
      `}</style>
    </div>
  );
}
