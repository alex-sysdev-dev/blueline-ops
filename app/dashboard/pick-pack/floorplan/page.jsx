import React from 'react';
import Card from '../../../../components/ui/Card';
import PickPackFloorplan from '../../../../components/dashboard/PickPackFloorplan';
import { getPickPackStations } from '../../../../lib/airtable';

export default async function PickPackFloorplanOnly() {
  const stations = await getPickPackStations();

  return (
    <div className="space-y-4">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Pick & Pack Floorplan
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
