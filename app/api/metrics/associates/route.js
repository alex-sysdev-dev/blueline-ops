export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TOKEN = process.env.AIRTABLE_ACCESS_TOKEN;

function buildUrl(department) {
  const base = `https://api.airtable.com/v0/${BASE_ID}/Associate_Performance?sort[0][field]=Timestamp&sort[0][direction]=desc&maxRecords=200`;
  if (!department || department === 'all') return base;

  const formula = encodeURIComponent(`{Department}='${department}'`);
  return `${base}&filterByFormula=${formula}`;
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const department = searchParams.get('department') || 'all';

    const url = buildUrl(department);
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: 'no-store',
    });

    if (!res.ok) throw new Error(`Airtable error: ${res.status}`);

    const data = await res.json();
    const records = data.records || [];
    const latestTimestamp = records[0]?.fields?.Timestamp || null;
    const latestRecords = latestTimestamp
      ? records.filter((r) => r.fields?.Timestamp === latestTimestamp)
      : records;

    const associates = latestRecords.map((r) => ({
      id: r.id,
      employeeId: r.fields?.Employee_ID || '',
      department: r.fields?.Department || '',
      currentUph: r.fields?.Current_UPH || 0,
      qualityScorePct: r.fields?.Quality_Score_Pct || 0,
      totalScans: r.fields?.Total_Scans || 0,
    }));

    return NextResponse.json({
      success: true,
      data: {
        timestamp: latestTimestamp,
        department,
        associates,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
