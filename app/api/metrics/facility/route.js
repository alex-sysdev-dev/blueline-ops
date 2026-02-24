import { NextResponse } from 'next/server';
// Using require to match how we fixed the simulation file
const Airtable = require('airtable');

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);

// Helper function to grab the single newest row from a table
async function getLatest(tableName) {
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
  try {
    // Fetch all department snapshots at the exact same time for speed
    const [facility, inbound, outbound, qa] = await Promise.all([
      getLatest('Facility_Metrics'),
      getLatest('Inbound_Metrics'),
      getLatest('Outbound_Metrics'),
      getLatest('QA_Metrics')
    ]);

    // Count how many trailers are currently in the yard
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
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}