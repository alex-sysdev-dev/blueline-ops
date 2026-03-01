"use client";

export default function Card({ children, className = "" }) {
  return (
    <div
      className={`
        relative rounded-2xl transition-all duration-300 hover:scale-[1.02]
        bg-white border border-slate-200 shadow-md text-slate-900 hover:shadow-lg
        dark:bg-white/5 dark:border-white/10 dark:backdrop-blur-xl dark:text-white
        dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] dark:hover:border-white/20 dark:hover:shadow-[0_12px_40px_rgba(0,0,0,0.5)]
        ${className}
      `}
    >
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}