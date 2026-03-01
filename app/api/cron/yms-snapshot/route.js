import { supabase } from "../../../../lib/supabase";

export async function GET() {
  const { data: trailers } = await supabase.from("trailers").select("*");
  const { data: docks } = await supabase.from("docks").select("*");
  const { data: moves } = await supabase.from("moves").select("*");
  const { data: appointments } = await supabase.from("appointments").select("*");

  const totalTrailers = trailers.length;
  const trailersOnYard = trailers.filter(t => t.is_on_yard).length;
  const deadlined = trailers.filter(t => t.is_deadlined).length;

  const occupiedDocks = docks.filter(d => d.status === "Occupied").length;

  const yardCapacity = 75;
  const totalDocks = 32;

  const yardOccupancyPct = Math.round((trailersOnYard / yardCapacity) * 100);
  const dockUtilizationPct = Math.round((occupiedDocks / totalDocks) * 100);

  const avgDwell =
    trailers.reduce((sum, t) => sum + (t.dwell_time_mins || 0), 0) /
    (totalTrailers || 1);

  const yardSeverity =
    yardOccupancyPct >= 90 ? "Critical"
    : yardOccupancyPct >= 80 ? "Warning"
    : "Normal";

  const dockSeverity =
    dockUtilizationPct >= 95 ? "Critical"
    : dockUtilizationPct >= 85 ? "Warning"
    : "Normal";

  const deadlinedSeverity =
    deadlined >= 3 ? "Critical"
    : deadlined >= 1 ? "Warning"
    : "Normal";

  await supabase.from("yms_snapshots").insert({
    total_trailers: totalTrailers,
    trailers_on_yard: trailersOnYard,
    yard_occupancy_pct: yardOccupancyPct,
    occupied_docks: occupiedDocks,
    dock_utilization_pct: dockUtilizationPct,
    deadlined_trailers: deadlined,
    avg_dwell_time: avgDwell,
    active_moves: moves.length,
    active_appointments: appointments.length,
    yard_severity: yardSeverity,
    dock_severity: dockSeverity,
    deadlined_severity: deadlinedSeverity
  });

  return Response.json({ success: true });
}