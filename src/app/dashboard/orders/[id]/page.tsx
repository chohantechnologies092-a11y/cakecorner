import { prisma } from "@/lib/db";
import { updateOrderStatus } from "@/lib/actions";
import Link from "next/link";
import { notFound } from "next/navigation";
import PrintButton from "@/components/admin/PrintButton";

const STATUS_OPTIONS = ["Pending", "Processing", "Completed", "Cancelled"];
const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  Pending:    { bg: "#fff8e1", color: "#f57f17" },
  Processing: { bg: "#e3f2fd", color: "#1565c0" },
  Completed:  { bg: "#e6f7f5", color: "#1b5e20" },
  Cancelled:  { bg: "#ffebee", color: "#b71c1c" },
};

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } } },
  });
  if (!order) notFound();

  const colors = STATUS_COLORS[order.status] || STATUS_COLORS.Pending;

  return (
    <div style={{ maxWidth: "900px" }}>
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .responsive-grid { grid-template-columns: 1fr !important; }
        }
        @media print {
          @page { size: auto; margin: 10mm; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white !important; font-size: 13px !important; line-height: 1.4 !important; }
          body * { visibility: hidden; }
          .printable-area, .printable-area * { visibility: visible; }
          .printable-area { 
            position: absolute; left: 0; top: 0; width: 100%; 
            background: white; padding: 0; color: #000;
          }
          .no-print { display: none !important; }
          
          /* Compact Header */
          .print-header { display: flex !important; flex-direction: column; align-items: center; justify-content: center; text-align: center; border-bottom: 2px solid #000; padding-bottom: 1rem; margin-bottom: 1rem; }
          .print-header img { height: 60px !important; width: 60px !important; }
          .print-header h1 { font-size: 1.8rem !important; }
          .print-header h2 { font-size: 1.2rem !important; }
          
          /* Compact Grid & Cards */
          .responsive-grid { gap: 1rem !important; margin-bottom: 1rem !important; }
          .printable-area .print-card { box-shadow: none !important; padding: 0 !important; margin-bottom: 1rem !important; border-radius: 0 !important; }
          
          /* Typography & Tables */
          .printable-area h2 { border-bottom: 1px solid #ccc; padding-bottom: 0.25rem; margin-bottom: 0.5rem; font-size: 1.1rem !important; }
          .printable-area table th { border-bottom: 2px solid #000 !important; color: #000 !important; padding: 0.5rem 0 !important; }
          .printable-area table td { border-bottom: 1px solid #ccc !important; padding: 0.5rem 0 !important; }
          
          /* Shrink images and hide download buttons */
          .printable-area td img { width: 30px !important; height: 30px !important; }
          .printable-area a { color: #000 !important; text-decoration: none !important; }
        }
      `}} />

      <div className="no-print" style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <Link href="/dashboard/orders" style={{ color: "#888", textDecoration: "none" }}>← Orders</Link>
        <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", margin: 0 }}>
          Order #{order.id.slice(-8).toUpperCase()}
        </h1>
        <span style={{ background: colors.bg, color: colors.color, padding: "0.25rem 0.75rem", borderRadius: "12px", fontSize: "0.85rem", fontWeight: "600" }}>
          {order.status}
        </span>
        <div style={{ marginLeft: "auto" }}>
          <PrintButton />
        </div>
      </div>

      <div className="printable-area">
        {/* Printable Header (Visible only when printing) */}
        <div style={{ display: "none" }} className="print-header">
          <div style={{ marginBottom: "1rem" }}>
            <img src="/logo.webp" alt="Cake Corner Logo" style={{ height: "70px", width: "70px", objectFit: "cover", borderRadius: "12px", marginBottom: "0.5rem", display: "inline-block" }} />
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "2rem", margin: 0, color: "var(--color-primary)" }}>Cake Corner</h1>
            <p style={{ margin: "0.2rem 0 0 0", color: "#444", fontSize: "0.9rem" }}>
              123 Sweet Street, Bakery Town | Phone: (123) 456-7890 | Email: hello@cakecorner.com
            </p>
          </div>
          <div style={{ width: "100%" }}>
            <h2 style={{ fontSize: "1.2rem", margin: 0, textTransform: "uppercase", letterSpacing: "2px", color: "#555" }}>Invoice</h2>
            <p style={{ margin: "0.3rem 0 0 0", fontWeight: "600" }}>
              Order #{order.id.slice(-8).toUpperCase()} &nbsp;|&nbsp; Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

      <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {/* Customer & Payment Info */}
        <div className="print-card" style={{ background: "white", borderRadius: "var(--border-radius-sm)", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
          <div className="responsive-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            
            {/* Bill To */}
            <div>
              <h2 style={{ fontSize: "1rem", marginBottom: "1rem", color: "#333" }}>Bill To</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.9rem" }}>
                <div><strong>{order.customer}</strong></div>
                <div><a href={`mailto:${order.email}`} style={{ color: "var(--color-primary)", textDecoration: "none" }}>{order.email}</a></div>
                {order.phone && <div>{order.phone}</div>}
                {order.address && <div style={{ color: "#555", marginTop: "0.2rem" }}>{order.address}</div>}
              </div>
            </div>

            {/* Delivery & Payment Info */}
            <div>
              <h2 style={{ fontSize: "1rem", marginBottom: "1rem", color: "#333" }}>Payment & Delivery</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.9rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#888" }}>Type:</span>
                  <strong>{order.address === "Store Pickup" ? "🏬 Store Pickup" : "🚚 Delivery"}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#888" }}>Method:</span>
                  <strong>{order.paymentMethod === "Card" ? "💳 Card (Stripe)" : "💵 Cash"}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#888" }}>Status:</span>
                  <strong style={{ color: order.paymentStatus === "Paid" ? "#15803d" : "#b45309" }}>{order.paymentStatus}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#888" }}>Date:</span>
                  <strong>{new Date(order.createdAt).toLocaleDateString()}</strong>
                </div>
              </div>
            </div>
            
          </div>
          
          {/* Notes Section spanning full width inside card if they exist */}
          {order.notes && (
            <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px dashed #ddd" }}>
              <h3 style={{ fontSize: "0.9rem", color: "#888", marginBottom: "0.4rem" }}>Order Notes / Instructions:</h3>
              <p style={{ fontSize: "0.9rem", color: "#333", margin: 0, fontStyle: "italic", lineHeight: 1.5 }}>
                "{order.notes}"
              </p>
            </div>
          )}
        </div>

        {/* Update Status */}
        <div className="no-print" style={{ background: "white", borderRadius: "var(--border-radius-sm)", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
          <h2 style={{ fontSize: "1rem", marginBottom: "1rem", color: "#333" }}>Update Status</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {STATUS_OPTIONS.map((status) => {
              const c = STATUS_COLORS[status];
              const updateWithParams = updateOrderStatus.bind(null, id, status);
              return (
                <form key={status} action={updateWithParams}>
                  <button
                    type="submit"
                    disabled={order.status === status}
                    style={{
                      width: "100%", padding: "0.6rem 1rem", borderRadius: "6px", fontSize: "0.9rem",
                      fontWeight: "600", cursor: order.status === status ? "default" : "pointer",
                      background: order.status === status ? c.bg : "#f5f5f5",
                      color: order.status === status ? c.color : "#555",
                      border: order.status === status ? `2px solid ${c.color}` : "2px solid transparent",
                      transition: "all 0.2s",
                    }}
                  >
                    {status === order.status ? `✓ ${status}` : `Set to ${status}`}
                  </button>
                </form>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="print-card" style={{ background: "white", borderRadius: "var(--border-radius-sm)", padding: "1.5rem", boxShadow: "var(--shadow-sm)" }}>
        <h2 style={{ fontSize: "1rem", marginBottom: "1rem", color: "#333" }}>Order Items</h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
              <th style={{ padding: "0.75rem 0", fontSize: "0.8rem", textTransform: "uppercase", color: "#888" }}>Product</th>
              <th style={{ padding: "0.75rem 0", fontSize: "0.8rem", textTransform: "uppercase", color: "#888", textAlign: "center" }}>Qty</th>
              <th style={{ padding: "0.75rem 0", fontSize: "0.8rem", textTransform: "uppercase", color: "#888", textAlign: "right" }}>Unit Price</th>
              <th style={{ padding: "0.75rem 0", fontSize: "0.8rem", textTransform: "uppercase", color: "#888", textAlign: "right" }}>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: "0.75rem 0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    {item.product.imageUrl && (
                      <img src={item.product.imageUrl} alt={item.product.name} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "6px" }} />
                    )}
                    <div>
                      <span style={{ fontWeight: "600" }}>{item.product.name}</span>
                      {(item.size || item.flavor || item.quantityOption) && (
                        <div style={{ fontSize: "0.8rem", color: "#666", marginTop: "0.25rem", display: "flex", gap: "0.5rem" }}>
                          {item.size && <span>Size: {item.size} </span>}
                          {item.flavor && <span>Flavor: {item.flavor}</span>}
                          {item.quantityOption && <span>Pack: {item.quantityOption}</span>}
                        </div>
                      )}
                      {item.photoUrl && (
                        <div style={{ marginTop: "0.75rem", display: "flex", gap: "1rem", alignItems: "flex-end" }}>
                          <div>
                            <span style={{ fontSize: "0.8rem", color: "#666", display: "block", marginBottom: "0.25rem" }}>Customer Photo:</span>
                            <img src={item.photoUrl} alt="Customer upload" style={{ width: "120px", height: "auto", borderRadius: "8px", border: "2px solid #e2e8f0", objectFit: "cover" }} />
                          </div>
                          <a 
                            href={item.photoUrl} 
                            download={`CakePhoto_${order.id}_${item.product.name.replace(/\s+/g, "_")}.png`}
                            className="no-print"
                            style={{ 
                              fontSize: "0.85rem", 
                              display: "inline-block", 
                              background: "var(--color-primary)", 
                              color: "white", 
                              padding: "0.5rem 1rem", 
                              borderRadius: "6px", 
                              textDecoration: "none", 
                              fontWeight: "600",
                              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                            }}
                          >
                            ⬇️ Download HD Print
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td style={{ padding: "0.75rem 0", textAlign: "center" }}>×{item.quantity}</td>
                <td style={{ padding: "0.75rem 0", textAlign: "right", color: "#666" }}>£{item.price.toFixed(2)}</td>
                <td style={{ padding: "0.75rem 0", textAlign: "right", fontWeight: "600" }}>£{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} style={{ padding: "1rem 0 0", textAlign: "right", fontWeight: "600", fontSize: "1rem" }}>Total:</td>
              <td style={{ padding: "1rem 0 0", textAlign: "right", fontWeight: "700", fontSize: "1.2rem", color: "var(--color-primary)" }}>£{order.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      {/* End printable area wrapper */}
      </div>
    </div>
  );
}
