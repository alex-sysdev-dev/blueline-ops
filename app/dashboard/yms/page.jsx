// app/dashboard/yms/page.jsx
import YmsExecutive from "../../../components/dashboard/YmsExecutive";
import YmsCharts from "../../../components/dashboard/YmsCharts";
import { supabase } from "../../../lib/supabase";

export const dynamic = 'force-dynamic';

export default async function YmsOverviewPage() {
  // Replace 'yard_snapshot' with your actual Supabase table for stats
  const { data: snapshot } = await supabase
    .from('yard_stats')
    .select('*')
    .single();

  return (
    <div className="space-y-10">
      <YmsExecutive snapshot={snapshot} />
      
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Performance Analytics</h2>
        <YmsCharts 
          lineData={snapshot?.dwell_trend || []} 
          barData={snapshot?.status_dist || []} 
        />
      </section>
    </div>
  );
}