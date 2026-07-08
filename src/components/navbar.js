"use client";

import { signOut } from "next-auth/react";
import ThemeToggle from "@/components/theme-toggle";

export default function Navbar({ userName }) {
  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            TaskFlow
          </p>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
            Hi, {userName}
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:bg-indigo-950 dark:hover:text-indigo-300"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
