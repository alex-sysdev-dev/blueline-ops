// components/layout/Sidebar.jsx
import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Building2, TrendingUp, Settings } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col min-h-screen border-r border-slate-800 shrink-0">
      
      {/* Brand Logo */}
      <div className="p-6 mb-2">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          <span className="text-blue-500">BLUE</span>LINE
        </h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 space-y-2">
        {/* Active Link (Dashboard) */}
        <Link 
          href="/dashboard" 
          className="flex items-center gap-3 px-4 py-3 bg-blue-600/10 text-blue-400 rounded-xl transition-all duration-200 border border-blue-500/20"
        >
          <LayoutDashboard size={20} />
          <span className="font-medium">Dashboard</span>
        </Link>

        {/* Inactive Links */}
        <Link 
          href="/facilities" 
          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl transition-all duration-200"
        >
          <Building2 size={20} />
          <span className="font-medium">Facilities</span>
        </Link>

        <Link 
          href="#" 
          className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white rounded-xl transition-all duration-200"
        >
          <TrendingUp size={20} />
          <span className="font-medium">Forecasting</span>
        </Link>
      </nav>

      {/* User Profile Section at Bottom */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 px-4 py-2 hover:bg-slate-800 rounded-xl cursor-pointer transition-all duration-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xs shadow-lg shadow-blue-500/30">
            OP
          </div>
          <div className="text-sm">
            <p className="text-white font-medium">Ops Manager</p>
            <p className="text-slate-500 text-xs">Active Session</p>
          </div>
        </div>
      </div>

    </aside>
  );
}