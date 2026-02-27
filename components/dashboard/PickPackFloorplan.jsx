import StationTile from './StationTile';

const PICK_COUNT = 20;
const PACK_COUNT = 20;

function buildPlaceholders(type, count, offset = 0) {
  return Array.from({ length: count }, (_, idx) => ({
    id: `${type}-${idx + 1 + offset}`,
    stationId: `${type}-${String(idx + 1 + offset).padStart(2, '0')}`,
    type,
    status: 'Inactive',
    associate: '',
    currentUph: 0,
    ordersInProgress: 0,
    lastActivity: null
  }));
}

function normalizeStations(stations, type, count) {
  const filtered = stations.filter((s) => s.type === type);
  const trimmed = filtered.slice(0, count);
  if (trimmed.length >= count) return trimmed;

  const placeholders = buildPlaceholders(type, count - trimmed.length, trimmed.length);
  return [...trimmed, ...placeholders];
}

function chunkStations(stations, perRow) {
  const rows = [];
  for (let i = 0; i < stations.length; i += perRow) {
    rows.push(stations.slice(i, i + perRow));
  }
  return rows;
}

export default function PickPackFloorplan({ stations = [], legend = false }) {
  const pickStations = normalizeStations(stations, 'Pick', PICK_COUNT);
  const packStations = normalizeStations(stations, 'Pack', PACK_COUNT);
  const pickRows = chunkStations(pickStations, 4);
  const packRows = chunkStations(packStations, 4);

  return (
    <div className="relative p-5 bg-slate-50 dark:bg-slate-900/60">
      <div className="absolute inset-0 pointer-events-none opacity-60 bg-[linear-gradient(90deg,rgba(148,163,184,0.12)_1px,transparent_1px),linear-gradient(180deg,rgba(148,163,184,0.12)_1px,transparent_1px)] bg-[size:32px_32px]" />

      <div className="relative grid grid-cols-1 xl:grid-cols-[1fr_auto_1fr] gap-5">
        {/* PICK ZONE */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/85 dark:bg-slate-900/70 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Pick Zone
            </h3>
            <span className="text-[10px] text-slate-400">{PICK_COUNT} Stations</span>
          </div>
          <div className="space-y-2">
            {pickRows.map((row, idx) => (
              <div key={`pick-row-${idx}`} className="grid grid-cols-[72px_1fr] gap-2 items-center">
                <div className="text-[10px] uppercase tracking-widest text-slate-400">
                  Aisle {idx + 1}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {row.map((station) => (
                    <StationTile key={station.id} station={station} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CONVEYOR / AISLE DIVIDER */}
        <div className="hidden xl:flex flex-col items-center justify-center text-slate-400">
          <div className="w-2 h-full bg-slate-300/60 dark:bg-slate-700/70 rounded-full" />
          <span className="text-[10px] uppercase tracking-widest mt-3">Conveyor</span>
        </div>

        {/* PACK ZONE */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/70 bg-white/85 dark:bg-slate-900/70 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Pack Zone
            </h3>
            <span className="text-[10px] text-slate-400">{PACK_COUNT} Stations</span>
          </div>
          <div className="space-y-2">
            {packRows.map((row, idx) => (
              <div key={`pack-row-${idx}`} className="grid grid-cols-[72px_1fr] gap-2 items-center">
                <div className="text-[10px] uppercase tracking-widest text-slate-400">
                  Aisle {idx + 1}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {row.map((station) => (
                    <StationTile key={station.id} station={station} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {legend ? (
        <div className="relative mt-5 flex flex-wrap items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Active
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-purple-500" />
            Maintenance
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-500" />
            Inactive
          </div>
        </div>
      ) : null}
    </div>
  );
}
