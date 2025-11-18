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
} from "lucide-react";
import DSPExportModal from "@/components/DSPExportModal";
import { Label } from "@radix-ui/react-label";

// Interfaces
interface SongData {
  id: string;
  title: string;
  artistName: string;
  genre: string;
  mood: string;
  createdAt: string;
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

  useEffect(() => {
    const storedSong = sessionStorage.getItem("currentSong");
    const storedEpk = sessionStorage.getItem("currentEpk");
    if (storedSong && storedEpk) {
      setSongData(JSON.parse(storedSong));
      setEpkData(JSON.parse(storedEpk));
    } else {
      router.push("/dashboard");
      return;
    }
    setIsLoading(false);
  }, [router, params.id]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (isLoading || !songData || !epkData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e14] to-[#1a1f2e] text-white flex items-center justify-center">
        <Loader2 className="w-16 h-16 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e14] via-[#0f1419] to-[#1a1f2e] text-white">
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
          <div className="w-40 h-40 md:w-48 md:h-48 flex-shrink-0 bg-[#0a0e14] rounded-xl flex items-center justify-center">
            {/* --- THIS IS THE FIX --- */}
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
            {/* -------------------- */}
          </div>
          <div>
            <p className="text-yellow-400 font-semibold mb-1">New Release</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
              {songData.title}
            </h1>
            <p className="text-xl text-gray-400 mb-4">
              by {songData.artistName}
            </p>
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
                  <Clock className="w-10 h-10 mx-auto mb-2 text-blue-400" />
                  <p className="font-semibold text-blue-300">
                    Submitted for Review
                  </p>
                  <p className="text-xs text-blue-400/80">
                    Platforms typically take 5-10 business days to process new
                    releases.
                  </p>
                </div>
              )}
              {distributionStatus === "live" && (
                <div className="bg-green-500/10 p-4 rounded-lg text-center">
                  <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-400" />
                  <p className="font-semibold text-green-300">
                    Your Track is Live!
                  </p>
                  <p className="text-xs text-green-400/80">
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
                  className={`flex-1 py-2 text-sm rounded-md ${
                    activeTab === "bio"
                      ? "bg-yellow-500 text-black"
                      : "text-gray-400"
                  }`}
                >
                  Biography
                </button>
                <button
                  onClick={() => setActiveTab("press")}
                  className={`flex-1 py-2 text-sm rounded-md ${
                    activeTab === "press"
                      ? "bg-yellow-500 text-black"
                      : "text-gray-400"
                  }`}
                >
                  Press Release
                </button>
                <button
                  onClick={() => setActiveTab("social")}
                  className={`flex-1 py-2 text-sm rounded-md ${
                    activeTab === "social"
                      ? "bg-yellow-500 text-black"
                      : "text-gray-400"
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
                        className="group p-3 bg-[#1e2936] rounded-lg"
                      >
                        <p className="text-sm text-gray-300">{blurb}</p>
                        <button
                          onClick={() => copyToClipboard(blurb, index)}
                          className="float-right -mt-6 opacity-0 group-hover:opacity-100"
                        >
                          {copiedIndex === index ? (
                            <Check size={16} className="text-green-500" />
                          ) : (
                            <Copy size={16} className="text-gray-500" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-300 whitespace-pre-wrap">
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
                className="w-full border-gray-600 hover:bg-gray-800"
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
                <Label htmlFor="licensing-switch" className="text-gray-300">
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
                  <p className="text-xs text-center text-green-400 mb-2">
                    Actively scanning for opportunities...
                  </p>
                  {dummyLicensingOps.map((op) => (
                    <div
                      key={op.id}
                      className="bg-[#0a0e14] p-3 rounded-lg border border-gray-700"
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
        onClose={() => {
          setShowDSPModal(false);
          // Simulate the next step in the journey after submission
          if (distributionStatus === "ready")
            setDistributionStatus("submitted");
        }}
        songData={songData}
        albumArt={epkData.albumArt}
        epkData={epkData}
      />
    </div>
  );
}
