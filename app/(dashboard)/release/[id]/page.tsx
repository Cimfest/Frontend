"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Loader2,
  ChevronLeft,
  Share2,
  Megaphone,
  Users,
  DollarSign,
  UploadCloud,
  CheckCircle2,
  Clock,
  Copy,
  Check,
  ImageIcon,
  Play,
  Pause,
  Volume2,
  VolumeX,
} from "lucide-react";
import DSPExportModal from "@/components/DSPExportModal";
import { Label } from "@radix-ui/react-label";

// Note: If you have an actual audio file/URL from your backend, you can set it here
// For demo purposes, we'll generate a simple tone
// Interfaces
interface SongData {
  id: string;
  title: string;
  artistName: string;
  genre: string;
  mood: string;
  createdAt: string;
  status?: "production" | "ready" | "distributed";
  audioUrl?: string;
}
interface EpkData {
  biography: string;
  pressRelease: string;
  socialBlurbs: string[];
  albumArt: string | null;
}

// Dummy data for demo purposes
const dummyLicensingOps = [
  {
    id: 1,
    title: "Upbeat Afrobeat for Toyota Commercial",
    source: "Songtradr",
    match: 85,
  },
  {
    id: 2,
    title: "Authentic Makossa for Netflix Series 'Cameroon Rising'",
    source: "Music Supervisor Request",
    match: 92,
  },
  {
    id: 3,
    title: "Chill background music for YouTube travel vlog",
    source: "ccMixter",
    match: 78,
  },
];

