"use client";

import { useState, useEffect, useMemo } from "react";
import { SongCard } from "./SongCard";

import { createClient } from "@/lib/supabase/client";

// Use a more specific type if you have one
type Song = any;

export const StudioClient = ({ initialSongs }: { initialSongs: Song[] }) => {
  const [songs, setSongs] = useState(initialSongs);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Supabase real-time subscription
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("realtime songs")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "songs" },
        (payload) => {
          console.log("Change received!", payload);
          // This is a simple refetch, you could also update state directly
          // For a more robust solution, you'd find the changed song and update/add/remove it
          const newSong = payload.new as Song;
          setSongs((currentSongs) => {
            const songExists = currentSongs.some((s) => s.id === newSong.id);
            if (songExists) {
              return currentSongs.map((s) =>
                s.id === newSong.id ? newSong : s
              );
            }
            return [newSong, ...currentSongs];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredSongs = useMemo(() => {
    return songs.filter((song) => {
      const matchesSearch = song.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter ? song.status === statusFilter : true;
      return matchesSearch && matchesStatus;
    });
  }, [songs, searchQuery, statusFilter]);

  return (
    <div>
      {/* <DashboardControls
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
      /> */}

      {filteredSongs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSongs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-gray-700 rounded-lg">
          <h2 className="text-2xl font-semibold">No Matching Songs</h2>
          <p className="text-gray-400 mt-2 mb-6">
            Try adjusting your search or filter.
          </p>
        </div>
      )}
    </div>
  );
};
