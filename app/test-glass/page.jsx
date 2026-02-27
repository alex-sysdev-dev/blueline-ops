import React from "react";

const tiles = [
  { label: "Yard Capacity", value: "82%", sub: "CPT‑B", accent: "text-blue-400" },
  { label: "Inbound Risk", value: "6", sub: "Open", accent: "text-amber-400" },
  { label: "Outbound CPT", value: "High", sub: "Next 3h", accent: "text-rose-400" },
  { label: "Facility UPH", value: "1,482", sub: "Avg", accent: "text-emerald-400" },
];

export default function TestGlassPage() {
  return (
    <div className="min-h-screen px-6 py-12 md:px-12 bg-[radial-gradient(circle_at_30%_20%,#1e3a8a,#0b1220_60%)] text-white">
      <header className="mb-10">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight">
          iPhone‑Style Glass Tiles
        </h1>
        <p className="text-slate-300 mt-2 max-w-2xl">
          Subtle transparency, strong blur, inner highlight, soft shadow. Hover for lift.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiles.map((tile) => (
          <div key={tile.label} className="glass-tile-dark p-6">
            <p className="text-[11px] uppercase tracking-widest text-slate-300">
              {tile.label}
            </p>
            <div className="mt-4 flex items-end justify-between">
              <span className={`text-3xl font-semibold ${tile.accent}`}>
                {tile.value}
              </span>
              <span className="text-xs text-slate-400">{tile.sub}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-tile-dark p-6">
          <p className="text-[11px] uppercase tracking-widest text-slate-300">
            Executive Snapshot
          </p>
          <p className="mt-3 text-xl font-medium text-slate-100">
            Smooth, glassy, and operationally focused.
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Use these tiles across dashboards for consistency.
          </p>
        </div>
        <div className="glass-tile p-6">
          <p className="text-[11px] uppercase tracking-widest text-slate-200">
            Light Variant
          </p>
          <p className="mt-3 text-xl font-medium text-white">
            Subtle contrast for light‑glass cases.
          </p>
          <p className="mt-2 text-sm text-slate-200">
            Works best on darker or textured backgrounds.
          </p>
        </div>
      </section>
    </div>
  );
}
