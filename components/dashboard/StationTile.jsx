export default function StationTile({ station }) {
  const status = (station.status || 'Idle').toLowerCase();

  const statusStyle = {
    active: 'bg-emerald-500',
    inactive: 'bg-slate-500',
    maintenance: 'bg-purple-500'
  }[status] || 'bg-slate-500';

  return (
    <div className="rounded-lg border border-slate-200/70 dark:border-slate-700/70 bg-white/90 dark:bg-slate-800/80 px-2.5 py-2 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold text-slate-700 dark:text-slate-200">{station.stationId}</p>
        <span className={`h-2 w-2 rounded-full ${statusStyle}`} />
      </div>
      <div className="mt-1.5 flex items-baseline justify-between">
        <p className="text-[9px] text-slate-500 dark:text-slate-400">UPH</p>
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{station.currentUph}</p>
      </div>
      <div className="mt-0.5 flex items-baseline justify-between">
        <p className="text-[9px] text-slate-500 dark:text-slate-400">Orders</p>
        <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">{station.ordersInProgress}</p>
      </div>
      <p className="mt-1.5 text-[9px] text-slate-400 truncate">
        {station.associate || 'Unassigned'}
      </p>
    </div>
  );
}
