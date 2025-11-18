// /lib/store.ts
"use client";
import { create } from "zustand";

interface SongDetails {
  title: string;
  genre: string;
  mood: string;
  artistName: string;
  vocalFile: File | null;
}

interface SongState extends SongDetails {
  setSongDetails: (details: SongDetails) => void;
}

export const useSongStore = create<SongState>((set) => ({
  title: "",
  genre: "",
  mood: "",
  artistName: "",
  vocalFile: null,
  setSongDetails: (details) => set({ ...details }),
}));
