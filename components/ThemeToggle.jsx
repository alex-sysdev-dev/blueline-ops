// components/ThemeToggle.jsx
"use client";

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Check the current theme when the page loads
  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme');
      if (stored === 'dark') {
        document.documentElement.classList.add('dark');
        setIsDark(true);
        return;
      }
      if (stored === 'light') {
        document.documentElement.classList.remove('dark');
        setIsDark(false);
        return;
      }
    } catch {}

    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
      try { localStorage.setItem('theme', 'light'); } catch {}
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
      try { localStorage.setItem('theme', 'dark'); } catch {}
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
      aria-label="Toggle dark mode"
      aria-pressed={isDark}
    >
      <span className={`flex h-6 w-6 items-center justify-center rounded-full border ${
        isDark 
          ? 'bg-slate-100 text-slate-900 border-slate-200'
          : 'bg-slate-900 text-yellow-300 border-slate-900'
      }`}>
        {isDark ? <Sun size={14} /> : <Moon size={14} />}
      </span>
      <span className="text-xs font-semibold uppercase tracking-widest">
        {isDark ? 'Dark' : 'Light'}
      </span>
    </button>
  );
}
