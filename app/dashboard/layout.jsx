// app/dashboard/layout.jsx
import React from 'react';
import Sidebar from '../../components/layout/Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* The Sidebar is pinned to the left */}
      <Sidebar />
      
      {/* The main dashboard content fills the rest of the screen */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}