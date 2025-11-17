import Link from "next/link";

export const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-400 py-8 px-6 md:px-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-bold text-white mb-2">Hamonix</h3>
          <p className="text-sm">Empowering Cameroonian Music Export.</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link href="/about" className="hover:text-white">
            About Us
          </Link>
          <Link href="/contact" className="hover:text-white">
            Contact
          </Link>
          <Link href="/#features" className="hover:text-white">
            Features
          </Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link href="/privacy" className="hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-white">
            Terms of Service
          </Link>
          <p className="mt-4">
            &copy; {new Date().getFullYear()} Hamonix. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
