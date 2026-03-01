import React from 'react';
import Card from '../../../../components/ui/Card';
import PickPackFloorplan from '../../../../components/dashboard/PickPackFloorplan';
import AutoRefresh from '../../../../components/AutoRefresh';
import { supabase } from '../../../../lib/supabase';

export default async function PickPackFloorplanOnly() {
  const { data } = await supabase.from('pick_pack_stations').select('*');
  
  // Map it to ensure camelCase compatibility with your UI component
  const stations = (data || []).map(s => ({
    ...s,
    currentUph: s.current_uph 
  }));

  return (
    <div className="space-y-4">
      <AutoRefresh intervalSeconds={10} />
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            <span className="text-blue-600 dark:text-blue-400">Pick</span>{' '}
            <span>& Pack Floorplan</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Full-screen station layout with aisle labels.
          </p>
        </div>
        <span className="text-xs text-slate-400 uppercase tracking-widest">Live View</span>
      </header>

      <Card className="p-0 overflow-hidden min-h-[calc(100vh-220px)]">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white px-6 py-3">
          <h2 className="text-sm font-bold tracking-wide">Station Floorplan</h2>
          <p className="text-[11px] text-slate-300 mt-1">Pick and Pack zones (20 stations each)</p>
        </div>

        <div className="h-full">
          <PickPackFloorplan stations={stations} legend />
        </div>
      </Card>
    </div>
  );
}