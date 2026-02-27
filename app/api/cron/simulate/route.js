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
          Status: 'Yard'
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

    // --- Associate Performance (50 on shift, unique roles) ---
    const roster = [
      'Alex Carter','Jamie Brooks','Jordan Blake','Taylor Reed','Morgan Hayes','Riley Quinn','Casey Parker','Avery Moore','Cameron Shaw','Drew Foster',
      'Quinn Harper','Logan Price','Peyton Cole','Reese Morgan','Rowan Ellis','Skyler James','Hayden Ross','Dakota Lane','Spencer Gray','Elliot Cruz',
      'Blake Sutton','Emerson Ward','Finley Grant','Harper Stone','Jules Bennett','Kai Sullivan','Kendall Fox','Lennon Watts','Micah Reed','Nico Alvarez',
      'Oakley Pierce','Parker Vaughn','Remy Collins','River Hayes','Rory Mitchell','Sawyer Flynn','Shiloh Brooks','Sloane Carter','Tatum Price','Teagan Reed',
      'Wren Calloway','Zion Brooks','Ari Jenkins','Bay Lee','Charlie Nguyen','Devin Kim','Frankie Lopez','Gale Torres','Harley Ortiz','Indie Russell',
      'Jesse Patel','Kieran Brooks','Lane Johnson','Marley Woods','Noah Rivera','Olive Grant','Phoenix Reed','Riley Stone','Sage Walker','Terry Adams'
    ];

    const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);
    const shuffled = shuffle([...roster]);
    const onShift = shuffled.slice(0, 50).map((name, idx) => ({
      id: `EMP-${String(idx + 1).padStart(3, '0')}`,
      name,
      label: `EMP-${String(idx + 1).padStart(3, '0')} - ${name}`
    }));

    const allocation = {
      Outbound: 18,
      Inbound: 14,
      QA: 6,
      'Problem Solve': 12
    };

    const assignments = [];
    let cursor = 0;
    Object.entries(allocation).forEach(([department, count]) => {
      const slice = onShift.slice(cursor, cursor + count);
      slice.forEach((person) => assignments.push({ ...person, department }));
      cursor += count;
    });

    const randomRange = (min, max, decimals = 0) => {
      const val = Math.random() * (max - min) + min;
      return decimals ? Number(val.toFixed(decimals)) : Math.round(val);
    };

    const assocRecords = assignments.map((person) => {
      let uphMin = 70, uphMax = 120, qsMin = 0.95, qsMax = 0.99, scansMin = 15, scansMax = 35;
      if (person.department === 'Outbound') { uphMin = 85; uphMax = 130; qsMin = 0.96; qsMax = 0.995; scansMin = 20; scansMax = 40; }
      if (person.department === 'Inbound') { uphMin = 75; uphMax = 120; qsMin = 0.95; qsMax = 0.99; scansMin = 15; scansMax = 35; }
      if (person.department === 'QA') { uphMin = 60; uphMax = 100; qsMin = 0.98; qsMax = 1.0; scansMin = 10; scansMax = 25; }
      if (person.department === 'Problem Solve') { uphMin = 50; uphMax = 90; qsMin = 0.95; qsMax = 0.99; scansMin = 5; scansMax = 20; }

      return {
        fields: {
          Timestamp: timestamp,
          Employee_ID: person.label,
          Department: person.department,
          Current_UPH: randomRange(uphMin, uphMax),
          Quality_Score_Pct: randomRange(qsMin, qsMax, 3),
          Dwell_Time_Mins: randomRange(0, 12),
          Total_Scans: randomRange(scansMin, scansMax)
        }
      };
    });

    // batch create (Airtable max 10 per request)
    for (let i = 0; i < assocRecords.length; i += 10) {
      await base('Associate_Performance').create(assocRecords.slice(i, i + 10));
    }

    // --- Stations (Pick/Pack) ---
    const stationRecords = await base('Stations').select({ maxRecords: 200 }).firstPage();
    const pickStations = stationRecords.filter((r) => r.get('Type') === 'Pick');
    const packStations = stationRecords.filter((r) => r.get('Type') === 'Pack');

    const outboundPeople = assignments.filter((p) => p.department === 'Outbound');
    const statusPool = ['Active', 'Active', 'Active', 'Inactive', 'Maintenance'];

    const stationUpdates = [...pickStations, ...packStations].map((rec, idx) => {
      const person = outboundPeople[idx % outboundPeople.length];
      const status = statusPool[Math.floor(Math.random() * statusPool.length)];
      const isActive = status === 'Active';
      return {
        id: rec.id,
        fields: {
          Status: status,
          Associate: person ? person.label : '',
          Current_UPH: isActive ? randomRange(90, 140) : 0,
          Orders_In_Progress: isActive ? randomRange(0, 12) : 0,
          Last_Activity: timestamp
        }
      };
    });

    for (let i = 0; i < stationUpdates.length; i += 10) {
      await base('Stations').update(stationUpdates.slice(i, i + 10));
    }

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
