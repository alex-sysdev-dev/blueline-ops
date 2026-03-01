// app/dashboard/yms/yard/page.jsx
import AutoRefresh from "../../../../components/AutoRefresh";
import YmsClient from "../../../../components/dashboard/YmsClient";
import { supabase } from "../../../../lib/supabase";

export const dynamic = 'force-dynamic';

export default async function YardLayoutPage() {
  const { data: spots, error } = await supabase
    .from('yard_spots')
    .select('spot_id, row, position, current_trailer')
    .order('row', { ascending: true })
    .order('position', { ascending: true });

  if (error) console.error("Supabase Error:", error.message);

  const safeSpots = (spots || []).map(spot => ({
    ...spot,
    name: spot.spot_id,
    status: spot.current_trailer ? 'Occupied' : 'Empty'
  }));

  const rows = {};
  safeSpots.forEach((spot) => {
    if (spot.name) {
      const rowLabel = spot.name.charAt(0).toUpperCase();
      if (!rows[rowLabel]) rows[rowLabel] = [];
      rows[rowLabel].push(spot);
    }
  });

  return (
    <div className="space-y-6">
      <AutoRefresh intervalSeconds={10} />
      
      <header>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          YMS <span className="text-blue-600 dark:text-blue-400">Yard</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Real-time trailer positions and spot status.
        </p>
      </header>

      <YmsClient initialRows={rows} />
    </div>
  );
}