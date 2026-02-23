// components/dashboard/ForecastWidget.jsx
'use client';

import React, { useState } from 'react';
import { calculateProjectedLabor } from '../../lib/forecasting';

export default function ForecastWidget({ targetUplh, recentUplhAvg }) {
  // State to hold the numbers the user types in
  const [forecastedUnits, setForecastedUnits] = useState(12500);
  const [seasonality, setSeasonality] = useState(1.0);

  // Calculate the projected hours using your secret weapon math!
  const projectedHours = calculateProjectedLabor(forecastedUnits, targetUplh, seasonality);
  
  // Quick bonus math: translate hours into actual people (assuming 8-hour shifts)
  const suggestedHeadcount = Math.ceil(projectedHours / 8);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* Left Side: Inputs */}
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Forecasted Units (Volume)
          </label>
          <input 
            type="number" 
            value={forecastedUnits}
            onChange={(e) => setForecastedUnits(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Seasonality Multiplier (1.0 = Normal)
          </label>
          <input 
            type="number" 
            step="0.1"
            value={seasonality}
            onChange={(e) => setSeasonality(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>
        
        <div className="text-sm text-slate-500 mt-2 bg-slate-100 p-3 rounded-lg">
          <p><strong>Target UPLH:</strong> {targetUplh}</p>
          <p><strong>Recent 7-Day Avg:</strong> {recentUplhAvg}</p>
        </div>
      </div>

      {/* Right Side: Output Dashboard */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-blue-100 flex flex-col justify-center items-center text-center shadow-inner">
        <h4 className="text-blue-800 font-semibold mb-2 uppercase tracking-wide text-sm">Suggested Labor Output</h4>
        
        <div className="text-5xl font-extrabold text-blue-600 mb-2">
          {projectedHours} <span className="text-2xl text-blue-400 font-medium">hrs</span>
        </div>
        
        <div className="text-slate-600 font-medium">
          Requires approx. <span className="text-indigo-600 font-bold text-lg">{suggestedHeadcount}</span> headcount (8hr shifts)
        </div>
      </div>

    </div>
  );
}