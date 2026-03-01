"use client";

import Card from "../ui/Card";

function severityColor(level) {
  if (level === "critical") return "text-rose-600 dark:text-rose-400";
  if (level === "warning") return "text-amber-600 dark:text-amber-400";
  return "text-emerald-600 dark:text-emerald-400";
}

export default function YmsExecutive({ snapshot }) {
  if (!snapshot) return null;

  return (
    <div className="space-y-6">

      <header>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
          Executive Yard Overview
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          Real-time yard health metrics
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <Card className="p-6">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Total Trailers</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {snapshot.total_trailers}
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Yard Occupancy</p>
          <p className={`text-3xl font-black mt-2 ${severityColor(snapshot.yard_severity)}`}>
            {snapshot.yard_occupancy_pct}%
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Dock Utilization</p>
          <p className={`text-3xl font-black mt-2 ${severityColor(snapshot.dock_severity)}`}>
            {snapshot.dock_utilization_pct}%
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Deadlined Trailers</p>
          <p className={`text-3xl font-black mt-2 ${severityColor(snapshot.deadlined_severity)}`}>
            {snapshot.deadlined_trailers}
          </p>
        </Card>

      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card className="p-6">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Avg Dwell Time</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {snapshot.avg_dwell_time} mins
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Active Moves</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {snapshot.active_moves}
          </p>
        </Card>

        <Card className="p-6">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Active Appointments</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white mt-2">
            {snapshot.active_appointments}
          </p>
        </Card>

      </section>

    </div>
  );
}