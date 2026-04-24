import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Task {
  id: number;
  text: string;
  isCompleted: boolean;
}

interface TaskStore {
  tasks: Task[];
  addTask: (text: string) => void;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
}

export const useTaskStore = create<TaskStore>()(
  persist(
    (set) => ({
      tasks: [],
      addTask: (text: string) =>
        set((state) => ({
          tasks: [...state.tasks, { id: Date.now(), text, isCompleted: false }],
        })),
      toggleTask: (id: number) =>
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === id ? { ...t, isCompleted: !t.isCompleted } : t,
          ),
        })),
      deleteTask: (id: number) =>
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        })),
    }),
    {
      name: "tasks-storage",
    },
  ),
);
