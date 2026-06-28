import { prisma } from "@/lib/db";
import { updateOrderStatus } from "@/lib/actions";
import Link from "next/link";
import styles from "../page.module.css";
import DeleteOrderButton from "./DeleteOrderButton";

const STATUS_OPTIONS = ["Pending", "Processing", "Completed", "Cancelled"];
const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Pending:    { bg: "#fff8e1", color: "#f57f17" },
  Processing: { bg: "#e3f2fd", color: "#1565c0" },
  Completed:  { bg: "#e6f7f5", color: "#1b5e20" },
  Cancelled:  { bg: "#ffebee", color: "#b71c1c" },
};

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  const totalRevenue = orders
    .filter((o) => o.status === "Completed")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Orders</h1>
          <p style={{ color: "#888", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            {orders.length} orders · Revenue: £{totalRevenue.toFixed(2)}
          </p>
        </div>
      </header>

      {/* Status filter summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
        {STATUS_OPTIONS.map((status) => {
          const count = orders.filter((o) => o.status === status).length;
          const colors = STATUS_COLORS[status];
          return (
            <div key={status} style={{ background: "white", borderRadius: "var(--border-radius-sm)", padding: "1rem 1.25rem", boxShadow: "var(--shadow-sm)", borderLeft: `4px solid ${colors.color}` }}>
              <p style={{ fontSize: "0.8rem", color: "#888", textTransform: "uppercase", letterSpacing: "0.05em" }}>{status}</p>
              <p style={{ fontSize: "1.8rem", fontWeight: "700", color: colors.color, lineHeight: 1.2, marginTop: "0.25rem" }}>{count}</p>
            </div>
          );
        })}
      </div>

      <div style={{ background: "white", borderRadius: "var(--border-radius-sm)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        {orders.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center" }}>
            <p style={{ fontSize: "3rem" }}>📦</p>
            <h3 style={{ margin: "1rem 0 0.5rem" }}>No Orders Yet</h3>
            <p style={{ color: "#888" }}>Orders will appear here once customers checkout.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "800px" }}>
              <thead>
                <tr style={{ background: "#f9f9f9", borderBottom: "2px solid #eee" }}>
                  <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", color: "#888" }}>Customer</th>
                  <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", color: "#888" }}>Order Info</th>
                  <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", color: "#888" }}>Total</th>
                  <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", color: "#888" }}>Status</th>
                  <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", color: "#888" }}>Date</th>
                  <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", color: "#888", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const colors = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;
                  
                  const isPickup = order.address === "Store Pickup";
                  const isStripe = order.paymentMethod === "Card";

                  return (
                    <tr key={order.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <p style={{ fontWeight: "600" }}>{order.customer}</p>
                        <p style={{ fontSize: "0.8rem", color: "#888" }}>{order.email}</p>
                      </td>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <p style={{ fontSize: "0.85rem", color: "#444", marginBottom: "0.2rem" }}>
                          <span style={{ fontWeight: 600 }}>{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span>
                        </p>
                        <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.3rem", flexWrap: "wrap" }}>
                          <span style={{ background: isPickup ? "#fef3c7" : "#e0f2fe", color: isPickup ? "#b45309" : "#0369a1", padding: "0.15rem 0.5rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "600", whiteSpace: "nowrap" }}>
                            {isPickup ? "🏬 Pickup" : "🚚 Delivery"}
                          </span>
                          <span style={{ background: order.paymentStatus === "Paid" ? "#dcfce7" : "#f3f4f6", color: order.paymentStatus === "Paid" ? "#15803d" : "#4b5563", padding: "0.15rem 0.5rem", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "600", whiteSpace: "nowrap" }}>
                            {isStripe ? "💳 Card" : "💵 Cash"} • {order.paymentStatus}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "1rem 1.5rem", fontWeight: "700" }}>£{order.total.toFixed(2)}</td>
                      <td style={{ padding: "1rem 1.5rem" }}>
                        <span style={{ background: colors.bg, color: colors.color, padding: "0.25rem 0.75rem", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "600", whiteSpace: "nowrap" }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={{ padding: "1rem 1.5rem", color: "#888", fontSize: "0.85rem", whiteSpace: "nowrap" }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                        <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                          <Link href={`/dashboard/orders/${order.id}`} title="View Order" style={{ padding: "0.35rem 0.6rem", background: "#f0f0f0", borderRadius: "6px", fontSize: "0.85rem", textDecoration: "none", color: "#333", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                            👁️
                          </Link>
                          <Link href={`/dashboard/orders/${order.id}`} title="Edit Status" style={{ padding: "0.35rem 0.6rem", background: "#e0f2fe", borderRadius: "6px", fontSize: "0.85rem", textDecoration: "none", color: "#0369a1", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                            ✏️
                          </Link>
                          <DeleteOrderButton id={order.id} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
