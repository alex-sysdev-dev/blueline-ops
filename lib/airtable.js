// lib/airtable.js

// We pull your secret keys from the .env.local file you made earlier
const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TOKEN = process.env.AIRTABLE_ACCESS_TOKEN;

// Helper function to handle rate limiting (429 errors) automatically
async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (response.ok) {
        return response;
      }

      // If we hit the rate limit (429) or a server error (5xx), wait and retry
      if (response.status === 429 || response.status >= 500) {
        const delay = (i + 1) * 1000; // Wait 1s, then 2s, then 3s
        console.warn(`Airtable rate limit hit (${response.status}). Retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }

      // For other errors (like 401 Unauthorized), throw immediately so we know what's wrong
      throw new Error(`Airtable API Error: ${response.status} ${response.statusText}`);
      
    } catch (error) {
      // If it's the last attempt, throw the error to be caught by the calling function
      if (i === retries - 1) throw error;
      // If it was a network error (fetch failed), wait a bit and retry
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

function normalizeLinked(value) {
  if (!value) return null;
  if (Array.isArray(value)) return value[0] || null;
  return value;
}

/**
 * Fetches the Daily Operations data from Airtable and cleans it up.
 */
export async function getDailyOperations() {
  // We tell Airtable to sort the data by Date so our chart flows left-to-right correctly
  const url = `https://api.airtable.com/v0/${BASE_ID}/Daily_Operations?sort[0][field]=Date&sort[0][direction]=asc`;

  try {
    const response = await fetchWithRetry(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
      // 'no-store' tells Next.js to always fetch fresh data, rather than caching an old version
      cache: 'no-store' 
    });

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
    const response = await fetchWithRetry(url, {
      // Now using your TOKEN variable!
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: 'no-store' 
    });

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
    const facilityRes = await fetchWithRetry(
      `https://api.airtable.com/v0/${BASE_ID}/Facility_Metrics?sort[0][field]=Timestamp&sort[0][direction]=desc&maxRecords=1`,
      {
        headers: { Authorization: `Bearer ${TOKEN}` },
        cache: 'no-store',
      }
    );

    const facilityData = await facilityRes.json();
    const latestFacility = facilityData.records?.[0]?.fields || {};

    // --- Outbound Metrics (Latest) ---
    const outboundRes = await fetchWithRetry(
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

// Fetch associates by department from Associate_Performance
export async function getAssociatesByDepartment(department) {
  const baseUrl = `https://api.airtable.com/v0/${BASE_ID}/Associate_Performance?sort[0][field]=Timestamp&sort[0][direction]=desc&maxRecords=200`;
  const url =
    department && department !== 'all'
      ? `${baseUrl}&filterByFormula=${encodeURIComponent(`{Department}='${department}'`)}`
      : baseUrl;

  try {
    const response = await fetchWithRetry(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: 'no-store'
    });

    const data = await response.json();
    const records = data.records || [];
    const latestTimestamp = records[0]?.fields?.Timestamp || null;
    const latestRecords = latestTimestamp
      ? records.filter((r) => r.fields?.Timestamp === latestTimestamp)
      : records;

    return latestRecords.map((r) => ({
      id: r.id,
      employeeId: r.fields.Employee_ID || '',
      department: r.fields.Department || '',
      currentUph: r.fields.Current_UPH || 0,
      qualityScorePct: r.fields.Quality_Score_Pct || 0,
      totalScans: r.fields.Total_Scans || 0
    }));

  } catch (error) {
    console.error("Associate_Performance fetch error:", error);
    return [];
  }
}

// Fetch recent YMS_Log records
export async function getYmsLog(limit = 50) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/YMS_Log?sort[0][field]=Geofence_Check_In&sort[0][direction]=desc&maxRecords=${limit}`;

  try {
    const response = await fetchWithRetry(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: 'no-store'
    });

    const data = await response.json();
    const records = data.records || [];

    return records.map((r) => ({
      id: r.id,
      trailerId: r.fields.Trailer_ID || '',
      origin: r.fields.Origin || '',
      appointmentTime: r.fields.Appointment_Time || null,
      geofenceCheckIn: r.fields.Geofence_Check_In || null,
      status: r.fields.Status || '',
      dwellTimeMins: r.fields.Dwell_Time_Mins || 0,
      direction: r.fields.Direction || '',
      cpt: r.fields.CPT || null,
      dockAssigned: r.fields.Dock_Assigned || null
    }));
  } catch (error) {
    console.error("YMS_Log fetch error:", error);
    return [];
  }
}

// Fetch Trailers data
export async function getTrailers(limit = 200) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/Trailers?sort[0][field]=Arrival%20Time&sort[0][direction]=desc&maxRecords=${limit}&cellFormat=string`;

  try {
    const response = await fetchWithRetry(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: 'no-store'
    });

    const data = await response.json();
    const records = data.records || [];

    return records.map((r) => ({
      id: r.id,
      trailerNumber: r.fields["Trailer Number"] || '',
      carrier: r.fields.Carrier || '',
      loadStatus: r.fields["Load Status"] || '',
      trailerStatus: r.fields["Trailer Status"] || '',
      arrivalTime: r.fields["Arrival Time"] || null,
      departureTime: r.fields["Departure Time"] || null,
      currentLocation: normalizeLinked(r.fields["Current Location"]),
      assignedDock: normalizeLinked(r.fields["Assigned Dock"]),
      appointment: normalizeLinked(r.fields.Appointment),
      shagDriverMoves: r.fields["Shag Driver Moves"] || [],
      trailerLength: r.fields["Trailer Length"] || 0,
      dwellTimeMinutes: r.fields["Dwell Time (minutes)"] || 0,
      isOnYard: r.fields["Is On Yard?"] || 0,
      isDeadlined: r.fields["Is Deadlined?"] || 0,
      priorityScore: r.fields["Priority Score"] || 0,
      priorityFinal: r.fields["Priority Final"] || 0
    }));
  } catch (error) {
    console.error("Trailers fetch error:", error);
    return [];
  }
}