export default function ReleaseDashboardPage() {
  const router = useRouter();
  const params = useParams();

  const [songData, setSongData] = useState<SongData | null>(null);
  const [epkData, setEpkData] = useState<EpkData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDSPModal, setShowDSPModal] = useState(false);
  const [distributionStatus, setDistributionStatus] = useState<
    "ready" | "submitted" | "live"
  >("ready");
  const [licensingEnabled, setLicensingEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState<"bio" | "press" | "social">("bio");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );

  useEffect(() => {
    const storedSong = sessionStorage.getItem("currentSong");
    const storedEpk = sessionStorage.getItem("currentEpk");

    if (storedSong && storedEpk) {
      const parsedSong = JSON.parse(storedSong);
      setSongData(parsedSong);
      setEpkData(JSON.parse(storedEpk));

      // Check localStorage to see if song has already been distributed
      const allSongsString = localStorage.getItem("allSongs");
      if (allSongsString) {
        const allSongs: SongData[] = JSON.parse(allSongsString);
        const existingSong = allSongs.find((s) => s.id === parsedSong.id);

        // Set distribution status based on stored status
        if (existingSong?.status === "distributed") {
          setDistributionStatus("live");
        } else if (existingSong?.status === "ready") {
          setDistributionStatus("ready");
        }
      }
    } else {
      // Try to load from params and localStorage
      const songId = params.id as string;
      const allSongsString = localStorage.getItem("allSongs");

      if (allSongsString && songId) {
        const allSongs: SongData[] = JSON.parse(allSongsString);
        const song = allSongs.find((s) => s.id === songId);

        if (song) {
          setSongData(song);

          // Generate fallback EPK if not available
          const fallbackEpk: EpkData = {
            biography: `${song.artistName} is an innovative ${song.genre} artist from Cameroon, creating a unique fusion of traditional African rhythms and contemporary production.`,
            pressRelease: `FOR IMMEDIATE RELEASE\n\n${song.artistName} Releases "${song.title}"\n\nAvailable now on all major streaming platforms.`,
            socialBlurbs: [
              `🎵 NEW MUSIC! "${song.title}" by ${song.artistName} is OUT NOW! #NewMusic`,
            ],
            albumArt: null,
          };
          setEpkData(fallbackEpk);

          // Set distribution status
          if (song.status === "distributed") {
            setDistributionStatus("live");
          } else if (song.status === "ready") {
            setDistributionStatus("ready");
          }
        } else {
          router.push("/dashboard");
          return;
        }
      } else {
        router.push("/dashboard");
        return;
      }
    }
    setIsLoading(false);
  }, [router, params.id]);

  // Initialize audio element
  useEffect(() => {
    // Create audio element
    const audio = new Audio();
    audio.loop = false;

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
    });

    audio.addEventListener("play", () => {
      setIsPlaying(true);
    });

    audio.addEventListener("pause", () => {
      setIsPlaying(false);
    });

    // Set audio source if available from songData
    if (songData?.audioUrl) {
      console.log("🎵 Loading audio from URL:", songData.audioUrl);
      audio.src = songData.audioUrl;
    }

    setAudioElement(audio);

    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [songData?.audioUrl]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDistributionComplete = () => {
    setShowDSPModal(false);

    if (songData && distributionStatus === "ready") {
      setDistributionStatus("submitted");

      // Update song status in localStorage
      const allSongsString = localStorage.getItem("allSongs");
      if (allSongsString) {
        const allSongs: SongData[] = JSON.parse(allSongsString);
        const songIndex = allSongs.findIndex((s) => s.id === songData.id);
        if (songIndex >= 0) {
          allSongs[songIndex].status = "distributed";
          localStorage.setItem("allSongs", JSON.stringify(allSongs));
          console.log(`✅ Updated song ${songData.id} status to distributed`);
        }
      }

      // Simulate moving to "live" after a delay (for demo purposes)
      setTimeout(() => {
        setDistributionStatus("live");
      }, 3000);
    }
  };

  const togglePlayPause = () => {
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
    } else {
      // Check if audio source is available
      if (audioElement.src && audioElement.src !== window.location.href) {
        audioElement.play().catch((err) => {
          console.error("Playback failed:", err);
        });
      } else {
        // No audio source available, show message
        console.warn("No audio source available for playback");
        alert(
          "Audio is not yet available. Please wait for the track to finish generating."
        );
      }
    }
  };

  const handleStop = () => {
    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (audioElement) {
      audioElement.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  if (isLoading || !songData || !epkData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e14] to-[#1a1f2e] text-white flex items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e14] via-[#0f1419] to-[#1a1f2e] text-white pb-32">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0f1419]/80 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 text-gray-400 hover:text-yellow-500 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <section className="mb-10 flex flex-col md:flex-row items-center gap-6 md:gap-8 bg-[#1e2936]/50 p-6 rounded-2xl border border-gray-800">
          <div className="w-40 h-40 md:w-48 md:h-48 flex-shrink-0 bg-[#0a0e14] rounded-xl flex items-center justify-center relative overflow-hidden">
            {epkData.albumArt ? (
              <Image
                src={epkData.albumArt}
                alt="Album Art"
                width={200}
                height={200}
                className="rounded-xl object-cover w-full h-full shadow-2xl shadow-black/50"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 text-center p-2">
                <ImageIcon className="w-10 h-10 mb-2" />
                <p className="text-xs">Art not available</p>
              </div>
            )}
            {/* Animated overlay when playing */}
            {isPlaying && (
              <div className="absolute inset-0 bg-yellow-500/10 animate-pulse"></div>
            )}
          </div>
          <div className="flex-1">
            <p className="text-yellow-400 font-semibold mb-1">
              {distributionStatus === "live" ? "Live Release" : "New Release"}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              {songData.title}
            </h1>
            <p className="text-xl text-gray-400 mb-4">
              by {songData.artistName}
            </p>
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  distributionStatus === "live"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : distributionStatus === "submitted"
                    ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                }`}
              >
                {distributionStatus === "live"
                  ? "● LIVE"
                  : distributionStatus === "submitted"
                  ? "● SUBMITTED"
                  : "● READY TO DISTRIBUTE"}
              </span>
            </div>

            {/* Audio Player Controls */}
            <div className="bg-[#0a0e14] rounded-lg p-4 border border-gray-700">
              <div className="flex items-center gap-4">
                <button
                  onClick={togglePlayPause}
                  className="w-12 h-12 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-black fill-black" />
                  ) : (
                    <Play className="w-6 h-6 text-black fill-black ml-0.5" />
                  )}
                </button>

                <div className="flex-1">
                  <p className="text-sm text-gray-400 mb-1">
                    {isPlaying ? "Now Playing..." : "Ready to play"}
                  </p>
                  {/* Animated waveform when playing */}
                  <div className="flex items-center gap-1 h-6">
                    {isPlaying ? (
                      <>
                        {[...Array(30)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-yellow-500 rounded-full animate-pulse"
                            style={{
                              height: `${Math.random() * 100}%`,
                              animationDelay: `${i * 0.05}s`,
                            }}
                          ></div>
                        ))}
                      </>
                    ) : (
                      <div className="w-full h-1 bg-gray-700 rounded-full"></div>
                    )}
                  </div>
                </div>

                <button
                  onClick={toggleMute}
                  className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-gray-300" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-gray-300" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (Main Actions) */}
          <div className="lg:col-span-2 space-y-6">
            {/* 1. Distribution Module */}
            <div className="bg-[#1e2936] rounded-2xl p-6 border border-gray-800">
              <h2 className="text-xl font-bold flex items-center gap-3 mb-4">
                <UploadCloud className="text-yellow-500" /> Global Distribution
              </h2>
              {distributionStatus === "ready" && (
                <>
                  <p className="text-gray-400 mb-4">
                    Your track is ready to be sent to major streaming platforms
                    worldwide.
                  </p>
                  <Button
                    onClick={() => setShowDSPModal(true)}
                    size="lg"
                    className="w-full bg-yellow-500 text-black hover:bg-yellow-600 font-semibold"
                  >
                    <Share2 className="w-5 h-5 mr-2" />
                    Distribute to Platforms
                  </Button>
                </>
              )}
              {distributionStatus === "submitted" && (
                <div className="bg-blue-500/10 p-4 rounded-lg text-center">
                  <Clock className="w-10 h-10 mx-auto mb-2 text-blue-400 animate-pulse" />
                  <p className="font-semibold text-blue-300">
                    Submitted for Review
                  </p>
                  <p className="text-xs text-blue-400/80 mt-2">
                    Platforms typically take 5-10 business days to process new
                    releases.
                  </p>
                </div>
              )}
              {distributionStatus === "live" && (
                <div className="bg-green-500/10 p-4 rounded-lg text-center">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-400" />
                  <p className="font-semibold text-green-300 text-lg">
                    Your Track is Live!
                  </p>
                  <p className="text-sm text-green-400/80 mt-2">
                    Congratulations! Your music is now available on selected
                    platforms.
                  </p>
                </div>
              )}
            </div>

            {/* 2. Promotion Module */}
            <div className="bg-[#1e2936] rounded-2xl p-6 border border-gray-800">
              <h2 className="text-xl font-bold flex items-center gap-3 mb-4">
                <Megaphone className="text-yellow-500" /> Promotional Toolkit
              </h2>
              {/* Re-used Tab UI */}
              <div className="flex gap-2 mb-4 bg-[#0a0e14] p-1 rounded-lg">
                <button
                  onClick={() => setActiveTab("bio")}
                  className={`flex-1 py-2 text-sm rounded-md transition-colors ${
                    activeTab === "bio"
                      ? "bg-yellow-500 text-black"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  Biography
                </button>
                <button
                  onClick={() => setActiveTab("press")}
                  className={`flex-1 py-2 text-sm rounded-md transition-colors ${
                    activeTab === "press"
                      ? "bg-yellow-500 text-black"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  Press Release
                </button>
                <button
                  onClick={() => setActiveTab("social")}
                  className={`flex-1 py-2 text-sm rounded-md transition-colors ${
                    activeTab === "social"
                      ? "bg-yellow-500 text-black"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  Social Content
                </button>
              </div>
              <div className="bg-[#0a0e14] rounded-xl p-4 border border-gray-700 min-h-[200px] max-h-64 overflow-y-auto">
                {activeTab === "social" ? (
                  <div className="space-y-3">
                    {epkData.socialBlurbs.map((blurb, index) => (
                      <div
                        key={index}
                        className="group relative p-3 bg-[#1e2936] rounded-lg hover:bg-[#1e2936]/80 transition-colors"
                      >
                        <p className="text-sm text-gray-300 pr-8">{blurb}</p>
                        <button
                          onClick={() => copyToClipboard(blurb, index)}
                          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {copiedIndex === index ? (
                            <Check size={16} className="text-green-500" />
                          ) : (
                            <Copy
                              size={16}
                              className="text-gray-400 hover:text-gray-200"
                            />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {activeTab === "bio"
                      ? epkData.biography
                      : epkData.pressRelease}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column (Secondary Actions) */}
          <div className="lg:col-span-1 space-y-6">
            {/* 3. Collaboration Module */}
            <div className="bg-[#1e2936] rounded-2xl p-6 border border-gray-800">
              <h2 className="text-xl font-bold flex items-center gap-3 mb-4">
                <Users className="text-yellow-500" /> Export Circle
              </h2>
              <p className="text-gray-400 text-sm mb-4">
                Amplify your reach by cross-promoting with other Cameroonian
                artists. Create or join a circle to coordinate releases and
                share audiences.
              </p>
              <Button
                variant="outline"
                className="w-full border-gray-600 hover:bg-gray-800 hover:border-gray-500 transition-colors"
              >
                Join or Create a Circle
              </Button>
            </div>

            {/* 4. Monetization Module */}
            <div className="bg-[#1e2936] rounded-2xl p-6 border border-gray-800">
              <h2 className="text-xl font-bold flex items-center gap-3 mb-4">
                <DollarSign className="text-yellow-500" /> Licensing
                Opportunities
              </h2>
              <div className="flex items-center justify-between mb-4">
                <Label
                  htmlFor="licensing-switch"
                  className="text-gray-300 text-sm"
                >
                  Make track available for sync
                </Label>
                <Switch
                  id="licensing-switch"
                  checked={licensingEnabled}
                  onCheckedChange={setLicensingEnabled}
                />
              </div>
              {licensingEnabled ? (
                <div className="space-y-3">
                  <p className="text-xs text-center text-green-400 mb-2 animate-pulse">
                    Actively scanning for opportunities...
                  </p>
                  {dummyLicensingOps.map((op) => (
                    <div
                      key={op.id}
                      className="bg-[#0a0e14] p-3 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                    >
                      <p className="text-sm font-semibold text-white">
                        {op.title}
                      </p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-500">
                          {op.source}
                        </span>
                        <span className="text-xs font-bold text-yellow-400">
                          {op.match}% Match
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">
                  Enable to find licensing deals for film, TV, and commercials.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* The Modal is rendered here, controlled by state */}
      <DSPExportModal
        isOpen={showDSPModal}
        onClose={handleDistributionComplete}
        songData={songData}
        albumArt={epkData.albumArt}
        epkData={epkData}
      />
    </div>
  );
}
