export default function AssociateList({ associates = [] }) {
  if (!associates.length) {
    return (
      <div className="text-sm text-slate-500 dark:text-slate-400">
        No associates found for this role.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700 transition-colors">
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Employee ID
            </th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Current UPH
            </th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Quality Score
            </th>
            <th className="py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              Total Scans
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 transition-colors">
          {associates.map((assoc) => (
            <tr
              key={`${assoc.employeeId}-${assoc.id}`}
              className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-100">
                {assoc.employeeId || '—'}
              </td>
              <td className="py-3 px-4 text-slate-700 dark:text-slate-200">
                {assoc.currentUph}
              </td>
              <td className="py-3 px-4 text-slate-700 dark:text-slate-200">
                {assoc.qualityScorePct}%
              </td>
              <td className="py-3 px-4 text-slate-700 dark:text-slate-200">
                {assoc.totalScans}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
