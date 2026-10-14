"use client";

import { useState, useEffect } from "react";
import KanbanBoard from "@/components/KanbanBoard";
import PomodoroTimer from "@/components/PomodoroTimer";
import AICoach from "@/components/AICoach";
import AudioWidget from "@/components/AudioWidget";
import { Task } from "@/lib/types";
import { loadTasks, saveTasks } from "@/lib/storage";
import { Brain, Clock, ListTodo } from "lucide-react";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<"tasks" | "pomodoro">("tasks");

  useEffect(() => {
    setTasks(loadTasks());
  }, []);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-night">
      <header className="mb-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold neon-text mb-2">FocusFlow</h1>
        <p className="text-slate-400">AI Destekli Görev ve Odaklanma Asistanı</p>
      </header>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setActiveTab("tasks")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl glass transition ${
            activeTab === "tasks" ? "border-neon ring-2 ring-neon/50" : ""
          }`}
        >
          <ListTodo size={20} /> Görevler
        </button>
        <button
          onClick={() => setActiveTab("pomodoro")}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl glass transition ${
            activeTab === "pomodoro" ? "border-neon ring-2 ring-neon/50" : ""
          }`}
        >
          <Clock size={20} /> Pomodoro
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {activeTab === "tasks" ? (
            <KanbanBoard tasks={tasks} setTasks={setTasks} />
          ) : (
            <PomodoroTimer />
          )}
        </div>
        <div className="space-y-6">
          <AICoach tasks={tasks} />
          <AudioWidget />
        </div>
      </div>
    </div>
  );
}
