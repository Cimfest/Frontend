// /components/ScriptLoader.tsx
"use client";

import { useEffect } from "react";
import { useScriptStore } from "@/lib/scriptStore";

export default function ScriptLoader() {
  const setEssentiaReady = useScriptStore((state) => state.setEssentiaReady);

  useEffect(() => {
    console.log("🚀 ScriptLoader: Loading Magenta.js");

    const loadMagenta = () => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/@magenta/music@1.23.1/dist/magentamusic.min.js";
        script.async = true;
        script.onload = () => {
          console.log("✅ Magenta.js loaded successfully");
          resolve(true);
        };
        script.onerror = (error) => {
          console.error("❌ Failed to load Magenta.js:", error);
          reject(error);
        };
        document.head.appendChild(script);
      });
    };

    loadMagenta()
      .then(() => {
        console.log("✅ All scripts ready");
        setEssentiaReady(true);
      })
      .catch((error) => {
        console.error("❌ Script loading failed:", error);
        // Still set ready so app doesn't hang
        setEssentiaReady(true);
      });

    return () => {
      console.log("🧹 ScriptLoader cleanup");
    };
  }, [setEssentiaReady]);

  return null;
}
