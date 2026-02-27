"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Card from "../../components/ui/Card";

export default function LoginPage() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Login failed");
      }
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <Card className="w-full max-w-md p-6">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Admin Access
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Enter your access code to continue.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Passcode
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div className="text-sm text-rose-500">{error}</div>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-lg bg-blue-600 text-white py-2 text-sm font-semibold hover:bg-blue-700 disabled:opacity-60"
          >
            {status === "loading" ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </Card>
    </div>
  );
}
