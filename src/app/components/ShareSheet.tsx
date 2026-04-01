import React from "react";
import { LuX, LuTwitter, LuLink as LinkIcon } from "react-icons/lu";
import { FaWhatsapp, FaSms } from "react-icons/fa";
import { Button } from "./Button";

interface ShareSheetProps {
  isOpen: boolean;
  onClose: () => void;
  score?: number;
}

export const ShareSheet: React.FC<ShareSheetProps> = ({ isOpen, onClose, score }) => {
  if (!isOpen) return null;

  const shareText = `I scored ${score || 0} points in MODIMAN! 🏆 Can you beat me? Play here: https://modiman-xi.vercel.app/`;
  const encodedText = encodeURIComponent(shareText);

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedText}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedText}`,
    sms: `sms:?body=${encodedText}`,
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://modiman-xi.vercel.app/");
    // You could add a toast here if available
    alert("Link copied to clipboard!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm sm:items-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-t-2xl sm:rounded-2xl border-4 border-[#0000FF] bg-black p-6 shadow-[0_0_30px_#0000FF] slide-in-from-bottom-full sm:slide-in-from-bottom-10">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl text-[#FFFF00] shadow-[#FFFF00] drop-shadow-[0_0_5px_rgba(255,255,0,0.8)]">
            SHARE SCORE
          </h2>
          <button
            onClick={onClose}
            className="text-[#0000FF] hover:text-[#FFFF00] transition-colors"
          >
            <LuX size={24} />
          </button>
        </div>

        {score !== undefined && (
          <div className="mb-6 text-center text-sm text-white">
            I SCORED <span className="text-[#FFFF00]">{score}</span> POINTS!
          </div>
        )}

        <div className="grid grid-cols-4 gap-4">
          <a 
            href={shareLinks.whatsapp} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#0000FF] bg-black group-hover:border-[#FFFF00] group-hover:text-[#FFFF00] group-hover:shadow-[0_0_15px_#FFFF00] transition-all">
              <FaWhatsapp size={20} />
            </div>
            <span className="text-[10px] text-gray-400 group-hover:text-[#FFFF00]">WA</span>
          </a>
          
          <a 
            href={shareLinks.twitter} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-2 group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#0000FF] bg-black group-hover:border-[#FFFF00] group-hover:text-[#FFFF00] group-hover:shadow-[0_0_15px_#FFFF00] transition-all">
              <LuTwitter size={20} />
            </div>
            <span className="text-[10px] text-gray-400 group-hover:text-[#FFFF00]">X</span>
          </a>

          <a 
            href={shareLinks.sms}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#0000FF] bg-black group-hover:border-[#FFFF00] group-hover:text-[#FFFF00] group-hover:shadow-[0_0_15px_#FFFF00] transition-all">
              <FaSms size={20} />
            </div>
            <span className="text-[10px] text-gray-400 group-hover:text-[#FFFF00]">SMS</span>
          </a>

          <button 
            onClick={handleCopyLink}
            className="flex flex-col items-center gap-2 group"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#0000FF] bg-black group-hover:border-[#FFFF00] group-hover:text-[#FFFF00] group-hover:shadow-[0_0_15px_#FFFF00] transition-all">
              <LinkIcon size={20} />
            </div>
            <span className="text-[10px] text-gray-400 group-hover:text-[#FFFF00]">COPY</span>
          </button>
        </div>

        <div className="mt-8">
          <Button variant="secondary" className="w-full text-xs py-3" onClick={onClose}>
            CANCEL
          </Button>
        </div>
      </div>
    </div>
  );
};
