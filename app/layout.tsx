import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScriptLoader from "@/components/ScriptLoader";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Hamonix",
    default: "Hamonix - Turn Your Voice Into Studio-Quality Music",
  },
  description:
    "AI-powered music export for Cameroonian artists. Go from raw vocals to a globally distributed track on Spotify and Apple Music in minutes, completely free.",
};

export default function RootLayout({
  children,
  auth,
}: Readonly<{
  children: React.ReactNode;
  auth?: React.ReactNode;
}>) {
  if (auth) {
    return (
      <html lang="en">
        <body className={`${inter.className} bg-gray-950 text-white`}>
          {auth}
          <ScriptLoader />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-white`}>
        <ScriptLoader />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
