# Blue Line Ops – Intelligence Architecture Data Contract

Date: February 26, 2026

## Scope
This document defines the Airtable data contracts for the Public and Platform layers. It maps Airtable tables and fields to the API endpoints and UI pages, including required derived metrics and CPT windows for charts.

## Global Conventions
- Airtable is the single source of truth.
- Latest record selection uses the highest `Timestamp` value.
- Single-select values must match exact text (case-sensitive).
- Percent fields use Airtable percent type.
- Missing numeric values default to `0` in the UI.
- `Active_Flag = 1` means active (Orders).
- If multiple associates exist in a metrics table, prefer the latest record and/or `System Aggregate` if present.

---

# Page and Endpoint Mapping

## Control Center
- Page: `/control-center`
- Endpoint: `/api/metrics/control-center`
- Sources: `Facility_Metrics`, `Inbound_Metrics`, `Outbound_Metrics`, `QA_Metrics`, `YMS_Log`, `Orders`

## YMS Overview
- Page: `/dashboard/yms`
- Endpoint: `/api/metrics/yms`
- Source: `YMS_Log`

## Inbound Dashboard
- Page: `/dashboard/inbound`
- Endpoint: `/api/metrics/inbound`
- Source: `Inbound_Metrics`

## Outbound Dashboard
- Page: `/dashboard/outbound`
- Endpoint: `/api/metrics/outbound`
- Sources: `Outbound_Metrics`, `Orders`

## QA Dashboard
- Page: `/dashboard/qa`
- Endpoint: `/api/metrics/qa`
- Source: `QA_Metrics`

## Associate Dashboard
- Page: `/dashboard/associates`
- Endpoint: `/api/metrics/associates`
- Sources: `Associate_Performance`, optional `Associate_Roster`

## Facility Dashboard
- Page: `/dashboard/facility`
- Endpoint: `/api/metrics/facility`
- Source: `Facility_Metrics`

---

# Table Contracts

## YMS_Log
**Primary ID:** `Trailer_ID`

**Fields**
- `Trailer_ID` (text)
- `Origin` (single-select): Oklahoma City, Kansas City, Denver, Wichita, Tulsa
- `Appointment_Time` (datetime)
- `Geofence_Check_In` (datetime)
- `Status` (single-select): Yard, At Dock, Empty, Dispatched, Maintenance
- `Dwell_Time_Mins` (formula, numeric minutes)
- `Direction` (single-select): Inbound, Outbound
- `CPT` (datetime)
- `Dock_Assigned` (number)

**Dwell Time Formula**
`IF({Status} != "Dispatched", DATETIME_DIFF(NOW(), {Geofence_Check_In}, 'minutes'), BLANK())`

**Derived Metrics**
- Active trailers: count where `Status != Dispatched`
- Trailer aging table: list sorted by `Dwell_Time_Mins` desc
- CPT countdown table: list sorted by `CPT` asc

---

## Inbound_Metrics
**Fields**
- `Associate` (text)
- `Timestamp` (datetime)
- `Putaway_Volume` (number)
- `Sorting_UPH` (number)
- `Problem_Solve` (number)
- `Dock_to_Stock_Hours` (number)

**UI Metrics**
- Dock to Stock Time → `Dock_to_Stock_Hours`
- Putaway Volume → `Putaway_Volume`
- Sorting UPH → `Sorting_UPH`
- Problem Solve Volume → `Problem_Solve`

---

## Outbound_Metrics
**Fields**
- `Associate` (text)
- `Timestamp` (datetime)
- `Blended_UPH` (number)
- `Pick_Rate` (number)
- `Pack_Rate` (number)
- `Orders_Pending_Pick` (number)
- `Orders_Pending_Pack` (number)
- `Shipped_Volume` (number)
- `Forecast_Charge_Hours` (number)
- `CPT_Risk_Level` (single-select): Low, Medium, High
- `Order` (linked record)

