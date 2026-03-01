// components/AutoRefresh.jsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AutoRefresh({ intervalSeconds = 10 }) {
  const router = useRouter();

  useEffect(() => {
    const ms = intervalSeconds * 1000;
    
    const timer = setInterval(() => {
      router.refresh(); // Quietly pulls the latest data
    }, ms);

    return () => clearInterval(timer);
  }, [router, intervalSeconds]);

  return null; 
}