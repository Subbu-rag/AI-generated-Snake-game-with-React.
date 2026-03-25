import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Point, Direction } from '../types';

const GRID_SIZE = 20;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION: Direction = 'UP';
const INITIAL_SPEED = 80;

export const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [highScore, setHighScore] = useState(0);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        if ('vibrate' in navigator) navigator.vibrate([100, 50, 100]);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
        if ('vibrate' in navigator) navigator.vibrate(50);
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, generateFood]);

  const handleDirectionChange = (newDir: Direction) => {
    setDirection((prev) => {
      if (newDir === 'UP' && prev !== 'DOWN') return 'UP';
      if (newDir === 'DOWN' && prev !== 'UP') return 'DOWN';
      if (newDir === 'LEFT' && prev !== 'RIGHT') return 'LEFT';
      if (newDir === 'RIGHT' && prev !== 'LEFT') return 'RIGHT';
      return prev;
    });
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': handleDirectionChange('UP'); break;
        case 'ArrowDown': handleDirectionChange('DOWN'); break;
        case 'ArrowLeft': handleDirectionChange('LEFT'); break;
        case 'ArrowRight': handleDirectionChange('RIGHT'); break;
        case ' ': setIsPaused((p) => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, INITIAL_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isPaused, isGameOver]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="flex flex-col items-center gap-4 md:gap-8 p-4 md:p-8 bg-black glitch-border w-full max-w-[min(90vw,500px)]">
      <div className="flex justify-between w-full px-2 md:px-4">
        <div className="flex flex-col">
          <span className="text-[6px] md:text-[8px] uppercase tracking-[0.2em] text-cyan-700 font-pixel">DATA_SCORE</span>
          <span 
            className="text-2xl md:text-4xl font-pixel text-magenta glitch"
            data-text={score.toString().padStart(4, '0')}
          >
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[6px] md:text-[8px] uppercase tracking-[0.2em] text-cyan-700 font-pixel">PEAK_VALUE</span>
          <span 
            className="text-2xl md:text-4xl font-pixel text-cyan-400 glitch"
            data-text={highScore.toString().padStart(4, '0')}
          >
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      <div 
        className="relative bg-black border-2 md:border-4 border-cyan-900 overflow-hidden aspect-square w-full touch-none"
        style={{ 
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Grid lines */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 pointer-events-none opacity-20">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-cyan-900" />
          ))}
        </div>

        {/* Snake */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            initial={false}
            animate={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
              opacity: 1 - (i / snake.length) * 0.5,
            }}
            className={`
              ${i === 0 
                ? 'bg-magenta z-10 shadow-[0_0_10px_#ff00ff]' 
                : 'bg-cyan-400 shadow-[0_0_5px_#00ffff]'}
            `}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
            scale: [0.8, 1.1, 0.8],
          }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
          className="bg-magenta shadow-[0_0_15px_#ff00ff]"
        />

        {/* Overlays */}
        <AnimatePresence>
          {(isGameOver || isPaused) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20 tear"
            >
              {isGameOver ? (
                <>
                  <h2 className="text-3xl font-pixel text-magenta mb-4 tracking-tighter">FATAL_ERROR</h2>
                  <p className="text-cyan-600 mb-8 font-mono text-xs uppercase">RECOVERY_FAILED // SCORE: {score}</p>
                  <button
                    onClick={resetGame}
                    className="px-8 py-4 bg-magenta text-black font-pixel text-[10px] hover:bg-white transition-all active:scale-95"
                  >
                    REBOOT_CORE
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-pixel text-cyan-400 mb-8 tracking-tighter">HALTED</h2>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="px-8 py-4 bg-cyan-400 text-black font-pixel text-[10px] hover:bg-magenta transition-all active:scale-95"
                  >
                    RESUME_PROCESS
                  </button>
                  <p className="mt-6 text-[8px] text-cyan-900 font-pixel">INTERRUPT_SIGNAL_DETECTED</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Controls */}
      <div className="grid grid-cols-3 gap-3 md:hidden mt-4">
        <div />
        <button 
          className="w-16 h-16 bg-cyan-900/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 active:bg-magenta active:text-black active:scale-90 transition-all rounded-lg"
          onClick={() => handleDirectionChange('UP')}
        >
          <span className="text-2xl">▲</span>
        </button>
        <div />
        <button 
          className="w-16 h-16 bg-cyan-900/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 active:bg-magenta active:text-black active:scale-90 transition-all rounded-lg"
          onClick={() => handleDirectionChange('LEFT')}
        >
          <span className="text-2xl">◀</span>
        </button>
        <button 
          className="w-16 h-16 bg-magenta/20 border-2 border-magenta flex items-center justify-center text-magenta active:bg-white active:text-black active:scale-90 transition-all rounded-lg"
          onClick={() => setIsPaused(!isPaused)}
        >
          <span className="text-xl">{isPaused ? '▶' : '||'}</span>
        </button>
        <button 
          className="w-16 h-16 bg-cyan-900/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 active:bg-magenta active:text-black active:scale-90 transition-all rounded-lg"
          onClick={() => handleDirectionChange('RIGHT')}
        >
          <span className="text-2xl">▶</span>
        </button>
        <div />
        <button 
          className="w-16 h-16 bg-cyan-900/20 border-2 border-cyan-400 flex items-center justify-center text-cyan-400 active:bg-magenta active:text-black active:scale-90 transition-all rounded-lg"
          onClick={() => handleDirectionChange('DOWN')}
        >
          <span className="text-2xl">▼</span>
        </button>
        <div />
      </div>

      <div className="flex flex-col gap-2 text-cyan-900 text-[6px] md:text-[8px] font-pixel uppercase text-center">
        <p className="hidden md:block">[ INPUT_ARROWS ] :: [ TOGGLE_SPACE ]</p>
        <p className="md:hidden">[ TOUCH_CONTROLS_ACTIVE ]</p>
        <p className="opacity-30">ENCRYPTION_LAYER_ACTIVE</p>
      </div>
    </div>
  );
};
