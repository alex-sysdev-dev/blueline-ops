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
   TRAILERS
============================ */

export async function getTrailers(limit = 200) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/Trailers?sort[0][field]=Arrival_Time&sort[0][direction]=desc&maxRecords=${limit}&cellFormat=string`;

  try {
    const response = await fetchWithRetry(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: "no-store",
    });

    const data = await response.json();
    const records = data.records || [];

    return records.map((r) => ({
      id: r.id,
      trailerNumber: r.fields.Trailer_Number || "",
      carrier: r.fields.Carrier || "",
      loadStatus: r.fields.Load_Status || "",
      trailerStatus: r.fields.Trailer_Status || "",
      arrivalTime: r.fields.Arrival_Time || null,
      departureTime: r.fields.Departure_Time || null,
      currentLocation: normalizeLinked(r.fields.Current_Location),
      assignedDock: normalizeLinked(r.fields.Assigned_Dock),
      appointment: normalizeLinked(r.fields.Appointment),
      shagDriverMoves: r.fields.Shag_Driver_Moves || [],
      trailerLength: r.fields.Trailer_Length || 0,
      dwellTimeMinutes: r.fields.Dwell_Time_Minutes || 0,
      isOnYard: r.fields.Is_On_Yard || 0,
      isDeadlined: r.fields.Is_Deadlined || 0,
      priorityScore: r.fields.Priority_Score || 0,
      priorityFinal: r.fields.Priority_Final || 0,
    }));
  } catch (error) {
    console.error("Trailers fetch error:", error);
    return [];
  }
}

/* ============================
   YARD SPOTS
============================ */

export async function getYardSpots(limit = 200) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/Yard_Spots?maxRecords=${limit}`;

  try {
    const response = await fetchWithRetry(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: "no-store",
    });

    const data = await response.json();
    const records = data.records || [];

    return records.map((r) => ({
      id: r.id,
      spotId: r.fields.Spot_ID || "",
      spotType: r.fields.Spot_Type || "",
      row: r.fields.Row || 0,
      position: r.fields.Position || 0,
      currentTrailer: normalizeLinked(r.fields.Current_Trailer),
      currentTrailerNumber: normalizeLinked(r.fields.Current_Trailer_Number),
      occupiedNumeric: r.fields.Occupied_Numeric || 0,
    }));
  } catch (error) {
    console.error("Yard_Spots fetch error:", error);
    return [];
  }
}

/* ============================
   DOCKS
============================ */

export async function getDocks(limit = 200) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/Docks?sort[0][field]=Dock_Number&sort[0][direction]=asc&maxRecords=${limit}&cellFormat=string`;

  try {
    const response = await fetchWithRetry(url, {
      headers: { Authorization: `Bearer ${TOKEN}` },
      cache: "no-store",
    });

    const data = await response.json();
    const records = data.records || [];

    return records.map((r) => ({
      id: r.id,
      dockNumber: r.fields.Dock_Number || "",
      dockType: r.fields.Dock_Type || "",
      assignedTrailer: normalizeLinked(r.fields.Assigned_Trailer),
      status: r.fields.Status || "",
      occupiedNumeric: r.fields.Dock_Occupied_Numeric || 0,
    }));
  } catch (error) {
    console.error("Docks fetch error:", error);
    return [];
  }
}

/* ============================
   MOVES
============================ */

export async function getMoves(limit = 200) {
  const url = `https://api.airtable.com/v0/${BASE_ID}/Moves?sort[0][field]=Move_Time&sort[0][direction]=desc&maxRecords=${limit}&cellFormat=string`;

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
      driver: normalizeLinked(r.fields.Driver),
      fromLocation: r.fields.From_Location || "",
      toLocation: r.fields.To_Location || "",
      moveTime: r.fields.Move_Time || null,
      reason: r.fields.Reason_For_Move || "",
    }));
  } catch (error) {
    console.error("Moves fetch error:", error);
    return [];
  }
}

/* ============================
   APPOINTMENTS
============================ */

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