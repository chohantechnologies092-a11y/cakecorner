import { prisma } from "@/lib/db";
import Link from "next/link";
import styles from "./page.module.css";

export default async function DashboardOverview() {
  const [productsCount, categoriesCount, totalRevenueResult, statusCountsResult, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { status: "Completed" },
    }),
    prisma.order.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: true },
    }),
  ]);

  const totalRevenue = totalRevenueResult._sum.total || 0;

  const statusCounts: Record<string, number> = {
    Pending: 0,
    Processing: 0,
    Completed: 0,
    Cancelled: 0,
  };

  let totalOrdersCount = 0;
  statusCountsResult.forEach((item) => {
    statusCounts[item.status] = item._count.status;
    totalOrdersCount += item._count.status;
  });

  const pendingOrders = statusCounts["Pending"] || 0;
  const completedOrders = statusCounts["Completed"] || 0;

  const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
    Pending:    { bg: "#fff8e1", color: "#f57f17" },
    Processing: { bg: "#e3f2fd", color: "#1565c0" },
    Completed:  { bg: "#e6f7f5", color: "#1b5e20" },
    Cancelled:  { bg: "#ffebee", color: "#b71c1c" },
  };

  return (
    <div>
      <header className={styles.header}>
        <h1 className={styles.title}>Dashboard Overview</h1>
        <Link href="/dashboard/products/new" style={{ padding: "0.75rem 1.5rem", background: "var(--color-primary)", color: "white", borderRadius: "12px", textDecoration: "none", fontWeight: "600", fontSize: "0.95rem", boxShadow: "0 4px 14px rgba(var(--color-primary-rgb), 0.3)", transition: "all 0.2s" }}>
          + Add Product
        </Link>
      </header>

      {/* Stats Cards */}
      <div className={styles.grid} style={{ marginBottom: "2.5rem" }}>
        {[
          { label: "Total Revenue", value: `£${totalRevenue.toFixed(2)}`, emoji: "💰", color: "#10b981", bg: "#d1fae5" },
          { label: "Total Orders", value: totalOrdersCount, emoji: "📦", color: "#3b82f6", bg: "#dbeafe" },
          { label: "Products", value: productsCount, emoji: "🎂", color: "#8b5cf6", bg: "#ede9fe" },
          { label: "Categories", value: categoriesCount, emoji: "🏷️", color: "#f59e0b", bg: "#fef3c7" },
        ].map((stat) => (
          <div key={stat.label} className={styles.card} style={{ borderTop: `4px solid ${stat.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <h3 className={styles.cardTitle}>{stat.label}</h3>
                <p className={styles.cardValue} style={{ color: stat.color }}>{stat.value}</p>
              </div>
              <span style={{ fontSize: "1.8rem", background: stat.bg, width: "48px", height: "48px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", boxShadow: `0 4px 10px ${stat.bg}` }}>{stat.emoji}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.panelsGrid}>
        {/* Recent Orders */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h2 className={styles.panelTitle}>Recent Orders</h2>
            <Link href="/dashboard/orders" style={{ fontSize: "0.9rem", color: "var(--color-primary)", textDecoration: "none", fontWeight: "600", background: "#f8fafc", padding: "0.4rem 1rem", borderRadius: "20px" }}>View All →</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p style={{ color: "#94a3b8", textAlign: "center", padding: "3rem 0", fontSize: "0.95rem" }}>No orders yet.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  {["Customer", "Total", "Status", "Date"].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => {
                  const c = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;
                  return (
                    <tr key={order.id}>
                      <td>
                        <Link href={`/dashboard/orders/${order.id}`} style={{ fontWeight: "700", textDecoration: "none", color: "#1e293b", fontSize: "0.95rem" }}>{order.customer}</Link>
                        <p style={{ fontSize: "0.8rem", color: "#64748b", marginTop: "0.2rem" }}>{order.email}</p>
                      </td>
                      <td style={{ fontWeight: "700", color: "#1e293b", fontSize: "0.95rem" }}>£{order.total.toFixed(2)}</td>
                      <td>
                        <span style={{ background: c.bg, color: c.color, padding: "0.3rem 0.8rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "700", letterSpacing: "0.5px" }}>{order.status}</span>
                      </td>
                      <td style={{ color: "#64748b", fontSize: "0.85rem", fontWeight: "500" }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Order Status Breakdown */}
        <div className={styles.panel}>
          <h2 className={styles.panelTitle} style={{ marginBottom: "1.5rem" }}>Order Status</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {["Pending", "Processing", "Completed", "Cancelled"].map((status) => {
              const count = statusCounts[status] || 0;
              const pct = totalOrdersCount ? Math.round((count / totalOrdersCount) * 100) : 0;
              const c = STATUS_COLORS[status];
              return (
                <div key={status}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                    <span style={{ fontSize: "0.9rem", fontWeight: "600", color: "#334155" }}>{status}</span>
                    <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "500" }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ height: "8px", background: "#f1f5f9", borderRadius: "4px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: c.color, borderRadius: "4px", transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)" }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid #f1f5f9" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: "500" }}>Pending Action</span>
              <span style={{ fontWeight: "800", color: "#f59e0b", fontSize: "1.1rem" }}>{pendingOrders}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem" }}>
              <span style={{ fontSize: "0.9rem", color: "#64748b", fontWeight: "500" }}>Completed</span>
              <span style={{ fontWeight: "800", color: "#10b981", fontSize: "1.1rem" }}>{completedOrders}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
