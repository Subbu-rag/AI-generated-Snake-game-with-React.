import React from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 font-sans static-noise crt-flicker">
      <div className="scanline" />
      
      <main className="relative z-10 container mx-auto px-2 md:px-4 py-4 md:py-8 min-h-screen flex flex-col items-center justify-start lg:justify-center gap-6 md:gap-12">
        <motion.header 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-4"
        >
          <h1 className="text-4xl md:text-6xl font-pixel text-magenta uppercase tear tracking-tighter">
            NEON_SNAKE_v1.0
          </h1>
          <div className="flex items-center justify-center gap-4">
            <p className="text-[10px] font-mono uppercase tracking-[0.5em] text-cyan-600">
              [ PROTOCOL_SNAKE ] // [ PROTOCOL_BEATS ]
            </p>
          </div>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 w-full max-w-7xl items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 flex flex-col gap-6 md:gap-8"
          >
            <MusicPlayer />
            
            <div className="hidden md:block glitch-border bg-black p-4 space-y-2">
              <h4 className="text-[8px] font-pixel text-magenta uppercase">Machine_Log</h4>
              <div className="text-[10px] font-mono text-cyan-700 space-y-1">
                <p>&gt; INITIALIZING_CORE...</p>
                <p>&gt; LOADING_SENSORS...</p>
                <p>&gt; SIGNAL_STRENGTH_98%</p>
                <p className="animate-pulse">&gt; WAITING_FOR_INPUT_</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-8 flex justify-center w-full"
          >
            <SnakeGame />
          </motion.div>
        </div>

        <footer className="mt-auto py-8 text-cyan-900 text-[8px] font-pixel uppercase tracking-widest flex flex-col items-center gap-2">
          <span>UNAUTHORIZED ACCESS DETECTED</span>
          <span className="opacity-50">NULL_POINTER_EXCEPTION_AT_0x000000</span>
        </footer>
      </main>
    </div>
  );
}
