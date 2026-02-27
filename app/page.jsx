import React from "react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col justify-center items-center px-6 relative">

      {/* Subtle Background Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

      <main className="relative z-10 flex flex-col items-center text-center w-full max-w-[1200px] gap-8">

        {/* YOUR SVG LOGO GOES HERE */}
        <div className="w-full flex justify-center">
          <img
            src="/brand/logo-light.svg"
            alt="BlueLine Ops"
            className="h-[200px] md:h-[260px] w-auto dark:hidden"
          />
          <img
            src="/brand/logo-dark.svg"
            alt="BlueLine Ops"
            className="h-[200px] md:h-[260px] w-auto hidden dark:block"
          />
        </div>

        <h1 className="w-full text-center text-3xl md:text-5xl font-extrabold tracking-tight">
          <span className="text-blue-600 dark:text-blue-400">Operational</span>{' '}
          <span className="text-slate-900 dark:text-white">Intelligence</span>{' '}
          <span className="text-blue-600 dark:text-blue-400">for Logistics</span>
        </h1>

        <div className="flex flex-col items-center gap-3">
          <Link
            href="/control-center"
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            Enter Platform
          </Link>

          {/* Subtle Admin Link */}
          <Link
            href="/login"
            className="text-xs text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 transition-all duration-300 hover:underline"
          >
            Admin Access
          </Link>
        </div>

      </main>
    </div>
  );
}
