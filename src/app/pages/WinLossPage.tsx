import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "../components/Button";
import { ShareSheet } from "../components/ShareSheet";
import html2canvas from "html2canvas";

// Import assets
import modiVideo from "./../../assets/win/modiwin.mp4";
import rahulVideo from "./../../assets/win/rahulwin.mp4";
import winmodiPhoto from "./../../assets/win/winmodi.png";
import winrahulPhoto from "./../../assets/win/winrahul.png";
import {FaHouse} from "react-icons/fa6";
import { FaPlay, FaShare, FaTrophy } from "react-icons/fa";

export const WinLossPage: React.FC = () => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const cardRef = useRef<HTMLDivElement>(null);

  const { status, character, score } = location.state || { status: 'loss', character: 'modi', score: 0 };
  const isWin = status === 'win';

  // Media selection: If you win, show your video. If you lose, show the opponent's video.
  const showModi = (character === 'modi' && isWin) || (character === 'rahul' && !isWin);
  const videoSrc = showModi ? modiVideo : rahulVideo;
  const photoSrc = showModi ? winmodiPhoto : winrahulPhoto;

  // Sync music
  useEffect(() => {
    const audio = (window as any).bgAudio;
    if (audio) {
      audio.muted = true;
    }
    return () => {
      if (audio) audio.muted = false;
    };
  }, []);

  const handleScreenshotAndShare = async () => {
    if (!cardRef.current) return;
    setIsSharing(true);
    try {
      // Small delay to ensure any animations settle
      await new Promise(r => setTimeout(r, 100));

      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#000",
        scale: 2,
        useCORS: true,
        logging: false,
      });

      canvas.toBlob(async (blob) => {
        if (!blob) {
          setIsShareOpen(true);
          return;
        }

        const file = new File([blob], "modiman_score.png", { type: "image/png" });
        const shareData = {
          files: [file],
          title: "MODIMAN Score",
          text: `I scored ${score} in MODIMAN! 🏆 Can you beat me? \nPlay here: ${window.location.origin}`,
        };

        // Try to share with files
        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share(shareData);
          } catch (shareErr) {
            if ((shareErr as Error).name !== 'AbortError') {
              console.error("Share failed:", shareErr);
              setIsShareOpen(true);
            }
          }
        } else {
          // Fallback to standard share sheet if files not supported
          setIsShareOpen(true);
        }
      }, "image/png");
    } catch (error) {
      console.error("Screenshot capture failed:", error);
      setIsShareOpen(true);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-black p-4 font-['Press_Start_2P'] relative overflow-x-hidden pt-4">

      {/* Background Effect */}
      {isWin && (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(255,255,0,0.15)_0%,transparent_70%)] animate-pulse" />
        </div>
      )}

      {/* Capture Card Area */}
      <div ref={cardRef} className="relative z-10 flex w-full max-w-sm flex-col items-center gap-6 bg-black p-6 rounded-2xl border-2 border-[#0000FF]/30 shadow-[0_0_30px_rgba(0,0,255,0.1)]">

        <header className="flex flex-col items-center gap-2">
          {isWin ? (
            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter text-[#FFFF00] animate-bounce drop-shadow-[0_0_10px_#FFFF00]">
              YOU WIN!
            </h1>
          ) : (
            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter text-red-600 animate-pulse drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">
              GAME OVER
            </h1>
          )}
        </header>

        <div className="flex flex-col items-center gap-4 w-full">
          {/* Achievement Media Container - 9:16 Portrait Fix */}
          <div className="relative w-full aspect-[9/16] max-h-[400px] md:max-h-[450px] rounded-xl border-4 border-[#0000FF] bg-black shadow-2xl overflow-hidden group">
            <video
              src={videoSrc}
              autoPlay
              loop
              playsInline
              className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Decorated Result Photo */}
          <div className="relative -mt-10 md:-mt-40 w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-[#FFFF00] bg-black shadow-2xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-300 z-10">
            <img src={photoSrc} alt="Result" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 right-0 p-1">
              <FaTrophy className="text-[#FFFF00] drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]" size={20} />
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] text-pink-500 tracking-widest animate-pulse">FINAL SCORE</span>
          <span className="text-2xl md:text-3xl text-white drop-shadow-[0_2px_4px_rgba(255,255,255,0.4)]">
            {score.toString().padStart(6, '0')}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="relative z-20 flex flex-col md:flex-row gap-4 w-full max-w-sm mb">
        <div className="flex gap-4 items-centerjustify-between">
          <Button
            variant="primary"
            className="flex-1 py-4 md:py-2 text-xs md:text-sm flex gap-3 shadow-[0_0_20px_rgba(255,255,0,0.2)]"
            onClick={() => navigate('/game', { state: { character: character } })}
          >
            <FaPlay className="animate-spin-slow" /> REPLAY
          </Button>
          <Link to="/" className="flex items-center justify-center">
            <Button variant="icon" className="p-4 md:p-2 flex items-center justify-center">
              <FaHouse size={24} />
            </Button>
          </Link>
        </div>

        <Button
          variant="secondary"
          className="flex-1 py-4 md:py-2 text-xs md:text-sm flex gap-3 border-[#FFFF00] text-[#FFFF00]"
          onClick={handleScreenshotAndShare}
          disabled={isSharing}
        >
          <FaShare size={24} /> {isSharing ? 'WAIT...' : 'SHARE SCORE'}
        </Button>


      </div>

      <ShareSheet isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} score={score} />
    </div>
  );
};
