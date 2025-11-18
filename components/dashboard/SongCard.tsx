"use client";

import Link from "next/link";
import Image from "next/image";
import { Mic, ArrowRight, ImageIcon } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { ShareButton } from "./ShareButton";

// Ensure the Song type matches the data structure we are now saving
type Song = {
  id: string;
  title: string;
  artist_name: string; // The card expects artist_name
  status: "Completed" | "Processing" | "Failed" | "Pending";
  albumArt?: string | null;
};

export const SongCard = ({ song }: { song: Song }) => {
  return (
    <Link
      href={`/release/${song.id}`} // Point to the release page
      className="block group"
      aria-label={`View details for ${song.title}`}
    >
      <div className="bg-gray-800/50 border border-gray-700/80 rounded-lg overflow-hidden hover:bg-gray-800 hover:border-yellow-500/30 transition-all duration-300 shadow-lg hover:shadow-xl">
        {/* Image Section */}
        <div className="relative aspect-video w-full bg-gray-900">
          {song.albumArt ? (
            <Image
              src={song.albumArt}
              alt={`Album art for ${song.title}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <ImageIcon className="w-12 h-12 text-gray-600" />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 pr-4">
              <h3 className="text-lg font-bold text-white truncate">
                {song.title}
              </h3>
              <p className="text-sm text-gray-400">by {song.artist_name}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <ShareButton
                songId={song.id}
                songTitle={song.title}
                artistName={song.artist_name}
              />
              <Mic className="h-5 w-5 text-gray-500" title="Vocal Track" />
            </div>
          </div>

          <div className="mb-4">
            <StatusBadge status={song.status} />
          </div>

          <div className="flex justify-between items-center border-t border-gray-700 pt-3">
            <span className="text-sm text-gray-400">View release details</span>
            <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-yellow-400 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
};
