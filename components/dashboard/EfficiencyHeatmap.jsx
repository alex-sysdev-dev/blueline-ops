// components/dashboard/EfficiencyHeatmap.jsx
import React from 'react';

export default function EfficiencyHeatmap() {
  // Mock data representing efficiency scores (0-100) across different zones and times
  const zones = ['Inbound', 'Picking', 'Packing', 'Outbound'];
  const times = ['08:00', '11:00', '14:00', '17:00'];
  
  const data = [
    [85, 92, 78, 65], // Inbound
    [95, 88, 82, 90], // Picking
    [70, 65, 85, 95], // Packing
    [60, 75, 88, 92], // Outbound
  ];

  // A helper function to pick the right color based on the score
  const getColor = (score) => {
    if (score >= 90) return 'bg-emerald-500 dark:bg-emerald-500';
    if (score >= 80) return 'bg-emerald-400/70 dark:bg-emerald-600/70';
    if (score >= 70) return 'bg-amber-400 dark:bg-amber-500';
    return 'bg-rose-500 dark:bg-rose-600'; // Needs attention
  };

  return (
    <div className="w-full h-full flex flex-col transition-colors duration-300">
      <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4 transition-colors">Zone Efficiency by Time</h3>
      
      <div className="flex-1 overflow-x-auto">
        <div className="min-w-[400px]">
          {/* Header Row (Times) */}
          <div className="grid grid-cols-5 gap-2 mb-2">
            <div></div> {/* Empty top-left corner */}
            {times.map(time => (
              <div key={time} className="text-center text-xs font-bold text-slate-400 dark:text-slate-500">{time}</div>
            ))}
          </div>

          {/* Data Rows (Zones) */}
          <div className="space-y-2">
            {zones.map((zone, rowIndex) => (
              <div key={zone} className="grid grid-cols-5 gap-2 items-center">
                <div className="text-xs font-bold text-slate-600 dark:text-slate-300 truncate pr-2">
                  {zone}
                </div>
                {data[rowIndex].map((score, colIndex) => (
                  <div 
                    key={colIndex} 
                    className={`h-10 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-sm transition-all duration-300 hover:scale-105 cursor-pointer ${getColor(score)}`}
                    title={`Score: ${score}`}
                  >
                    {score}%
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-6 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Optimal</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-400"></div> Warning</div>
        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-rose-500"></div> Critical</div>
      </div>
    </div>
  );
}