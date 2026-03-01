// components/dashboard/YmsClient.jsx
"use client";

import React from "react";
import Card from "../ui/Card";

export default function YmsClient({ initialRows = {} }) {
  const rowLabels = Object.keys(initialRows).sort();

  return (
    <div className="space-y-8">
      {rowLabels.map((label) => (
        <div key={label} className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white px-1">
            Row {label}
          </h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {initialRows[label].map((spot) => (
              <Card 
                key={spot.spot_id} 
                className={`p-4 transition-colors ${
                  spot.status === 'Occupied' 
                    ? 'border-blue-500/50 bg-blue-50/50 dark:bg-blue-500/10' 
                    : 'border-slate-200 dark:border-white/5'
                }`}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                    {spot.name}
                  </span>
                  <span className={`text-sm font-semibold ${
                    spot.status === 'Occupied' 
                      ? 'text-blue-700 dark:text-blue-400' 
                      : 'text-slate-400 dark:text-slate-500'
                  }`}>
                    {spot.current_trailer || 'Empty'}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}