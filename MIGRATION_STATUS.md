# Database Migration Tracker

## ✅ Completed (Supabase Live)
- [x] **YMS Yard**: Page logic updated, `yard_spots` table seeded.
- [x] **Inbound**: `inbound_metrics` table created, KPI cards live.
- [x] **Outbound**: `outbound_metrics` table created, KPI cards live.
- [x] **RLS Policies**: Public read enabled for primary tables.

## 🛠️ In Progress / Next Steps
- [ ] **QA Dashboard**: Needs `qa_metrics` table and code swap.
- [ ] **Control Center**: Needs heavy lifting to bridge all metrics.
- [ ] **Final Cleanup**: Delete `lib/airtable.js` once all pages are green.

## ⚠️ Known Issues
- `app/dashboard/pick-pack/page.jsx` still needs mapping for some Airtable imports.
- `YmsClient` dark mode class needs to be forced in the parent container.