// /lib/scriptStore.ts
"use client";
import { create } from "zustand";

interface ScriptState {
  isEssentiaReady: boolean;
  setEssentiaReady: (ready: boolean) => void;
}

export const useScriptStore = create<ScriptState>((set) => ({
  isEssentiaReady: false,
  setEssentiaReady: (ready) => set({ isEssentiaReady: ready }),
}));
