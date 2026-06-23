"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    
    // Ignore dashboard and admin routes
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/api') || pathname.startsWith('/login')) {
      return;
    }

    // Send a non-blocking request to log the page view
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      keepalive: true,
    }).catch(() => {
      // Silently ignore errors to avoid affecting user experience
    });
  }, [pathname]);

  return null;
}
