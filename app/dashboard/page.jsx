import React from 'react';
import Link from 'next/link';
import { Download, Upload, Users, Truck, ShieldCheck, Activity } from 'lucide-react';

export default function CommandCenter() {
  const tiles = [
    { id: 'Inbound_Metrics', label: 'Inbound', value: '94%', sub: 'Putaway', icon: <Download size={24} />, color: 'text-blue-500' },
    { id: 'Outbound_Metrics', label: 'Outbound', value: '2.4k', sub: 'Pending', icon: <Upload size={24} />, color: 'text-emerald-500' },
    { id: 'Associate_Performance', label: 'Associates', value: '102', sub: 'UPH', icon: <Users size={24} />, color: 'text-purple-500' },
    { id: 'YMS_Log', label: 'Yard/YMS', value: '14', sub: 'Trailers', icon: <Truck size={24} />, color: 'text-amber-500' },
    { id: 'QA_Metrics', label: 'Quality', value: '99.8%', sub: 'Accuracy', icon: <ShieldCheck size={24} />, color: 'text-rose-500' },
    { id: 'Facility_Metrics', label: 'Facility', value: 'Low', sub: 'Risk', icon: <Activity size={24} />, color: 'text-cyan-500' },
  ];

  return (
    <div className="flex-1 p-8 md:p-12 relative overflow-hidden bg-slate-50 dark:bg-slate-950 min-h-screen">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <header className="relative z-10 mb-12">
        <h1 className="text-4xl font-black uppercase tracking-tighter">
          <span className="text-blue-600">Comm</span>
          <span className="text-slate-900 dark:text-white">and Center</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
          Digital Twin v1.0 • Demonstration Environment
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {tiles.map((tile) => (
          <Link key={tile.id} href={`/dashboard/${tile.id}`} className="glass-tile-btn group">
            <div className="flex justify-between items-start mb-8">
              <div className={`p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/50 ${tile.color}`}>{tile.icon}</div>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{tile.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 dark:text-white">{tile.value}</span>
                <span className="text-[10px] font-bold text-slate-400 italic">{tile.sub}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}