// lib/airtable.js

const BASE_ID = process.env.AIRTABLE_BASE_ID;
const TOKEN = process.env.AIRTABLE_ACCESS_TOKEN;

async function fetchWithRetry(url, options, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      if (response.status === 429 || response.status >= 500) {
        const delay = (i + 1) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw new Error(`Airtable API Error: ${response.status}`);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

function normalizeLinked(value) {
  if (!value) return null;
  if (Array.isArray(value)) return value[0] || null;
  return value;
}

/* ============================
   TRAILERS, YARD SPOTS, DOCKS, MOVES, APPOINTMENTS
   (Your existing functions remain here...)
============================ */

export async function getTrailers(limit = 200) { /* ... existing code ... */ }
export async function getYardSpots(limit = 200) { /* ... existing code ... */ }
export async function getDocks(limit = 200) { /* ... existing code ... */ }
export async function getMoves(limit = 200) { /* ... existing code ... */ }
export async function getAppointments(limit = 200) { 
  const url = `https://api.airtable.com/v0/${BASE_ID}/Appointments?sort[0][field]=Scheduled_Time&sort[0][direction]=desc&maxRecords=${limit}&cellFormat=string`;
  try {
    const response = await fetchWithRetry(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: "no-store",
    });
    const data = await response.json();
    const records = data.records || [];
    return records.map((r) => ({
      id: r.id,
      trailer: normalizeLinked(r.fields.Trailer),
      appointmentType: r.fields.Appointment_Type || "",
      scheduledTime: r.fields.Scheduled_Time || null,
      actualArrival: r.fields.Actual_Arrival || null,
      actualDeparture: r.fields.Actual_Departure || null,
      appointmentStatus: r.fields.Appointment_Status || "",
      arrivalVariance: r.fields.Arrival_Variance_Min || 0,
      departureVariance: r.fields.Departure_Variance_Min || 0,
    }));
  } catch (error) {
    console.error("Appointments fetch error:", error);
    return [];
  }
}

/* ============================
    MISSING: CONTROL CENTER DATA
============================ */

export async function getControlCenterData() {
  // Replace 'Facility_Stats' with your actual table name if different
  const url = `https://api.airtable.com/v0/${BASE_ID}/Facility_Stats?maxRecords=10&cellFormat=string`;

  try {
    const response = await fetchWithRetry(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: "no-store",
    });

    const data = await response.json();
    const records = data.records || [];

    return records.map((r) => ({
      id: r.id,
      metricName: r.fields.Metric_Name || "Unnamed Metric",
      value: r.fields.Value || 0,
      status: r.fields.Status || "normal",
      trend: r.fields.Trend || 0,
    }));
  } catch (error) {
    console.error("Control Center fetch error:", error);
    return [];
  }
}