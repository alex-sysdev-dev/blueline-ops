// app/facilities/page.jsx

import React from 'react';
import { Building2, AlertCircle, CheckCircle2 } from 'lucide-react';
import AutoRefresh from '../../components/AutoRefresh';
import { getFacility_Metrics } from '../../lib/airtable';
import BrandWordmark from '../../components/BrandWordmark';

export default async function Facilities() {
  const facilities = await getFacility_Metrics();

  return (
    <div>
      
      {/* HEADER */}
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
          <BrandWordmark />
          <span>Facility Network</span>
        </h1>
      </header>

      {/* AUTO REFRESH */}
      <AutoRefresh intervalSeconds={10} />

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {facilities.map((site) => {
          const isOptimal = site.facilityUPH >= 1450;

          return (
            <div
              key={site.id}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
            >

              {/* CARD HEADER */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                    <Building2 size={20} />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                    {new Date(site.timestamp).toLocaleTimeString()}
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
                  {site.facilityUPH}
                </p>
              </div>

              {/* SECONDARY METRICS */}
              <div className="grid grid-cols-2 gap-4 mt-auto border-t border-slate-100 dark:border-slate-700 pt-4 text-sm">
                
                <div>
                  <p className="text-slate-500 dark:text-slate-400">
                    Labor / Unit
                  </p>
                  <p className="font-semibold">
                    ${Number(site.laborCostPerUnit).toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 dark:text-slate-400">
                    CPT Risk
                  </p>
                  <p
                    className={`font-semibold ${
                      site.cptRisk === 'High'
                        ? 'text-red-500'
                        : site.cptRisk === 'Medium'
                        ? 'text-yellow-500'
                        : 'text-emerald-500'
                    }`}
                  >
                    {site.cptRisk}
                  </p>
                </div>

                <div>
                  <p className="text-slate-500 dark:text-slate-400">
                    Safety Incidents
                  </p>
                  <p className="font-semibold">
                    {site.safetyIncidents}
                  </p>
                </div>

              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}