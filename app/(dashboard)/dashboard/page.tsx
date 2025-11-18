// KEY CHANGE: This is now a Client Component to access localStorage
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Info, Loader2 } from "lucide-react";
import { SongCard } from "@/components/dashboard/SongCard";
import { getUserProfile } from "@/app/actions/user-actions";
// KEY CHANGE: We now use this as a fallback for the first load
import { getAllSongs as getInitialSongs } from "@/lib/data/dummy-songs";

// Define a type for the profile for better type safety
interface UserProfile {
  artist_name: string;
  email: string;
  first_name: string;
  last_name: string;
}

export default function DashboardPage() {
  // KEY CHANGE: We use state to hold data fetched on the client
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // KEY CHANGE: We fetch all data in a useEffect hook
  useEffect(() => {
    async function loadDashboardData() {
      // Fetch user profile
      const userProfile = await getUserProfile();
      setProfile(userProfile);

      // Fetch songs from localStorage
      const storedSongs = localStorage.getItem("allSongs");
      if (storedSongs) {
        setSongs(JSON.parse(storedSongs));
      } else {
        // If nothing in localStorage, this is the first visit.
        // Load the initial dummy songs and save them.
        const initialSongs = getInitialSongs();
        setSongs(initialSongs);
        localStorage.setItem("allSongs", JSON.stringify(initialSongs));
      }

      setIsLoading(false);
    }

    loadDashboardData();
  }, []); // Empty dependency array means this runs once on component mount

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
