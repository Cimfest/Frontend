import Link from "next/link";
import { Mic, ArrowRight } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { ShareButton } from "./ShareButton";

type Song = {
  id: string;
  title: string;
  artist_name: string;
  status: "Completed" | "Processing" | "Failed" | "Pending";
};

export const SongCard = ({ song }: { song: Song }) => {
  return (

    <Link href={`/dashboard/songs/${song.id}`} className="block">
      <div className="bg-gray-800/50 border border-gray-700/80 rounded-lg p-6 hover:bg-gray-800 transition-colors group relative">

        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white">{song.title}</h3>
            <p className="text-sm text-gray-400">by {song.artist_name}</p>
          </div>
          
          {/* Icons container - Share button on ALL cards */}
          <div className="flex items-center gap-2">
            <ShareButton
              songId={song.id}
              songTitle={song.title}
              artistName={song.artist_name}
            />
            <Mic className="h-5 w-5 text-gray-500" />
          </div>
        </div>

        <div className="mb-6">
          <StatusBadge status={song.status} />
        </div>

        <div className="flex justify-between items-center border-t border-gray-700 pt-4">
          <span className="text-sm text-gray-400">Click to view details</span>
          <ArrowRight className="h-5 w-5 text-gray-500 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};