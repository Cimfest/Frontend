import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Info } from "lucide-react";
import { SongCard } from "@/components/dashboard/SongCard";
import { createClient } from "@/lib/supabase/client";

// Dummy data for development when not logged in
const dummySongs = [
  {
    id: "1",
    title: "Afro Love",
    artist_name: "Kwame Asante",
    status: "Completed",
  },
  {
    id: "2",
    title: "Mbolé Fire",
    artist_name: "Aminata Diallo",
    status: "Processing",
  },
  {
    id: "3",
    title: "Midnight Makossa",
    artist_name: "Jean-Claude Mbarga",
    status: "Failed",
  },
  {
    id: "4",
    title: "Savanna Soul",
    artist_name: "Fatou Bensouda",
    status: "Pending",
  },
  {
    id: "5",
    title: "Bamenda Beats",
    artist_name: "Emmanuel Njoya",
    status: "Completed",
  },
  {
    id: "6",
    title: "Douala Dreams",
    artist_name: "Grace Mbock",
    status: "Processing",
  },
];

export default async function DashboardPage() {
  const supabase = createClient();

  // --- TEMPORARILY DISABLED AUTH ---
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) {
  //   // For now, we won't redirect. We'll show dummy data instead.
  //   // return redirect('/login');
  // }
  // --------------------------------

  // Since we are not logged in, we will use dummy data to build the UI.
  // In a real scenario, you would still fetch data here.
  // const { data: songs, error } = await supabase
  //   .from('songs')
  //   .select('*')
  //   .eq('user_id', user.id)
  //   .order('created_at', { ascending: false });

  // Use dummy data for now
  const songs = dummySongs;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Your Studio</h1>
        <Button asChild size="lg">
          <Link href="/create-song">
            <Plus className="mr-2 h-5 w-5" />
            Create New Song
          </Link>
        </Button>
      </div>

      {songs && songs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {songs.map((song) => (
            <SongCard
              key={song.id}
              song={{
                id: song.id,
                title: song.title,
                artist_name: song.artist_name,
                status: song.status as any, // Cast status to 'any' for dummy data
              }}
            />
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
