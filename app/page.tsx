"use client";

import { useState } from "react";
import { useTaskStore } from "@/app/store/useTaskStore";
import { Trash2, CheckCircle, Circle, Plus } from "lucide-react";

export default function TodoPage() {
  const [input, setInput] = useState("");
  const { tasks, addTask, toggleTask, deleteTask } = useTaskStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim() === "") return;
    addTask(input);
    setInput("");
  };

  const completedCount = tasks.filter((t) => t.isCompleted).length;

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Smart Tasks</h1>
        <p className="text-slate-500 mb-8">
          Completed: {completedCount} / {tasks.length}
        </p>

        <form onSubmit={handleSubmit} className="flex gap-2 mb-8 text-black">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all "
          />
          <button
            type="submit"
            className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <Plus size={24} />
          </button>
        </form>

        <div className="space-y-3">
          {tasks.length === 0 && (
            <p className="text-center text-slate-400 py-10">
              No tasks yet. Add one above!
            </p>
          )}
          {tasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-transparent hover:border-indigo-100 transition-all"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="text-indigo-600"
                >
                  {task.isCompleted ? (
                    <CheckCircle className="fill-indigo-100" />
                  ) : (
                    <Circle />
                  )}
                </button>
                <span
                  className={`text-lg ${task.isCompleted ? "line-through text-slate-400" : "text-slate-700"}`}
                >
                  {task.text}
                </span>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
