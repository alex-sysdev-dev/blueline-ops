// components/layout/Sidebar.jsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, Gauge, Truck, Download, Upload, ShieldCheck, Users, Activity, Play, LayoutGrid } from 'lucide-react';
import BrandWordmark from '../BrandWordmark';

export default function Sidebar({ isAdmin = false }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Control Center', href: '/control-center', icon: Gauge },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'YMS Overview', href: '/dashboard/yms', icon: Truck },
    { name: 'Yard', href: '/dashboard/yms/yard', icon: LayoutGrid },
    { name: 'Inbound', href: '/dashboard/inbound', icon: Download },
    { name: 'Outbound', href: '/dashboard/outbound', icon: Upload },
    { name: 'Pick/Pack', href: '/dashboard/pick-pack', icon: LayoutGrid },
    { name: 'Pick/Pack Floor', href: '/dashboard/pick-pack/floorplan', icon: LayoutGrid },
    { name: 'QA', href: '/dashboard/qa', icon: ShieldCheck },
    { name: 'Associates', href: '/dashboard/associates', icon: Users },
    { name: 'Facilities', href: '/facilities', icon: Building2 },
    ...(isAdmin ? [{ name: 'Simulation', href: '/admin/simulation', icon: Play }] : []),
  ];

  return (
    <aside className="fixed bottom-0 left-0 z-40 w-full bg-white border-t border-slate-200 dark:bg-slate-900 dark:border-slate-800 md:relative md:w-64 md:min-h-screen md:border-t-0 md:border-r md:flex md:flex-col transition-colors duration-300">
      
      {/* Brand logo */}
      <Link href="/" className="hidden md:flex p-6 items-center gap-3 text-slate-900 dark:text-white">
        {/* Shows in Light Mode */}
        <img
          src="/brand/logo-dark.svg" 
          alt="BlueLineOps"
          className="h-8 w-8 block dark:hidden"
        />
        {/* Shows in Dark Mode */}
        <img
          src="/brand/logo-light.svg" 
          alt="BlueLineOps"
          className="h-8 w-8 hidden dark:block"
        />
        <BrandWordmark
          className="text-xl font-extrabold tracking-wider"
          blueClassName="text-blue-600 dark:text-blue-400"
          restClassName="text-slate-900 dark:text-white"
          uppercase
        />
      </Link>

      {/* Navigation links */}
      <nav className="flex flex-row justify-around items-center h-14 md:flex-col md:h-auto md:flex-1 md:px-3 md:py-4 md:space-y-1.5 md:justify-start overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2 w-auto h-full md:w-full md:h-auto md:px-3 md:py-2 md:rounded-lg transition-all duration-200 font-medium 
                hover:bg-slate-100 dark:hover:bg-slate-800/80 
                ${
                isActive 
                  ? 'text-blue-600 bg-blue-50 md:bg-blue-600 md:text-white md:shadow-md md:shadow-blue-600/20 dark:text-white dark:bg-slate-800 dark:md:bg-blue-600' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Icon size={18} className={isActive ? "md:text-white dark:text-white" : ""} />
              <span className="text-[10px] md:text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}