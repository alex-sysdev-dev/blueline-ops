// components/dashboard/KpiTile.jsx
import React from 'react';

export default function KpiTile({
  title,
  currentValue,
  vsYesterdayPercent,
  vsTargetPercent,
  isPositiveGood 
}) {
  
  const getIndicatorColor = (percent) => {
    if (percent === 0) return 'text-slate-300';
    const isPositive = percent > 0;
    const isGood = isPositive === isPositiveGood;
    return isGood ? 'text-emerald-400' : 'text-rose-400'; 
  };

  return (
    <div className="flex flex-col p-6 rounded-2xl bg-gradient-to-br from-blue-700 to-blue-950 border border-blue-500 shadow-lg shadow-blue-900/20 text-white relative overflow-hidden transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/40 cursor-default">
      
      {/* Glossy top highlight effect */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-white opacity-5 rounded-t-2xl pointer-events-none"></div>

      <h3 className="text-sm font-medium text-blue-200 mb-1 uppercase tracking-wider">{title}</h3>
      <div className="text-4xl font-bold mb-4">{currentValue}</div>
      
      <div className="flex flex-col gap-1 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-blue-100/70">vs Yesterday</span>
          <span className={`font-semibold ${getIndicatorColor(vsYesterdayPercent)}`}>
            {vsYesterdayPercent > 0 ? '+' : ''}{vsYesterdayPercent}%
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-blue-100/70">vs Target</span>
          <span className={`font-semibold ${getIndicatorColor(vsTargetPercent)}`}>
            {vsTargetPercent > 0 ? '+' : ''}{vsTargetPercent}%
          </span>
        </div>
      </div>
    </div>
  );
}