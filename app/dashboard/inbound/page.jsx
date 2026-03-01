import React from 'react';
import Card from '../../../components/ui/Card';
import AssociateList from '../../../components/dashboard/AssociateList';
import AutoRefresh from '../../../components/AutoRefresh';
import { supabase } from '../../../lib/supabase';

export default async function InboundDashboard() {
  // 1. Fetch Inbound Associates from Supabase
  const { data: associatesRes, error: associatesError } = await supabase
    .from('associates')
    .select('*')
    .eq('department', 'Inbound');

  if (associatesError) console.error("Error fetching inbound associates:", associatesError.message);
  const safeAssociates = associatesRes || [];

  // 2. Fetch the latest Inbound Metrics for the KPI cards
  const { data: metricsRes, error: metricsError } = await supabase
    .from('inbound_metrics')
    .select('*')
    .order('timestamp', { ascending: false })
    .limit(1)
    .single(); // Grabs the single most recent row

  if (metricsError && metricsError.code !== 'PGRST116') {
    // PGRST116 just means no rows found, which is fine if the table is empty
    console.error("Error fetching inbound metrics:", metricsError.message);
  }

  // Set fallbacks in case the table is empty
  const metrics = metricsRes || {
    dock_to_stock_hours: '—',
    putaway_volume: '—',
    sorting_uph: '—'
  };

  return (
    <div className="space-y-6">
      <AutoRefresh intervalSeconds={10} />
      <header>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          <span className="text-blue-600 dark:text-blue-400">Inbound</span>{' '}
          <span>Dashboard</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Dock to stock flow and inbound execution.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Dock to Stock (Hours)</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{metrics.dock_to_stock_hours}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Putaway Volume</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{metrics.putaway_volume}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Sorting UPH</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{metrics.sorting_uph}</p>
        </Card>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Inbound Associates
        </h2>
        <AssociateList associates={safeAssociates} />
      </section>
    </div>
  );
}