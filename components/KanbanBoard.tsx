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
  useDroppable,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task, Status, Priority } from "@/lib/types";
import TaskCard from "./TaskCard";
import { Plus } from "lucide-react";

interface Props {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const columns: { id: Status; title: string }[] = [
  { id: "todo", title: "Yapılacaklar" },
  { id: "inprogress", title: "Yapılıyor" },
  { id: "done", title: "Tamamlandı" },
];

function Column({ id, title, tasks, children }: { id: Status; title: string; tasks: Task[]; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      className={`glass rounded-2xl p-4 min-h-[400px] transition-colors ${
        isOver ? "border-neon/60 bg-slate-800/40" : ""
      }`}
    >
      <h3 className="text-lg font-semibold mb-4 flex justify-between">
        {title}
        <span className="text-sm text-slate-400">{tasks.length}</span>
      </h3>
      {children}
    </div>
  );
}

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
    let newStatus: Status | null = null;

    if (columns.some((c) => c.id === over.id)) {
      newStatus = over.id as Status;
    } else {
      // Dropped on a task, find its column
      const overTask = tasks.find((t) => t.id === over.id);
      if (overTask) newStatus = overTask.status;
    }

    if (newStatus) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status: newStatus!,
                completedAt: newStatus === "done" ? Date.now() : undefined,
              }
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
          className="bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200"
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
              <Column key={col.id} id={col.id} title={col.title} tasks={colTasks}>
                <SortableContext items={colTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                  <div className="space-y-3 min-h-[200px]">
                    {colTasks.map((task) => (
                      <TaskCard key={task.id} task={task} onDelete={deleteTask} />
                    ))}
                  </div>
                </SortableContext>
              </Column>
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
