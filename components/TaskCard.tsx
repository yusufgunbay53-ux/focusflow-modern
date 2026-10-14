"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/lib/types";
import { Trash2, GripVertical } from "lucide-react";

interface Props {
  task: Task;
  onDelete?: (id: string) => void;
  isOverlay?: boolean;
}

const priorityColors = {
  low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/40",
  high: "bg-rose-500/20 text-rose-400 border-rose-500/40",
};

const priorityLabels = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
};

export default function TaskCard({ task, onDelete, isOverlay }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`glass p-4 rounded-xl border ${isOverlay ? "rotate-2 scale-105" : ""} group`}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs px-2 py-0.5 rounded-full border ${priorityColors[task.priority]}`}
            >
              {priorityLabels[task.priority]}
            </span>
          </div>
          <p className="font-medium text-slate-100">{task.title}</p>
        </div>
        <div className="flex items-center gap-1">
          <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-500 hover:text-neon">
            <GripVertical size={16} />
          </button>
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
