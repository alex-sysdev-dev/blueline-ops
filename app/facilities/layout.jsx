// app/facilities/layout.jsx
import React from 'react';
import Sidebar from '../../components/layout/Sidebar';

export default function FacilitiesLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Pin the sidebar to the left for this page too */}
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}