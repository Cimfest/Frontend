"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSongStore } from "@/lib/store";
import { useAiMusicGenerator } from "@/hooks/useAiMusicGenerator";
import { useScriptStore } from "@/lib/scriptStore";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Play, Square, Loader2, Music, Mic, Tag } from "lucide-react";

export default function ProductionPage() {
  const router = useRouter();
  const { title, genre, vocalFile } = useSongStore();
  const { status, progress, isReady, isReadyToPlay, generate, play, stop } =
    useAiMusicGenerator();
  const [isGenerating, setIsGenerating] = useState(false);

  // DEBUG: Check script loading status
  const isEssentiaReady = useScriptStore((state) => state.isEssentiaReady);

  // DEBUG: Log states
  useEffect(() => {
    console.log("🔍 DEBUG INFO:");
    console.log("- isEssentiaReady:", isEssentiaReady);
    console.log("- isReady:", isReady);
    console.log("- vocalFile:", vocalFile);
    console.log("- genre:", genre);
    console.log("- status:", status);
    console.log("- window.essentia exists:", !!window.essentia);
  }, [isEssentiaReady, isReady, vocalFile, genre, status]);

  useEffect(() => {
    if (!vocalFile) {
      console.error("No vocal file found in store. Redirecting.");
      router.replace("/dashboard/create-song");
      return;
    }
  }, [vocalFile, router]);

  const handleGenerate = () => {
    console.log("🎵 Generate button clicked!");
    console.log("- Can generate:", isReady && vocalFile && genre);

    if (isReady && vocalFile && genre) {
      setIsGenerating(true);
      generate(vocalFile, genre);
    } else {
      console.error("Cannot generate:", {
        isReady,
        hasVocalFile: !!vocalFile,
        hasGenre: !!genre,
      });
    }
  };

  if (!vocalFile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <Loader2 className="h-12 w-12 animate-spin mb-4" />
        <p>Loading project details...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <div className="bg-card p-8 rounded-lg shadow-lg border border-border">
        <h1 className="text-3xl font-bold mb-4">Produce Your Song</h1>
        <p className="text-muted-foreground mb-6">
          You are about to start the AI-powered music production process. Review
          the details below and click "Start Production" when you're ready.
        </p>

        {/* DEBUG PANEL */}
        <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-600 rounded-md">
          <p className="font-bold text-yellow-400 mb-2">🔍 Debug Info:</p>
          <p className="text-sm text-yellow-200">Status: {status}</p>
          <p className="text-sm text-yellow-200">
            Essentia Ready: {isEssentiaReady ? "✅" : "❌"}
          </p>
          <p className="text-sm text-yellow-200">
            Hook Ready: {isReady ? "✅" : "❌"}
          </p>
          <p className="text-sm text-yellow-200">
            window.essentia:{" "}
            {typeof window !== "undefined" && window.essentia ? "✅" : "❌"}
          </p>
        </div>

        <div className="space-y-4 mb-8 p-4 border rounded-md">
          <div className="flex items-center">
            <Music className="h-5 w-5 mr-3 text-primary" />
            <span className="font-semibold">Title:</span>
            <span className="ml-2">{title}</span>
          </div>
          <div className="flex items-center">
            <Tag className="h-5 w-5 mr-3 text-primary" />
            <span className="font-semibold">Genre:</span>
            <span className="ml-2">{genre}</span>
          </div>
          <div className="flex items-center">
            <Mic className="h-5 w-5 mr-3 text-primary" />
            <span className="font-semibold">Vocal Track:</span>
            <span className="ml-2">{vocalFile.name}</span>
          </div>
        </div>

        {!isGenerating ? (
          <Button
            onClick={handleGenerate}
            disabled={!isReady || isGenerating}
            size="lg"
            className="w-full"
          >
            {isGenerating ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Start Production
          </Button>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium">{status}</p>
                <p className="text-sm font-semibold">{Math.round(progress)}%</p>
              </div>
              <Progress value={progress} className="w-full" />
            </div>

            <div className="flex items-center justify-center space-x-4 pt-6">
              <Button
                onClick={play}
                disabled={!isReadyToPlay}
                size="lg"
                className="flex items-center gap-2"
              >
                <Play className="h-5 w-5" />
                Play
              </Button>
              <Button
                onClick={stop}
                disabled={!isReadyToPlay}
                size="lg"
                variant="secondary"
                className="flex items-center gap-2"
              >
                <Square className="h-5 w-5" />
                Stop
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
