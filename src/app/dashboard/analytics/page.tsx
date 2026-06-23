import { prisma } from "@/lib/db";
import Link from "next/link";
import { DailyViewsChart } from "@/components/admin/AnalyticsCharts";

export default async function AnalyticsDashboard() {
  // 1. Fetch Traffic Analytics
  const dailyData = await prisma.dailyAnalytics.findMany({
    orderBy: { date: "asc" },
    take: 14, // Last 14 days
  });

  const chartData = dailyData.map(d => ({
    dateStr: d.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
    views: d.pageViews,
    visitors: d.visitors,
  }));

  const topPages = await prisma.pageAnalytics.findMany({
    orderBy: { views: "desc" },
    take: 5,
  });

  const topLocations = await prisma.locationAnalytics.findMany({
    orderBy: { views: "desc" },
    take: 5,
  });

  // Calculate totals
  const totalViews = dailyData.reduce((sum, d) => sum + d.pageViews, 0);

  // 2. Fetch SEO Analytics
  const [totalProducts, totalBlogs] = await Promise.all([
    prisma.product.count(),
    prisma.blogPost.count(),
  ]);

  const productsMissingSeo = await prisma.product.findMany({
    where: { OR: [{ metaTitle: null }, { metaTitle: "" }, { metaDescription: null }, { metaDescription: "" }] },
    select: { id: true, name: true, isVisible: true },
  });

  const blogsMissingSeo = await prisma.blogPost.findMany({
    where: { OR: [{ metaTitle: null }, { metaTitle: "" }, { metaDescription: null }, { metaDescription: "" }] },
    select: { id: true, title: true, isPublished: true },
  });

  const missingProductsCount = productsMissingSeo.length;
  const missingBlogsCount = blogsMissingSeo.length;

  const totalItems = totalProducts + totalBlogs;
  const missingItems = missingProductsCount + missingBlogsCount;
  const seoScore = totalItems > 0 ? Math.round(((totalItems - missingItems) / totalItems) * 100) : 100;

  return (
    <div style={{ maxWidth: "1200px" }}>
      <header style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", color: "#1e293b", marginBottom: "0.5rem" }}>Analytics & SEO Dashboard</h1>
        <p style={{ color: "#64748b" }}>Monitor your website traffic and search engine health.</p>
      </header>

      {/* Traffic Section */}
      <h2 style={{ fontSize: "1.2rem", color: "#334155", marginBottom: "1rem" }}>Site Traffic (Last 14 Days)</h2>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
        <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
          <h3 style={{ fontSize: "1rem", color: "#64748b", marginBottom: "0.5rem" }}>Total Page Views</h3>
          <p style={{ fontSize: "2rem", fontWeight: "700", color: "var(--color-primary)" }}>{totalViews}</p>
        </div>
        <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
          <h3 style={{ fontSize: "1rem", color: "#64748b", marginBottom: "0.5rem" }}>SEO Health Score</h3>
          <p style={{ fontSize: "2rem", fontWeight: "700", color: seoScore > 80 ? "#10b981" : seoScore > 50 ? "#f59e0b" : "#ef4444" }}>{seoScore}%</p>
        </div>
      </div>

      <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9", marginBottom: "2.5rem" }}>
        <h3 style={{ fontSize: "1.1rem", marginBottom: "1.5rem" }}>Traffic Chart</h3>
        {chartData.length > 0 ? (
          <DailyViewsChart data={chartData} />
        ) : (
          <p style={{ color: "#888", textAlign: "center", padding: "2rem" }}>Not enough data collected yet. Visit the site to see the chart.</p>
        )}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginBottom: "3rem" }}>
        {/* Top Pages */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Top Pages</h3>
            {topPages.length > 0 ? (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {topPages.map((page, i) => (
                  <li key={page.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: i < topPages.length - 1 ? "1px solid #eee" : "none" }}>
                    <span style={{ color: "#334155", fontWeight: "500", wordBreak: "break-all", fontSize: "0.9rem" }}>{page.path}</span>
                    <span style={{ background: "#f1f5f9", color: "#334155", padding: "0.2rem 0.6rem", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "600" }}>{page.views} Views</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: "#888", fontSize: "0.9rem" }}>No pages tracked yet.</p>
            )}
          </div>

          <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
            <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem" }}>Top Regions</h3>
            {topLocations.length > 0 ? (
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {topLocations.map((loc, i) => (
                  <li key={loc.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.75rem 0", borderBottom: i < topLocations.length - 1 ? "1px solid #eee" : "none" }}>
                    <span style={{ color: "#334155", fontWeight: "500", fontSize: "0.9rem" }}>{loc.city}, {loc.country}</span>
                    <span style={{ background: "#fef3c7", color: "#d97706", padding: "0.2rem 0.6rem", borderRadius: "20px", fontSize: "0.85rem", fontWeight: "600" }}>{loc.views} Views</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: "#888", fontSize: "0.9rem" }}>No location data yet.</p>
            )}
          </div>
        </div>

        {/* SEO Audit List */}
        <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", border: "1px solid #f1f5f9" }}>
          <h3 style={{ fontSize: "1.1rem", marginBottom: "1rem", display: "flex", justifyContent: "space-between" }}>
            <span>Needs SEO Optimization</span>
            <span style={{ color: "#ef4444", background: "#fef2f2", padding: "0.2rem 0.6rem", borderRadius: "20px", fontSize: "0.85rem" }}>{missingItems} Items</span>
          </h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div>
              <h4 style={{ fontSize: "0.95rem", color: "#64748b", marginBottom: "0.5rem" }}>Products ({missingProductsCount})</h4>
              {missingProductsCount > 0 ? (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {productsMissingSeo.slice(0, 5).map((p) => (
                    <li key={p.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0" }}>
                      <span style={{ fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "70%" }}>{p.name}</span>
                      <Link href={`/dashboard/products/${p.id}/edit`} style={{ fontSize: "0.85rem", color: "var(--color-primary)", textDecoration: "none" }}>Edit →</Link>
                    </li>
                  ))}
                  {missingProductsCount > 5 && <li style={{ fontSize: "0.85rem", color: "#888", marginTop: "0.5rem" }}>+ {missingProductsCount - 5} more...</li>}
                </ul>
              ) : (
                <p style={{ color: "#10b981", fontSize: "0.85rem" }}>All products optimized! 🎉</p>
              )}
            </div>

            <div>
              <h4 style={{ fontSize: "0.95rem", color: "#64748b", marginBottom: "0.5rem" }}>Blog Posts ({missingBlogsCount})</h4>
              {missingBlogsCount > 0 ? (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {blogsMissingSeo.slice(0, 5).map((b) => (
                    <li key={b.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.4rem 0" }}>
                      <span style={{ fontSize: "0.9rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "70%" }}>{b.title}</span>
                      <Link href={`/dashboard/blogs/${b.id}`} style={{ fontSize: "0.85rem", color: "var(--color-primary)", textDecoration: "none" }}>Edit →</Link>
                    </li>
                  ))}
                  {missingBlogsCount > 5 && <li style={{ fontSize: "0.85rem", color: "#888", marginTop: "0.5rem" }}>+ {missingBlogsCount - 5} more...</li>}
                </ul>
              ) : (
                <p style={{ color: "#10b981", fontSize: "0.85rem" }}>All blogs optimized! 🎉</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
