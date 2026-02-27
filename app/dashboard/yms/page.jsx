import React from "react";
import Card from "../../../components/ui/Card";
import YmsCharts from "../../../components/dashboard/YmsCharts";
import { getYmsLog } from "../../../lib/airtable";
import AutoRefresh from "../../../components/AutoRefresh";

const YARD_CAPACITY = 50;
const INBOUND_DOCKS = 14;
const OUTBOUND_DOCKS = 14;

function formatTime(value) {
  if (!value) return "—";
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default async function YmsOverview() {
  const records = await getYmsLog(60);

  const activeTrailers = records.filter((r) => r.status !== "Dispatched").length;
  const yardCapacityPct = Math.round((activeTrailers / YARD_CAPACITY) * 100);

  const inboundAtDock = records.filter(
    (r) => r.direction === "Inbound" && r.status === "At Dock"
  ).length;
  const outboundAtDock = records.filter(
    (r) => r.direction === "Outbound" && r.status === "At Dock"
  ).length;

  const inboundDockUtil = Math.round((inboundAtDock / INBOUND_DOCKS) * 100);
  const outboundDockUtil = Math.round((outboundAtDock / OUTBOUND_DOCKS) * 100);

  const inboundDwellRisk =
    records.some((r) => r.direction === "Inbound" && r.dwellTimeMins > 240) ? "High" : "Low";
  const outboundCptRisk =
    records.some((r) => r.direction === "Outbound" && r.cpt && new Date(r.cpt) < Date.now())
      ? "High"
      : "Low";

  const overallYardRisk =
    inboundDwellRisk === "High" || outboundCptRisk === "High" ? "High" : "Low";

  const lineData = [...records]
    .filter((r) => r.geofenceCheckIn)
    .sort((a, b) => new Date(a.geofenceCheckIn) - new Date(b.geofenceCheckIn))
    .slice(-8)
    .map((r) => ({
      label: formatTime(r.geofenceCheckIn),
      value: Number(r.dwellTimeMins) || 0
    }));

  const statusCounts = records.reduce((acc, r) => {
    const key = r.status || "Unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const barData = Object.entries(statusCounts).map(([label, value]) => ({ label, value }));

  const buildDockSlots = (direction) => {
    const occupied = records
      .filter((r) => r.status === "At Dock" && r.direction === direction)
      .sort((a, b) => (a.dockAssigned || 0) - (b.dockAssigned || 0));

    const slots = Array.from({ length: 14 }, (_, idx) => ({
      slot: idx + 1,
      trailerId: '',
      occupied: false
    }));

    let nextIndex = 0;
    occupied.forEach((r) => {
      if (r.dockAssigned && r.dockAssigned >= 1 && r.dockAssigned <= 14) {
        slots[r.dockAssigned - 1] = {
          slot: r.dockAssigned,
          trailerId: r.trailerId,
          occupied: true
        };
      } else {
        while (nextIndex < slots.length && slots[nextIndex].occupied) nextIndex += 1;
        if (nextIndex < slots.length) {
          slots[nextIndex] = {
            slot: nextIndex + 1,
            trailerId: r.trailerId,
            occupied: true
          };
        }
      }
    });

    return slots;
  };

  const inboundDockSlots = buildDockSlots("Inbound");
  const outboundDockSlots = buildDockSlots("Outbound");
  const yardTrailers = records.filter((r) => r.status === "Yard");
  const yardSlots = Array.from({ length: YARD_CAPACITY }, (_, idx) => ({
    slot: idx + 1,
    occupied: idx < yardTrailers.length
  }));

  const trailerAging = [...records]
    .filter((r) => r.dwellTimeMins)
    .sort((a, b) => b.dwellTimeMins - a.dwellTimeMins)
    .slice(0, 4);

  const cptCountdown = [...records]
    .filter((r) => r.cpt)
    .sort((a, b) => new Date(a.cpt) - new Date(b.cpt))
    .slice(0, 4);

  return (
    <div className="space-y-6">
      <AutoRefresh intervalSeconds={10} />
      <header>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          <span className="text-blue-600 dark:text-blue-400">YMS</span> Overview
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Yard visibility, dwell risk, and CPT exposure.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Active Trailers
          </p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {activeTrailers}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Yard Capacity
          </p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {yardCapacityPct}%
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Overall Yard Risk
          </p>
          <p className={`text-2xl font-black mt-2 ${overallYardRisk === "High" ? "text-rose-500" : "text-emerald-500"}`}>
            {overallYardRisk}
          </p>
        </Card>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Inbound Dwell Risk
          </p>
          <p className={`text-xl font-black mt-2 ${inboundDwellRisk === "High" ? "text-rose-500" : "text-emerald-500"}`}>
            {inboundDwellRisk}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Outbound CPT Risk
          </p>
          <p className={`text-xl font-black mt-2 ${outboundCptRisk === "High" ? "text-rose-500" : "text-emerald-500"}`}>
            {outboundCptRisk}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Inbound Dock Utilization
          </p>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-2">
            {inboundDockUtil}%
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Outbound Dock Utilization
          </p>
          <p className="text-xl font-black text-slate-900 dark:text-white mt-2">
            {outboundDockUtil}%
          </p>
        </Card>
      </section>

      <Card className="p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white px-6 py-4">
          <h2 className="text-base font-bold tracking-wide">Yard & Dock Floorplan</h2>
          <p className="text-xs text-slate-300 mt-1">Yard capacity and dock assignments</p>
        </div>

        <div className="relative p-5 bg-slate-50 dark:bg-slate-900/60">
          <div className="absolute inset-0 pointer-events-none opacity-60 bg-[linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(180deg,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:28px_28px]" />

          <div className="relative grid grid-cols-1 xl:grid-cols-[1fr_auto_1fr] gap-5">
            {/* Inbound Docks */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/85 dark:bg-slate-900/70 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Inbound Docks
                </h3>
                <span className="text-[10px] text-slate-400">14 Doors</span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {inboundDockSlots.map((dock) => (
                  <div
                    key={`in-${dock.slot}`}
                    className={`h-12 rounded-md border text-[10px] font-semibold flex flex-col items-center justify-center gap-0.5 ${
                      dock.occupied
                        ? "bg-blue-500/90 text-white border-blue-500"
                        : "bg-white/80 dark:bg-slate-800/80 text-slate-500 border-slate-200 dark:border-slate-700"
                    }`}
                    title={dock.trailerId || `Dock ${dock.slot}`}
                  >
                    <span className="text-[9px] uppercase tracking-widest">Dock {dock.slot}</span>
                    <span className="text-[9px] font-medium">{dock.trailerId || '—'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Yard */}
            <div className="hidden xl:flex flex-col items-center justify-center text-slate-400">
              <div className="w-2 h-full bg-slate-300/60 dark:bg-slate-700/70 rounded-full" />
              <span className="text-[10px] uppercase tracking-widest mt-3">Yard</span>
            </div>

            {/* Outbound Docks */}
            <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/85 dark:bg-slate-900/70 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Outbound Docks
                </h3>
                <span className="text-[10px] text-slate-400">14 Doors</span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {outboundDockSlots.map((dock) => (
                  <div
                    key={`out-${dock.slot}`}
                    className={`h-12 rounded-md border text-[10px] font-semibold flex flex-col items-center justify-center gap-0.5 ${
                      dock.occupied
                        ? "bg-emerald-500/90 text-white border-emerald-500"
                        : "bg-white/80 dark:bg-slate-800/80 text-slate-500 border-slate-200 dark:border-slate-700"
                    }`}
                    title={dock.trailerId || `Dock ${dock.slot}`}
                  >
                    <span className="text-[9px] uppercase tracking-widest">Dock {dock.slot}</span>
                    <span className="text-[9px] font-medium">{dock.trailerId || '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/85 dark:bg-slate-900/70 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Yard Slots
              </h3>
              <span className="text-[10px] text-slate-400">
                {yardTrailers.length}/{YARD_CAPACITY} occupied
              </span>
            </div>
            <div className="grid grid-cols-10 gap-1.5">
              {yardSlots.map((slot) => {
                const trailer = yardTrailers[slot.slot - 1];
                return (
                  <div
                    key={`yard-${slot.slot}`}
                    className={`h-8 rounded-sm flex flex-col items-center justify-center text-[8px] font-semibold ${
                      slot.occupied
                        ? "bg-amber-400/90 text-slate-900"
                        : "bg-slate-200/70 dark:bg-slate-800/70 text-slate-500"
                    }`}
                    title={trailer?.trailerId || `Yard ${slot.slot}`}
                  >
                    <span>Y{slot.slot}</span>
                    <span className="font-normal">{trailer?.trailerId || '—'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      <YmsCharts lineData={lineData} barData={barData} />

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
            Trailer Aging
          </h3>
          <div className="space-y-3">
            {trailerAging.map((t) => (
              <div key={t.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-700 dark:text-slate-200 font-semibold">{t.trailerId}</span>
                <span className="text-slate-500 dark:text-slate-400">{t.dwellTimeMins} mins</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">
            CPT Countdown
          </h3>
          <div className="space-y-3">
            {cptCountdown.map((t) => (
              <div key={t.id} className="flex items-center justify-between text-sm">
                <span className="text-slate-700 dark:text-slate-200 font-semibold">{t.trailerId}</span>
                <span className="text-slate-500 dark:text-slate-400">{formatTime(t.cpt)}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </div>
  );
}
