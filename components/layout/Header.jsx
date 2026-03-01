// components/layout/Header.jsx
"use client";

import React from "react";
import Link from "next/link";
import ThemeToggle from "../ThemeToggle";

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between px-6 md:px-8 py-4 border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1220] shadow-sm transition-colors duration-300">
      <Link href="/" className="flex items-center">
        {/* Shows in Light Mode */}
        <img
          src="/brand/logo-dark.svg"
          alt="BlueLineOps"
          className="h-10 md:h-12 block dark:hidden"
        />
        {/* Shows in Dark Mode */}
        <img
          src="/brand/logo-light.svg"
          alt="BlueLineOps"
          className="h-10 md:h-12 hidden dark:block"
        />
      </Link>
      
      <ThemeToggle />
    </header>
  );
}