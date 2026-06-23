import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { path } = await req.json();
    if (!path) return NextResponse.json({ error: "Path missing" }, { status: 400 });

    const ipStr = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const ip = ipStr.split(",")[0].trim(); // Get first IP if multiple
    
    // Check Netlify/Vercel standard headers first
    let country = req.headers.get("x-vercel-ip-country") || req.headers.get("x-nf-country") || req.headers.get("x-country") || "Unknown";
    let city = req.headers.get("x-vercel-ip-city") || req.headers.get("x-nf-city") || req.headers.get("x-city") || "Unknown";

    // If local or unknown, try free geo IP API as fallback (only if real IP)
    if ((country === "Unknown" || city === "Unknown") && ip !== "unknown" && ip !== "::1" && ip !== "127.0.0.1") {
      try {
        const geoResponse = await fetch(`https://get.geojs.io/v1/ip/geo/${ip}.json`, { 
          signal: AbortSignal.timeout(2000) 
        });
        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          country = geoData.country || country;
          city = geoData.city || city;
        }
      } catch (err) {
        // Ignore timeout
      }
    }

    if (country === "Unknown") country = "Local / Unknown";
    if (city === "Unknown") city = "Localhost";

    // Get today's date at midnight UTC
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Run database updates concurrently
    await Promise.all([
      // Update Page Views
      prisma.pageAnalytics.upsert({
        where: { path },
        update: { views: { increment: 1 } },
        create: { path, views: 1 },
      }),

      // Update Daily Analytics
      prisma.dailyAnalytics.upsert({
        where: { date: today },
        update: { pageViews: { increment: 1 } },
        create: { date: today, pageViews: 1, visitors: 1 },
      }),

      // Update Location Analytics
      prisma.locationAnalytics.upsert({
        where: { country_city: { country, city } },
        update: { views: { increment: 1 } },
        create: { country, city, views: 1 },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Tracking Error:", error);
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}
