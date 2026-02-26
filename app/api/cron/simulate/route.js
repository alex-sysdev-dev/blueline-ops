export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
const Airtable = require('airtable');

export async function GET() {

  const base = new Airtable({
    apiKey: process.env.AIRTABLE_ACCESS_TOKEN,
  }).base(process.env.AIRTABLE_BASE_ID);

  const timestamp = new Date().toISOString();

  try {

    const origins = ['Chicago', 'Kansas City', 'Dallas', 'Oklahoma City', 'Denver', 'Wichita', 'Tulsa'];

    if (Math.random() > 0.6) {
      await base('YMS_Log').create([{
        fields: {
          Trailer_ID: `TRK-${Math.floor(Math.random() * 9000) + 1000}`,
          Origin: origins[Math.floor(Math.random() * origins.length)],
          Appointment_Time: timestamp,
          Geofence_Check_In: timestamp,
          Status: 'Yard',
          Dwell_Time_Mins: 0
        }
      }]);
    }

    const riskLevels = ['Low', 'Medium', 'High'];

    await base('Facility_Metrics').create([{
      fields: {
        Timestamp: timestamp,
        Facility_UPH: Math.floor(Math.random() * 500) + 1200,
        Labor_Cost_Per_Unit: 1.15 + (Math.random() * 0.20),
        CPT_Risk_Level: riskLevels[Math.floor(Math.random() * riskLevels.length)],
        Safety_Incidents: Math.random() > 0.98 ? 1 : 0
      }
    }]);

    await base('Inbound_Metrics').create([{
      fields: {
        Associate: 'System Aggregate',
        Timestamp: timestamp,
        Putaway_Volume: Math.floor(Math.random() * 600) + 200,
        Sorting_UPH: Math.floor(Math.random() * 50) + 150,
        Problem_Solve: Math.floor(Math.random() * 40),
        Dock_to_Stock_Hours: parseFloat((Math.random() * 3 + 1).toFixed(1))
      }
    }]);

    const pickRate = Math.floor(Math.random() * 20) + 90;
    const packRate = Math.floor(Math.random() * 30) + 130;
    const pendingPick = Math.floor(Math.random() * 3000) + 500;

    await base('Outbound_Metrics').create([{
      fields: {
        Associate: 'System Aggregate',
        Timestamp: timestamp,
        Blended_UPH: Math.round((pickRate + packRate) / 2),
        Pick_Rate: pickRate,
        Pack_Rate: packRate,
        Orders_Pending_Pick: pendingPick,
        Orders_Pending_Pack: Math.floor(Math.random() * 500) + 100,
        Shipped_Volume: Math.floor(Math.random() * 800) + 400,
        Forecast_Charge_Hours: parseFloat((pendingPick / pickRate).toFixed(1)),
        CPT_Risk_Level: pendingPick > 2000 ? 'High' : 'Low'
      }
    }]);

    await base('QA_Metrics').create([{
      fields: {
        Associate: 'System Aggregate',
        Timestamp: timestamp,
        Cycle_Counts_Completed: Math.floor(Math.random() * 100) + 20,
        Inventory_Accuracy_Pct: 0.98 + (Math.random() * 0.02),
        FIFO_Violations: Math.random() > 0.9 ? Math.floor(Math.random() * 5) : 0
      }
    }]);

    return NextResponse.json({
      success: true,
      message: 'Simulation data populated successfully.'
    });

  } catch (error) {
    console.error('Simulation Error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}