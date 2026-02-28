"use client";


import React, { useMemo, useState } from "react";
import Card from "../ui/Card";


function sortByNumericId(a, b, field) {
  const numA = Number(String(a[field] || "").replace(/\D/g, "")) || 0;
  const numB = Number(String(b[field] || "").replace(/\D/g, "")) || 0;
  return numA - numB;
}


function formatTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}


function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}


function buildTimelineEvents(trailer, moves, appointments) {
  if (!trailer) return [];


  const trailerMoves = moves
    .filter((m) => m.trailer === trailer.trailerNumber)
    .sort((a, b) => new Date(a.moveTime) - new Date(b.moveTime))
    .map((m) => ({
      type: "Move",
      label: m.reason || "Move",
      time: m.moveTime,
      meta: `${m.fromLocation || ""} -> ${m.toLocation || ""}`.trim()
    }));


  const trailerAppt = appointments.find((a) => a.trailer === trailer.trailerNumber);
  const events = [];


  if (trailerAppt?.scheduledTime) {
    events.push({ type: "Appointment", label: "Scheduled", time: trailerAppt.scheduledTime });
  }


  if (trailer.arrivalTime) {
    events.push({ type: "Arrival", label: "Arrived", time: trailer.arrivalTime });
  }


  events.push(...trailerMoves);


  if (trailer.departureTime) {
    events.push({ type: "Departure", label: "Departed", time: trailer.departureTime });
  }


  return events.sort((a, b) => new Date(a.time) - new Date(b.time));
}


