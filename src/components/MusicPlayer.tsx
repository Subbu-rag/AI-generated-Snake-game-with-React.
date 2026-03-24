import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Music2 } from 'lucide-react';
import { Track } from '../types';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Nights',
    artist: 'SynthWave AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    cover: 'https://picsum.photos/seed/neon/400/400',
    color: '#22d3ee',
  },
  {
    id: '2',
    title: 'Cyber Pulse',
    artist: 'Digital Dreamer',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    cover: 'https://picsum.photos/seed/cyber/400/400',
    color: '#e879f9',
  },
  {
    id: '3',
    title: 'Retro Future',
    artist: 'Glitch Master',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    cover: 'https://picsum.photos/seed/retro/400/400',
    color: '#4ade80',
  },
];

export const MusicPlayer: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = DUMMY_TRACKS[currentIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <div className="w-full bg-black glitch-border p-6 flex flex-col gap-6 tear">
      <div className="flex items-center gap-4">
        <div className="relative">
          <motion.div
            animate={isPlaying ? { rotate: [0, 90, 180, 270, 360], x: [0, 2, -2, 0] } : { rotate: 0 }}
            transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
            className="w-16 h-16 border-2 border-magenta p-1"
          >
            <img 
              src={currentTrack.cover} 
              alt={currentTrack.title} 
              className="w-full h-full object-cover grayscale invert"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-cyan-400" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-magenta" />
        </div>

        <div className="flex-1 overflow-hidden">
          <h3 className="text-xs font-pixel text-magenta truncate uppercase tracking-tighter">{currentTrack.title}</h3>
          <p className="text-cyan-700 text-[8px] font-pixel uppercase mt-1">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="h-4 w-full bg-cyan-900/30 border border-cyan-900 relative overflow-hidden">
          <motion.div 
            className="h-full bg-magenta"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[8px] font-pixel text-cyan-400 mix-blend-difference">
              BUFFERING_{Math.floor(progress)}%
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-6">
        <button 
          onClick={handlePrev}
          className="p-2 text-cyan-700 hover:text-magenta transition-all active:scale-90"
        >
          <SkipBack size={24} />
        </button>
        
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-12 h-12 flex items-center justify-center bg-magenta text-black hover:bg-cyan-400 transition-all active:scale-95"
        >
          {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
        </button>

        <button 
          onClick={handleNext}
          className="p-2 text-cyan-700 hover:text-magenta transition-all active:scale-90"
        >
          <SkipForward size={24} />
        </button>
      </div>

      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center justify-between px-2 text-[6px] font-pixel text-cyan-900 uppercase">
        <div className="flex items-center gap-2">
          <Volume2 size={10} />
          <span>GAIN_MAX</span>
        </div>
        <div className="flex items-center gap-2">
          <Music2 size={10} />
          <span>RAW_STREAM</span>
        </div>
      </div>
    </div>
  );
};
