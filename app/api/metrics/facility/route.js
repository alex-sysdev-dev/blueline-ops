export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
const Airtable = require('airtable');

// Helper function to grab the single newest row from a table
async function getLatest(base, tableName) {
  try {
    const records = await base(tableName).select({
      maxRecords: 1,
      sort: [{ field: 'Timestamp', direction: 'desc' }]
    }).firstPage();

    return records[0]?.fields || null;

  } catch (e) {
    console.error(`Error fetching ${tableName}:`, e);
    return null;
  }
}

export async function GET() {

  const base = new Airtable({
    apiKey: process.env.AIRTABLE_ACCESS_TOKEN, // MUST match Vercel
  }).base(process.env.AIRTABLE_BASE_ID);

  try {

    const [facility, inbound, outbound, qa] = await Promise.all([
      getLatest(base, 'Facility_Metrics'),
      getLatest(base, 'Inbound_Metrics'),
      getLatest(base, 'Outbound_Metrics'),
      getLatest(base, 'QA_Metrics')
    ]);

    const yardRecords = await base('YMS_Log').select({
      filterByFormula: "Status != 'Dispatched'"
    }).all();

    return NextResponse.json({
      success: true,
      data: {
        facility,
        inbound,
        outbound,
        qa,
        active_trailers: yardRecords.length
      }
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}