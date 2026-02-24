// app/dashboard/page.jsx
import React from 'react';
import KpiTile from '../../components/dashboard/KpiTile';
import ProductivityChart from '../../components/dashboard/ProductivityChart';
import ForecastWidget from '../../components/dashboard/ForecastWidget';
import AutoRefresh from '../../components/AutoRefresh'; // <-- Perfect import!
import { getDailyOperations } from '../../lib/airtable';
import { calculate7DayMovingAverage } from '../../lib/forecasting';

function calculatePercentChange(current, previous) {
  if (!previous || previous === 0) return 0;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export default async function Dashboard() {
  const operationsData = await getDailyOperations();

  let today = { uplh: 0, oplh: 0, costPerUnit: 0, onTimePercent: 0 };
  let yesterday = { uplh: 0, oplh: 0, costPerUnit: 0, onTimePercent: 0 };

  if (operationsData.length > 0) {
    today = operationsData[operationsData.length - 1]; 
    if (operationsData.length > 1) {
      yesterday = operationsData[operationsData.length - 2]; 
    }
  }

  const uplhChange = calculatePercentChange(today.uplh, yesterday.uplh);
  const oplhChange = calculatePercentChange(today.oplh, yesterday.oplh);
  const costChange = calculatePercentChange(today.costPerUnit, yesterday.costPerUnit);
  const onTimeChange = calculatePercentChange(today.onTimePercent, yesterday.onTimePercent);

  const historicalUplh = operationsData.map(row => row.uplh);
  const recentUplhAvg = calculate7DayMovingAverage(historicalUplh);

  const targetUplh = 40;
  const targetCost = 1.20;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-6 md:p-10 transition-colors duration-300">
      
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight transition-colors">
          <span className="text-blue-600 dark:text-blue-500">BLUE</span>LINE OPS
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg transition-colors">Facility Operations Center</p>
      </header>

      {/* Our invisible 10-second Airtable polling is safely inside the main div! */}
      <AutoRefresh intervalSeconds={10} />

      <main className="flex flex-col gap-8">
        
        {/* KPI TILES */}
        <section>
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4 transition-colors">Core Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiTile title="UPLH" currentValue={today.uplh} vsYesterdayPercent={uplhChange} vsTargetPercent={calculatePercentChange(today.uplh, targetUplh)} isPositiveGood={true} />
            <KpiTile title="OPLH" currentValue={today.oplh} vsYesterdayPercent={oplhChange} vsTargetPercent={0} isPositiveGood={true} />
            <KpiTile title="Labor Cost / Unit" currentValue={`$${today.costPerUnit.toFixed(2)}`} vsYesterdayPercent={costChange} vsTargetPercent={calculatePercentChange(today.costPerUnit, targetCost)} isPositiveGood={false} />
            <KpiTile title="On-Time %" currentValue={`${today.onTimePercent}%`} vsYesterdayPercent={onTimeChange} vsTargetPercent={0} isPositiveGood={true} />
          </div>
        </section>

        {/* CHARTS */}
        <section>
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4 transition-colors">Performance Trends</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col min-h-[350px] transition-colors duration-300">
              <ProductivityChart data={operationsData} />
            </div>
            
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex items-center justify-center min-h-[300px] transition-colors duration-300">
              <p className="text-slate-400 dark:text-slate-500 font-medium transition-colors">Efficiency Heatmap</p>
            </div>
          </div>
        </section>

        {/* FORECASTING WIDGET */}
        <section>
          <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-4 transition-colors">Forecasting & Labor Planning</h2>
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex items-center justify-center min-h-[200px] transition-colors duration-300">
             <ForecastWidget targetUplh={targetUplh} recentUplhAvg={recentUplhAvg} />
          </div>
        </section>

      </main>
    </div>
  );
}