// app/facilities/page.jsx
import React from 'react';
import { Building2, Users, AlertCircle, CheckCircle2 } from 'lucide-react';

// Mock data for your warehouses
const facilities = [
  { id: 1, name: 'Dallas Hub (DFW-1)', status: 'Optimal', headcount: 245, uplh: 42, issues: 0 },
  { id: 2, name: 'Atlanta FC (ATL-3)', status: 'Warning', headcount: 310, uplh: 36, issues: 2 },
  { id: 3, name: 'Phoenix Annex (PHX-2)', status: 'Optimal', headcount: 120, uplh: 45, issues: 0 },
];

export default function Facilities() {
  return (
    <div className="min-h-screen p-6 md:p-10">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Facility Network</h1>
        <p className="text-slate-500 mt-2">Manage multi-site operations and network health.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {facilities.map((site) => (
          <div 
            key={site.id} 
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                  <Building2 size={24} />
                </div>
                <h2 className="text-xl font-bold text-slate-800">{site.name}</h2>
              </div>
              
              {/* Status Badge */}
              {site.status === 'Optimal' ? (
                <span className="flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-full border border-emerald-200">
                  <CheckCircle2 size={16} /> Optimal
                </span>
              ) : (
                <span className="flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 text-sm font-semibold rounded-full border border-amber-200">
                  <AlertCircle size={16} /> Warning
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto border-t border-slate-100 pt-4">
              <div>
                <p className="text-sm text-slate-500 mb-1 flex items-center gap-1">
                  <Users size={14} /> Active Headcount
                </p>
                <p className="text-2xl font-bold text-slate-800">{site.headcount}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-1">Current UPLH</p>
                <p className={`text-2xl font-bold ${site.uplh >= 40 ? 'text-emerald-600' : 'text-amber-600'}`}>
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