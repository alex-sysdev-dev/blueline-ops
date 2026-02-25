// lib/airtable.js

// We pull your secret keys from the .env.local file you made earlier
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TOKEN = process.env.AIRTABLE_ACCESS_TOKEN;

/**
 * Fetches the Daily Operations data from Airtable and cleans it up.
 */
export async function getDailyOperations() {
  // We tell Airtable to sort the data by Date so our chart flows left-to-right correctly
  const url = `https://api.airtable.com/v0/${BASE_ID}/Daily_Operations?sort[0][field]=Date&sort[0][direction]=asc`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
      // 'no-store' tells Next.js to always fetch fresh data, rather than caching an old version
      cache: 'no-store' 
    });

    if (!response.ok) {
      throw new Error(`Airtable error: ${response.status} - Check your Base ID and Token`);
    }

    const data = await response.json();
    
    // Airtable's raw data is messy. This maps it into a clean, simple list for our dashboard.
    return data.records.map((record) => ({
      id: record.id,
      date: record.fields.Date,
      uplh: record.fields.UPLH || 0,
      oplh: record.fields.OPLH || 0,
      costPerUnit: record.fields.Cost_Per_Unit || 0,
      onTimePercent: record.fields.On_Time_Percent || 0,
      activeOrders: record.fields.Active_Orders_Count || 0,
    }));

  } catch (error) {
    console.error("Failed to fetch from Airtable:", error);
    return []; // Return an empty array if it fails so your app doesn't crash
  }
}

/**
 * Fetches the Facility_Metrics network data from Airtable.
 */
export async function getFacility_Metrics() {
  // Now using your BASE_ID variable!
  const url = `https://api.airtable.com/v0/${BASE_ID}/Facility_Metrics`;

  try {
    const response = await fetch(url, {
      // Now using your TOKEN variable!
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: 'no-store' 
    });

    if (!response.ok) throw new Error("Failed to fetch Facility_Metrics");

    const data = await response.json();
    
    // Clean up the data for our frontend
    return data.records.map((record) => ({
  id: record.id,
  timestamp: record.fields.Timestamp,
  facilityUPH: record.fields.Facility_UPH || 0,
  laborCostPerUnit: record.fields.Labor_Cost_Per_Unit || 0,
  cptRisk: record.fields.CPT_Risk_Level || 'Unknown',
  safetyIncidents: record.fields.Safety_Incidents || 0,
}));

  } catch (error) {
    console.error("Airtable Facility_Metrics error:", error);
    return []; 
  }
}

// Fetch latest snapshot for Control Center
export async function getControlCenterData() {
  try {
    // --- Facility Metrics (Latest) ---
    const facilityRes = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/Facility_Metrics?sort[0][field]=Timestamp&sort[0][direction]=desc&maxRecords=1`,
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
        cache: 'no-store',
      }
    );

    const facilityData = await facilityRes.json();
    const latestFacility = facilityData.records?.[0]?.fields || {};

    // --- Outbound Metrics (Latest) ---
    const outboundRes = await fetch(
      `https://api.airtable.com/v0/${BASE_ID}/Outbound_Metrics?sort[0][field]=Timestamp&sort[0][direction]=desc&maxRecords=1`,
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
        cache: 'no-store',
      }
    );

    const outboundData = await outboundRes.json();
    const latestOutbound = outboundData.records?.[0]?.fields || {};

    return {
      timestamp: latestFacility.Timestamp || null,
      facilityUPH: latestFacility.Facility_UPH || 0,
      laborCostPerUnit: latestFacility.Labor_Cost_Per_Unit || 0,
      cptRisk: latestFacility.CPT_Risk_Level || 'Unknown',
      safetyIncidents: latestFacility.Safety_Incidents || 0,
      ordersPendingPick: latestOutbound.Orders_Pending_Pick || 0,
      ordersPendingPack: latestOutbound.Orders_Pending_Pack || 0,
    };

  } catch (error) {
    console.error("Control Center fetch error:", error);
    return null;
  }
}