import React from 'react';
import Card from '../../../components/ui/Card';
import Link from 'next/link';
import PickPackFloorplan from '../../../components/dashboard/PickPackFloorplan';
import AutoRefresh from '../../../components/AutoRefresh';

// 1. BYE BYE AIRTABLE! Hello Supabase.
import { supabase } from '../../../lib/supabase';

export default async function PickPackStations() {
  // 2. Fetch from Supabase simultaneously
  const [stationsRes, ordersRes] = await Promise.all([
    supabase.from('pick_pack_stations').select('*'),
    supabase.from('orders').select('*')
  ]);

  const rawStations = stationsRes.data || [];
  const rawOrders = ordersRes.data || [];

  // 3. Map Supabase snake_case to the camelCase your components expect
  const stations = rawStations.map(s => ({
    ...s,
    currentUph: s.current_uph // matching the old Airtable format
  }));

  const orders = rawOrders.map(o => ({
    ...o,
    activeFlag: o.active_flag // matching the old Airtable format
  }));

  // The rest of your logic stays exactly the same!
  const activeStations = stations.filter((s) => Number(s.currentUph) > 0);
  const avgUph = activeStations.length
    ? Math.round(activeStations.reduce((sum, s) => sum + Number(s.currentUph || 0), 0) / activeStations.length)
    : 0;

  const now = new Date();
  const cptWindowEnd = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  const ordersLeftToPick = orders.filter((o) => {
    if (!o.cpt) return false;
    if (Number(o.activeFlag) !== 1) return false;
    if (!['Pending', 'Picking'].includes(o.status)) return false;
    const cptTime = new Date(o.cpt);
    return cptTime >= now && cptTime <= cptWindowEnd;
  }).length;

  return (
    <div className="space-y-6">
      <AutoRefresh intervalSeconds={10} />
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            <span className="text-blue-600 dark:text-blue-400">Pick</span>{' '}
            <span>& Pack Stations</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Overhead view of active pick and pack stations.
          </p>
        </div>
        <Link
          href="/dashboard/pick-pack/floorplan"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          Open Floorplan View
        </Link>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Current UPH</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{avgUph}</p>
          <p className="text-xs text-slate-400 mt-1">Average across active stations</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Orders Left to Pick</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white mt-2">{ordersLeftToPick}</p>
          <p className="text-xs text-slate-400 mt-1">Next CPT window (3 hours)</p>
        </Card>
      </section>

      <Card className="p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white px-6 py-4">
          <h2 className="text-base font-bold tracking-wide">Station Floorplan</h2>
          <p className="text-xs text-slate-300 mt-1">Pick and Pack zones (20 stations each)</p>
        </div>

        <PickPackFloorplan stations={stations} legend />
      </Card>
    </div>
  );
}