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
  Music2,
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Package,
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
  albumArt: string;
  epkData: {
    biography: string;
    pressRelease: string;
  };
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
    isrc: "",
    upc: "",
    composer: songData.artistName,
    producer: songData.artistName,
    recordLabel: "Independent",
    explicit: false,
  });

  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [error, setError] = useState("");

  const platforms = [
    {
      id: "spotify",
      name: "Spotify",
      icon: "🎵",
      desc: "Global streaming leader",
    },
    {
      id: "appleMusic",
      name: "Apple Music",
      icon: "🍎",
      desc: "Premium audio quality",
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: "🎬",
      desc: "Viral discovery platform",
    },
    {
      id: "youtube",
      name: "YouTube Music",
      icon: "▶️",
      desc: "Video & music platform",
    },
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

    try {
      // Prepare form data
      const formData = new FormData();

      // Convert album art from base64 to blob
      const artResponse = await fetch(albumArt);
      const artBlob = await artResponse.blob();
      formData.append("albumArt", artBlob, "artwork.jpg");

      // For demo purposes, we'll create a dummy audio file
      // In production, you'd use the actual audio file
      const dummyAudio = new Blob(["audio data"], { type: "audio/wav" });
      formData.append("audio", dummyAudio, `${songData.title}.wav`);

      // Prepare complete metadata
      const completeMetadata = {
        ...metadata,
        title: songData.title,
        artistName: songData.artistName,
        genre: songData.genre,
        mood: songData.mood,
        duration: songData.duration || "3:30",
        biography: epkData.biography,
        pressRelease: epkData.pressRelease,
      };

      formData.append("metadata", JSON.stringify(completeMetadata));

      const selectedPlatformsList = Object.entries(selectedPlatforms)
        .filter(([_, selected]) => selected)
        .map(([platform]) => platform);

      formData.append("platforms", JSON.stringify(selectedPlatformsList));

      // Call the API
      const response = await fetch("/api/export-dsp", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Export failed");
      }

      const data = await response.json();

      // Set download URL
      setDownloadUrl(data.package);
      setExportComplete(true);

      // Trigger download automatically
      const link = document.createElement("a");
      link.href = data.package;
      link.download = data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      setError("Failed to create export package. Please try again.");
      console.error("Export error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const atLeastOnePlatform = Object.values(selectedPlatforms).some(Boolean);
  const isMetadataComplete = metadata.releaseDate !== "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-[#1e2936] to-[#16202d] border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-black" />
            </div>
            Export for Distribution
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Prepare your track for Spotify, Apple Music, TikTok, and more
          </DialogDescription>
        </DialogHeader>

        {!exportComplete ? (
          <div className="space-y-6 py-4">
            {/* Platform Selection */}
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
                        : "border-gray-700 bg-[#0a0e14] hover:border-gray-600"
                    }`}
                    onClick={() => handlePlatformToggle(platform.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox
                        checked={
                          selectedPlatforms[
                            platform.id as keyof typeof selectedPlatforms
                          ]
                        }
                        onCheckedChange={() =>
                          handlePlatformToggle(platform.id)
                        }
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-2xl">{platform.icon}</span>
                          <span className="font-semibold">{platform.name}</span>
                        </div>
                        <p className="text-sm text-gray-400">{platform.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Metadata Form */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Release Information
              </h3>
              <div className="bg-[#0a0e14] rounded-lg p-6 border border-gray-700 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="album" className="text-gray-300 mb-2 block">
                      Album/Single Name
                    </Label>
                    <Input
                      id="album"
                      value={metadata.album}
                      onChange={(e) =>
                        setMetadata({ ...metadata, album: e.target.value })
                      }
                      className="bg-[#1e2936] border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="releaseDate"
                      className="text-gray-300 mb-2 block"
                    >
                      Release Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="releaseDate"
                      type="date"
                      value={metadata.releaseDate}
                      onChange={(e) =>
                        setMetadata({
                          ...metadata,
                          releaseDate: e.target.value,
                        })
                      }
                      className="bg-[#1e2936] border-gray-600 text-white"
                      min={
                        new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
                          .toISOString()
                          .split("T")[0]
                      }
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum 2 weeks from today
                    </p>
                  </div>

                  <div>
                    <Label
                      htmlFor="composer"
                      className="text-gray-300 mb-2 block"
                    >
                      Composer
                    </Label>
                    <Input
                      id="composer"
                      value={metadata.composer}
                      onChange={(e) =>
                        setMetadata({ ...metadata, composer: e.target.value })
                      }
                      className="bg-[#1e2936] border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="producer"
                      className="text-gray-300 mb-2 block"
                    >
                      Producer
                    </Label>
                    <Input
                      id="producer"
                      value={metadata.producer}
                      onChange={(e) =>
                        setMetadata({ ...metadata, producer: e.target.value })
                      }
                      className="bg-[#1e2936] border-gray-600 text-white"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="recordLabel"
                      className="text-gray-300 mb-2 block"
                    >
                      Record Label
                    </Label>
                    <Input
                      id="recordLabel"
                      value={metadata.recordLabel}
                      onChange={(e) =>
                        setMetadata({
                          ...metadata,
                          recordLabel: e.target.value,
                        })
                      }
                      className="bg-[#1e2936] border-gray-600 text-white"
                    />
                  </div>

                  <div className="flex items-center space-x-2 pt-6">
                    <Checkbox
                      id="explicit"
                      checked={metadata.explicit}
                      onCheckedChange={(checked) =>
                        setMetadata({
                          ...metadata,
                          explicit: checked as boolean,
                        })
                      }
                    />
                    <Label
                      htmlFor="explicit"
                      className="text-gray-300 cursor-pointer"
                    >
                      Explicit Content
                    </Label>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 mt-4">
                  <div className="flex gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-300 font-medium mb-1">
                        ISRC & UPC Codes
                      </p>
                      <p className="text-xs text-blue-300/80">
                        These will be provided by your music distributor
                        (DistroKid, CD Baby, TuneCore, etc.) during upload.
                        Leave empty for now.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Package Contents Info */}
            <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-yellow-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Your package will include:
              </h4>
              <ul className="text-sm text-gray-300 space-y-1 ml-6">
                <li>✓ Audio files in platform-specific formats</li>
                <li>✓ Album artwork in required dimensions</li>
                <li>✓ Metadata CSV files for each platform</li>
                <li>
                  ✓ Complete distribution guide with step-by-step instructions
                </li>
                <li>✓ Platform-specific requirements documents</li>
                <li>✓ Delivery checklists and notes</li>
              </ul>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              </div>
            )}

            {/* Export Button */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={onClose}
                variant="outline"
                className="flex-1 border-gray-600 hover:bg-gray-800"
                disabled={isExporting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                disabled={
                  !atLeastOnePlatform || !isMetadataComplete || isExporting
                }
                className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700 font-semibold"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Package...
                  </>
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
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Package Created!</h3>
            <p className="text-gray-400 mb-6">
              Your DSP export package has been downloaded
            </p>

            <div className="bg-[#0a0e14] rounded-lg p-6 mb-6 border border-gray-700">
              <h4 className="font-semibold mb-3 text-yellow-400">
                Next Steps:
              </h4>
              <ol className="text-sm text-left text-gray-300 space-y-2">
                <li>1. Extract the ZIP file</li>
                <li>2. Read the README.txt for instructions</li>
                <li>
                  3. Choose a music distributor (DistroKid, CD Baby, etc.)
                </li>
                <li>4. Obtain ISRC and UPC codes from your distributor</li>
                <li>5. Upload files to your chosen platforms</li>
                <li>6. Set your release date (minimum 2 weeks out)</li>
              </ol>
            </div>

            <div className="flex gap-3">
              {downloadUrl && (
                <Button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = downloadUrl;
                    link.download = `${songData.title}_DSP_Package.zip`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  variant="outline"
                  className="flex-1 border-yellow-500 text-yellow-500 hover:bg-yellow-500/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Again
                </Button>
              )}
              <Button
                onClick={() => {
                  setExportComplete(false);
                  onClose();
                }}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
