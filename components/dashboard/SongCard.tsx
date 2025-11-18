"use client";

import Link from "next/link";
import { Mic, ArrowRight, ImageIcon, Trash2 } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { ShareButton } from "./ShareButton";

type Song = {
  id: string;
  title: string;
  artist_name: string;
  status: "Completed" | "Processing" | "Failed" | "Pending";
  albumArt?: string | null;
};

type SongCardProps = {
  song: Song;
  onDelete?: (songId: string) => void;
};

export const SongCard = ({ song, onDelete }: SongCardProps) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to song details
    e.stopPropagation(); // Prevent event bubbling
    if (onDelete) {
      onDelete(song.id);
    }
  };

  return (
    <Link
      href={`/release/${song.id}`}
      className="block group"
      aria-label={`View details for ${song.title}`}
    >
      <div className="bg-[#1e2936]/50 border border-gray-800 rounded-2xl overflow-hidden hover:bg-[#1e2936] hover:border-yellow-500/50 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-yellow-500/10 relative">
        
        {/* Delete Button */}
        <button
          onClick={handleDelete}
          className="absolute top-3 right-3 z-10 p-2 bg-red-500/90 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
          aria-label={`Delete ${song.title}`}
        >
          <Trash2 className="h-4 w-4 text-white" />
        </button>

        {/* Album Art Section - Square aspect ratio */}
        <div className="relative aspect-square w-full bg-[#0a0e14] overflow-hidden">
          {song.albumArt ? (
            <img
              src={song.albumArt}
              alt={`Album art for ${song.title}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ImageIcon className="w-16 h-16 mb-3" />
              <p className="text-sm">Art not available</p>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 pr-4">
              <h3 className="text-xl font-bold text-white truncate mb-1">
                {song.title}
              </h3>
              <p className="text-sm text-gray-400">by {song.artist_name}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
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

          <div className="flex justify-between items-center border-t border-gray-700/50 pt-4">
            <span className="text-sm text-gray-400 font-medium">View release details</span>
            <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-yellow-500 group-hover:translate-x-1 transition-all duration-300" />
          </div>
        </div>
      </div>
    </Link>
  );
};