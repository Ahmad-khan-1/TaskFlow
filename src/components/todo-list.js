"use client";

import { useMemo, useOptimistic, useState, useTransition } from "react";
import TodoForm from "./todo-form";
import TodoItem from "./todo-item";

export default function TodoList({ initialTodos, userId }) {
  const [todos, setTodos] = useState(initialTodos);
  const [optimisticTodos, setOptimisticTodos] = useOptimistic(
    todos,
    (currentTodos, updater) => updater(currentTodos),
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | completed
  const [sortBy, setSortBy] = useState("newest"); // newest | priority | dueDate

  const addTodo = async (data) => {
    setError("");
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, userId }),
    });
    const result = await res.json();

    if (!res.ok) {
      setError(result.error || "Failed to add todo");
      return;
    }
    setTodos([result.todo, ...todos]);
  };

  const editTodo = async (id, data) => {
    setError("");
    const res = await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const result = await res.json();

    if (!res.ok) {
      setError(result.error || "Failed to update todo");
      return;
    }
    setTodos(todos.map((t) => (t._id === id ? result.todo : t)));
  };

  const toggleComplete = async (id, currentStatus) => {
    setError("");
    const nextStatus = !currentStatus;

    startTransition(() => {
      setOptimisticTodos((currentTodos) =>
        currentTodos.map((todo) =>
          todo._id === id ? { ...todo, isCompleted: nextStatus } : todo,
        ),
      );
    });

    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isCompleted: nextStatus }),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to update todo");
      }

      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo._id === id ? result.todo : todo)),
      );
    } catch (error) {
      startTransition(() => {
        setOptimisticTodos((currentTodos) =>
          currentTodos.map((todo) =>
            todo._id === id ? { ...todo, isCompleted: currentStatus } : todo,
          ),
        );
      });
      setError(error.message || "Failed to update todo");
      throw error;
    }
  };

  const deleteTodo = async (id) => {
    setError("");
    const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });

    if (!res.ok) {
      const result = await res.json();
      setError(result.error || "Failed to delete todo");
      return;
    }
    setTodos(todos.filter((t) => t._id !== id));
  };

  const visibleTodos = useMemo(() => {
    let result = [...optimisticTodos];

    if (filter === "active") result = result.filter((t) => !t.isCompleted);
    if (filter === "completed") result = result.filter((t) => t.isCompleted);

    const priorityRank = { high: 0, medium: 1, low: 2 };
    if (sortBy === "priority") {
      result.sort(
        (a, b) => priorityRank[a.priority] - priorityRank[b.priority],
      );
    } else if (sortBy === "dueDate") {
      result.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [optimisticTodos, filter, sortBy]);

  return (
    <div>
      <div className="mb-4">
        <TodoForm onSubmit={addTodo} />
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 border border-red-100 dark:border-red-900 rounded-lg px-3 py-2 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="text-red-400 hover:text-red-600 dark:hover:text-red-300"
          >
            ×
          </button>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs font-medium px-3 py-1.5 rounded-md capitalize transition-colors ${
                filter === f
                  ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-xs border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 rounded-lg px-2 py-1.5 text-slate-600 focus:outline-none"
        >
          <option value="newest">Newest first</option>
          <option value="priority">By priority</option>
          <option value="dueDate">By due date</option>
        </select>
      </div>

      {visibleTodos.length === 0 && (
        <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-sm">
          {filter === "all"
            ? "Nothing here yet — add your first task above."
            : `No ${filter} todos.`}
        </div>
      )}

      <ul className="space-y-2">
        {visibleTodos.map((todo) => (
          <TodoItem
            key={todo._id}
            todo={todo}
            onToggle={toggleComplete}
            onDelete={deleteTodo}
            onEdit={editTodo}
            isPending={isPending}
          />
        ))}
      </ul>
    </div>
  );
}
