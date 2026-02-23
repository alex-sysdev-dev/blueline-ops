// app/page.jsx
import React from 'react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
      <div className="text-center max-w-2xl px-6">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            BLUELINE OPS
          </span>
        </h1>
        <p className="text-xl text-slate-300 mb-8">
          Modernizing Warehouse Operations. Real-time Metrics, Intelligent Forecasting, and Seamless Labor Management.
        </p>
        
        <Link 
          href="/dashboard"
          className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-full transition-all duration-200 shadow-lg shadow-blue-500/30"
        >
          Enter Command Center
        </Link>
      </div>
    </div>
  );
}