"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3"); // Place a sound file or use beep
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleComplete = () => {
    setIsRunning(false);
    // Notification
    if (Notification.permission === "granted") {
      new Notification(isBreak ? "Mola bitti!" : "Pomodoro tamamlandı!", {
        body: isBreak ? "Tekrar çalışmaya başla" : "5 dakika mola zamanı",
      });
    }
    // Sound
    try {
      const beep = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmFgU7k9n1unEiBC13yO/eizEIHWq+8+OWT");
      beep.play().catch(() => {});
    } catch {}

    if (!isBreak) {
      setSessions((s) => s + 1);
      setIsBreak(true);
      setTimeLeft(BREAK_TIME);
    } else {
      setIsBreak(false);
      setTimeLeft(WORK_TIME);
    }
  };

  const toggle = () => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
    setIsRunning((r) => !r);
  };

  const reset = () => {
    setIsRunning(false);
    setIsBreak(false);
    setTimeLeft(WORK_TIME);
  };

  const format = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  const progress = isBreak
    ? ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100
    : ((WORK_TIME - timeLeft) / WORK_TIME) * 100;

  return (
    <div className="glass rounded-2xl p-8 text-center max-w-md mx-auto">
      <div className="flex items-center justify-center gap-2 mb-6">
        {isBreak ? <Coffee className="text-amber-400" /> : <Play className="text-neon" />}
        <h2 className="text-2xl font-bold">{isBreak ? "Mola" : "Odaklanma"}</h2>
      </div>

      <div className="relative w-48 h-48 mx-auto mb-6">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="8" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#00d2ff"
            strokeWidth="8"
            strokeDasharray={`${progress * 2.827} 282.7`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl font-mono font-bold neon-text">{format(timeLeft)}</span>
        </div>
      </div>

      <div className="flex justify-center gap-4">
        <button onClick={toggle} className="bg-neon text-night p-4 rounded-full hover:scale-110 transition">
          {isRunning ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button onClick={reset} className="glass p-4 rounded-full hover:border-neon transition">
          <RotateCcw size={24} />
        </button>
      </div>

      <p className="mt-6 text-slate-400">Tamamlanan oturumlar: {sessions}</p>
    </div>
  );
}
