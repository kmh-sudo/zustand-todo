# Smart Tasks

Simple Todo app built with Next.js 16, React 19, Tailwind CSS 4, and Zustand.

This project is a good beginner example because it shows:

- how a Next.js App Router page works
- how React local UI state works with `useState`
- how Zustand manages global state
- how Zustand `persist` keeps tasks in browser `localStorage`

## Demo Features

- add a task
- mark a task as completed
- delete a task
- keep tasks after page refresh
- show completed task count

## Tech Stack

- Next.js `16.2.4`
- React `19.2.4`
- TypeScript `5`
- Tailwind CSS `4`
- Zustand `5`
- Lucide React icons

## Packages Explained

### Main packages

- `next`: framework for routing, layouts, rendering, and app structure
- `react`: builds the UI with components
- `react-dom`: lets React render in the browser
- `zustand`: small state management library for shared app state
- `lucide-react`: icon library used for add, delete, and complete icons

### Dev packages

- `typescript`: adds types for safer code
- `eslint` and `eslint-config-next`: help catch code problems
- `tailwindcss` and `@tailwindcss/postcss`: utility-first CSS styling
- `@types/node`, `@types/react`, `@types/react-dom`: TypeScript type definitions

## How To Run This Project

This repo uses `pnpm` because it already has a `pnpm-lock.yaml` file.

```bash
pnpm install
pnpm dev
```

Then open `http://localhost:3000`.

### Other useful commands

```bash
pnpm lint
pnpm build
pnpm start
```

## How This Project Was Created

If you want to build the same project from scratch, you can use these steps.

### 1. Create a Next.js app

```bash
pnpm create next-app@latest todo --ts --tailwind --eslint --app
```

What these options mean:

- `--ts`: use TypeScript
- `--tailwind`: install Tailwind CSS
- `--eslint`: install ESLint
- `--app`: use the App Router with the `app/` folder

### 2. Install extra packages

```bash
pnpm add zustand lucide-react
```

### 3. Create the store file

Create `app/store/useTaskStore.tsx`.

This file holds all shared task data and actions.

### 4. Build the UI page

Create `app/page.tsx`.

This page reads data from the store and displays the Todo interface.

## Project Structure

```text
app/
  layout.tsx
  page.tsx
  globals.css
  store/
    useTaskStore.tsx
```

## What Is Zustand?

Zustand is a lightweight state management library.

In simple words:

- React `useState` stores data inside one component
- Zustand stores data in a shared store
- any component can read and update that store

In this project:

- the store keeps the `tasks` array
- the store also contains functions like `addTask`, `toggleTask`, and `deleteTask`
- the `persist` middleware saves tasks in `localStorage`

That means when the browser refreshes, the tasks are still there.

## Code Explanation For Junior Developers

Below is a line-by-line explanation of the main files.

### 1. `app/store/useTaskStore.tsx`

```tsx
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
```

Explanation:

- `import { create } from "zustand";`
  Creates a Zustand store.
- `import { persist } from "zustand/middleware";`
  Adds middleware that saves store data in browser storage.
- `interface Task { ... }`
  Describes what one task looks like.
- `id: number;`
  Each task has a unique number.
- `text: string;`
  This is the task name.
- `isCompleted: boolean;`
  Stores `true` or `false` depending on completion.
- `interface TaskStore { ... }`
  Describes the full store shape.
- `tasks: Task[];`
  The store contains an array of tasks.
- `addTask: (text: string) => void;`
  Function to add a task.
- `toggleTask: (id: number) => void;`
  Function to switch completed or not completed.
- `deleteTask: (id: number) => void;`
  Function to remove a task.
- `export const useTaskStore = create<TaskStore>()(`
  Creates and exports a custom hook named `useTaskStore`.
- `persist(`
  Wraps the store so it can be saved in `localStorage`.
- `(set) => ({`
  `set` is the function used to update store state.
- `tasks: [],`
  Initial value is an empty task list.
- `addTask: (text: string) =>`
  Starts the add task function.
- `set((state) => ({`
  Updates the store using the current state.
- `tasks: [...state.tasks, { id: Date.now(), text, isCompleted: false }],`
  Creates a new array with all old tasks plus a new task.
- `Date.now()`
  Generates a simple unique id using the current time.
- `toggleTask: (id: number) =>`
  Starts the toggle function.
- `tasks: state.tasks.map((t) =>`
  Loops through all tasks and returns a new array.
- `t.id === id ? { ...t, isCompleted: !t.isCompleted } : t`
  If the task id matches, copy it and reverse the completed value.
