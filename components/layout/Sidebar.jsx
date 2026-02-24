// components/Sidebar.jsx
"use client"; // We need this so the sidebar can read the live web address!

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, ShieldCheck } from 'lucide-react';

export default function Sidebar() {
  // This grabs the current URL (e.g., '/dashboard' or '/facilities')
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Facilities', href: '/facilities', icon: Building2 },
  ];

  return (
    <aside className="w-64 bg-slate-900 flex flex-col min-h-screen border-r border-slate-800 transition-colors duration-300">
      <div className="p-6 flex items-center gap-3 text-white">
        <ShieldCheck size={28} className="text-blue-500" />
        <span className="text-xl font-extrabold tracking-wider">
          <span className="text-blue-500">BLUE</span>LINE
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          // Check if this button's link matches the current page URL
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20' // Active state (Blue)
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'   // Inactive state (Gray)
              }`}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}