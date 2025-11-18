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
import { Textarea } from "@/components/ui/textarea";
import {
  Download,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Package,
  Music2,
  Sparkles,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { submitDistribution } from "@/app/actions/distribution-actions";

interface DSPExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  songData: {
    id: string;
    title: string;
    artistName: string;
    genre: string;
    mood: string;
    duration?: string;
  };
  albumArt: string | null;
  epkData: {
    biography: string;
    pressRelease: string;
    socialBlurbs: string[];
  };
}

const platforms = [
  {
    id: "spotify",
    name: "Spotify",
    icon: "🎵",
    enabled: true,
    description: "5-10 business days",
  },
  {
    id: "apple_music",
    name: "Apple Music",
    icon: "🍎",
    enabled: true,
    description: "5-7 business days",
  },
  {
    id: "youtube",
    name: "YouTube Music",
    icon: "▶️",
    enabled: true,
    description: "1-3 business days",
  },
  {
    id: "deezer",
    name: "Deezer",
    icon: "🎧",
    enabled: true,
    description: "3-5 business days",
  },
  {
    id: "tidal",
    name: "Tidal",
    icon: "🌊",
    enabled: true,
    description: "7-10 business days",
  },
];

type StepType = "selection" | "metadata" | "review" | "results";

export default function DSPExportModal({
  isOpen,
  onClose,
  songData,
  albumArt,
  epkData,
}: DSPExportModalProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([
    "spotify",
    "apple_music",
    "youtube",
  ]);
  const [step, setStep] = useState<StepType>("selection"); // FIXED THIS LINE
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResults, setSubmissionResults] = useState<any[]>([]);
  const [error, setError] = useState("");

  // Metadata state
  const [metadata, setMetadata] = useState({
    releaseDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    lyrics: "",
    language: "en",
    explicit: false,
    tags: `${songData.genre}, ${songData.mood}, Cameroon, African Music`,
  });

  const handlePlatformToggle = (platformId: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setStep("results");
    setError("");

    if (!albumArt) {
      setError("Album art is required for distribution");
      setIsSubmitting(false);
      return;
    }

    try {
      // Prepare distribution metadata
      const distributionMetadata = {
        title: songData.title,
        artistName: songData.artistName,
        genre: songData.genre,
        mood: songData.mood,
        albumArt: albumArt,
        releaseDate: metadata.releaseDate,
        lyrics: metadata.lyrics,
        language: metadata.language,
        explicit: metadata.explicit,
        tags: metadata.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        biography: epkData.biography,
        pressRelease: epkData.pressRelease,
      };

      // Submit distribution
      const result = await submitDistribution(
        songData.id,
        selectedPlatforms,
        distributionMetadata
      );

      if (result.success) {
        setSubmissionResults(result.results || []);
      } else {
        setError(result.error || "Distribution failed");
        setSubmissionResults([]);
      }
    } catch (err: any) {
      console.error("Distribution error:", err);
      setError("An unexpected error occurred");
      setSubmissionResults([]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep("selection");
    setSubmissionResults([]);
    setIsSubmitting(false);
    setError("");
    onClose();
  };

  const atLeastOnePlatform = selectedPlatforms.length > 0;

  // Step 1: Platform Selection
  const renderSelectionStep = () => (
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
                selectedPlatforms.includes(platform.id)
                  ? "border-yellow-500 bg-yellow-500/10"
                  : "border-gray-700 bg-[#0a0e14]"
              } ${!platform.enabled && "opacity-50 cursor-not-allowed"}`}
              onClick={() =>
                platform.enabled && handlePlatformToggle(platform.id)
              }
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={selectedPlatforms.includes(platform.id)}
                  disabled={!platform.enabled}
                  onCheckedChange={() => handlePlatformToggle(platform.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{platform.icon}</span>
                    <span className="font-semibold">{platform.name}</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {platform.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          Release Date
        </h3>
        <div className="bg-[#0a0e14] rounded-lg p-6 border border-gray-700">
          <Label htmlFor="releaseDate" className="text-white">
            Scheduled Release Date <span className="text-red-500">*</span>
          </Label>
          <Input
            id="releaseDate"
            type="date"
            value={metadata.releaseDate}
            onChange={(e) =>
              setMetadata({ ...metadata, releaseDate: e.target.value })
            }
            min={new Date().toISOString().split("T")[0]}
            className="mt-2 bg-[#1e2936] border-gray-600 text-white"
          />
          <p className="text-xs text-gray-400 mt-2">
            💡 Schedule at least 7 days in advance for optimal processing
          </p>
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
          onClick={handleClose}
          variant="outline"
          className="flex-1 border-gray-600 hover:bg-gray-800"
        >
          Cancel
        </Button>
        <Button
          onClick={() => setStep("metadata")}
          disabled={!atLeastOnePlatform || !metadata.releaseDate}
          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
        >
          Continue →
        </Button>
      </div>
    </div>
  );

  // Step 2: Additional Metadata
  const renderMetadataStep = () => (
    <div className="space-y-6 py-4">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          Additional Details
        </h3>
        <div className="bg-[#0a0e14] rounded-lg p-6 border border-gray-700 space-y-4">
          <div>
            <Label htmlFor="lyrics" className="text-white">
              Lyrics (Optional)
            </Label>
            <Textarea
              id="lyrics"
              placeholder="Enter song lyrics..."
              value={metadata.lyrics}
              onChange={(e) =>
                setMetadata({ ...metadata, lyrics: e.target.value })
              }
              className="mt-2 bg-[#1e2936] border-gray-600 text-white placeholder:text-gray-500"
              rows={6}
            />
            <p className="text-xs text-gray-400 mt-1">
              Lyrics help with searchability
            </p>
          </div>

          <div>
            <Label htmlFor="tags" className="text-white">
              Tags/Keywords
            </Label>
            <Input
              id="tags"
              placeholder="afrobeats, cameroon, makossa"
              value={metadata.tags}
              onChange={(e) =>
                setMetadata({ ...metadata, tags: e.target.value })
              }
              className="mt-2 bg-[#1e2936] border-gray-600 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="language" className="text-white">
                Language
              </Label>
              <select
                id="language"
                value={metadata.language}
                onChange={(e) =>
                  setMetadata({ ...metadata, language: e.target.value })
                }
                className="mt-2 w-full p-2 rounded-md bg-[#1e2936] border border-gray-600 text-white"
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="mul">Multiple/Mixed</option>
              </select>
            </div>

            <div className="flex items-center space-x-2 pt-8">
              <Checkbox
                id="explicit"
                checked={metadata.explicit}
                onCheckedChange={(checked) =>
                  setMetadata({ ...metadata, explicit: checked as boolean })
                }
              />
              <Label htmlFor="explicit" className="text-white cursor-pointer">
                Explicit Content
              </Label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-300">
            <p className="font-semibold mb-1">Auto-Generated:</p>
            <ul className="space-y-1 text-xs">
              <li>• ISRC code will be generated automatically</li>
              <li>• Smart hashtags based on genre and mood</li>
              <li>• EPK biography included in descriptions</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          onClick={() => setStep("selection")}
          variant="outline"
          className="flex-1 border-gray-600 hover:bg-gray-800"
        >
          ← Back
        </Button>
        <Button
          onClick={() => setStep("review")}
          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
        >
          Review →
        </Button>
      </div>
    </div>
  );

  // Step 3: Review
  const renderReviewStep = () => (
    <div className="space-y-6 py-4">
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-yellow-500" />
          Review Your Release
        </h3>
        <div className="bg-[#0a0e14] rounded-lg p-6 border border-gray-700 space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-gray-700">
            {albumArt && (
              <img
                src={albumArt}
                alt="Album Art"
                className="w-20 h-20 rounded-lg object-cover"
              />
            )}
            <div>
              <h4 className="text-xl font-bold text-white">
                {songData.title}
              </h4>
              <p className="text-gray-400">{songData.artistName}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-400">Release Date</p>
              <p className="text-sm text-white font-semibold">
                {new Date(metadata.releaseDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Genre & Mood</p>
              <p className="text-sm text-white font-semibold">
                {songData.genre} • {songData.mood}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Language</p>
              <p className="text-sm text-white font-semibold">
                {metadata.language === "en"
                  ? "English"
                  : metadata.language === "fr"
                  ? "French"
                  : "Multiple"}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Content Rating</p>
              <p className="text-sm text-white font-semibold">
                {metadata.explicit ? "Explicit" : "Clean"}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-gray-400 mb-2">
              Platforms ({selectedPlatforms.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedPlatforms.map((platformId) => {
                const platform = platforms.find((p) => p.id === platformId);
                return (
                  <span
                    key={platformId}
                    className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm font-medium"
                  >
                    {platform?.icon} {platform?.name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-300">
            <p className="font-semibold mb-1">Important Notes:</p>
            <ul className="space-y-1 text-xs">
              <li>• Distribution takes 5-10 business days</li>
              <li>• You'll receive email notifications</li>
              <li>• Ensure all rights are cleared</li>
              <li>• Changes after submission may delay release</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          onClick={() => setStep("metadata")}
          variant="outline"
          className="flex-1 border-gray-600 hover:bg-gray-800"
        >
          ← Back
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Submitting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Submit Distribution
            </>
          )}
        </Button>
      </div>
    </div>
  );

  // Step 4: Results
  const renderResultsStep = () => (
    <div className="py-4">
      {isSubmitting ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="w-16 h-16 animate-spin text-yellow-500 mb-4" />
          <p className="text-gray-400">Submitting to platforms...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Error</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <Button
            onClick={() => setStep("selection")}
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            Try Again
          </Button>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-4 text-center text-white">
            Distribution Results
          </h3>
          <div className="space-y-3 mb-6">
            {submissionResults.map((result, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                  result.success
                    ? "border-green-500 bg-green-500/10"
                    : "border-red-500 bg-red-500/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  {result.success ? (
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-semibold text-white">
                      {result.platform}
                    </p>
                    <p className="text-sm text-gray-400">
                      {result.success ? result.message : result.error}
                    </p>
                  </div>
                </div>
                {result.url && (
                  <Button
                    size="sm"
                    variant="link"
                    onClick={() => window.open(result.url, "_blank")}
                    className="text-yellow-400 hover:text-yellow-300"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-300">
              📧 You'll receive email updates as your track goes live on each
              platform. Check your dashboard for status updates.
            </p>
          </div>

          <Button
            onClick={handleClose}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
          >
            Done
          </Button>
        </>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl bg-gradient-to-br from-[#1e2936] to-[#16202d] border-gray-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-white">
            <Package className="w-6 h-6 text-yellow-500" />
            {step === "selection" && "Distribute Your Music"}
            {step === "metadata" && "Additional Details"}
            {step === "review" && "Review & Submit"}
            {step === "results" && "Distribution Status"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {step === "selection" &&
              "Select platforms and schedule your release"}
            {step === "metadata" && "Add metadata to optimize your distribution"}
            {step === "review" && "Review everything before submitting"}
            {step === "results" && "Your distribution submission results"}
          </DialogDescription>
        </DialogHeader>

        {step === "selection" && renderSelectionStep()}
        {step === "metadata" && renderMetadataStep()}
        {step === "review" && renderReviewStep()}
        {step === "results" && renderResultsStep()}
      </DialogContent>
    </Dialog>
  );
}