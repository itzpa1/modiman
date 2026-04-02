import React, { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Button } from "../components/Button";
import { ShareSheet } from "../components/ShareSheet";
import html2canvas from "html2canvas";

// Import assets
import modiVideo from "./../../assets/win/modiwin.mp4";
import rahulVideo from "./../../assets/win/rahulwin.mp4";
import winmodiPhoto from "./../../assets/win/winmodi.png";
import winrahulPhoto from "./../../assets/win/winrahul.png";
import { FaHouse } from "react-icons/fa6";
import { FaPlay, FaShare, FaTrophy } from "react-icons/fa";

export const WinLossPage: React.FC = () => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const shareCardRef = useRef<HTMLDivElement>(null);

  const { status, character, score } = location.state || { status: 'loss', character: 'modi', score: 0 };
  const isWin = status === 'win';

  const winnerName = isWin
    ? (character === 'modi' ? 'MODI' : 'RAHUL')
    : (character === 'modi' ? 'RAHUL' : 'MODI');
  const loserName = isWin
    ? (character === 'modi' ? 'RAHUL' : 'MODI')
    : (character === 'modi' ? 'MODI' : 'RAHUL');

  const showModi = (character === 'modi' && isWin) || (character === 'rahul' && !isWin);
  const videoSrc = showModi ? modiVideo : rahulVideo;
  const photoSrc = showModi ? winmodiPhoto : winrahulPhoto;

  const handleScreenshotAndShare = async () => {
    if (!shareCardRef.current) return;
    setIsSharing(true);
    try {
      await new Promise(r => setTimeout(r, 200));
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: "#000000",
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        ignoreElements: (el) => el.tagName === 'VIDEO',
      });
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/png"));
      if (!blob) { setIsSharing(false); setIsShareOpen(true); return; }
      if (screenshotUrl) URL.revokeObjectURL(screenshotUrl);
      const url = URL.createObjectURL(blob);
      setScreenshotUrl(url);
      const file = new File([blob], "modiman_score.png", { type: "image/png" });
      const shareText = `I scored ${score} in MODIMAN! 🏆 Can you beat me?\nPlay here: https://modiman-xi.vercel.app/`;
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "MODIMAN Score", text: shareText });
          setIsSharing(false); return;
        } catch (err) {
          if ((err as Error).name === 'AbortError') { setIsSharing(false); return; }
        }
      }
      setIsSharing(false);
      setIsShareOpen(true);
    } catch (err) {
      console.error("Screenshot failed:", err);
      setIsSharing(false);
      setIsShareOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-black font-['Press_Start_2P'] relative overflow-hidden">

      {/* Win background glow */}
      {isWin && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,0,0.08)_0%,transparent_70%)] animate-pulse" />
        </div>
      )}

      {/* ══════════════════════════════════════
          MOBILE layout (< md):
          Full-screen video + overlay + bento buttons
      ══════════════════════════════════════ */}
      <div className="md:hidden relative w-full h-[100dvh] flex flex-col">

        {/* Video — fills screen */}
        <div className="absolute inset-0 z-0">
          <video
            src={videoSrc}
            autoPlay loop playsInline
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay: dark top + dark bottom */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80" />
        </div>

        {/* Top overlay — result text */}
        <div className="relative z-10 flex flex-col items-center pt-10 px-4 gap-1">
          <h1 className={`text-3xl font-bold tracking-tight text-[#FFFF00] drop-shadow-[0_0_15px_#FFFF00] ${isWin ? 'animate-bounce' : 'animate-pulse'}`}>
            {isWin ? 'YOU WIN!' : 'GAME OVER'}
          </h1>
          <p className="text-sm text-[#FFFF00]/80 tracking-widest animate-pulse mt-1">
            {winnerName} WINS 🏆
          </p>
          <p className="text-[10px] text-white/40 mt-0.5">
            {loserName} {isWin ? 'is out!' : 'lost!'}
          </p>
        </div>

        {/* Middle — character photo + score, overlaid on video */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-4 px-4">
          {/* Character photo */}
          <div className="relative w-28 h-28 rounded-2xl border-4 border-[#FFFF00] bg-black/40 shadow-[0_0_20px_rgba(255,255,0,0.4)] overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-300">
            <img src={photoSrc} alt="Result" className="w-full h-full object-cover" />
            <div className="absolute bottom-0 right-0 p-1">
              <FaTrophy className="text-[#FFFF00] drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]" size={18} />
            </div>
          </div>
          {/* Score */}
          <div className="flex flex-col items-center gap-1">
            <span className="text-[9px] text-pink-400 tracking-[4px] animate-pulse">FINAL SCORE</span>
            <span className="text-4xl text-white font-bold drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] tabular-nums">
              {score.toString().padStart(6, '0')}
            </span>
          </div>
        </div>

        {/* Bottom — bento-grid action buttons */}
        <div className="relative z-10 p-4 pb-6 grid grid-cols-2 gap-3">
          <Button
            variant="primary"
            className="col-span-1 py-5 text-xs flex items-center justify-center gap-2"
            onClick={() => navigate('/game', { state: { character } })}
          >
            <FaPlay /> REPLAY
          </Button>

          <Link to="/" className="col-span-1 flex">
            <Button variant="icon" className="flex-1 py-5 flex items-center justify-center gap-2 text-xs w-full">
              <FaHouse size={20} /> HOME
            </Button>
          </Link>

          <Button
            variant="secondary"
            className="col-span-2 py-5 text-xs flex items-center justify-center gap-2 border-[#FFFF00] text-[#FFFF00]"
            onClick={handleScreenshotAndShare}
            disabled={isSharing}
          >
            <FaShare size={18} /> {isSharing ? 'CAPTURING...' : 'SHARE SCORE'}
          </Button>
        </div>
      </div>

      {/* ══════════════════════════════════════
          DESKTOP / TABLET layout (≥ md):
          Two-column: video left, info+actions right
      ══════════════════════════════════════ */}
      <div className="hidden md:flex min-h-screen w-full max-w-5xl mx-auto items-stretch gap-8 p-6">

        {/* LEFT — Video panel */}
        <div className="w-[340px] flex-shrink-0 flex flex-col justify-center">
          <div className="relative w-full aspect-[9/16] rounded-2xl border-4 border-[#0000FF] bg-black shadow-[0_0_30px_rgba(0,0,255,0.4)] overflow-hidden group">
            <video
              src={videoSrc}
              autoPlay loop playsInline
              className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>

        {/* RIGHT — Info + actions */}
        <div className="flex-1 flex flex-col items-start justify-between gap-6 py-4">

          <header className="flex flex-col items-start gap-3">
            <h1 className={`text-4xl font-bold tracking-tight text-[#FFFF00] drop-shadow-[0_0_15px_#FFFF00] ${isWin ? 'animate-bounce' : 'animate-pulse'}`}>
              {isWin ? 'YOU WIN!' : 'GAME OVER'}
            </h1>
            <p className="text-lg text-[#FFFF00]/80 tracking-widest animate-pulse">
              {winnerName} WINS 🏆
            </p>
            <p className="text-[11px] text-white/40 tracking-wide">
              {loserName} {isWin ? 'is out!' : 'lost!'}
            </p>
          </header>

          {/* Character photo + score side by side */}
          <div className="flex flex-row items-end gap-6">
            <div className="relative w-40 h-40 rounded-2xl border-4 border-[#FFFF00] bg-black shadow-2xl overflow-hidden transform rotate-3 hover:rotate-0 transition-transform duration-300 flex-shrink-0">
              <img src={photoSrc} alt="Result" className="w-full h-full object-cover" />
              <div className="absolute bottom-0 right-0 p-1">
                <FaTrophy className="text-[#FFFF00] drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]" size={20} />
              </div>
            </div>
            <div className="flex flex-col items-start gap-2">
              <span className="text-[10px] text-pink-500 tracking-[4px] animate-pulse">FINAL SCORE</span>
              <span className="text-5xl text-white font-bold drop-shadow-[0_0_20px_rgba(255,255,255,0.3)] tabular-nums">
                {score.toString().padStart(6, '0')}
              </span>
            </div>
          </div>

          <div className="w-full border-t border-[#0000FF]/30" />

          {/* Action buttons */}
          <div className="flex flex-row gap-3 w-full">
            <Button
              variant="primary"
              className="flex-1 py-4 text-xs flex items-center justify-center gap-3"
              onClick={() => navigate('/game', { state: { character } })}
            >
              <FaPlay /> REPLAY
            </Button>
            <Button
              variant="secondary"
              className="flex-1 py-4 text-xs flex items-center justify-center gap-3 border-[#FFFF00] text-[#FFFF00]"
              onClick={handleScreenshotAndShare}
              disabled={isSharing}
            >
              <FaShare size={18} /> {isSharing ? 'CAPTURING...' : 'SHARE SCORE'}
            </Button>
            <Link to="/" className="flex items-center justify-center">
              <Button variant="icon" className="p-4 flex items-center justify-center">
                <FaHouse size={22} />
              </Button>
            </Link>
          </div>

          <p className="text-[9px] text-white/20 tracking-widest">
            modiman-xi.vercel.app &nbsp;·&nbsp; code.itzpa1
          </p>
        </div>
      </div>

      {/* ── HIDDEN SHARE CARD (html2canvas safe — no video) ── */}
      <div
        ref={shareCardRef}
        aria-hidden
        style={{
          position: 'fixed', left: '-9999px', top: 0,
          width: '360px', background: '#000', padding: '28px',
          borderRadius: '16px', border: '2px solid #0000FF',
          fontFamily: "'Press Start 2P', monospace",
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#FFFF00', marginBottom: '8px' }}>
            {isWin ? 'YOU WIN!' : 'GAME OVER'}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,0,0.8)', marginBottom: '4px' }}>
            {winnerName} WINS 🏆
          </div>
          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)' }}>
            {loserName} {isWin ? 'is out!' : 'lost!'}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div style={{ width: '160px', height: '160px', borderRadius: '16px', border: '4px solid #FFFF00', overflow: 'hidden', background: '#111' }}>
            <img src={photoSrc} alt="Result" style={{ width: '100%', height: '100%', objectFit: 'cover' }} crossOrigin="anonymous" />
          </div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '9px', color: '#ec4899', marginBottom: '8px', letterSpacing: '2px' }}>FINAL SCORE</div>
          <div style={{ fontSize: '32px', color: '#fff', fontWeight: 700 }}>
            {score.toString().padStart(6, '0')}
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '8px', color: 'rgba(255,255,0,0.35)', letterSpacing: '1px' }}>
          modiman-xi.vercel.app
        </div>
      </div>

      <ShareSheet isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} score={score} screenshotUrl={screenshotUrl} />
    </div>
  );
};
