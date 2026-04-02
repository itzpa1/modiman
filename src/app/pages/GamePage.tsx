import React, { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import { LuVolume2, LuVolumeX, LuMaximize, LuMinimize } from "react-icons/lu";
import { Link, useNavigate, useLocation } from "react-router";
import { DPad } from "../components/DPad";
import { FaHeart } from "react-icons/fa";

// Import character assets
import modi5 from "./../../assets/characters/modi/5.png";
import modi6 from "./../../assets/characters/modi/6.png";
import modi7 from "./../../assets/characters/modi/7.png";
import rahul1 from "./../../assets/characters/rahul/1.png";
import rahul2 from "./../../assets/characters/rahul/2.png";
import rahul3 from "./../../assets/characters/rahul/3.png";
import bonusImg from "./../../assets/characters/8.png";

// Audio assets
import bgMusic from "./../../assets/audio/bg_music.mp3";
import wahModi from "./../../assets/audio/wah-modiji-wah.mp3";
import majaAaya from "./../../assets/audio/maja-aaya.mp3";
import laureNa from "./../../assets/audio/laure-na-bhujjam-x-modi.mp3";
import khatam from "./../../assets/audio/khatam.mp3";

const INITIAL_MAZE = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 3, 1, 1, 0, 1, 2, 1, 0, 1, 1, 3, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 2, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 0, 1, 4, 1, 0, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 0, 1, 2, 1, 0, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 3, 1, 1, 0, 1, 0, 1, 0, 1, 1, 3, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const GRID_SIZE = { cols: 13, rows: 13 };

export const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const characterId = location.state?.character || 'modi';

  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('modiman_highScore') || '0'));
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const dpadRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const scoreRef2 = useRef<HTMLDivElement>(null);
  const hasAutoFullscreened = useRef(false);
  
  // High-performance dynamic scaling — accounts for header, score bar, and D-Pad
  useLayoutEffect(() => {
    const updateScale = () => {
      const headerH = headerRef.current?.offsetHeight || 0;
      const scoreH = scoreRef2.current?.offsetHeight || 0;
      const dpadH = dpadRef.current?.offsetHeight || 0;
      const availW = window.innerWidth - 16;
      const availH = window.innerHeight - headerH - scoreH - dpadH - 16;
      const s = Math.min(1, availW / 780, availH / 780);
      setScale(Math.max(0.1, s));
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) observer.observe(containerRef.current);
    window.addEventListener('resize', updateScale);
    return () => { observer.disconnect(); window.removeEventListener('resize', updateScale); };
  }, []);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [maze, setMaze] = useState(INITIAL_MAZE);
  const [playerUI, setPlayerUI] = useState({ x: 6, y: 10 });
  const [ghostsUI, setGhostsUI] = useState([
    { x: 5, y: 5, dir: 'LEFT' },
    { x: 6, y: 5, dir: 'UP' },
    { x: 7, y: 5, dir: 'RIGHT' },
  ]);

  const playerRef = useRef({ x: 6, y: 10, nextDir: null as string | null, currentDir: null as string | null });
  const ghostsRef = useRef([
    { x: 5, y: 5, dir: 'LEFT' },
    { x: 6, y: 5, dir: 'UP' },
    { x: 7, y: 5, dir: 'RIGHT' },
  ]);
  const mazeRef = useRef(INITIAL_MAZE);
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const isMutedRef = useRef(isMuted);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const lastEffectRef = useRef<HTMLAudioElement | null>(null);

  // Fullscreen helpers (with webkit prefix for Samsung/old browsers)
  const requestFullscreen = useCallback(() => {
    const el = document.documentElement as any;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  }, []);

  const exitFullscreen = useCallback(() => {
    const doc = document as any;
    if (doc.exitFullscreen) doc.exitFullscreen();
    else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
  }, []);

  const toggleFullscreen = useCallback(() => {
    const doc = document as any;
    const isFs = !!(doc.fullscreenElement || doc.webkitFullscreenElement);
    if (isFs) exitFullscreen(); else requestFullscreen();
  }, [requestFullscreen, exitFullscreen]);

  // Sync fullscreen state with browser
  useEffect(() => {
    const onFsChange = () => {
      const doc = document as any;
      setIsFullscreen(!!(doc.fullscreenElement || doc.webkitFullscreenElement));
    };
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
    };
  }, []);

  useEffect(() => { isMutedRef.current = isMuted; }, [isMuted]);

  const playerImg = characterId === 'modi' ? modi5 : rahul3;
  const enemyImgs = characterId === 'modi' ? [rahul1, rahul2, rahul3] : [modi5, modi6, modi7];

  const playEffect = useCallback((src: string) => {
    if (!isMutedRef.current) {
      // Stop previous effect sound before playing new one
      if (lastEffectRef.current) {
        lastEffectRef.current.pause();
        lastEffectRef.current.currentTime = 0;
      }
      const sfx = new Audio(src);
      lastEffectRef.current = sfx;
      sfx.play().catch(e => console.error("Audio error:", e));
    }
  }, []);

  const moveEntity = useCallback((x: number, y: number, dir: string | null) => {
    let nx = x, ny = y;
    if (dir === 'UP') ny--; if (dir === 'DOWN') ny++; if (dir === 'LEFT') nx--; if (dir === 'RIGHT') nx++;
    if (nx < 0) nx = GRID_SIZE.cols - 1; if (nx >= GRID_SIZE.cols) nx = 0;
    if (mazeRef.current[ny] && mazeRef.current[ny][nx] !== 1 && mazeRef.current[ny][nx] !== 4) return { x: nx, y: ny };
    return { x, y };
  }, []);

  const handleDirection = useCallback((dir: string) => {
    // Auto-enter fullscreen on first touch interaction (mobile only)
    if (!hasAutoFullscreened.current && window.innerWidth < 768) {
      hasAutoFullscreened.current = true;
      requestFullscreen();
    }
    playerRef.current.nextDir = dir;
  }, [requestFullscreen]);

  useEffect(() => {
    const loop = setInterval(() => {
      const p = playerRef.current;
      let nextPos = p.nextDir ? moveEntity(p.x, p.y, p.nextDir) : { x: p.x, y: p.y };
      if (nextPos.x !== p.x || nextPos.y !== p.y) {
        p.currentDir = p.nextDir; p.nextDir = null;
        p.x = nextPos.x; p.y = nextPos.y;
      } else if (p.currentDir) {
        nextPos = moveEntity(p.x, p.y, p.currentDir);
        p.x = nextPos.x; p.y = nextPos.y;
      }

      const cell = mazeRef.current[p.y][p.x];
      if (cell === 0 || cell === 3) {
        if (cell === 3) playEffect(characterId === 'modi' ? wahModi : majaAaya);
        mazeRef.current[p.y][p.x] = 2;
        scoreRef.current += (cell === 3 ? 50 : 10);
        setMaze([...mazeRef.current]); setScore(scoreRef.current);
      }

      const gList = ghostsRef.current;
      gList.forEach((g) => {
        const dirs: ('UP' | 'DOWN' | 'LEFT' | 'RIGHT')[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
        const opposites: any = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
        let bestDir: string | null = null; let minDist = Infinity;
        // Try all non-opposite directions first
        dirs.forEach(d => {
          if (d === opposites[g.dir]) return;
          const test = moveEntity(g.x, g.y, d);
          if (test.x !== g.x || test.y !== g.y) {
            const dist = Math.abs(test.x - p.x) + Math.abs(test.y - p.y);
            if (dist < minDist) { minDist = dist; bestDir = d; }
          }
        });
        // Fallback: allow reversing direction if completely stuck (dead end)
        if (bestDir === null) {
          const revTest = moveEntity(g.x, g.y, opposites[g.dir]);
          if (revTest.x !== g.x || revTest.y !== g.y) bestDir = opposites[g.dir];
        }
        if (bestDir === null) return; // truly stuck (shouldn't happen in a valid maze)
        const nPos = moveEntity(g.x, g.y, bestDir);
        g.x = nPos.x; g.y = nPos.y; g.dir = bestDir;
      });

      const colHero = gList.find(g => g.x === p.x && g.y === p.y);
      if (colHero) {
        playEffect(characterId === 'modi' ? khatam : laureNa);
        if (livesRef.current > 1) {
          livesRef.current--; setLives(livesRef.current);
          p.x = 6; p.y = 10; p.currentDir = null; p.nextDir = null;
          gList[0] = { x: 5, y: 5, dir: 'LEFT' }; gList[1] = { x: 6, y: 5, dir: 'UP' }; gList[2] = { x: 7, y: 5, dir: 'RIGHT' };
        } else {
          clearInterval(loop); navigate('/win-loss', { state: { status: 'loss', character: characterId, score: scoreRef.current } });
        }
      }

      if (!mazeRef.current.some(row => row.includes(0) || row.includes(3))) {
        clearInterval(loop); navigate('/win-loss', { state: { status: 'win', character: characterId, score: scoreRef.current } });
      }
      setPlayerUI({ x: p.x, y: p.y }); setGhostsUI([...gList]);
    }, 320); // Slowed ghost speed (was 200ms)
    return () => clearInterval(loop);
  }, [navigate, characterId, moveEntity, playEffect]);

  useEffect(() => {
    if (score > highScore) { setHighScore(score); localStorage.setItem('modiman_highScore', score.toString()); }
  }, [score, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const dirs: any = { ArrowUp: 'UP', ArrowDown: 'DOWN', ArrowLeft: 'LEFT', ArrowRight: 'RIGHT', w: 'UP', s: 'DOWN', a: 'LEFT', d: 'RIGHT' };
      if (dirs[e.key]) handleDirection(dirs[e.key]);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDirection]);

  useEffect(() => {
    const audio = new Audio(bgMusic);
    audio.loop = true; audio.volume = 0.4;
    bgMusicRef.current = audio;
    // Stop any START page audio carried over
    const prev = (window as any).activeAudio as HTMLAudioElement | undefined;
    if (prev) { prev.pause(); prev.currentTime = 0; }
    (window as any).activeAudio = null;
    if (!isMuted) audio.play().catch(e => console.error(e));
    return () => {
      // Stop bg music and last effect when leaving game page
      audio.pause();
      if (lastEffectRef.current) {
        lastEffectRef.current.pause();
        lastEffectRef.current.currentTime = 0;
      }
    };
  }, [isMuted]);

  return (
    <div className="fixed inset-0 h-[100dvh] flex flex-col bg-black text-white font-['Press_Start_2P'] selection:bg-pink-500 overflow-hidden select-none">
      {/* Header */}
      <div ref={headerRef} className="flex items-center justify-between px-4 py-3 flex-shrink-0 z-50">
        <Link to="/" className="text-[#0000FF] hover:text-[#FFFF00] transition-colors">{'< BACK'}</Link>
        <div className="flex items-center gap-4">
          {/* Fullscreen toggle — mobile/tablet only */}
          <button
            onClick={toggleFullscreen}
            className="md:hidden text-[#0000FF] hover:text-[#FFFF00] transition-colors"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <LuMinimize size={22} /> : <LuMaximize size={22} />}
          </button>
          <button onClick={() => setIsMuted(!isMuted)} className="text-[#0000FF] hover:text-[#FFFF00] transition-colors">
            {isMuted ? <LuVolumeX size={24} /> : <LuVolume2 size={24} />}
          </button>
        </div>
      </div>

      {/* Score Area */}
      <div ref={scoreRef2} className="flex flex-col items-center flex-shrink-0 px-4 py-1 z-50">
        <div className="flex w-full max-w-[600px] items-center justify-between">
          <div className="flex flex-col items-center"><span className="text-[9px] text-pink-500">SCORE</span><span className="text-xs text-white">{score.toString().padStart(6, '0')}</span></div>
          <div className="flex gap-1">{[...Array(3)].map((_, index) => (<FaHeart key={index} size={14} className={index < lives ? "text-red-500 drop-shadow-[0_0_5px_#ef4444]" : "text-gray-800"} />))}</div>
          <div className="flex flex-col items-center"><span className="text-[9px] text-pink-500">HI-SCORE</span><span className="text-xs text-white">{highScore.toString().padStart(6, '0')}</span></div>
        </div>
      </div>

      {/* Maze Container */}
      <div ref={containerRef} className="flex-1 relative flex items-center justify-center w-full min-h-0 px-2 py-2 overflow-hidden">
        {/* Sizer Box: Corrects DOM Layout Box */}
        <div 
          className="relative flex-shrink-0 flex items-center justify-center overflow-hidden rounded-lg shadow-[0_0_20px_#0000FF] border-2 border-[#0000FF]"
          style={{ width: 780 * scale, height: 780 * scale }}
        >
          {/* Scaler Box: Visual Scale */}
          <div 
            className="absolute bg-black grid grid-cols-13 grid-rows-13"
            style={{ 
              width: '780px', height: '780px',
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              left: 0, top: 0
            }}
          >
            {maze.map((row, y) =>
              row.map((cell, x) => (
                <div key={`${x}-${y}`} className="relative w-[60px] h-[60px] flex items-center justify-center">
                  {cell === 1 && <div className="absolute inset-[4px] bg-blue-900 border-2 border-blue-500 rounded-sm" />}
                  {cell === 0 && <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_5px_#ffff00]" />}
                  {cell === 3 && (
                    <div className="relative w-[48px] h-[48px] flex items-center justify-center">
                      {/* Glow ring pulsing around the power pellet */}
                      <div className="absolute inset-0 rounded-full animate-[pellet-glow_1.2s_ease-in-out_infinite]" />
                      <img src={bonusImg} alt="bonus" className="w-full h-full object-contain relative z-10" />
                    </div>
                  )}
                  {playerUI.x === x && playerUI.y === y && (
                    <div className="absolute z-20 w-[60px] h-[60px] transition-all duration-200" style={{ left: 0, top: 0 }}>
                      <img src={playerImg} alt="player" className="w-full h-full rounded-full drop-shadow-[0_0_15px_#fff]" />
                    </div>
                  )}
                  {ghostsUI.map((ghost, index) => ghost.x === x && ghost.y === y ? (
                    <div key={index} className="absolute z-10 w-[60px] h-[60px] transition-all duration-200" style={{ left: 0, top: 0 }}>
                      <img src={enemyImgs[index % enemyImgs.length]} alt="ghost" className="w-full h-full rounded-full drop-shadow-[0_0_15px_rgba(255,0,0,0.6)]" />
                    </div>
                  ) : null)}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* D-Pad Area - Only on touch devices (phone/tablet), hidden on desktop */}
      <div ref={dpadRef} className="md:hidden flex w-full items-center justify-center p-2 flex-shrink-0 z-50 bg-black/50 backdrop-blur-sm">
        <DPad onDirection={handleDirection} />
      </div>
    </div>
  );
};
