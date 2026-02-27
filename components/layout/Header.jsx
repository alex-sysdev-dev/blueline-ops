// components/layout/Header.jsx
"use client";

import React from "react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between px-6 md:px-8 py-4 border-b border-slate-800 bg-slate-900 shadow-sm">
      <Link href="/" className="flex items-center">
        <img
          src="/brand/logo-dark.svg"
          alt="BlueLineOps"
          className="h-10 md:h-12"
        />
      </Link>
      <div className="w-10 md:w-12" />
    </header>
  );
}
