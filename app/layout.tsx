import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | Hamonix",
    default: "Hamonix - Turn Your Voice Into Studio-Quality Music",
  },
  description:
    "AI-powered music export for Cameroonian artists. Go from raw vocals to a globally distributed track on Spotify and Apple Music in minutes, completely free.",
  openGraph: {
    title: "Hamonix - Turn Your Voice Into Studio-Quality Music",
    description: "The complete music export pipeline for Cameroonian artists.",
    url: "https://hamonix.com", // Replace with your actual domain
    siteName: "Hamonix",
    images: [
      {
        url: "https://hamonix.com/og-image.png", // Replace with your actual social image URL
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hamonix - Turn Your Voice Into Studio-Quality Music",
    description: "The complete music export pipeline for Cameroonian artists.",
    images: ["https://hamonix.com/og-image.png"], // Replace with your actual social image URL
  },
};

// This is the RootLayout component that wraps all non-auth pages
export default function RootLayout({
  children,
  auth,
}: Readonly<{
  children: React.ReactNode;
  auth?: React.ReactNode;
}>) {
  // If auth slot is being used, render auth pages without navbar and footer
  if (auth) {
    return (
      <html lang="en">
        <body className={`${inter.className} bg-gray-950 text-white`}>
          {auth}
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-white`}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
