"use client";

import { useState } from "react";
import {
  DndContext,
  closestCorners,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task, Status, Priority } from "@/lib/types";
import TaskCard from "./TaskCard";
import { Plus, Trash2 } from "lucide-react";

interface Props {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const columns: { id: Status; title: string }[] = [
  { id: "todo", title: "Yapılacaklar" },
  { id: "inprogress", title: "Yapılıyor" },
  { id: "done", title: "Tamamlandı" },
];

export default function KanbanBoard({ tasks, setTasks }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newPriority, setNewPriority] = useState<Priority>("medium");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as Status;

    if (columns.some((c) => c.id === newStatus)) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, status: newStatus, completedAt: newStatus === "done" ? Date.now() : undefined }
            : t
        )
      );
    }
  };

  const addTask = () => {
    if (!newTitle.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTitle,
      priority: newPriority,
      status: "todo",
      createdAt: Date.now(),
    };
    setTasks((prev) => [...prev, task]);
    setNewTitle("");
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const activeTask = tasks.find((t) => t.id === activeId);

  return (
    <div className="space-y-6">
      {/* Add Task */}
      <div className="glass p-4 rounded-2xl flex flex-col md:flex-row gap-3 items-end">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          placeholder="Yeni görev ekle..."
          className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:border-neon"
        />
        <select
          value={newPriority}
          onChange={(e) => setNewPriority(e.target.value as Priority)}
          className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3"
        >
          <option value="low">Düşük</option>
          <option value="medium">Orta</option>
          <option value="high">Yüksek</option>
        </select>
        <button
          onClick={addTask}
          className="bg-neon text-night font-semibold px-6 py-3 rounded-xl hover:bg-cyan-400 transition flex items-center gap-2"
        >
          <Plus size={18} /> Ekle
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);
            return (
              <div key={col.id} className="glass rounded-2xl p-4 min-h-[400px]">
                <h3 className="text-lg font-semibold mb-4 flex justify-between">
                  {col.title}
                  <span className="text-sm text-slate-400">{colTasks.length}</span>
                </h3>
                <SortableContext items={colTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3" id={col.id}>
                    {colTasks.map((task) => (
                      <TaskCard key={task.id} task={task} onDelete={deleteTask} />
                    ))}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
