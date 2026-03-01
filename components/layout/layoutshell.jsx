// components/layout/layoutshell.jsx
"use client";

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import ThemeToggle from "../ThemeToggle";

export default function LayoutShell({ children, isAdmin = false }) {
  const pathname = usePathname();

  const isLandingPage = pathname === "/";
  const isPublicPage = pathname === "/login";

  if (isLandingPage) {
    return (
      <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
        <div className="fixed top-6 right-6 z-50">
          <ThemeToggle />
        </div>
        {children}
      </div>
    );
  }

  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-50 transition-colors duration-300">
        <Header />
        <div className="p-8 md:p-10">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0b1220] transition-colors duration-300">
      <Sidebar isAdmin={isAdmin} />

      <main className="flex-1 flex flex-col min-h-screen bg-slate-50 dark:bg-[radial-gradient(circle_at_20%_20%,#1e3a8a,transparent_40%),radial-gradient(circle_at_80%_80%,#0f172a,transparent_50%),#0b1220] transition-colors duration-300">
        <Header />
        
        <div className="p-8 md:p-10 text-slate-900 dark:text-slate-50">
          {children}
        </div>
      </main>
    </div>
  );
}