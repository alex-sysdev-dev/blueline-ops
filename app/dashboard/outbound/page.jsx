import React from 'react';
import Card from '../../../components/ui/Card';
import Link from 'next/link';
import AssociateList from '../../../components/dashboard/AssociateList';
import { getAssociatesByDepartment } from '../../../lib/airtable';
import AutoRefresh from '../../../components/AutoRefresh';

export default async function OutboundDashboard() {
  const associates = await getAssociatesByDepartment('Outbound');

  return (
    <div className="space-y-6">
      <AutoRefresh intervalSeconds={10} />
      <header>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          <span className="text-blue-600 dark:text-blue-400">Outbound</span>{' '}
          <span>Dashboard</span>
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Protect CPT and outbound throughput.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Orders Pending Pick</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">—</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">Orders Pending Pack</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">—</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">CPT Risk</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">—</p>
        </Card>
      </section>

      <section>
        <Link href="/dashboard/pick-pack" className="block">
          <Card className="p-4 flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Pick & Pack Stations
              </p>
              <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
                View Station Floorplan
              </p>
            </div>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">Open</span>
          </Card>
        </Link>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
          Outbound Associates
        </h2>
        <AssociateList associates={associates} />
      </section>
    </div>
  );
}
