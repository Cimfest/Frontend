"use client";

import { useState } from "react";
import { Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  TelegramShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  TelegramIcon,
  LinkedinIcon,
} from "react-share";

interface ShareButtonProps {
  songId: string;
  songTitle: string;
  artistName: string;
}

export function ShareButton({
  songId,
  songTitle,
  artistName,
}: ShareButtonProps) {
  const [open, setOpen] = useState(false);

  // Create the shareable URL
  // In production, this should be your actual domain
  const shareUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/dashboard/songs/${songId}`;

  // Craft an engaging share message
  const shareTitle = `🎵 Check out "${songTitle}" by ${artistName}`;
  const shareDescription = `Listen to my new track "${songTitle}" produced with AI on Hamonix Studio! 🔥🎶`;

  // Handle copy to clipboard
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Stop event propagation to prevent navigation when clicking share button
  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="text-gray-400 hover:text-yellow-400 transition-colors"
        onClick={handleShareClick}
        aria-label="Share song"
      >
        <Share2 className="h-5 w-5" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md bg-gray-800 border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Share Your Track
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Share "{songTitle}" with your fans and followers
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Social Media Share Buttons */}
            <div>
              <h3 className="text-sm font-medium mb-3 text-gray-300">
                Share on Social Media
              </h3>
              <div className="flex gap-3 flex-wrap">
                <FacebookShareButton
                  url={shareUrl}
                  // quote={shareDescription}
                  hashtag="#HamonixStudio"
                >
                  <FacebookIcon size={48} round />
                </FacebookShareButton>

                <TwitterShareButton
                  url={shareUrl}
                  title={shareTitle}
                  hashtags={["HamonixStudio", "NewMusic", "AIMusic"]}
                >
                  <TwitterIcon size={48} round />
                </TwitterShareButton>

                <WhatsappShareButton
                  url={shareUrl}
                  title={shareTitle}
                  separator=" - "
                >
                  <WhatsappIcon size={48} round />
                </WhatsappShareButton>

                <TelegramShareButton url={shareUrl} title={shareTitle}>
                  <TelegramIcon size={48} round />
                </TelegramShareButton>

                <LinkedinShareButton
                  url={shareUrl}
                  title={shareTitle}
                  summary={shareDescription}
                >
                  <LinkedinIcon size={48} round />
                </LinkedinShareButton>
              </div>
            </div>

            {/* Copy Link Section */}
            <div>
              <h3 className="text-sm font-medium mb-3 text-gray-300">
                Or Copy Link
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <Button
                  onClick={handleCopyLink}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold"
                >
                  Copy
                </Button>
              </div>
            </div>

            {/* Share Tips */}
            <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-semibold mb-2 text-yellow-400">
                💡 Tips for Going Viral
              </h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• Share during peak hours (6-9 PM local time)</li>
                <li>• Use trending hashtags in your niche</li>
                <li>• Tag influencers and music pages</li>
                <li>• Create a short teaser video for TikTok/Reels</li>
                <li>• Engage with comments and shares</li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
