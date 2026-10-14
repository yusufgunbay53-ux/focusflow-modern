"use client";

import { useState, useRef } from "react";
import { Volume2, VolumeX, Music } from "lucide-react";

export default function AudioWidget() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Free lo-fi rain sample (Pixabay / public domain style)
  const AUDIO_URL = "https://cdn.pixabay.com/download/audio/2022/03/15/audio_8b0f2b5c5e.mp3?filename=lofi-rain-111019.mp3";

  const toggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  return (
    <div className="glass rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Music size={18} className="text-neon" />
          <span className="text-sm font-medium">Lo-Fi / Yağmur</span>
        </div>
        <button onClick={toggle} className="text-neon hover:text-cyan-300">
          {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
      </div>
      <input
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={handleVolume}
        className="w-full accent-neon"
      />
      <audio ref={audioRef} src={AUDIO_URL} loop preload="none" />
    </div>
  );
}
