// app/facilities/page.jsx
import React from 'react';
import { Building2, AlertCircle, CheckCircle2 } from 'lucide-react';
import AutoRefresh from '../../components/AutoRefresh';
import { supabase } from '../../lib/supabase';
import BrandWordmark from '../../components/BrandWordmark';
import Card from '../../components/ui/Card'; // Path restored to /ui/

export const dynamic = 'force-dynamic';

export default async function Facilities() {
  const { data: facilities, error } = await supabase
    .from('facility_metrics')
    .select('*')
    .order('timestamp', { ascending: false });

  if (error) {
    console.error("Supabase Error:", error.message);
    return <div className="p-10 text-red-500">Error loading facility network.</div>;
  }

  return (
    <div className="space-y-8">
      
      {/* HEADER */}
      <header>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
          <BrandWordmark />
          <span className="text-slate-500 dark:text-slate-400 font-medium">|</span>
          <span>Facility Network</span>
        </h1>
      </header>

      {/* AUTO REFRESH */}
      <AutoRefresh intervalSeconds={10} />

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {(facilities || []).map((site) => {
          const isOptimal = site.facility_uph >= 1450;

          return (
            <Card
              key={site.id}
              className="flex flex-col h-full"
            >

              {/* CARD HEADER */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                    <Building2 size={20} />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    {site.facility_name || 'Active Site'}
                  </h2>
                </div>

                {isOptimal ? (
                  <span className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
                    <CheckCircle2 size={14} /> Optimal
                  </span>
                ) : (
                  <span className="flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400">
                    <AlertCircle size={14} /> Warning
                  </span>
                )}
              </div>

              {/* HERO METRIC */}
              <div className="mb-6">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Facility UPH
                </p>
                <p className="text-4xl font-extrabold text-slate-900 dark:text-white">
                  {site.facility_uph}
                </p>
              </div>

              {/* SECONDARY METRICS */}
              <div className="grid grid-cols-2 gap-4 mt-auto border-t border-slate-100 dark:border-slate-800 pt-4 text-sm">
                
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Labor / Unit</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-200">
                    ${Number(site.labor_cost_per_unit || 0).toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 dark:text-slate-400">CPT Risk</p>
                  <p className={`font-semibold ${
                      site.cpt_risk === 'High' ? 'text-rose-500' : 
                      site.cpt_risk === 'Medium' ? 'text-amber-500' : 'text-emerald-500'
                    }`}>
                    {site.cpt_risk}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 dark:text-slate-400">Safety</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-200">
                    {site.safety_incidents} Incidents
                  </p>
                </div>

                <div className="text-right flex items-end justify-end">
                   <p className="text-[10px] text-slate-400 uppercase">
                     {new Date(site.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </p>
                </div>

              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}