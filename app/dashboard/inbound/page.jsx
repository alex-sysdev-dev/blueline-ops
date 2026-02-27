import React from 'react';
import Card from '../../../components/ui/Card';
import AssociateList from '../../../components/dashboard/AssociateList';
import { getAssociatesByDepartment } from '../../../lib/airtable';

export default async function InboundDashboard() {
  const associates = await getAssociatesByDepartment('Inbound');

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Inbound Dashboard
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Dock to stock flow and inbound execution.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Dock to Stock</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">—</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Putaway Volume</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">—</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Sorting UPH</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">—</p>
        </Card>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Inbound Associates
        </h2>
        <AssociateList associates={associates} />
      </section>
    </div>
  );
}
