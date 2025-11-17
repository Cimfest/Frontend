import "../globals.css";
import { Inter } from "next/font/google";
import { DashboardHeader } from "@/components/layout/dashboard/DashboardHeader";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Your Studio | Hamonix",
  description: "Manage your songs and create new ones.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-white`}>
        <div className="flex flex-col min-h-screen">
          <DashboardHeader />
          <main className="grow container mx-auto p-6 md:p-12">{children}</main>
        </div>
      </body>
    </html>
  );
}
