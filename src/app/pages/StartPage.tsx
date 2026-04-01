import React, { useState, useEffect } from "react";
import { FaCaretLeft, FaCaretRight, FaShare, FaStar, FaGithub } from "react-icons/fa";
import { LuVolume2, LuVolumeX } from "react-icons/lu"
import { useNavigate } from "react-router";
import { Button } from "../components/Button";
import { ShareSheet } from "../components/ShareSheet";
import startBg from "./../../assets/startbg.png";
import rahulImage from "./../../assets/characters/rahul/3.png";
import modiImage from "./../../assets/characters/modi/5.png";
import Logo from "./../../assets/favicon.png"
import modiMusic from "./../../assets/audio/wah-modiji-wah.mp3";
import rahulMusic from "./../../assets/audio/maja-aaya.mp3";

const CHARACTERS = [
  { id: 'modi', name: 'MODI', image: modiImage, audio: modiMusic },
  { id: 'rahul', name: 'RAHUL', image: rahulImage, audio: rahulMusic },
];

export const StartPage: React.FC = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(CHARACTERS[0].id);
  const navigate = useNavigate();

  useEffect(() => {
    const audio = (window as any).bgAudio;
    if (audio) {
      audio.muted = isMuted;
    }
  }, [isMuted]);

  const handleStartGame = () => {
    navigate('/game', { state: { character: selectedCharacter } });
  };

  const handleCharacterChange = (characterId: string) => {
    setSelectedCharacter(characterId);
    if (!isMuted) {
      const audio = new Audio(CHARACTERS.find(c => c.id === characterId)?.audio);
      audio.play().catch(e => console.error("Audio playback failed:", e));
      (window as any).bgAudio = audio;
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "MODIMAN",
          text: "Play MODIMAN - The ultimate maze game!",
          url: "https://modiman-xi.vercel.app/"
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error("Share failed:", error);
          setIsShareOpen(true);
        }
      }
    } else {
      setIsShareOpen(true);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black font-['Press_Start_2P'] flex flex-col items-center">
      <style>{`
        .glitch-wrapper {
          position: relative;
          z-index: 1;
        }

        .glitch {
          position: relative;
          color: #FFFF00;
          font-size: clamp(2rem, 8vw, 5rem);
          font-weight: 700;
          letter-spacing: 5px;
          text-shadow: 0 0 10px rgba(255, 255, 0, 0.8), 0 0 20px rgba(255, 255, 0, 0.5);
          animation: glitch-skew 1s infinite linear alternate-reverse;
        }
        
        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .glitch::before {
          left: 2px;
          text-shadow: -2px 0 #0000FF;
          clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
          animation: glitch-anim 2s infinite linear alternate-reverse;
        }

        .glitch::after {
          left: -2px;
          text-shadow: -2px 0 #FF0000;
          clip-path: polygon(0 80%, 100% 20%, 100% 100%, 0 100%);
          animation: glitch-anim2 3s infinite linear alternate-reverse;
        }

        @keyframes glitch-anim {
          0% { clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%); }
          20% { clip-path: polygon(0 15%, 100% 15%, 100% 15%, 0 15%); }
          40% { clip-path: polygon(0 10%, 100% 10%, 100% 20%, 0 20%); }
          60% { clip-path: polygon(0 1%, 100% 1%, 100% 2%, 0 2%); }
          80% { clip-path: polygon(0 33%, 100% 33%, 100% 33%, 0 33%); }
          100% { clip-path: polygon(0 44%, 100% 44%, 100% 44%, 0 44%); }
        }

        @keyframes glitch-anim2 {
          0% { clip-path: polygon(0 25%, 100% 25%, 100% 30%, 0 30%); }
          20% { clip-path: polygon(0 3%, 100% 3%, 100% 3%, 0 3%); }
          40% { clip-path: polygon(0 5%, 100% 5%, 100% 20%, 0 20%); }
          60% { clip-path: polygon(0 20%, 100% 20%, 100% 20%, 0 20%); }
          80% { clip-path: polygon(0 10%, 100% 10%, 100% 10%, 0 10%); }
          100% { clip-path: polygon(0 40%, 100% 40%, 100% 40%, 0 40%); }
        }
        
        @keyframes glitch-skew {
          0% { transform: skew(0deg); }
          10% { transform: skew(0deg); }
          11% { transform: skew(-2deg); }
          12% { transform: skew(0deg); }
          50% { transform: skew(0deg); }
          51% { transform: skew(2deg); }
          52% { transform: skew(0deg); }
          100% { transform: skew(0deg); }
        }
      `}</style>

      {/* Scrolling Parallax Background - CSS animated */}
      <div
        className="absolute inset-0 z-0 "
        style={{
          backgroundImage: `url(${startBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          imageRendering: 'pixelated',
        }}
      />

      {/* Dark overlay to ensure neon stands out */}
      <div className="absolute inset-0 z-0 bg-black/60" />

      {/* Top Bar Actions */}
      <div className="absolute top-4 right-4 z-20 flex gap-4">
        <Button variant="icon" onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? <LuVolumeX size={20} /> : <LuVolume2 size={20} />}
        </Button>
        <Button variant="icon" onClick={handleShare}>
          <FaShare size={20} />
        </Button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center p-6 text-center">

        {/* Animated Modiman Logo Section */}
        <div className="mb-6 flex flex-col items-center gap-6">

          <div className="glitch-wrapper flex flex-col items-center justify-center">
            <div className="relative w-60 h-60 overflow-hidden justify-center rounded-2xl">
              <img src={Logo} alt="modiman" className="object-fit w-full glitch" />
            </div>
            <h1 className="glitch" data-text="MODIMAN">MODIMAN</h1>
          </div>
        </div>

        {/* Menu Options */}
        <div className="flex items-center w-full md:w-3/4 flex-col gap-6 ">
          <Button
            className="w-3/4 md:w-1/2 md:text-lg py-3 md:py-5 group"
            onClick={handleStartGame}
          >
            <FaCaretRight size={28} className="md:opacity-0 group-hover:opacity-100 transition-opacity" />
            START GAME
            <FaCaretLeft size={28} className="md:opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
          {/* Character Selection */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-12 mt-4 w-full md:w-3/4  justify-center items-center md:justify-start md:items-start">
            {CHARACTERS.map((char) => (
              <Button key={char.id} variant="secondary" className={`flex justify-baseline items-center md:w-full w-2/3 group relative ${selectedCharacter === char.id
                ? ' shadow-[0_0_15px_rgba(255,255,0,0.3)] scale-105 border-2 border-[#FFFF00]'
                : ''
                }`}
                onClick={() => handleCharacterChange(char.id)}>
                <FaCaretRight size={28} className={`opacity-0 ${selectedCharacter === char.id ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
                <span>{char.name}</span>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-[#FFFF00] group-hover:shadow-[0_0_10px_#FFFF00]">
                  <img src={char.image} alt={char.name} />
                </div>
              </Button>
            ))}
          </div>
        </div>



      </div>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 md:flex flex-col items-center gap-1 w-full p-2 hidden">
        <p className="text-[10px] md:text-[8px] text-white opacity-80 text-center">
          Developed by <a href="https://github.com/codeitzpa1" target="_blank" rel="noopener noreferrer" className="text-[#FFFF00] hover:underline">code.itzpa1</a>
        </p>
        <a 
          href="https://github.com/codeitzpa1" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[10px] md:text-[8px] text-[#FFFF00] hover:scale-105 transition-transform flex items-center gap-2 drop-shadow-[0_0_5px_rgba(255,255,0,0.5)]"
        >
          <FaGithub /> Give star on GitHub project <FaStar className="animate-pulse" />
        </a>
        <p className="text-[10px] md:text-[8px] text-white/40 italic text-center mt-2">
          This game is for just fun. This game is not related to any political party or any person.*
        </p>
      </div>

      <ShareSheet isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
    </div>
  );
};
