// app/facilities/page.jsx
import React from 'react';
import { Building2, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import AutoRefresh from '../../components/AutoRefresh'; // <-- The import is right here!
import { getFacilities } from '../../lib/airtable';

export default async function Facilities() {
  const facilities = await getFacilities();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-10 transition-colors duration-300">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight transition-colors">
          Facility Network
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 transition-colors">
          Manage multi-site operations and network health.
        </p>
      </header>

      {/* Our invisible 10-second Airtable polling is safely inside the main div! */}
      <AutoRefresh intervalSeconds={10} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {facilities.map((site) => (
          <div 
            key={site.id} 
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl transition-colors">
                  <Building2 size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 transition-colors">
                  {site.name}
                </h2>
              </div>
              
              {site.status === 'Optimal' ? (
                <span className="flex items-center gap-1 px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-semibold rounded-full border border-emerald-200 dark:border-emerald-500/20 transition-colors">
                  <CheckCircle2 size={16} /> Optimal
                </span>
              ) : (
                <span className="flex items-center gap-1 px-3 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-sm font-semibold rounded-full border border-amber-200 dark:border-amber-500/20 transition-colors">
                  <AlertCircle size={16} /> Warning
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto border-t border-slate-100 dark:border-slate-700 pt-4 transition-colors">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1 transition-colors">
                  <Users size={14} /> Active Headcount
                </p>
                <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors">
                  {site.headcount}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 transition-colors">Current UPLH</p>
                <p className={`text-2xl font-bold transition-colors ${site.uplh >= 40 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                  {site.uplh}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}