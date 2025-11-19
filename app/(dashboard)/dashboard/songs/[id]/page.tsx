import { notFound } from "next/navigation";

import { SongDetailHeader } from "@/components/dashboard/SongDetailHeader";
import { AudioPlayer } from "@/components/dashboard/AudioPlayer";
import { TrackInformation } from "@/components/dashboard/TrackInformation";
import { AIAnalysis } from "@/components/dashboard/AIAnalysis";
import { QuickActions } from "@/components/dashboard/QuickActions";

export async function generateStaticParams() {
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" },
    { id: "6" },
  ];
}

export default async function SongDetailPage({ params }) {
  // Await the params since it's an asynchronous API now
  const { id } = await params;

  const song = getSongById(id);

  if (!song) {
    notFound();
  }

  const isTrackReady = song.status === "Completed";

  return (
    <div className="space-y-6">
      <SongDetailHeader
        title={song.title}
        artist={song.artist_name}
        status={song.status}
      />

      {/* Tabs */}
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

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Audio players */}
        <div className="lg:col-span-2 space-y-6">
          <AudioPlayer
            title="Your Original Vocal"
            duration={song.duration}
            quality={song.original_vocal.quality}
            format={song.original_vocal.format}
            downloadUrl={song.original_vocal.url}
            isReady={true}
          />

          <AudioPlayer
            title="AI-Generated Full Track"
            duration={song.duration}
            downloadUrl={song.generated_track.url}
            isGenerated={true}
            isReady={isTrackReady}
          />
        </div>

        {/* Right column - Information panels */}
        <div className="space-y-6">
          <TrackInformation
            duration={song.duration}
            genre={song.genre}
            mood={song.mood}
            bpm={song.bpm}
            key={song.key}
            created={song.created_at}
          />

          <AIAnalysis
            vocalQuality={song.ai_analysis.vocal_quality}
            pitchAccuracy={song.ai_analysis.pitch_accuracy}
            rhythmSync={song.ai_analysis.rhythm_sync}
          />

          <QuickActions />
        </div>
      </div>
    </div>
  );
}