// Fetch Yard Spots data
export async function getYardSpots(limit = 200) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/Yard_Spots?`;

  try {
    const response = await fetchWithRetry(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: 'no-store'
    });

    const data = await response.json();
    const records = data.records || [];

    return records.map((r) => ({
  id: r.id,
  spotId: r.fields["Spot_ID"] || '',
  spotType: r.fields["Spot_Type"] || '',
  row: r.fields["Row"] || 0,
  position: r.fields["Position"] || 0,
  currentTrailer: normalizeLinked(r.fields["Current_Trailer"]),
  currentTrailerNumber: Array.isArray(r.fields["Current_Trailer_Number"])
    ? r.fields["Current_Trailer_Number"][0]
    : r.fields["Current_Trailer_Number"] || '',
  occupiedNumeric: r.fields["Occupied_Numeric"] || 0
}));

  } catch (error) {
    console.error("Yard Spots fetch error:", error);
    return [];
  }
}

// Fetch Docks data
export async function getDocks(limit = 200) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/Docks?sort[0][field]=Dock%20Number&sort[0][direction]=asc&maxRecords=${limit}&cellFormat=string`;

  try {
    const response = await fetchWithRetry(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: 'no-store'
    });

    const data = await response.json();
    const records = data.records || [];

    return records.map((r) => ({
      id: r.id,
      dockNumber: r.fields["Dock Number"] || '',
      dockType: r.fields["Dock Type"] || '',
      assignedTrailer: normalizeLinked(r.fields["Assigned Trailer"]),
      status: r.fields.Status || '',
      occupiedNumeric: r.fields["Dock Occupied Numeric"] || 0
    }));
  } catch (error) {
    console.error("Docks fetch error:", error);
    return [];
  }
}

// Fetch Moves data
export async function getMoves(limit = 200) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/Moves?sort[0][field]=Move%20Time&sort[0][direction]=desc&maxRecords=${limit}&cellFormat=string`;

  try {
    const response = await fetchWithRetry(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: 'no-store'
    });

    const data = await response.json();
    const records = data.records || [];

    return records.map((r) => ({
      id: r.id,
      trailer: normalizeLinked(r.fields.Trailer),
      driver: normalizeLinked(r.fields.Driver),
      fromLocation: r.fields["From Location"] || '',
      toLocation: r.fields["To Location"] || '',
      moveTime: r.fields["Move Time"] || null,
      reason: r.fields["Reason for Move"] || ''
    }));
  } catch (error) {
    console.error("Moves fetch error:", error);
    return [];
  }
}

// Fetch Appointments data
export async function getAppointments(limit = 200) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/Appointments?sort[0][field]=Scheduled%20Time&sort[0][direction]=desc&maxRecords=${limit}&cellFormat=string`;

  try {
    const response = await fetchWithRetry(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: 'no-store'
    });

    const data = await response.json();
    const records = data.records || [];

    return records.map((r) => ({
      id: r.id,
      trailer: normalizeLinked(r.fields.Trailer),
      appointmentType: r.fields["Appointment Type"] || '',
      scheduledTime: r.fields["Scheduled Time"] || null,
      actualArrival: r.fields["Actual Arrival"] || null,
      actualDeparture: r.fields["Actual Departure"] || null,
      appointmentStatus: r.fields["Appointment Status"] || '',
      arrivalVariance: r.fields["Arrival Variance (min)"] || 0,
      departureVariance: r.fields["Departure Variance (min)"] || 0
    }));
  } catch (error) {
    console.error("Appointments fetch error:", error);
    return [];
  }
}

// Fetch Pick & Pack station data
export async function getPickPackStations(limit = 200) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/Stations?sort[0][field]=Station_ID&sort[0][direction]=asc&maxRecords=${limit}`;

  try {
    const response = await fetchWithRetry(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: 'no-store'
    });

    const data = await response.json();
    const records = data.records || [];

    return records.map((r) => ({
      id: r.id,
      stationId: r.fields.Station_ID || '',
      type: r.fields.Type || '',
      status: r.fields.Status || '',
      associate: r.fields.Associate || '',
      currentUph: r.fields.Current_UPH || 0,
      ordersInProgress: r.fields.Orders_In_Progress || 0,
      lastActivity: r.fields.Last_Activity || null,
      location: r.fields.Location || '',
      stationImage: r.fields.Station_Image || null
    }));
  } catch (error) {
    console.error("Pick_Pack_Stations fetch error:", error);
    return [];
  }
}

// Fetch Orders for CPT calculations
export async function getOrders(limit = 200) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/Orders?sort[0][field]=CPT&sort[0][direction]=asc&maxRecords=${limit}`;

  try {
    const response = await fetchWithRetry(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: 'no-store'
    });

    const data = await response.json();
    const records = data.records || [];

    return records.map((r) => ({
      id: r.id,
      orderId: r.fields.Order_ID || '',
      status: r.fields.Status || '',
      units: r.fields.Units || 0,
      cpt: r.fields.CPT || null,
      activeFlag: r.fields.Active_Flag ?? 0
    }));
  } catch (error) {
    console.error("Orders fetch error:", error);
    return [];
  }
}
