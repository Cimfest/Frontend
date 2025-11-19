// This file remains a Server Component

import { SongDetailView } from "@/components/dashboard/SongDetailView";

// Define the type for the page props
type SongDetailPageProps = {
  params: {
    id: string;
  };
};

// This function still runs on the server at build time, which is correct
export async function generateStaticParams() {
  // This is a bit of a problem. If your songs are ONLY in localStorage,
  // the server has no way to know what IDs to generate pages for.
  // For the build to pass, you must provide some static IDs here.
  // The ones you have are fine for a demo.
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
    { id: "4" },
    { id: "5" },
    { id: "6" },
  ];
}

// The page component is now very clean
export default async function SongDetailPage({ params }: SongDetailPageProps) {
  // We pass the 'id' from the server (params) to the client component as a prop
  return <SongDetailView id={params.id} />;
}
