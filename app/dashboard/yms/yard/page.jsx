import { getYardSpots } from '../../../../lib/airtable';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Yard',
};

export default async function YardLayoutPage() {
  const spots = await getYardSpots();

  // Group by row (lowercase now)
  const rows = {};

  spots.forEach((spot) => {
    if (!rows[spot.row]) rows[spot.row] = [];
    rows[spot.row].push(spot);
  });

  const sortedRows = Object.keys(rows)
    .sort((a, b) => Number(a) - Number(b))
    .map((rowKey) => ({
      row: rowKey,
      spots: rows[rowKey].sort(
        (a, b) => Number(a.position) - Number(b.position)
      ),
    }));

  return (
    <div className="min-h-screen p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/yms"
          className="text-sm text-slate-500 hover:text-blue-600"
        >
          ← Back to YMS Overview
        </Link>

        <h1 className="text-4xl font-black mt-4">
          <span className="text-blue-600">Yard</span> Layout
        </h1>
        <p className="text-slate-500 mt-2">
          Real-time physical yard visualization
        </p>
      </div>

      {/* Grid */}
      <div className="space-y-6">
        {sortedRows.map((row) => (
          <div key={row.row}>
            <h2 className="text-xs uppercase font-bold text-slate-400 mb-2">
              Row {row.row}
            </h2>

            <div className="flex flex-wrap gap-3">
              {row.spots.map((spot) => (
                <YardTile key={spot.id} spot={spot} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function YardTile({ spot }) {
  const occupied = spot.occupiedNumeric === 1;

  const baseClasses =
    'w-20 h-20 flex flex-col items-center justify-center text-xs font-bold glass-tile';
  const statusClasses = occupied
    ? 'bg-blue-600 text-white border-blue-600'
    : 'text-slate-700 dark:text-slate-200';

  return (
    <div className={`${baseClasses} ${statusClasses}`}>
      <div>{spot.spotId}</div>

      {occupied && (
        <div className="text-[10px] mt-1 opacity-90">
          {spot.currentTrailerNumber || '—'}
        </div>
      )}
    </div>
  );
}