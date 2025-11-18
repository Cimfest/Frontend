"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Info, Loader2 } from "lucide-react";
import { SongCard } from "@/components/dashboard/SongCard";
import { getUserProfile } from "@/app/actions/user-actions";
import { getAllSongs as getInitialSongs } from "@/lib/data/dummy-songs";

interface UserProfile {
  artist_name: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Song {
  id: string;
  title: string;
  artist_name: string;
  status: "Completed" | "Processing" | "Failed" | "Pending";
  albumArt?: string | null;
  genre?: string;
  mood?: string;
  createdAt?: string;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      // Fetch user profile
      const userProfile = await getUserProfile();
      setProfile(userProfile);

      // Fetch songs from localStorage
      const storedSongs = localStorage.getItem("allSongs");
      if (storedSongs) {
        const parsedSongs = JSON.parse(storedSongs);
        console.log("Loaded songs from localStorage:", parsedSongs);
        setSongs(parsedSongs);
      } else {
        // If nothing in localStorage, load initial dummy songs
        const initialSongs = getInitialSongs();
        setSongs(initialSongs);
        localStorage.setItem("allSongs", JSON.stringify(initialSongs));
      }

      setIsLoading(false);
    }

    loadDashboardData();
  }, []);

  // Listen for storage changes (when new songs are added)
  useEffect(() => {
    const handleStorageChange = () => {
      const storedSongs = localStorage.getItem("allSongs");
      if (storedSongs) {
        setSongs(JSON.parse(storedSongs));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Also check for updates on focus (in case user comes back from another tab)
    window.addEventListener("focus", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", handleStorageChange);
    };
  }, []);

  if (isLoading || !profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-12 h-12 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold">Your Studio</h1>
            <p className="text-gray-400 mt-2">
              Welcome back,{" "}
              <span className="text-yellow-400 font-semibold">
                {profile.artist_name}
              </span>
              !
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/create-song">
              <Plus className="mr-2 h-5 w-5" />
              Create New Song
            </Link>
          </Button>
        </div>

        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Artist Name</p>
              <p className="font-semibold">{profile.artist_name}</p>
            </div>
            <div>
              <p className="text-gray-400">Email</p>
              <p className="font-semibold">{profile.email}</p>
            </div>
            <div>
              <p className="text-gray-400">First Name</p>
              <p className="font-semibold">{profile.first_name}</p>
            </div>
            <div>
              <p className="text-gray-400">Last Name</p>
              <p className="font-semibold">{profile.last_name}</p>
            </div>
          </div>
        </div>
      </div>

      {songs && songs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {songs.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-gray-700 rounded-lg">
          <h2 className="text-2xl font-semibold">No songs yet</h2>
          <p className="text-gray-400 mt-2 mb-6">
            Click &quot;Create New Song&quot; to get started.
          </p>
          <Button asChild size="lg">
            <Link href="/create-song">
              <Plus className="mr-2 h-5 w-5" />
              Create New Song
            </Link>
          </Button>
        </div>
      )}

      <div className="flex items-center justify-center mt-12 text-gray-500 text-sm">
        <Info className="mr-2 h-4 w-4" />
        <span>
          Your tracks are automatically saved and synced across all devices.
        </span>
      </div>
    </div>
  );
}