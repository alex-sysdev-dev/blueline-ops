"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200 border bg-white text-slate-900 border-slate-200 hover:bg-slate-100 dark:bg-slate-800 dark:text-white dark:border-slate-700 dark:hover:bg-slate-700"
    >
      {theme === "dark" ? "Light Mode" : "Dark Mode"}
    </button>
  );
}