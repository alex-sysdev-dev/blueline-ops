export default function Card({ children, className = "" }) {
  return (
    <div
      className={`
        glass-tile-dark
        p-6
        ${className}
      `}
    >
      {children}
    </div>
  );
}
