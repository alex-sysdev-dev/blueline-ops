// components/dashboard/ProductivityChart.jsx
'use client'; 

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Now it accepts 'data' directly from your database!
export default function ProductivityChart({ data }) {
  // If Airtable hasn't loaded data yet, show a clean loading state
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center text-slate-400">
        Waiting for Airtable data...
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <h3 className="text-lg font-semibold text-slate-700 mb-4">Productivity Trend (UPLH)</h3>
      
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          {/* We pass the real 'data' prop into the chart here */}
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorUplh" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Area type="monotone" dataKey="uplh" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorUplh)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}