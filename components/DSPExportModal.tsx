"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Package,
  Music2,
  Sparkles,
} from "lucide-react";

interface DSPExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  songData: {
    title: string;
    artistName: string;
    genre: string;
    mood: string;
    duration?: string;
  };
  albumArt: string | null;
  epkData: { biography: string; pressRelease: string };
}

export default function DSPExportModal({
  isOpen,
  onClose,
  songData,
  albumArt,
  epkData,
}: DSPExportModalProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    spotify: true,
    appleMusic: true,
    tiktok: true,
    youtube: true,
  });
  const [metadata, setMetadata] = useState({
    album: songData.title + " - Single",
    releaseDate: "",
    composer: songData.artistName,
    recordLabel: "Independent",
  });
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [error, setError] = useState("");

  const platforms = [
    { id: "spotify", name: "Spotify", icon: "🎵" },
    { id: "appleMusic", name: "Apple Music", icon: "🍎" },
    { id: "tiktok", name: "TikTok", icon: "🎬" },
    { id: "youtube", name: "YouTube Music", icon: "▶️" },
  ];

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms((prev) => ({
      ...prev,
      [platformId]: !prev[platformId as keyof typeof prev],
    }));
  };

  const handleExport = async () => {
    setIsExporting(true);
    setError("");

    if (!albumArt) {
      setError(
        "Album art is missing or failed to generate. Cannot create export package."
      );
      setIsExporting(false);
      return;
    }

    try {
      const formData = new FormData();
      const artResponse = await fetch(albumArt);
      const artBlob = await artResponse.blob();
      formData.append("albumArt", artBlob, "artwork.jpg");
      const dummyAudio = new Blob(["audio data"], { type: "audio/wav" });
      formData.append("audio", dummyAudio, `${songData.title}.wav`);

      const completeMetadata = { ...metadata, ...songData, ...epkData };
      formData.append("metadata", JSON.stringify(completeMetadata));
      const selectedPlatformsList = Object.keys(selectedPlatforms).filter(
        (p) => selectedPlatforms[p as keyof typeof selectedPlatforms]
      );
      formData.append("platforms", JSON.stringify(selectedPlatformsList));

      const response = await fetch("/api/export-dsp", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Export failed");

      const data = await response.json();
      const link = document.createElement("a");
      link.href = data.package;
      link.download = data.filename;
      link.click();
      setExportComplete(true);
    } catch (err) {
      setError("Failed to create export package. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const atLeastOnePlatform = Object.values(selectedPlatforms).some(Boolean);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-gradient-to-br from-[#1e2936] to-[#16202d] border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <Package className="w-6 h-6 text-yellow-500" />
            Export for Distribution
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Prepare your track for major streaming platforms.
          </DialogDescription>
        </DialogHeader>

        {!exportComplete ? (
          <div className="space-y-6 py-4">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Music2 className="w-5 h-5 text-yellow-500" />
                Select Platforms
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {platforms.map((platform) => (
                  <div
                    key={platform.id}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedPlatforms[
                        platform.id as keyof typeof selectedPlatforms
                      ]
                        ? "border-yellow-500 bg-yellow-500/10"
                        : "border-gray-700 bg-[#0a0e14]"
                    }`}
                    onClick={() => handlePlatformToggle(platform.id)}
                  >
                    <Checkbox
                      checked={
                        selectedPlatforms[
                          platform.id as keyof typeof selectedPlatforms
                        ]
                      }
                      onCheckedChange={() => handlePlatformToggle(platform.id)}
                    />
                    <span className="ml-3 font-semibold">{platform.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Release Information
              </h3>
              <div className="bg-[#0a0e14] rounded-lg p-6 border border-gray-700 space-y-4">
                <Label htmlFor="album">Album/Single Name</Label>
                <Input
                  id="album"
                  value={metadata.album}
                  onChange={(e) =>
                    setMetadata({ ...metadata, album: e.target.value })
                  }
                  className="bg-[#1e2936] border-gray-600"
                />
                <Label htmlFor="releaseDate">
                  Release Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="releaseDate"
                  type="date"
                  value={metadata.releaseDate}
                  onChange={(e) =>
                    setMetadata({ ...metadata, releaseDate: e.target.value })
                  }
                  className="bg-[#1e2936] border-gray-600"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <AlertCircle className="w-5 h-5 text-red-400 inline-block mr-2" />
                <p className="text-sm text-red-300 inline">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                disabled={
                  !atLeastOnePlatform || !metadata.releaseDate || isExporting
                }
                className="flex-1 bg-yellow-500 text-black font-semibold"
              >
                {isExporting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Create DSP Package
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <CheckCircle2 className="w-20 h-20 bg-green-500 text-white rounded-full mx-auto mb-6 p-2" />
            <h3 className="text-2xl font-bold">Package Created!</h3>
            <p className="text-gray-400 mb-6">
              Your DSP export package has been downloaded.
            </p>
            <Button
              onClick={() => {
                setExportComplete(false);
                onClose();
              }}
              className="bg-yellow-500 text-black"
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
