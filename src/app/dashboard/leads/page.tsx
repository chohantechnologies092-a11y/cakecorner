import { prisma } from "@/lib/db";
import { deleteLead, markLeadAsRead } from "./actions";

export const metadata = {
  title: "Leads Dashboard | Cake Corner",
};

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "700", color: "#1e293b", margin: 0 }}>Customer Leads</h1>
      </div>

      {leads.length === 0 ? (
        <div style={{ background: "white", padding: "4rem 2rem", borderRadius: "16px", textAlign: "center", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "600", color: "#475569", marginBottom: "0.5rem" }}>No Leads Yet</h3>
          <p style={{ color: "#64748b" }}>When customers submit the contact form, their messages will appear here.</p>
        </div>
      ) : (
        <div className="table-responsive" style={{ background: "white", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid #e2e8f0", background: "#f8fafc", textAlign: "left" }}>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Status</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Date</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Customer</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Subject</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em" }}>Message</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.85rem", fontWeight: "600", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} style={{ borderBottom: "1px solid #e2e8f0", background: lead.isRead ? "white" : "#f0fdfa", transition: "background 0.2s" }}>
                  <td style={{ padding: "1.2rem 1.5rem" }}>
                    {lead.isRead ? (
                      <span style={{ display: "inline-block", padding: "0.25rem 0.75rem", borderRadius: "999px", background: "#f1f5f9", color: "#64748b", fontSize: "0.75rem", fontWeight: "600" }}>Read</span>
                    ) : (
                      <span style={{ display: "inline-block", padding: "0.25rem 0.75rem", borderRadius: "999px", background: "#ccfbf1", color: "#0f766e", fontSize: "0.75rem", fontWeight: "600" }}>New</span>
                    )}
                  </td>
                  <td style={{ padding: "1.2rem 1.5rem", fontSize: "0.9rem", color: "#64748b" }}>
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: "1.2rem 1.5rem" }}>
                    <div style={{ fontWeight: "600", color: "#1e293b", marginBottom: "0.2rem" }}>{lead.name}</div>
                    <a href={`mailto:${lead.email}`} style={{ fontSize: "0.85rem", color: "var(--color-primary)", textDecoration: "none" }}>{lead.email}</a>
                  </td>
                  <td style={{ padding: "1.2rem 1.5rem", fontWeight: "600", color: "#334155" }}>
                    {lead.subject}
                  </td>
                  <td style={{ padding: "1.2rem 1.5rem", color: "#475569", fontSize: "0.95rem", maxWidth: "300px" }}>
                    <div style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {lead.message}
                    </div>
                  </td>
                  <td style={{ padding: "1.2rem 1.5rem", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                      <form action={markLeadAsRead.bind(null, lead.id, !lead.isRead)}>
                        <button type="submit" style={{ padding: "0.4rem 1rem", background: "var(--color-background-glass, #f8fafc)", border: "1px solid var(--color-border-glass, #e2e8f0)", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer", color: "#334155" }}>
                          {lead.isRead ? "Mark Unread" : "Mark Read"}
                        </button>
                      </form>
                      <form action={deleteLead.bind(null, lead.id)}>
                        <button type="submit" style={{ padding: "0.4rem 1rem", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
