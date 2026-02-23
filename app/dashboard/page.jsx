// app/dashboard/page.jsx
import React from 'react';
import KpiTile from '../../components/dashboard/KpiTile';
import ProductivityChart from '../../components/dashboard/ProductivityChart';
import { getDailyOperations } from '../../lib/airtable';
import ForecastWidget from '../../components/dashboard/ForecastWidget';
import { calculate7DayMovingAverage } from '../../lib/forecasting';

// A quick helper to calculate percentage change safely
function calculatePercentChange(current, previous) {
  if (!previous || previous === 0) return 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export default async function Dashboard() {
  // 1. Fetch the real data from Airtable!
  const operationsData = await getDailyOperations();

  // 2. Set up defaults in case your Airtable is empty
  let today = { uplh: 0, oplh: 0, costPerUnit: 0, onTimePercent: 0 };
  let yesterday = { uplh: 0, oplh: 0, costPerUnit: 0, onTimePercent: 0 };

  // 3. Grab the most recent row for Today, and the row before it for Yesterday
  if (operationsData.length > 0) {
    today = operationsData[operationsData.length - 1]; // Last item in array
    if (operationsData.length > 1) {
      yesterday = operationsData[operationsData.length - 2]; // Second to last item
    }
  }

  // 4. Calculate your vs Yesterday percentages
  const uplhChange = calculatePercentChange(today.uplh, yesterday.uplh);
  const oplhChange = calculatePercentChange(today.oplh, yesterday.oplh);
  const costChange = calculatePercentChange(today.costPerUnit, yesterday.costPerUnit);
  const onTimeChange = calculatePercentChange(today.onTimePercent, yesterday.onTimePercent);

  // Targets (Hardcoded for now until we build the Targets table)
  const targetUplh = 40;
  const targetCost = 1.20;
// Map just the UPLH numbers to feed into our 7-day average math
const historicalUplh = operationsData.map(row => row.uplh);
const recentUplhAvg = calculate7DayMovingAverage(historicalUplh);
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-10">
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
          <span className="text-blue-600">BLUE</span>LINE OPS
        </h1>
        <p className="text-slate-500 mt-2 text-lg">Facility Command Center</p>
      </header>

      <main className="flex flex-col gap-8">
        
        {/* KPI TILES (Now fed with Airtable variables!) */}
        <section>
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Core Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiTile 
              title="UPLH" 
              currentValue={today.uplh} 
              vsYesterdayPercent={uplhChange} 
              vsTargetPercent={calculatePercentChange(today.uplh, targetUplh)} 
              isPositiveGood={true} 
            />
            <KpiTile 
              title="OPLH" 
              currentValue={today.oplh} 
              vsYesterdayPercent={oplhChange} 
              vsTargetPercent={0} // Placeholder target
              isPositiveGood={true} 
            />
            <KpiTile 
              title="Labor Cost / Unit" 
              currentValue={`$${today.costPerUnit.toFixed(2)}`} 
              vsYesterdayPercent={costChange} 
              vsTargetPercent={calculatePercentChange(today.costPerUnit, targetCost)} 
              isPositiveGood={false} 
            />
            <KpiTile 
              title="On-Time %" 
              currentValue={`${today.onTimePercent}%`} 
              vsYesterdayPercent={onTimeChange} 
              vsTargetPercent={0} // Placeholder target
              isPositiveGood={true} 
            />
          </div>
        </section>

        {/* CHARTS (Passing the whole Airtable array into the chart) */}
        <section>
          <h2 className="text-lg font-semibold text-slate-700 mb-4">Performance Trends</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col min-h-[350px]">
              <ProductivityChart data={operationsData} />
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center justify-center min-h-[300px]">
              <p className="text-slate-400 font-medium">Efficiency Heatmap</p>
            </div>
          </div>
        </section>

        <section>
       <h2 className="text-lg font-semibold text-slate-700 mb-4">Forecasting & Labor Planning</h2>
       <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-center justify-center min-h-[200px]">
          <ForecastWidget targetUplh={targetUplh} recentUplhAvg={recentUplhAvg} />
       </div>
     </section>

      </main>
    </div>
  );
}