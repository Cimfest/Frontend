// lib/data/dummy-songs.ts
import { getRandomPlaceholderImage } from "@/lib/placeholder-images";

export const getAllSongs = () => {
  return [
    {
      id: "1",
      title: "Bafanji",
      artist_name: "Brandon Blink",
      status: "Completed" as const,
      albumArt: getRandomPlaceholderImage(),
      genre: "Afrobeats",
      mood: "Uplifting",
      createdAt: "2024-01-15"
    },
    {
      id: "2",
      title: "Baranyi",
      artist_name: "Brandon Blink", 
      status: "Processing" as const,
      albumArt: getRandomPlaceholderImage(),
      genre: "Makossa",
      mood: "Energetic",
      createdAt: "2024-01-10"
    },
    {
      id: "3", 
      title: "Mbangwa",
      artist_name: "Brandon Blink",
      status: "Pending" as const,
      albumArt: getRandomPlaceholderImage(),
      genre: "Bikutsi",
      mood: "Rhythmic",
      createdAt: "2024-01-05"
    }
  ];
};