import React from "react";
import AutoRefresh from "../../../components/AutoRefresh";
import YmsClient from "../../../components/dashboard/YmsClient";
import {
  getTrailers,
  getYardSpots,
  getDocks,
  getMoves,
  getAppointments
} from "../../../lib/airtable";

const YARD_CAPACITY = 75;
const TOTAL_DOCKS = 32;

const YMS_THRESHOLDS = {
  yardOccupancy: {
    warning: 80,
    critical: 90,
  },
  dockUtilization: {
    warning: 85,
    critical: 95,
  },
  deadlined: {
    warning: 1,
    critical: 3,
  },
};

function getSeverity(value, threshold) {
  if (value >= threshold.critical) return "critical";
  if (value >= threshold.warning) return "warning";
  return "normal";
}

export default async function YmsOverview() {
  const [trailers, yardSpots, docks, moves, appointments] = await Promise.all([
    getTrailers(200),
    getYardSpots(200),
    getDocks(200),
    getMoves(200),
    getAppointments(200)
  ]);

  const trailersOnYard = trailers.filter((t) => Number(t.isOnYard) === 1 || t.trailerStatus === "On Yard").length;
  const yardOccupancyPct = Math.round((trailersOnYard / YARD_CAPACITY) * 100);

  const occupiedDocks = docks.filter((d) => d.status === "Occupied").length;
  const dockUtilPct = Math.round((occupiedDocks / TOTAL_DOCKS) * 100);

  const deadlined = trailers.filter((t) => t.loadStatus === "Deadlined" || Number(t.isDeadlined) === 1).length;

  function getSeverity(value, threshold) {
  if (value >= threshold.critical) return "critical";
  if (value >= threshold.warning) return "warning";
  return "normal";
}

const yardSeverity = getSeverity(
  yardOccupancyPct,
  YMS_THRESHOLDS.yardOccupancy
);

const dockSeverity = getSeverity(
  dockUtilPct,
  YMS_THRESHOLDS.dockUtilization
);

const deadlinedSeverity = getSeverity(
  deadlined,
  YMS_THRESHOLDS.deadlined
);

  const kpis = {
  totalTrailers: trailers.length,
  trailersOnYard,

  yardOccupancyPct: Number.isFinite(yardOccupancyPct) ? yardOccupancyPct : 0,
  yardSeverity,

  dockUtilPct: Number.isFinite(dockUtilPct) ? dockUtilPct : 0,
  dockSeverity,

  deadlined,
  deadlinedSeverity
};

  return (
    <div className="space-y-6">
      <AutoRefresh intervalSeconds={10} />
      <YmsClient
        trailers={trailers}
        yardSpots={yardSpots}
        docks={docks}
        moves={moves}
        appointments={appointments}
        kpis={kpis}
      />
    </div>
  );
}
