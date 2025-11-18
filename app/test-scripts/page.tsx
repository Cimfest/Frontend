// app/test-scripts/page.tsx
"use client";

import { useEffect } from "react";
import { useScriptStore } from "@/lib/scriptStore";

export default function TestScriptsPage() {
  const isEssentiaReady = useScriptStore((state) => state.isEssentiaReady);

  useEffect(() => {
    console.log("📄 Test page mounted");
    console.log("📊 isEssentiaReady:", isEssentiaReady);
    console.log("📊 window.essentia:", window.essentia);

    const interval = setInterval(() => {
      console.log("🔄 Checking every 2 seconds...");
      console.log("  - isEssentiaReady:", isEssentiaReady);
      console.log("  - window.essentia:", !!window.essentia);
    }, 2000);

    return () => clearInterval(interval);
  }, [isEssentiaReady]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Script Loading Test</h1>
      <div className="space-y-4">
        <div className="p-4 bg-gray-800 rounded">
          <h2 className="font-bold mb-2">Status:</h2>
          <p>Essentia Ready: {isEssentiaReady ? "✅ YES" : "❌ NO"}</p>
          <p>
            window.essentia exists:{" "}
            {typeof window !== "undefined" && window.essentia
              ? "✅ YES"
              : "❌ NO"}
          </p>
        </div>
        <div className="p-4 bg-gray-800 rounded">
          <h2 className="font-bold mb-2">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Open browser console (F12)</li>
            <li>Look for "🚀 ScriptLoader component HAS MOUNTED"</li>
            <li>Watch for script loading messages</li>
            <li>Check if status above changes to YES</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
