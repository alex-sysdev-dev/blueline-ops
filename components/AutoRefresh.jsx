// components/AutoRefresh.jsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AutoRefresh({ intervalSeconds = 10 }) {
  const router = useRouter();

  useEffect(() => {
    // Convert seconds to milliseconds
    const ms = intervalSeconds * 1000;
    
    // Set up the polling loop
    const timer = setInterval(() => {
      router.refresh(); // This tells Next.js to quietly pull the latest Airtable data!
    }, ms);

    // Clean up the timer if the user leaves the page
    return () => clearInterval(timer);
  }, [router, intervalSeconds]);

  return null; 
}