- `deleteTask: (id: number) =>`
  Starts the delete function.
- `tasks: state.tasks.filter((t) => t.id !== id),`
  Keeps every task except the one with the matching id.
- `{ name: "tasks-storage" }`
  This is the key name used inside `localStorage`.

### 2. `app/page.tsx`

```tsx
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
```

Explanation:

- `"use client";`
  Tells Next.js this file must run on the client side because it uses React hooks and browser interaction.
- `import { useState } from "react";`
  Imports React local state.
- `import { useTaskStore } from "@/app/store/useTaskStore";`
  Imports the Zustand store hook.
- `import { Trash2, CheckCircle, Circle, Plus } from "lucide-react";`
  Imports icons.
- `export default function TodoPage() {`
  Creates the page component for the home route.
- `const [input, setInput] = useState("");`
  Stores the current text typed in the input box.
- `const { tasks, addTask, toggleTask, deleteTask } = useTaskStore();`
  Reads task data and actions from the Zustand store.
- `const handleSubmit = (...) => {`
  Creates a function for form submission.
- `e.preventDefault();`
  Stops the browser from refreshing the page when the form is submitted.
- `if (input.trim() === "") return;`
  Prevents empty tasks from being added.
- `addTask(input);`
  Sends the typed text to the store.
- `setInput("");`
  Clears the input after adding the task.
- `const completedCount = tasks.filter((t) => t.isCompleted).length;`
  Counts how many tasks are completed.
- `<main className="...">`
  Outer page wrapper.
- `<div className="max-w-md mx-auto ...">`
  Card container centered on the page.
- `<h1>Smart Tasks</h1>`
  Main title.
- `<p>Completed: {completedCount} / {tasks.length}</p>`
  Shows completed tasks out of total tasks.
- `<form onSubmit={handleSubmit}>`
  Form that runs `handleSubmit` when submitted.
- `<input ... />`
  Controlled input field.
- `value={input}`
  Input value always comes from React state.
- `onChange={(e) => setInput(e.target.value)}`
  Updates state when the user types.
- `<button type="submit">`
  Submits the form.
- `<Plus size={24} />`
  Shows the plus icon.
- `{tasks.length === 0 && (...)}`
  If no tasks exist, show an empty message.
- `{tasks.map((task) => (...) )}`
  Loop through every task and render one card for each.
- `key={task.id}`
  Gives React a unique key for list rendering.
- `onClick={() => toggleTask(task.id)}`
  Toggles the selected task.
- `{task.isCompleted ? <CheckCircle /> : <Circle />}`
  Shows different icons based on completion.
- `className={\`text-lg ${task.isCompleted ? "line-through text-slate-400" : "text-slate-700"}\`}`
  Adds line-through styling if the task is completed.
- `onClick={() => deleteTask(task.id)}`
  Deletes the clicked task.

### 3. `app/layout.tsx`

This file is the root layout for the entire app.

Important ideas:

- it imports global CSS once for the whole app
- it loads Geist fonts with `next/font/google`
- it wraps all pages with `<html>` and `<body>`
- `children` means the page content gets inserted inside the layout

## Next.js Concepts Used Here

### App Router

This project uses the `app/` directory, which means it uses the Next.js App Router.

- `app/page.tsx` becomes the `/` route
- `app/layout.tsx` wraps the page
- client components need `"use client"` when they use hooks or browser APIs

### Why `"use client"` is needed here

The page uses:

- `useState`
- button click handlers
- a Zustand store with browser persistence

Because of that, `app/page.tsx` must be a client component.

## How Data Flows In This App

1. User types a task into the input.
2. React stores the input value in local state.
3. User submits the form.
4. `addTask()` updates the Zustand store.
5. The page re-renders with the new task.
6. Zustand `persist` saves tasks to `localStorage`.
7. After refresh, tasks are loaded again.

## Scripts

From `package.json`:

- `pnpm dev` starts the development server
- `pnpm build` creates a production build
- `pnpm start` runs the production build
- `pnpm lint` checks code quality

## Beginner Notes

- `useState` is best for small state inside one component
- Zustand is helpful when multiple components need the same data
- `persist` is middleware, which means extra logic wrapped around the store
- `map()` is used to transform arrays
- `filter()` is used to remove items or find matching items
- `preventDefault()` stops normal browser form behavior

## Future Improvement Ideas

- add edit task feature
- add task due dates
- split UI into smaller components
- add tests for store behavior
- update metadata in `app/layout.tsx` to match the app name
