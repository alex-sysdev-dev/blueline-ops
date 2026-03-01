import { supabase } from "../../lib/supabase";
import YmsExecutive from "../../components/dashboard/YmsExecutive";

export default async function ControlCenter() {
  const { data, error } = await supabase
    .from("yms_snapshots")
    .select("*")
    .order("snapshot_time", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return (
      <div className="p-8 text-rose-500">
        Failed to load executive snapshot.
      </div>
    );
  }

  return (
    <div className="p-8">
      <YmsExecutive snapshot={data} />
    </div>
  );
}