// components/layout/Sidebar.jsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, Gauge, Truck, Download, Upload, ShieldCheck, Users, Activity, Play, LayoutGrid } from 'lucide-react';
import BrandWordmark from '../BrandWordmark';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Control Center', href: '/control-center', icon: Gauge },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'YMS Overview', href: '/dashboard/yms', icon: Truck },
    { name: 'Inbound', href: '/dashboard/inbound', icon: Download },
    { name: 'Outbound', href: '/dashboard/outbound', icon: Upload },
    { name: 'Pick/Pack', href: '/dashboard/pick-pack', icon: LayoutGrid },
    { name: 'Pick/Pack Floor', href: '/dashboard/pick-pack/floorplan', icon: LayoutGrid },
    { name: 'QA', href: '/dashboard/qa', icon: ShieldCheck },
    { name: 'Associates', href: '/dashboard/associates', icon: Users },
    { name: 'Facility', href: '/dashboard/facility', icon: Activity },
    { name: 'Facilities', href: '/facilities', icon: Building2 },
    { name: 'Simulation', href: '/admin/simulation', icon: Play },
  ];

  return (
    <aside className="fixed bottom-0 left-0 z-40 w-full bg-slate-900 border-t border-slate-800 md:relative md:w-64 md:min-h-screen md:border-t-0 md:border-r md:flex md:flex-col transition-colors duration-300">
      
      {/* Brand logo - Hidden on phones, visible on desktop */}
      <div className="hidden md:flex p-6 items-center gap-3 text-white">
        <img
          src="/brand/logo-header.svg"
          alt="BlueLine Ops"
          className="h-8 w-8"
        />
        <BrandWordmark
          className="text-xl font-extrabold tracking-wider"
          blueClassName="text-blue-500"
          restClassName="text-white"
          uppercase
        />
      </div>

      {/* Navigation links - Row on phones, Column on desktop */}
      <nav className="flex flex-row justify-around items-center h-14 md:flex-col md:h-auto md:flex-1 md:px-3 md:py-4 md:space-y-1.5 md:justify-start">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 w-auto h-full md:w-full md:h-auto md:px-3 md:py-2 md:rounded-lg transition-all duration-200 font-medium hover:bg-slate-800/80 hover:shadow-[0_0_18px_rgba(59,130,246,0.45)] hover:ring-1 hover:ring-blue-500/40 ${
                isActive 
                  ? 'text-blue-500 md:bg-blue-600 md:text-white md:shadow-md md:shadow-blue-600/20' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon size={18} className={isActive ? "md:text-white" : ""} />
              <span className="text-[10px] md:text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
