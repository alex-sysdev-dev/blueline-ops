export default function Card({ children, className = "" }) {
  return (
    <div
      className={`
        bg-white dark:bg-slate-800
        p-6
        rounded-2xl
        shadow-sm
        border border-slate-200/80 dark:border-slate-700/80
        hover:shadow-xl hover:shadow-slate-200/60 dark:hover:shadow-black/30
        hover:-translate-y-1 hover:border-slate-300 dark:hover:border-slate-600
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}
