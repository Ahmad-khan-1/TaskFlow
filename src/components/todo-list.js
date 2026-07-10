"use client";

import { useMemo, useState, useTransition } from "react";
import TodoForm from "./todo-form";
import TodoItem from "./todo-item";

export default function TodoList({ initialTodos, userId }) {
  const [todos, setTodos] = useState(initialTodos);
  const [isPending] = useTransition();
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | completed
  const [sortBy, setSortBy] = useState("newest"); // newest | priority | dueDate

  const addTodo = async (data) => {
    setError("");
    const tempId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : Date.now().toString();

    const tempTodo = {
      _id: tempId,
      title: data.title,
      priority: data.priority,
      category: data.category,
      dueDate: data.dueDate,
      isCompleted: false,
      userId,
      createdAt: new Date().toISOString(),
    };

    setTodos((prevTodos) => [tempTodo, ...prevTodos]);

    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, userId }),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to add todo");
      }

      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo._id === tempId ? result.todo : todo)),
      );
    } catch (err) {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== tempId));
      setError(err.message || "Failed to add todo");
    }
  };

  const editTodo = async (id, data) => {
    setError("");
    let previousTodo;

    setTodos((prevTodos) =>
      prevTodos.map((todo) => {
        if (todo._id === id) {
          previousTodo = todo;
          return { ...todo, ...data };
        }
        return todo;
      }),
    );

    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to update todo");
      }

      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo._id === id ? result.todo : todo)),
      );
    } catch (err) {
      if (previousTodo) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) => (todo._id === id ? previousTodo : todo)),
        );
      }
      setError(err.message || "Failed to update todo");
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    setError("");
    const nextStatus = !currentStatus;

    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === id ? { ...todo, isCompleted: nextStatus } : todo,
      ),
    );

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
    } catch (err) {
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, isCompleted: currentStatus } : todo,
        ),
      );
      setError(err.message || "Failed to update todo");
    }
  };

  const deleteTodo = async (id) => {
    setError("");
    let deletedTodo;
    let deletedIndex = -1;

    setTodos((prevTodos) => {
      deletedIndex = prevTodos.findIndex((todo) => todo._id === id);
      if (deletedIndex === -1) return prevTodos;
      deletedTodo = prevTodos[deletedIndex];
      return prevTodos.filter((todo) => todo._id !== id);
    });

    try {
      const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || "Failed to delete todo");
      }
    } catch (err) {
      if (deletedTodo && deletedIndex >= 0) {
        setTodos((prevTodos) => {
          const nextTodos = [...prevTodos];
          nextTodos.splice(deletedIndex, 0, deletedTodo);
          return nextTodos;
        });
      }
      setError(err.message || "Failed to delete todo");
    }
  };

  const visibleTodos = useMemo(() => {
    let result = [...todos];

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
  }, [todos, filter, sortBy]);

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
