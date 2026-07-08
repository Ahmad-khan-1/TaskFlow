import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import ThemeToggle from "@/components/theme-toggle";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/todos");
  }

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-200 dark:bg-indigo-900/40 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-40 animate-blob" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-200 dark:bg-blue-900/40 rounded-full mix-blend-multiply dark:mix-blend-normal filter blur-3xl opacity-40 animate-blob [animation-delay:2s]" />

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>

      <div className="relative max-w-xl w-full rounded-3xl border border-white/60 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-12 transition-all duration-300 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)]">
        {/* Badge */}
        <span className="inline-flex items-center rounded-full bg-indigo-50 dark:bg-indigo-950 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 border border-indigo-100/80 dark:border-indigo-900">
          TaskFlow
        </span>

        {/* Title */}
        <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 dark:from-white dark:via-indigo-200 dark:to-white bg-clip-text text-transparent">
          Organize your tasks, simply.
        </h1>

        {/* Description */}
        <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          Keep your priorities in one calm place and stay on top of everything.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col gap-3.5 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-3.5 text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm transition-all duration-200 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-[0.98]"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 transition-all duration-200 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-[0.98]"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </main>
  );
}
