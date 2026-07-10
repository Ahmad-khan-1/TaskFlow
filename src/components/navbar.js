"use client";

import { signOut } from "next-auth/react";
import ThemeToggle from "@/components/theme-toggle";

export default function Navbar({ userName }) {
  const [firstName, ...restName] = userName?.split(" ") ?? [userName];
  const restOfName = restName.join(" ");

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-3 sm:px-4 sm:py-4 lg:px-8">
        <div>
          <p className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-100">
            TaskFlow
          </p>
        </div>

        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <span className="max-w-[120px] truncate whitespace-nowrap text-sm font-medium text-slate-600 dark:text-slate-300 sm:max-w-none sm:text-base">
            Hi,&nbsp;
            <span className="font-semibold">{firstName}</span>
            <span className="hidden sm:inline"> {restOfName}</span>
          </span>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-lg border border-slate-200 px-2.5 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:text-slate-200 dark:hover:border-indigo-500 dark:hover:bg-indigo-950 dark:hover:text-indigo-300 sm:px-3"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
