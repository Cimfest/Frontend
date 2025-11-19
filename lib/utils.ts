import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { getCurrentDemoUser } from "@/lib/data/dummy-users";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Your existing song storage functions
export interface Song {
  id: string;
  title: string;
  artist_name: string;
  status: "Completed" | "Processing" | "Failed" | "Pending";
  albumArt?: string | null;
  genre?: string;
  mood?: string;
  createdAt?: string;
}

/**
 * Save a new song to localStorage
 */
export function saveSongToLocalStorage(songData: Partial<Song>): Song {
  const currentUser = getCurrentDemoUser();
  
  const newSong: Song = {
    id: songData.id || `song-${Date.now()}`,
    title: songData.title || "Untitled",
    artist_name: songData.artist_name || currentUser.artist_name,
    status: songData.status || "Completed",
    albumArt: songData.albumArt || null,
    genre: songData.genre,
    mood: songData.mood,
    createdAt: songData.createdAt || new Date().toISOString(),
  };

  const existingSongsJson = localStorage.getItem("allSongs");
  const existingSongs: Song[] = existingSongsJson ? JSON.parse(existingSongsJson) : [];

  const existingIndex = existingSongs.findIndex(s => s.id === newSong.id);
  
  if (existingIndex !== -1) {
    existingSongs[existingIndex] = newSong;
  } else {
    existingSongs.unshift(newSong);
  }

  localStorage.setItem("allSongs", JSON.stringify(existingSongs));
  
  console.log("Song saved to localStorage:", newSong);
  
  return newSong;
}

/**
 * Get all songs from localStorage
 */
export function getAllSongsFromLocalStorage(): Song[] {
  const songsJson = localStorage.getItem("allSongs");
  return songsJson ? JSON.parse(songsJson) : [];
}

/**
 * Get a single song by ID
 */
export function getSongById(id: string): Song | null {
  const songs = getAllSongsFromLocalStorage();
  return songs.find(s => s.id === id) || null;
}