"use client"; // This is the most important line!

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";

import { SongDetailHeader } from "@/components/dashboard/SongDetailHeader";
import { AudioPlayer } from "@/components/dashboard/AudioPlayer";
import { TrackInformation } from "@/components/dashboard/TrackInformation";
import { AIAnalysis } from "@/components/dashboard/AIAnalysis";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { getSongById, type Song } from "@/lib/utils"; // Import the type as well

// This component now takes the song 'id' as a simple prop
export function SongDetailView({ id }: { id: string }) {
  const [song, setSong] = useState<Song | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect runs ONLY on the client, after the component has mounted
  useEffect(() => {
    const songData = getSongById(id);
    setSong(songData);
    setIsLoading(false);
  }, [id]); // Re-run if the id changes

  // Show a loading state while fetching from localStorage
  if (isLoading) {
    return <div>Loading song details...</div>;
  }

  // If the song is not found after checking, show the 404 page
  if (!song) {
    notFound();
  }

  const isTrackReady = song.status === "Completed";

  // All your original JSX goes here
  return (
    <div className="space-y-6">
      <SongDetailHeader
        title={song.title}
        artist={song.artist_name}
        status={song.status}
      />

      <div className="border-b border-gray-700 mb-6">
        <div className="flex gap-8">
          <button className="pb-3 border-b-2 border-yellow-400 text-yellow-400 font-medium">
            Overview
          </button>
          <button className="pb-3 text-gray-400 hover:text-white">
            Production
          </button>
          <button className="pb-3 text-gray-400 hover:text-white">
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* NOTE: These props probably need to be fixed based on your Song type */}
          {/* I'm commenting them out as they don't exist on your defined Song interface */}
          {/* You'll need to add them to the interface in lib/utils.ts */}
          <AudioPlayer
            title="Your Original Vocal"
            // duration={song.duration}
            // quality={song.original_vocal.quality}
            // format={song.original_vocal.format}
            // downloadUrl={song.original_vocal.url}
            isReady={true}
          />
          <AudioPlayer
            title="AI-Generated Full Track"
            // duration={song.duration}
            // downloadUrl={song.generated_track.url}
            isGenerated={true}
            isReady={isTrackReady}
          />
        </div>

        <div className="space-y-6">
          <TrackInformation
            // duration={song.duration}
            genre={song.genre}
            mood={song.mood}
            // bpm={song.bpm}
            // key={song.key}
            created={song.createdAt}
          />
          <AIAnalysis
          // vocalQuality={song.ai_analysis.vocal_quality}
          // pitchAccuracy={song.ai_analysis.pitch_accuracy}
          // rhythmSync={song.ai_analysis.rhythm_sync}
          />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
