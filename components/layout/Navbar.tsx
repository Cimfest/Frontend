import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image"; // For your logo

export const Navbar = () => {
  return (
    <header className="py-4 px-6 md:px-12 flex justify-between items-center bg-gray-900 bg-opacity-80 backdrop-blur-sm sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2">
        {/* Replace with your actual logo */}
        {/* <Image src="/hamonix-logo.svg" alt="Hamonix Logo" width={30} height={30} /> */}
        <span className="text-xl font-bold text-white">Hamonix</span>
      </Link>
      <nav className="hidden md:flex items-center gap-6">
        <Link
          href="/#features"
          className="text-gray-300 hover:text-white transition-colors"
        >
          Features
        </Link>
        <Link
          href="/#testimonials"
          className="text-gray-300 hover:text-white transition-colors"
        >
          Testimonials
        </Link>
        <Link
          href="/pricing"
          className="text-gray-300 hover:text-white transition-colors"
        >
          Pricing
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <Link
          href="/login"
          className="text-gray-300 hover:text-white transition-colors text-sm"
        >
          Sign In
        </Link>
        <Button asChild>
          <Link href="/signup">Start Creating Free</Link>
        </Button>
      </div>
    </header>
  );
};
