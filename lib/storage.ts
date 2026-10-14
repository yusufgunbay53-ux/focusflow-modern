import { Task, PomodoroSession } from "./types";

const TASKS_KEY = "focusflow_tasks";
const SESSIONS_KEY = "focusflow_sessions";

export const loadTasks = (): Task[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(TASKS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveTasks = (tasks: Task[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const loadSessions = (): PomodoroSession[] => {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(SESSIONS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveSessions = (sessions: PomodoroSession[]) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
};