export default function YmsClient({
  trailers = [],
  yardSpots = [],
  docks = [],
  moves = [],
  appointments = [],
  kpis = {}
}) {
  const [selectedTrailer, setSelectedTrailer] = useState("");
  const [filters, setFilters] = useState({
    carrier: "",
    loadStatus: "",
    minPriority: ""
  });
  const getSeverityColor = (severity) => {
  if (severity === "critical") return "text-rose-400";
  if (severity === "warning") return "text-amber-400";
  return "text-emerald-400";
};
  const carriers = useMemo(() => {
    const unique = new Set(trailers.map((t) => t.carrier).filter(Boolean));
    return Array.from(unique).sort();
  }, [trailers]);


  const loadStatuses = useMemo(() => {
    const unique = new Set(trailers.map((t) => t.loadStatus).filter(Boolean));
    return Array.from(unique).sort();
  }, [trailers]);


  const trailerByNumber = useMemo(() => {
    return trailers.reduce((acc, trailer) => {
      acc[trailer.trailerNumber] = trailer;
      return acc;
    }, {});
  }, [trailers]);


  const matchesFilters = (trailer) => {
    if (!trailer) return false;
    if (filters.carrier && trailer.carrier !== filters.carrier) return false;
    if (filters.loadStatus && trailer.loadStatus !== filters.loadStatus) return false;
    if (filters.minPriority) {
      const min = Number(filters.minPriority);
      if (!Number.isNaN(min) && Number(trailer.priorityFinal || 0) < min) return false;
    }
    return true;
  };


  const filteredTrailers = useMemo(() => {
    if (!filters.carrier && !filters.loadStatus && !filters.minPriority) return trailers;
    return trailers.filter(matchesFilters);
  }, [trailers, filters]);


  const priorityTrailers = useMemo(() => {
    return [...filteredTrailers]
      .sort((a, b) => Number(b.priorityFinal || 0) - Number(a.priorityFinal || 0))
      .slice(0, 10);
  }, [filteredTrailers]);


  const sortedYardSpots = useMemo(() => {
    const spots = [...yardSpots].sort((a, b) => sortByNumericId(a, b, "spotId"));
    return spots;
  }, [yardSpots]);


  const inboundDocks = useMemo(() => docks.filter((d) => d.dockType === "Inbound"), [docks]);
  const outboundDocks = useMemo(() => docks.filter((d) => d.dockType === "Outbound"), [docks]);
  const flexDocks = useMemo(() => docks.filter((d) => d.dockType === "Flex"), [docks]);


  const selectedTrailerData = trailers.find((t) => t.trailerNumber === selectedTrailer);
  const timelineEvents = buildTimelineEvents(selectedTrailerData, moves, appointments);


  return (
    <div className="space-y-5">
      <header className="flex flex-col gap-1">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          <span className="text-blue-600 dark:text-blue-400">YMS</span> Overview
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Yard visibility, dock utilization, and priority flow.
        </p>
      </header>


      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="text-xs uppercase tracking-widest text-slate-400">Filters</div>
          <select
            value={filters.carrier}
            onChange={(e) => setFilters((prev) => ({ ...prev, carrier: e.target.value }))}
            className="bg-transparent border border-slate-600/40 text-slate-100 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Carriers</option>
            {carriers.map((carrier) => (
              <option key={carrier} value={carrier} className="text-slate-900">
                {carrier}
              </option>
            ))}
          </select>


          <select
            value={filters.loadStatus}
            onChange={(e) => setFilters((prev) => ({ ...prev, loadStatus: e.target.value }))}
            className="bg-transparent border border-slate-600/40 text-slate-100 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Load Status</option>
            {loadStatuses.map((status) => (
              <option key={status} value={status} className="text-slate-900">
                {status}
              </option>
            ))}
          </select>


          <input
            type="number"
            placeholder="Min Priority"
            value={filters.minPriority}
            onChange={(e) => setFilters((prev) => ({ ...prev, minPriority: e.target.value }))}
            className="bg-transparent border border-slate-600/40 text-slate-100 rounded-lg px-3 py-2 text-sm w-36"
          />
        </div>
      </Card>


      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-400">Total Trailers</p>
          <p className="text-2xl font-black text-slate-100 mt-2">{kpis.totalTrailers}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-400">Yard Occupancy</p>
          <p className="text-2xl font-black text-slate-100 mt-2">{kpis.yardOccupancyPct}%</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-400">Dock Utilization</p>
          <p className="text-2xl font-black text-slate-100 mt-2">{kpis.dockUtilPct}%</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-400">Deadlined Trailers</p>
          <p className="text-2xl font-black text-rose-400 mt-2">{kpis.deadlined}</p>
        </Card>
      </section>


      <section className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Yard Spots</h2>
              <span className="text-[11px] text-slate-400">{kpis.trailersOnYard}/75 occupied</span>
            </div>
            <div className="grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1.5">
              {sortedYardSpots.map((spot) => {
                const trailerNumber = spot.currentTrailer;
                const trailer = trailerNumber ? trailerByNumber[trailerNumber] : null;
                const isSelected = trailerNumber && selectedTrailer === trailerNumber;
                const matches = trailer ? matchesFilters(trailer) : true;


                let bg = "bg-slate-800/60";
                if (trailer?.loadStatus === "Deadlined") bg = "bg-rose-500/80";
                else if (trailer?.loadStatus === "Loaded") bg = "bg-blue-500/80";
                else if (trailer?.loadStatus === "Empty") bg = "bg-amber-400/80";


                return (
                  <button
                    key={spot.spotId}
                    onClick={() => trailerNumber && setSelectedTrailer(trailerNumber)}
                    className={`${bg} ${matches ? "" : "opacity-40"} ${isSelected ? "ring-2 ring-blue-400" : ""} rounded-md text-[9px] text-slate-900 font-semibold flex flex-col items-center justify-center h-12 transition-all`}
                    title={trailerNumber || spot.spotId}
                  >
                    <span className="text-[9px] text-slate-100">{spot.spotId}</span>
                    <span className="text-[9px] text-slate-900">{trailerNumber || "-"}</span>
                  </button>
                );
              })}
            </div>
          </Card>


          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-3">Inbound Docks</h3>
              <div className="grid grid-cols-4 gap-2">
                {inboundDocks.sort((a, b) => sortByNumericId(a, b, "dockNumber")).map((dock) => {
                  const occupied = dock.status === "Occupied";
                  return (
                    <div
                      key={dock.dockNumber}
                      className={`rounded-md border text-[10px] flex flex-col items-center justify-center h-14 ${
                        occupied ? "bg-blue-500/80 text-white border-blue-500/70" : "bg-slate-800/60 text-slate-200 border-slate-700"
                      }`}
                    >
                      <span className="text-[9px] uppercase">{dock.dockNumber}</span>
                      <span className="text-[9px]">{dock.assignedTrailer || "-"}</span>
                    </div>
                  );
                })}
              </div>
            </Card>


            <Card className="p-4">
              <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-3">Outbound Docks</h3>
              <div className="grid grid-cols-4 gap-2">
                {outboundDocks.sort((a, b) => sortByNumericId(a, b, "dockNumber")).map((dock) => {
                  const occupied = dock.status === "Occupied";
                  return (
                    <div
                      key={dock.dockNumber}
                      className={`rounded-md border text-[10px] flex flex-col items-center justify-center h-14 ${
                        occupied ? "bg-emerald-500/80 text-white border-emerald-500/70" : "bg-slate-800/60 text-slate-200 border-slate-700"
                      }`}
                    >
                      <span className="text-[9px] uppercase">{dock.dockNumber}</span>
                      <span className="text-[9px]">{dock.assignedTrailer || "-"}</span>
                    </div>
                  );
                })}
              </div>
            </Card>


            <Card className="p-4">
              <h3 className="text-xs uppercase tracking-widest text-slate-400 mb-3">Flex Docks</h3>
              <div className="grid grid-cols-4 gap-2">
                {flexDocks.sort((a, b) => sortByNumericId(a, b, "dockNumber")).map((dock) => {
                  const occupied = dock.status === "Occupied";
                  return (
                    <div
                      key={dock.dockNumber}
                      className={`rounded-md border text-[10px] flex flex-col items-center justify-center h-14 ${
                        occupied ? "bg-purple-500/80 text-white border-purple-500/70" : "bg-slate-800/60 text-slate-200 border-slate-700"
                      }`}
                    >
                      <span className="text-[9px] uppercase">{dock.dockNumber}</span>
                      <span className="text-[9px]">{dock.assignedTrailer || "-"}</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>


        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Priority Trailers</h2>
            <span className="text-[11px] text-slate-400">Top 10</span>
          </div>
          <div className="space-y-2">
            {priorityTrailers.map((trailer) => (
              <button
                key={trailer.trailerNumber}
                onClick={() => setSelectedTrailer(trailer.trailerNumber)}
                className={`w-full text-left rounded-lg border px-3 py-2 text-xs transition-all ${
                  selectedTrailer === trailer.trailerNumber
                    ? "border-blue-500/70 bg-blue-500/20"
                    : "border-slate-700 bg-slate-900/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-100">{trailer.trailerNumber}</span>
                  <span className="text-[10px] text-blue-300">{Number(trailer.priorityFinal || 0).toFixed(1)}</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  {trailer.loadStatus || "-"} • {trailer.dwellTimeMinutes || 0} mins
                </div>
              </button>
            ))}
          </div>
        </Card>
      </section>


      <Card className="p-4 min-h-[140px]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Trailer Timeline</h2>
          <span className="text-[11px] text-slate-400">
            {selectedTrailerData ? selectedTrailerData.trailerNumber : "Select a trailer"}
          </span>
        </div>


        {!selectedTrailerData && (
          <div className="text-sm text-slate-500">Select a trailer from the yard or priority list.</div>
        )}


        {selectedTrailerData && (
          <div className="flex gap-6 overflow-x-auto">
            {timelineEvents.map((event, idx) => (
              <div key={`${event.type}-${idx}`} className="min-w-[120px]">
                <div className="w-2 h-2 rounded-full bg-blue-400 mb-2" />
                <div className="text-xs font-semibold text-slate-100">{event.type}</div>
                <div className="text-[10px] text-slate-400">{event.label}</div>
                <div className="text-[10px] text-slate-400">{formatDateTime(event.time)}</div>
                {event.meta && <div className="text-[10px] text-slate-500">{event.meta}</div>}
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

