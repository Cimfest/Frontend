"use client"; // This component will have interactive elements like the dropdown, so it's a client component.

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { User, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// We need to add the DropdownMenu component from Shadcn/UI
// Run this in your terminal: npx shadcn-ui@latest add dropdown-menu

export const DashboardHeader = () => {
  // TODO: Add Supabase logic here to get user info and handle logout

  const handleLogout = async () => {
    // const supabase = createClient();
    // await supabase.auth.signOut();
    // router.push('/login');
    console.log("Logging out...");
  };

  return (
    <header className="py-4 px-6 md:px-12 flex justify-between items-center bg-gray-950 border-b border-gray-800 sticky top-0 z-50">
      {/* Left Side: Brand Logo/Name */}
      <Link href="/dashboard" className="flex items-center gap-2">
        {/* You could add a logo SVG here */}
        <span className="text-xl font-bold text-white">Hamonix Studio</span>
      </Link>

      {/* Right Side: User Profile Dropdown */}
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="h-5 w-5 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="font-medium">Your Account</p>
              <p className="text-xs text-muted-foreground font-normal">
                {/* TODO: Replace with dynamic user email */}
                artist@example.com
              </p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-500 focus:text-red-500"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
