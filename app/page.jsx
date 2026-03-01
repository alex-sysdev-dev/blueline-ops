import React from "react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[radial-gradient(circle_at_20%_20%,#1e3a8a,transparent_40%),radial-gradient(circle_at_80%_80%,#0f172a,transparent_50%),#0b1220] flex flex-col justify-center items-center px-6 relative text-slate-900 dark:text-slate-100 transition-colors duration-300">

      {/* Subtle Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

      <main className="relative z-10 flex flex-col items-center text-center w-full max-w-[1200px] gap-8">

        {/* Using glass-card to support both light and dark modes */}
        <div className="glass-card w-full max-w-[980px] px-6 py-10 md:px-12 md:py-14">
          
          <div className="w-full flex justify-center">
            {/* Shows in Light Mode */}
            <img
              src="/brand/logo-dark.svg"
              alt="BlueLineOps"
              className="block h-[200px] md:h-[260px] w-auto dark:hidden"
              loading="eager"
            />
            {/* Shows in Dark Mode */}
            <img
              src="/brand/logo-light.svg"
              alt="BlueLineOps"
              className="block h-[200px] md:h-[260px] w-auto hidden dark:block"
              loading="eager"
            />
          </div>

          <h1 className="w-full text-center text-3xl md:text-5xl font-extrabold tracking-tight mt-6">
            <span className="text-blue-600 dark:text-blue-400">Operational</span>{' '}
            <span className="text-slate-900 dark:text-slate-100">Intelligence</span>{' '}
            <span className="text-blue-600 dark:text-blue-400">for Logistics</span>
          </h1>

          <div className="flex flex-col items-center gap-3 mt-6">
            <Link
              href="/control-center"
              className="bg-blue-600 hover:bg-blue-700 dark:bg-white/10 dark:hover:bg-white/20 px-8 py-4 text-white rounded-2xl font-semibold text-lg transition-all shadow-md"
            >
              Welcome
            </Link>

            <Link
              href="/login"
              className="text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-all duration-300 hover:underline"
            >
              Admin Access
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}