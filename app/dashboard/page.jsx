import React from 'react';
import Link from 'next/link';
import { Download, Upload, Users, Truck, ShieldCheck, Activity } from 'lucide-react';
import BrandWordmark from '../../components/BrandWordmark';
import Card from '../../components/ui/Card';
import AutoRefresh from '../../components/AutoRefresh';

export default function CommandCenter() {
  const tiles = [
    { id: 'Inbound_Metrics', href: '/dashboard/inbound', label: 'Inbound', value: '94%', sub: 'Putaway', icon: <Download size={24} />, color: 'text-blue-500' },
    { id: 'Outbound_Metrics', href: '/dashboard/outbound', label: 'Outbound', value: '2.4k', sub: 'Pending', icon: <Upload size={24} />, color: 'text-emerald-500' },
    { id: 'Associate_Performance', label: 'Associates', value: '102', sub: 'UPH', icon: <Users size={24} />, color: 'text-purple-500' },
    { id: 'YMS_Log', href: '/dashboard/yms', label: 'Yard/YMS', value: '14', sub: 'Trailers', icon: <Truck size={24} />, color: 'text-amber-500' },
    { id: 'QA_Metrics', label: 'Quality', value: '99.8%', sub: 'Accuracy', icon: <ShieldCheck size={24} />, color: 'text-rose-500' },
    { id: 'Facility_Metrics', href: '/facilities', label: 'Facility', value: 'Low', sub: 'Risk', icon: <Activity size={24} />, color: 'text-cyan-500' },
  ];

  return (
    <div className="relative overflow-hidden">
      <AutoRefresh intervalSeconds={10} />
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <header className="relative z-10 mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight font-heading">
          <BrandWordmark className="mr-3" />
          <span className="text-slate-900 dark:text-white">Command Center</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
          Leverage Data to Maximize Proformance
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {tiles.map((tile) => (
          <Link key={tile.id} href={tile.href || `/dashboard/${tile.id}`} className="group block h-full">
            <Card className="h-full cursor-pointer">
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
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
