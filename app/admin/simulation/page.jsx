"use client";

import React, { useState } from "react";
import Card from "../../../components/ui/Card";

export default function SimulationPage() {
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [lastRun, setLastRun] = useState(null);

  const runSimulation = async () => {
    setStatus("running");
    setMessage("");
    try {
      const res = await fetch("/api/cron/simulate", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Simulation failed");
      }
      setStatus("success");
      setMessage(data.message || "Simulation completed.");
      setLastRun(new Date().toLocaleString());
    } catch (error) {
      setStatus("error");
      setMessage(error.message || "Simulation failed.");
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          <span className="text-blue-600 dark:text-blue-400">Sim</span>ulation
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Run the operational simulation to populate Airtable with demo data.
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Status
          </p>
          <p className={`text-2xl font-black mt-2 ${
            status === "success" ? "text-emerald-500" :
            status === "error" ? "text-rose-500" :
            status === "running" ? "text-blue-500" :
            "text-slate-900 dark:text-white"
          }`}>
            {status === "idle" ? "Ready" : status}
          </p>
          {message && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {message}
            </p>
          )}
        </Card>

        <Card className="p-4">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
            Last Run
          </p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">
            {lastRun || "—"}
          </p>
        </Card>
      </section>

      <Card className="p-6 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Run Simulation
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Generates facility, inbound, outbound, QA, associates, and station data.
          </p>
        </div>
        <button
          onClick={runSimulation}
          disabled={status === "running"}
          className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "running" ? "Running..." : "Run Now"}
        </button>
      </Card>
    </div>
  );
}
