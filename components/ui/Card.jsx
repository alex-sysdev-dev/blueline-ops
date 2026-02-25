export default function Card({ children, className = "" }) {
  return (
    <div
      className={`
        bg-white dark:bg-slate-800
        p-6
        rounded-2xl
        shadow-sm
        border border-slate-200 dark:border-slate-700
        hover:shadow-xl hover:-translate-y-1
        transition-all duration-300
        ${className}
      `}
    >
      {children}
    </div>
  );
}