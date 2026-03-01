"use client";

import React from "react";
import Link from "next/link";
import ThemeToggle from "../ThemeToggle";

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between px-6 md:px-8 py-4 border-b border-white/10 bg-[#0b1220] shadow-sm transition-none">
      <Link href="/" className="flex items-center">
        <img
          src="/brand/logo-light.svg"
          alt="BlueLineOps"
          className="h-10 md:h-12"
        />
      </Link>
      
      <ThemeToggle />
    </header>
  );
}