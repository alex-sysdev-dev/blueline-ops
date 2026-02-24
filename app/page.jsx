import React from 'react';
import Link from 'next/link';
import { Shield, Zap, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="h-screen w-full bg-white dark:bg-slate-950 overflow-hidden relative flex flex-col justify-center items-center">
      <div className="absolute top-[-5%] left-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <main className="relative z-10 w-full max-w-6xl px-6 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-card !rounded-full text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest mb-6 border-blue-500/20">
          <Shield size={12} /> Solution Architecture Demonstration
        </div>
        <h1 className="text-7xl md:text-9xl font-black leading-none mb-6 tracking-tighter">
          <span className="text-blue-600">Blue</span>
          <span className="text-slate-900 dark:text-white">LineOps</span>
        </h1>
        <p className="max-w-xl text-center text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-10">
          I architect <strong>Digital Twins</strong> that turn live data into automated intelligence.
        </p>
        <Link href="/dashboard" className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-base flex items-center gap-3 shadow-2xl shadow-blue-500/40 transition-all hover:scale-105 mb-12">
          Launch Platform Demo <ArrowRight className="group-hover:translate-x-2 transition-transform" />
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div className="glass-card p-6">
            <Zap className="text-blue-500 mb-2" size={24} />
            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">Architecture</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">Proof-of-concept Airtable telemetry syncing.</p>
          </div>
          {/* ... Add 2 more similar cards if space permits ... */}
        </div>
      </main>
    </div>
  );
}