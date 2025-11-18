"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Download,
  Play,
  Pause,
  Loader2,
  Sparkles,
  Copy,
  Check,
  FileText,
  Image as ImageIcon,
  Share2,
  Waves,
} from "lucide-react";
import Image from "next/image";
import DSPExportModal from "@/components/DSPExportModal";

// Interfaces
interface SongData {
  id: string;
  title: string;
  genre: string;
  mood: string;
  fileName: string;
  createdAt: string;
  artistName: string;
}

interface EpkData {
  biography: string;
  pressRelease: string;
  socialBlurbs: string[];
  albumArt: string;
}

export default function ProductionPage() {
  const router = useRouter();
  const [songData, setSongData] = useState<SongData | null>(null);
  const [epkData, setEpkData] = useState<EpkData | null>(null);
  const [isProducing, setIsProducing] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isGeneratingEpk, setIsGeneratingEpk] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"bio" | "press" | "social">("bio");
  const [showDSPModal, setShowDSPModal] = useState(false);

  useEffect(() => {
    const storedData = sessionStorage.getItem("currentSong");
    if (storedData) {
      setSongData(JSON.parse(storedData));
    } else {
      router.push("/dashboard");
      return;
    }

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setIsProducing(false);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, [router]);

  useEffect(() => {
    if (!isProducing && songData && !epkData && !isGeneratingEpk) {
      const generateEpk = async () => {
        setIsGeneratingEpk(true);
        try {
          const response = await fetch("/api/generate-epk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: songData.title,
              genre: songData.genre,
              mood: songData.mood,
              artistName: songData.artistName || "Cameroonian Artist",
            }),
          });
          if (!response.ok) throw new Error("Failed to fetch EPK data");
          const data: EpkData = await response.json();
          setEpkData(data);
        } catch (error) {
          console.error("EPK Generation failed:", error);
        } finally {
          setIsGeneratingEpk(false);
        }
      };
      generateEpk();
    }
  }, [isProducing, songData, epkData, isGeneratingEpk]);

  const handleDownloadPressKitSummary = () => {
    alert("This will download a simple PDF summary of the press kit.");
    // jsPDF implementation would go here
  };

  const togglePlayback = () => setIsPlaying(!isPlaying);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!songData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e14] via-[#0f1419] to-[#1a1f2e] text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-yellow-500" />
          <p className="text-gray-400">Loading song data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e14] via-[#0f1419] to-[#1a1f2e] text-white">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0f1419]/80 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition-colors group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
              <Waves className="w-8 h-8 text-black" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-white via-yellow-100 to-yellow-300 bg-clip-text text-transparent">
                {songData.title}
              </h1>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-1.5 bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 rounded-full text-sm font-medium text-yellow-400">
                  {songData.genre}
                </span>
                <span className="px-4 py-1.5 bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-500/30 rounded-full text-sm font-medium text-blue-400">
                  {songData.mood}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-[#1e2936] to-[#16202d] rounded-2xl p-6 border border-gray-700/50 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">Full Production</h2>
              <div className="bg-[#0a0e14] rounded-xl p-8 sm:p-12 flex flex-col items-center justify-center min-h-[300px] border border-gray-800">
                {isProducing ? (
                  <div className="w-full max-w-lg">
                    <Loader2 className="w-24 h-24 animate-spin mx-auto text-yellow-500 mb-8" />
                    <p className="text-gray-300 text-center mb-8 text-xl font-semibold">
                      Crafting your masterpiece...
                    </p>
                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden shadow-inner">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-500 to-yellow-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full max-w-lg">
                    <div className="text-center mb-8">
                      <p className="text-2xl font-bold mb-2">
                        Track Complete! 🎉
                      </p>
                    </div>
                    <div className="bg-gradient-to-r from-[#1e2936] to-[#253240] rounded-xl p-6 border border-gray-700 shadow-xl">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={togglePlayback}
                          className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center"
                        >
                          {isPlaying ? (
                            <Pause className="w-8 h-8 text-black" />
                          ) : (
                            <Play className="w-8 h-8 text-black ml-1" />
                          )}
                        </button>
                        <p className="font-bold text-lg text-white">
                          {songData.title}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-[#1e2936] to-[#16202d] rounded-2xl p-6 border border-gray-700/50 shadow-2xl sticky top-24">
              <h2 className="text-xl font-bold mb-6">AI Press Kit</h2>
              {isGeneratingEpk ? (
                <div className="text-center py-12">
                  <Loader2 className="w-16 h-16 animate-spin mx-auto text-yellow-500 mb-6" />
                  <p className="text-gray-300 font-medium">
                    Generating your press kit...
                  </p>
                </div>
              ) : epkData ? (
                <div className="space-y-6">
                  <div className="group">
                    <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wide mb-3">
                      Cover Art
                    </h3>
                    <div className="relative w-full aspect-square bg-[#0a0e14] rounded-xl overflow-hidden border border-gray-700">
                      <Image
                        src={epkData.albumArt}
                        alt="AI Generated Album Art"
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex gap-2 mb-4 bg-[#0a0e14] p-1 rounded-lg">
                      <button
                        onClick={() => setActiveTab("bio")}
                        className={`flex-1 py-2 px-3 rounded-md text-xs font-medium ${
                          activeTab === "bio"
                            ? "bg-yellow-500 text-black"
                            : "text-gray-400"
                        }`}
                      >
                        Biography
                      </button>
                      <button
                        onClick={() => setActiveTab("press")}
                        className={`flex-1 py-2 px-3 rounded-md text-xs font-medium ${
                          activeTab === "press"
                            ? "bg-yellow-500 text-black"
                            : "text-gray-400"
                        }`}
                      >
                        Press Release
                      </button>
                      <button
                        onClick={() => setActiveTab("social")}
                        className={`flex-1 py-2 px-3 rounded-md text-xs font-medium ${
                          activeTab === "social"
                            ? "bg-yellow-500 text-black"
                            : "text-gray-400"
                        }`}
                      >
                        Social
                      </button>
                    </div>
                    <div className="bg-[#0a0e14] rounded-xl p-4 border border-gray-800 min-h-[200px] max-h-[300px] overflow-y-auto">
                      {activeTab === "bio" && (
                        <p className="text-sm text-gray-300">
                          {epkData.biography}
                        </p>
                      )}
                      {activeTab === "press" && (
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">
                          {epkData.pressRelease}
                        </p>
                      )}
                      {activeTab === "social" && (
                        <div className="space-y-3">
                          {epkData.socialBlurbs.map((blurb, index) => (
                            <div
                              key={index}
                              className="group p-4 bg-[#1e2936] rounded-lg border border-gray-700"
                            >
                              <button
                                onClick={() => copyToClipboard(blurb, index)}
                                className="float-right p-1.5 rounded"
                              >
                                {copiedIndex === index ? (
                                  <Check className="w-4 h-4 text-green-500" />
                                ) : (
                                  <Copy className="w-4 h-4 text-gray-400" />
                                )}
                              </button>
                              <p className="text-sm text-gray-300">{blurb}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2 pt-4 border-t border-gray-700">
                    <Button
                      onClick={() => setShowDSPModal(true)}
                      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold py-6"
                    >
                      <Share2 className="w-5 h-5 mr-2" />
                      Distribute to Platforms
                    </Button>
                    <Button
                      onClick={handleDownloadPressKitSummary}
                      variant="outline"
                      className="w-full border-gray-600"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Download Press Kit Summary
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p>Press kit will be generated after production</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {epkData && songData && (
        <DSPExportModal
          isOpen={showDSPModal}
          onClose={() => setShowDSPModal(false)}
          songData={songData}
          albumArt={epkData.albumArt}
          epkData={epkData}
        />
      )}
    </div>
  );
}
