"use client";

import { useState, useTransition } from "react";
import TodoForm from "./todo-form";

const priorityDot = {
  low: "bg-emerald-500",
  medium: "bg-amber-500",
  high: "bg-red-500",
};

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
  isPending,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleEditSubmit = async (data) => {
    await onEdit(todo._id, data);
    setIsEditing(false);
  };

  const handleToggle = async () => {
    if (busy) return;

    setBusy(true);

    try {
      await onToggle(todo._id, todo.isCompleted);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await onDelete(todo._id);
    } finally {
      setBusy(false);
    }
  };

  if (isEditing) {
    return (
      <TodoForm
        initialData={todo}
        onSubmit={handleEditSubmit}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  const isOverdue =
    todo.dueDate && !todo.isCompleted && new Date(todo.dueDate) < new Date();

  return (
    <li className="group flex items-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
      <button
        onClick={handleToggle}
        disabled={busy || isPending}
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
          todo.isCompleted
            ? "bg-indigo-600 border-indigo-600"
            : "border-slate-300 dark:border-slate-600 hover:border-indigo-400"
        }`}
      >
        {todo.isCompleted && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>

      {todo.priority && (
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${priorityDot[todo.priority]}`}
        />
      )}

      <div className="flex-1 min-w-0">
        <span
          className={`text-sm block ${
            todo.isCompleted
              ? "text-slate-400 line-through"
              : "text-slate-700 dark:text-slate-200"
          }`}
        >
          {todo.title}
        </span>
        <div className="flex gap-2 mt-0.5">
          {todo.category?.name && (
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: `${todo.category.color}20`,
                color: todo.category.color,
              }}
            >
              {todo.category.name}
            </span>
          )}
          {todo.dueDate && (
            <span
              className={`text-xs ${isOverdue ? "text-red-500 font-medium" : "text-slate-400 dark:text-slate-500"}`}
            >
              Due{" "}
              {new Date(todo.dueDate).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </span>
          )}
        </div>
      </div>

      <div className="opacity-0 group-hover:opacity-100 flex gap-3 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 text-sm"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={busy || isPending}
          className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 text-sm"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
