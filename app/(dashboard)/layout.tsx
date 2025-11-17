import Link from "next/link";
import "../globals.css";
import { Inter } from "next/font/google";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react"; // We'll use an icon for the user profile

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Your Studio | Hamonix",
  description: "Manage your songs and create new ones.",
};

// A simpler Navbar for when the user is logged in
const DashboardNavbar = () => (
  <header className="py-4 px-6 md:px-12 flex justify-between items-center bg-gray-950 border-b border-gray-800">
    <Link href="/dashboard" className="flex items-center gap-2">
      <span className="text-xl font-bold text-white">Hamonix Studio</span>
    </Link>
    <div className="flex items-center gap-4">
      {/* This would eventually be a dropdown with settings and logout */}
      <Button variant="ghost" size="icon">
        <User className="h-5 w-5 text-gray-400" />
      </Button>
    </div>
  </header>
);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 text-white`}>
        <div className="flex flex-col min-h-screen">
          <DashboardNavbar />
          <main className="flex-grow container mx-auto p-6 md:p-12">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
