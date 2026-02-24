// components/layout/Sidebar.jsx
"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, ShieldCheck } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Facilities', href: '/facilities', icon: Building2 },
  ];

  return (
    <aside className="fixed bottom-0 left-0 z-40 w-full bg-slate-900 border-t border-slate-800 md:relative md:w-64 md:min-h-screen md:border-t-0 md:border-r md:flex md:flex-col transition-colors duration-300">
      
      {/* Brand logo - Hidden on phones, visible on desktop */}
      <div className="hidden md:flex p-6 items-center gap-3 text-white">
        <ShieldCheck size={28} className="text-blue-500" />
        <span className="text-xl font-extrabold tracking-wider">
          <span className="text-blue-500">BLUE</span>LINE
        </span>
      </div>

      {/* Navigation links - Row on phones, Column on desktop */}
      <nav className="flex flex-row justify-around items-center h-16 md:flex-col md:h-auto md:flex-1 md:px-4 md:py-6 md:space-y-2 md:justify-start">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 w-full h-full md:w-auto md:h-auto md:px-4 md:py-3 md:rounded-xl transition-all duration-200 font-medium ${
                isActive 
                  ? 'text-blue-500 md:bg-blue-600 md:text-white md:shadow-md md:shadow-blue-600/20' 
                  : 'text-slate-400 hover:text-white md:hover:bg-slate-800'
              }`}
            >
              <Icon size={20} className={isActive ? "md:text-white" : ""} />
              <span className="text-[10px] md:text-base">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}