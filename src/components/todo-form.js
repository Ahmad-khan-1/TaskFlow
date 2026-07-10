"use client";

import { useState } from "react";

[{}, {}, {}];

const CATEGORIES = [
  { name: "Personal", color: "#3B82F6" },
  { name: "Work", color: "#6366F1" },
  { name: "Shopping", color: "#A855F7" },
  { name: "Health", color: "#10B981" },
  { name: "Other", color: "#6B7280" },
];

export default function TodoForm({ onSubmit, initialData, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [priority, setPriority] = useState(initialData?.priority || "medium");
  const [categoryName, setCategoryName] = useState(
    initialData?.category?.name || "",
  );
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate ? initialData.dueDate.slice(0, 10) : "",
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);

    const category = CATEGORIES.find((c) => c.name === categoryName);

    await onSubmit({
      title,
      priority,
      dueDate: dueDate || null,
      category: category
        ? { name: category.name, color: category.color }
        : null,
    });

    setSubmitting(false);
    if (!initialData) {
      setTitle("");
      setPriority("medium");
      setCategoryName("");
      setDueDate("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3"
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="What needs to be done?"
        className="w-full rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">No category</option>
          {CATEGORIES.map((c) => (
            <option key={c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="rounded-lg border border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg px-4 py-2 transition-colors"
        >
          {submitting ? "Saving..." : initialData ? "Save changes" : "Add todo"}
        </button>
        {initialData && (
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 text-sm font-medium px-4 py-2"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
