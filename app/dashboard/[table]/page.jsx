"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Zap, Target, Activity, BarChart3, TrendingUp } from 'lucide-react';

// --- VISUAL COMPONENT: SPARKLINE CHART ---
const Sparkline = ({ data }) => {
  const min = Math.min(...data) - 0.5;
  const max = Math.max(...data) + 0.5;
  const range = max - min;
  const points = data.map((val, i) => `${(i * 10)} ${40 - ((val - min) / range) * 40}`).join(' L ');

  return (
    <svg className="w-full h-10 overflow-visible" viewBox="0 0 90 40">
      <path
        d={`M ${points}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-blue-500 transition-all duration-1000"
      />
    </svg>
  );
};

export default function DeepDive() {
  const { table } = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [livePace, setLivePace] = useState(102.4);
  const [history, setHistory] = useState([101, 102, 101, 103, 102, 104, 103, 105, 104, 102]);

  useEffect(() => {
    setMounted(true); // Fixes the red error screen mismatch
    const interval = setInterval(() => {
      setLivePace(prev => {
        const next = +(prev + (Math.random() * 0.4 - 0.2)).toFixed(1);
        setHistory(h => [...h.slice(1), next]);
        return next;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return <div className="min-h-screen bg-white dark:bg-slate-950" />;

  const firstWord = table.split('_')[0];
  const restOfTitle = table.split('_').slice(1).join(' ');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12 relative overflow-hidden">
      <button onClick={() => router.push('/dashboard')} className="flex items-center gap-2 text-slate-500 hover:text-blue-500 transition-colors mb-8 font-bold uppercase text-sm">
        <ChevronLeft size={20} /> Back to Command Center
      </button>

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <h1 className="text-6xl font-black uppercase tracking-tighter">
            {/* BRANDING: Blue first word */}
            <span className="text-blue-600">{firstWord}</span>
            <span className="text-slate-900 dark:text-white ml-2">{restOfTitle}</span>
          </h1>
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 glass-card !rounded-full text-emerald-500 text-xs font-black uppercase tracking-widest border border-emerald-500/20 animate-pulse">
            <Zap size={14} /> Digital Twin Active
          </div>
        </div>
        <div className="glass-card px-6 py-4 flex items-center gap-4">
           <div className="text-right">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Live Efficiency</p>
              <p className="text-2xl font-black text-emerald-500">+4.2%</p>
           </div>
           <TrendingUp className="text-emerald-500" size={32} />
        </div>
      </header>

      <div className="glass-card p-12 min-h-[400px] flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Operations Digital Twin</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Real-time algorithmic forecasting demonstration.</p>
          </div>
          <BarChart3 className="text-blue-500 animate-bounce" size={40} />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="glass-card !bg-white/50 !rounded-[2rem] p-8">
            <Target className="text-purple-500 mb-4" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Target Pace</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">105.0</p>
          </div>

          {/* PACE TILE WITH SPARKLINE CHART */}
          <div className="glass-card !bg-white/50 !rounded-[2rem] p-8 border-blue-500/30">
            <Activity className="text-blue-500 mb-4" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Current Pace</p>
            <div className="flex items-end justify-between gap-4">
              <p className="text-4xl font-black text-blue-600 dark:text-blue-400">{livePace}</p>
              <div className="flex-1 max-w-[120px] mb-2 text-blue-500/50">
                <Sparkline data={history} />
              </div>
            </div>
          </div>

          <div className="glass-card !bg-white/50 !rounded-[2rem] p-8">
            <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full mb-4 overflow-hidden">
              <div className="h-full bg-emerald-500 w-[94%]" />
            </div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Health Score</p>
            <p className="text-3xl font-black text-slate-900 dark:text-white">94%</p>
          </div>
        </div>
      </div>
    </div>
  );
}