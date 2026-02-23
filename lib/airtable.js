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
      onTimePercent: record.fields.On_Time_Percent || 0
    }));

  } catch (error) {
    console.error("Failed to fetch from Airtable:", error);
    return []; // Return an empty array if it fails so your app doesn't crash
  }
}