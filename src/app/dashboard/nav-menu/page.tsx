import { prisma } from "@/lib/db";
import { deleteNavItem, seedDefaultNavItems } from "@/lib/actions";
import Link from "next/link";
import styles from "../page.module.css";

export default async function NavMenuPage() {
  // Seed defaults if empty
  await seedDefaultNavItems();

  const items = await prisma.navMenuItem.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Nav Menu</h1>
          <p style={{ color: "#888", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            Control which links appear in the store navigation bar.
          </p>
        </div>
        <Link href="/dashboard/nav-menu/new" style={{ padding: "0.6rem 1.4rem", background: "var(--color-primary)", color: "white", borderRadius: "var(--border-radius-sm)", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>
          + Add Link
        </Link>
      </header>

      <div style={{ background: "white", borderRadius: "var(--border-radius-sm)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ background: "#f9f9f9", borderBottom: "2px solid #eee" }}>
              <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", color: "#888" }}>Order</th>
              <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", color: "#888" }}>Label</th>
              <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", color: "#888" }}>URL</th>
              <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", color: "#888" }}>Status</th>
              <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", color: "#888" }}>New Tab</th>
              <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", color: "#888", textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                <td style={{ padding: "1rem 1.5rem", color: "#888" }}>#{item.sortOrder + 1}</td>
                <td style={{ padding: "1rem 1.5rem", fontWeight: "600" }}>{item.label}</td>
                <td style={{ padding: "1rem 1.5rem", color: "var(--color-primary)", fontSize: "0.9rem" }}>{item.url}</td>
                <td style={{ padding: "1rem 1.5rem" }}>
                  <span style={{ background: item.isVisible ? "#e6f7f5" : "#f5f5f5", color: item.isVisible ? "var(--color-primary)" : "#888", padding: "0.2rem 0.7rem", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "600" }}>
                    {item.isVisible ? "Visible" : "Hidden"}
                  </span>
                </td>
                <td style={{ padding: "1rem 1.5rem", color: "#666", fontSize: "0.85rem" }}>
                  {item.openNewTab ? "✓ Yes" : "—"}
                </td>
                <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                  <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                    <Link href={`/dashboard/nav-menu/${item.id}/edit`} style={{ padding: "0.35rem 0.9rem", background: "#f0f0f0", borderRadius: "6px", fontSize: "0.85rem", textDecoration: "none", color: "#333" }}>
                      Edit
                    </Link>
                    <form action={async () => { "use server"; await deleteNavItem(item.id); }}>
                      <button type="submit" style={{ padding: "0.35rem 0.9rem", background: "#fff0f0", color: "#d32f2f", borderRadius: "6px", fontSize: "0.85rem", cursor: "pointer" }}>
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
    </div>
  );
}
