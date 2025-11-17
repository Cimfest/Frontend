'use client';

import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClientComponentClient();
    await supabase.auth.signOut();
    router.push('/Login');
    router.refresh();
  };

  return (
    <Button variant="outline" onClick={handleLogout} size="sm">
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}