**UI Metrics**
- Orders Pending Pick → `Orders_Pending_Pick`
- Orders Pending Pack → `Orders_Pending_Pack`
- Shipped Volume → `Shipped_Volume`
- Blended UPH → `Blended_UPH`
- CPT Risk Level → `CPT_Risk_Level`
- Forecast Charge Hours → `Forecast_Charge_Hours`

---

## Orders
**Primary ID:** `Order_ID`

**Fields**
- `Order_ID` (text)
- `Type` (single-select; options not finalized)
- `Status` (single-select): Pending, Picking, Packing, Complete, Shipped
- `Units` (number)
- `CPT` (datetime)
- `Associate` (linked record)
- `Timestamp` (datetime)
- `Outbound_Metrics` (linked record)
- `Facility_Metrics` (linked record)
- `Active_Flag` (number: 0/1)

**Derived**
- Late order = `Status != Shipped` AND `CPT < NOW()`

---

## QA_Metrics
**Fields**
- `Associate` (text)
- `Timestamp` (datetime)
- `Cycle_Counts_Completed` (number)
- `Inventory_Accuracy_Pct` (percent)
- `FIFO_Violations` (number)

**Derived QA Risk (no extra field required)**
- High if `FIFO_Violations > 0` OR `Inventory_Accuracy_Pct < 98`
- Medium if `Inventory_Accuracy_Pct < 99` OR `Cycle_Counts_Completed < 50`
- Low otherwise

---

## Associate_Performance
**Fields**
- `Timestamp` (datetime)
- `Employee_ID` (text)
- `Department` (single-select): Outbound, Inbound, Problem Solve, QA
- `Current_UPH` (number)
- `Quality_Score_Pct` (percent)
- `Dwell_Time_Mins` (number)
- `Total_Scans` (number)

**Derived Metrics**
- Active headcount: distinct `Employee_ID` at latest `Timestamp`
- Avg UPH: average `Current_UPH` at latest `Timestamp`
- High/Low performers: thresholds determined in UI

---

## Associate_Roster (Reference)
**Fields**
- `Employee_ID` (text)
- `Role` (single-select; options not finalized)
- `Baseline_UPH` (number)
- `Hourly_Rate` (currency)
- `Orders` (linked record)

---

## Facility_Metrics
**Fields**
- `Timestamp` (datetime)
- `Facility_UPH` (number)
- `Labor_Cost_Per_Unit` (currency)
- `CPT_Risk_Level` (single-select): Low, Medium, High
- `Safety_Incidents` (number)
- `Active_Orders_Count` (number)

---

# CPT Windows (3-hour buckets)
Used for line graphs and executive breakdowns.

- **Early Morning** — 03:00–06:00
- **Breakfast** — 06:00–09:00
- **Brunch** — 09:00–12:00
- **Lunch** — 12:00–15:00
- **Afternoon** — 15:00–18:00
- **Dinner** — 18:00–21:00
- **Late Night** — 21:00–24:00

**Bucket Rules**
- Outbound chart: bucket by `Orders.CPT`
- Inbound chart: bucket by `Inbound_Metrics.Timestamp`
- Associate chart: bucket by `Associate_Performance.Timestamp`
- Control Center: show CPT window breakdown from Orders

---

# Line Graphs (Blue)
- **Outbound**: `Orders_Pending_Pick` by CPT window
- **Inbound**: `Putaway_Volume` by CPT window
- **Associates**: avg `Current_UPH` by CPT window

Color: brand blue (e.g., #1D4ED8).

---

# Assumptions / Deferred Fields
- Inbound Dock Utilization field not present; excluded until added.
- Orders Type options not finalized; excluded from KPIs.
- Associate_Roster Role options not finalized; used only as reference data.

---

# Acceptance Criteria
- All UI metrics map to existing Airtable fields.
- Latest record logic is consistent across tables.
- Single-select values match exact text.
- Line graphs render with CPT windows and blue styling.
- No missing-field errors when API reads tables as defined above.
