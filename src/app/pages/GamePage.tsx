import React, { useState, useEffect, useCallback, useRef } from "react";
import { LuVolume2, LuVolumeX } from "react-icons/lu";
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

// 1: Wall, 0: Pellet, 2: Empty, 3: Bonus, 4: Ghost Gate
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
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('modiman_highScore') || '0');
  });
  const [lives, setLives] = useState(3);
  const [maze, setMaze] = useState(INITIAL_MAZE);
  const [playerPos, setPlayerPos] = useState({ x: 6, y: 10 });
  const playerPosRef = useRef(playerPos);

  const [ghosts, setGhosts] = useState([
    { x: 5, y: 5, dir: 'LEFT', chase: true },
    { x: 6, y: 5, dir: 'UP', chase: false },
    { x: 7, y: 5, dir: 'RIGHT', chase: true },
  ]);

  const playerImg = characterId === 'modi' ? modi5 : rahul3;
  const enemyImgs = characterId === 'modi' ? [rahul1, rahul2, rahul3] : [modi5, modi6, modi7];

  const playEffect = useCallback((src: string) => {
    if (!isMuted) {
      new Audio(src).play().catch(e => console.error("Audio error:", e));
    }
  }, [isMuted]);

  useEffect(() => {
    playerPosRef.current = playerPos;
  }, [playerPos]);

  const moveEntity = useCallback((currentPos: { x: number, y: number }, direction: string) => {
    let { x, y } = currentPos;
    if (direction === 'UP') y--;
    if (direction === 'DOWN') y++;
    if (direction === 'LEFT') x--;
    if (direction === 'RIGHT') x++;

    if (x < 0) x = GRID_SIZE.cols - 1;
    if (x >= GRID_SIZE.cols) x = 0;

    if (maze[y] && maze[y][x] !== 1 && maze[y][x] !== 4) return { x, y };
    return currentPos;
  }, [maze]);

  const getChaseDirection = useCallback((ghost: { x: number, y: number, dir: string }, target: { x: number, y: number }) => {
    const directions: ('UP' | 'DOWN' | 'LEFT' | 'RIGHT')[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
    const opposites = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };

    let bestDir = ghost.dir;
    let minDistance = Infinity;
    let fallbackDir = ghost.dir;

    directions.forEach(dir => {
      const next = moveEntity(ghost, dir);
      if (next.x === ghost.x && next.y === ghost.y) return; // Wall

      fallbackDir = dir;
      if (dir === opposites[ghost.dir as keyof typeof opposites]) return;

      const distance = Math.abs(next.x - target.x) + Math.abs(next.y - target.y);
      if (distance < minDistance) {
        minDistance = distance;
        bestDir = dir;
      }
    });

    if (minDistance === Infinity) return fallbackDir;
    return bestDir;
  }, [moveEntity]);

  const handleDirection = useCallback((dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    const nextPos = moveEntity(playerPos, dir);
    if (nextPos.x !== playerPos.x || nextPos.y !== playerPos.y) {
      setPlayerPos(nextPos);
      const cell = maze[nextPos.y][nextPos.x];
      if (cell === 0 || cell === 3) {
        if (cell === 3) playEffect(characterId === 'modi' ? wahModi : majaAaya);
        const newMaze = maze.map(row => [...row]);
        newMaze[nextPos.y][nextPos.x] = 2;
        setMaze(newMaze);
        setScore(s => s + (cell === 3 ? 50 : 10));
      }
    }
  }, [playerPos, maze, moveEntity, playEffect, characterId]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('modiman_highScore', score.toString());
    }
  }, [score, highScore]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const dirs: { [key: string]: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' } = {
        'ArrowUp': 'UP', 'ArrowDown': 'DOWN', 'ArrowLeft': 'LEFT', 'ArrowRight': 'RIGHT',
        'w': 'UP', 's': 'DOWN', 'a': 'LEFT', 'd': 'RIGHT'
      };
      if (dirs[e.key]) handleDirection(dirs[e.key]);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDirection]);

  useEffect(() => {
    const ghostLoop = setInterval(() => {
      setGhosts(prev => prev.map(ghost => {
        let dir = ghost.dir;
        const target = playerPosRef.current;

        if (ghost.chase) {
          dir = getChaseDirection(ghost, target);
        } else {
          const next = moveEntity(ghost, ghost.dir);
          if (next.x === ghost.x && next.y === ghost.y) {
            const directions: ('UP' | 'DOWN' | 'LEFT' | 'RIGHT')[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
            dir = directions[Math.floor(Math.random() * directions.length)];
          }
        }

        const next = moveEntity(ghost, dir);
        return { ...next, dir, chase: ghost.chase };
      }));
    }, 350);
    return () => clearInterval(ghostLoop);
  }, [moveEntity, getChaseDirection]);

  useEffect(() => {
    const collision = ghosts.find(g => g.x === playerPos.x && g.y === playerPos.y);
    if (collision) {
      playEffect(characterId === 'modi' ? khatam : laureNa);
      if (lives > 1) {
        setLives(l => l - 1);
        setPlayerPos({ x: 6, y: 10 });
      } else {
        navigate('/win-loss', { state: { status: 'loss', character: characterId, score: score } });
      }
    }
  }, [playerPos, ghosts, lives, navigate, playEffect, characterId, score]);

  useEffect(() => {
    if (!maze.some(row => row.includes(0) || row.includes(3))) {
      navigate('/win-loss', { state: { status: 'win', character: characterId, score: score } });
    }
  }, [maze, navigate, characterId, score]);

  useEffect(() => {
    const audio = new Audio(bgMusic);
    audio.loop = true;
    audio.volume = 0.4;
    if (!isMuted) audio.play().catch(e => console.error("BG Audio failed:", e));
    (window as any).bgAudio = audio;
    return () => {
      audio.pause();
      (window as any).bgAudio = null;
    };
  }, [isMuted]);

  return (
    <div className="flex min-h-screen flex-col bg-black text-white font-['Press_Start_2P'] selection:bg-pink-500 selection:text-white">
      <div className="flex items-center justify-between p-4">
        <Link to="/" className="text-[#0000FF] hover:text-[#FFFF00] transition-colors">{'< BACK'}</Link>
        <button onClick={() => setIsMuted(!isMuted)} className="text-[#0000FF] hover:text-[#FFFF00] transition-colors">
          {isMuted ? <LuVolumeX size={24} /> : <LuVolume2 size={24} />}
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center p-4 w-full max-w-[500px] mx-auto overflow-hidden">
        <div className="flex w-full items-end justify-between px-4 pb-4">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] md:text-sm text-pink-500">SCORE</span>
            <span className="text-sm md:text-lg text-white">{score.toString().padStart(6, '0')}</span>
          </div>
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <FaHeart key={i} size={20} className={i < lives ? "text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.7)]" : "text-gray-800"} />
            ))}
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] md:text-sm text-pink-500">HI-SCORE</span>
            <span className="text-sm md:text-lg text-white">{highScore.toString().padStart(6, '0')}</span>
          </div>
        </div>

        <div className="relative w-full max-w-[500px] aspect-square rounded-xl border-4 border-[#0000FF] p-1 shadow-[0_0_20px_#0000FF] bg-black overflow-hidden bg-[radial-gradient(circle_at_center,rgba(0,0,255,0.05)_0%,transparent_100%)]">
          <div className="relative w-full h-full grid grid-cols-13 grid-rows-13">
            {maze.map((row, y) =>
              row.map((cell, x) => (
                <div key={`${x}-${y}`} className="flex items-center justify-center relative">
                  {cell === 1 && <div className="absolute inset-0 bg-blue-700/60 border-2 border-blue-500/80 rounded-sm shadow-[inset_0_0_8px_rgba(59,130,246,0.5)]" />}
                  {cell === 0 && <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_5px_rgba(250,204,21,0.5)]" />}
                  {cell === 3 && <img src={bonusImg} alt="bonus" className="w-[140%] h-[140%] animate-bounce z-10 rounded-full" />}

                  {playerPos.x === x && playerPos.y === y && (
                    <img src={playerImg} alt="player" className="absolute inset-0 w-[140%] h-[140%] -left-[20%] -top-[20%] z-20 scale-150 drop-shadow-[0_0_12px_rgba(255,255,255,0.8)] rounded-full backdrop-blur-sm" />
                  )}

                  {ghosts.map((ghost, index) =>
                    ghost.x === x && ghost.y === y ? (
                      <img key={index} src={enemyImgs[index % enemyImgs.length]} alt="ghost" className="absolute inset-0 w-[130%] h-[130%] -left-[15%] -top-[15%] z-10 scale-125 brightness-125 drop-shadow-[0_0_10px_rgba(255,0,0,0.6)] rounded-full" />
                    ) : null
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex w-full items-center justify-center p-6 md:p-8 md:hidden">
        <DPad onDirection={handleDirection} />
      </div>
    </div>
  );
};
