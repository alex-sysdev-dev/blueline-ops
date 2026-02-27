import React from 'react';
import Link from 'next/link';

export default function KpiTile({
  title,
  currentValue,
  vsYesterdayPercent,
  vsTargetPercent,
  isPositiveGood = true,
  href
}) {
  
  // 1. MUST BE DEFINED FIRST: The color logic
  const getIndicatorColor = (percent) => {
    if (!percent || percent === 0) return 'text-slate-400';
    if (percent > 0) return isPositiveGood ? 'text-emerald-500' : 'text-rose-500';
    return isPositiveGood ? 'text-rose-500' : 'text-emerald-500';
  };

  // 2. DEFINED SECOND: The tile content
  const tileContent = (
    <div className="glass-tile-dark p-5 h-full flex flex-col justify-between">
      
      <div className="mb-4">
        <h3 className="text-sm font-medium text-slate-300 mb-1">{title}</h3>
        <div className="text-3xl font-bold text-slate-100">
          {currentValue}
        </div>
      </div>
      
      <div className="space-y-2 text-sm text-slate-300">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">vs Yesterday</span>
          <span className={`font-semibold ${getIndicatorColor(vsYesterdayPercent)}`}>
            {vsYesterdayPercent > 0 ? '+' : ''}{vsYesterdayPercent}%
          </span>
        </div>

        {vsTargetPercent !== undefined && vsTargetPercent !== 0 && (
          <div className="flex justify-between items-center">
            <span className="text-slate-400">vs Target</span>
            <span className={`font-semibold ${getIndicatorColor(vsTargetPercent)}`}>
              {vsTargetPercent > 0 ? '+' : ''}{vsTargetPercent}%
            </span>
          </div>
        )}
      </div>

    </div>
  );

  // 3. RETURN STATEMENT: Wrap in Link if href exists
  if (href) {
    return (
      <Link href={href} className="block h-full hover:scale-[1.02] transition-transform duration-200 cursor-pointer">
        {tileContent}
      </Link>
    );
  }

  return tileContent;
}
