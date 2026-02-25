import React from 'react';
import { getControlCenterData } from '../../lib/airtable';
import Card from '../../components/ui/Card';
import { Activity } from 'lucide-react';

export default async function ControlCenter() {
  const data = await getControlCenterData();

  if (!data) {
    return <div className="p-10">Failed to load control center.</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
  <span className="text-blue-600 dark:text-blue-400">Control</span>{' '}
  <span>Center</span>
</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

        <KpiCard
  title="Facility UPH"
  value={data.facilityUPH}
  status={
    data.facilityUPH >= 1450
      ? "good"
      : data.facilityUPH >= 1300
      ? "warning"
      : "danger"
  }
/>

        <KpiCard
  title="Labor / Unit"
  value={`$${Number(data.laborCostPerUnit).toFixed(2)}`}
  status={
    data.laborCostPerUnit <= 2.50
      ? "good"
      : data.laborCostPerUnit <= 3.50
      ? "warning"
      : "danger"
  }
/>

        <KpiCard
  title="CPT Risk"
  value={data.cptRisk}
  status={
    data.cptRisk === "High"
      ? "danger"
      : data.cptRisk === "Medium"
      ? "warning"
      : "good"
  }
/>

        <KpiCard
  title="Safety Incidents"
  value={data.safetyIncidents}
  status={data.safetyIncidents > 0 ? "danger" : "good"}
/>

        <KpiCard
  title="Orders Pending Pick"
  value={data.ordersPendingPick}
  status={
    data.ordersPendingPick > 50
      ? "danger"
      : data.ordersPendingPick > 25
      ? "warning"
      : "good"
  }
/>

        <KpiCard
  title="Orders Pending Pack"
  value={data.ordersPendingPack}
  status={
    data.ordersPendingPack > 50
      ? "danger"
      : data.ordersPendingPack > 25
      ? "warning"
      : "good"
  }
/>

      </div>
    </div>
  );
}

function KpiCard({ title, value, status = "neutral" }) {

  const statusStyles = {
    good: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
    danger: "text-red-600 dark:text-red-400",
    neutral: "text-slate-900 dark:text-white"
  };

  return (
    <Card>
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
          <Activity size={18} />
        </div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          {title}
        </p>
      </div>

      <p className={`text-4xl font-extrabold tracking-tight ${statusStyles[status]}`}>
        {value}
      </p>
    </Card>
  );
}