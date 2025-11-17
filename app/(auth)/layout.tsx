import Link from "next/link";
import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Authentication | Hamonix",
  description:
    "Sign in or create an account to start your music export journey.",
};

// This is the static marketing panel component for the right side
const MarketingPanel = () => (
  <div className="hidden lg:flex flex-col items-start justify-center p-12 bg-gray-900 text-white relative overflow-hidden">
    {/* Decorative blobs */}
    <div className="absolute top-0 right-0 -mr-24 -mt-24 w-64 h-64 bg-yellow-400 rounded-full opacity-10 mix-blend-multiply filter blur-3xl animate-blob"></div>
    <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-72 h-72 bg-blue-400 rounded-full opacity-10 mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>

    <div className="z-10">
      <h1 className="text-4xl font-bold mb-4">
        Create Music Like Never Before
      </h1>
      <p className="text-lg text-gray-300 mb-8">
        Transform your vocals into professional tracks with AI-powered
        production.
      </p>
      <div className="space-y-6">
        <FeatureItem
          text="AI-Powered Production"
          description="Upload your vocals and let our AI create professional instrumentals in any genre."
        />
        <FeatureItem
          text="Studio-Quality Output"
          description="Get professionally mixed and mastered tracks ready for streaming platforms."
        />
        <FeatureItem
          text="Complete Export Package"
          description="Download your track, artwork, and press kit - everything you need to release."
        />
      </div>
      <p className="mt-12 text-gray-400">
        Trusted by 10,000+ artists worldwide
      </p>
    </div>
  </div>
);

const FeatureItem = ({
  text,
  description,
}: {
  text: string;
  description: string;
}) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
      <svg
        className="w-4 h-4 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M5 13l4 4L19 7"
        ></path>
      </svg>
    </div>
    <div>
      <h3 className="font-semibold">{text}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  </div>
);

// This layout is rendered as a slot in the root layout for auth pages
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side: The form will be injected here via {children} */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8 self-start">
            {/* <Image src="/hamonix-logo.svg" alt="Hamonix Logo" width={40} height={40} /> */}
            <span className="text-2xl font-bold text-white">Hamonix</span>
          </Link>
          {children}
        </div>
      </div>

      {/* Right Side: The static marketing panel */}
      <MarketingPanel />
    </div>
  );
}
