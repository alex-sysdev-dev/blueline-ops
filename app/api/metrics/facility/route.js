export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TOKEN = process.env.AIRTABLE_ACCESS_TOKEN;

async function getLatest(table) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/${table}?maxRecords=1&sort[0][field]=Timestamp&sort[0][direction]=desc`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TOKEN}`,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Airtable error: ${res.status}`);
  }

  const data = await res.json();
  return data.records?.[0]?.fields || null;
}

export async function GET() {
  try {
    const [facility, inbound, outbound, qa] = await Promise.all([
      getLatest('Facility_Metrics'),
      getLatest('Inbound_Metrics'),
      getLatest('Outbound_Metrics'),
      getLatest('QA_Metrics'),
    ]);

    // YMS active trailers
    const yardUrl = `https://api.airtable.com/v0/${BASE_ID}/YMS_Log?filterByFormula=Status!='Dispatched'`;

    const yardRes = await fetch(yardUrl, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
      cache: 'no-store',
    });

    const yardData = await yardRes.json();

    return NextResponse.json({
      success: true,
      data: {
        facility,
        inbound,
        outbound,
        qa,
        active_trailers: yardData.records?.length || 0,
      },
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}