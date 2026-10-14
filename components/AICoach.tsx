"use client";

import { useMemo } from "react";
import { Task } from "@/lib/types";
import { Brain, Sparkles } from "lucide-react";

interface Props {
  tasks: Task[];
}

export default function AICoach({ tasks }: Props) {
  const message = useMemo(() => {
    const completed = tasks.filter((t) => t.status === "done").length;
    const total = tasks.length;
    const highPriorityPending = tasks.filter((t) => t.priority === "high" && t.status !== "done").length;

    if (total === 0) return "Henüz görev eklemedin. Hadi başlayalım!";
    if (completed === total) return "Bugün harika gidiyorsun! Tüm görevler tamamlandı. 🎉";
    if (highPriorityPending > 0) return "Yüksek öncelikli görevlerin var. Onlara odaklanmayı dene.";
    if (completed > total / 2) return "İyi gidiyorsun! Bu tempo ile devam et.";
    return "Biraz yavaşladın. 5 dakikalık bir mola vermek ister misin?";
  }, [tasks]);

  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Brain className="text-neon" />
        <h3 className="font-semibold text-lg">AI Koç</h3>
        <Sparkles size={16} className="text-amber-400" />
      </div>
      <p className="text-slate-300 leading-relaxed">{message}</p>
      <p className="text-xs text-slate-500 mt-4">
        Mock AI — Gerçek API (OpenAI / Gemini) bağlantısı için hazır.
      </p>
    </div>
  );
}
