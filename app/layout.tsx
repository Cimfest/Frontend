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
    url: "https://hamonix.com",
    siteName: "Hamonix",

    images: [
      {
        url: "https://hamonix.com/og-image.png",
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
    images: ["https://hamonix.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        {/* The <main> tag wraps the primary content of the page */}
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
