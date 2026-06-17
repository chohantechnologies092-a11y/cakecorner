import { updateNavItem } from "@/lib/actions";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../../page.module.css";

export default async function EditNavItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await prisma.navMenuItem.findUnique({ where: { id } });
  if (!item) notFound();

  const updateWithId = updateNavItem.bind(null, id);

  return (
    <div>
      <header className={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/dashboard/nav-menu" style={{ color: "#888", textDecoration: "none" }}>← Back</Link>
          <h1 className={styles.title} style={{ margin: 0 }}>Edit Nav Link</h1>
        </div>
      </header>

      <div style={{ background: "white", borderRadius: "var(--border-radius-sm)", padding: "2rem", boxShadow: "var(--shadow-sm)", maxWidth: "600px" }}>
        <form action={updateWithId} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div style={{ display: "flex", gap: "1rem" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label htmlFor="label" style={{ fontWeight: "600", fontSize: "0.9rem" }}>Label *</label>
              <input type="text" id="label" name="label" required defaultValue={item.label}
                style={{ padding: "0.75rem", borderRadius: "var(--border-radius-sm)", border: "1px solid #ddd" }} />
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <label htmlFor="url" style={{ fontWeight: "600", fontSize: "0.9rem" }}>URL *</label>
              <input type="text" id="url" name="url" required defaultValue={item.url}
                style={{ padding: "0.75rem", borderRadius: "var(--border-radius-sm)", border: "1px solid #ddd" }} />
            </div>
          </div>

          <div style={{ display: "flex", gap: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input type="checkbox" id="isVisible" name="isVisible" value="true" defaultChecked={item.isVisible} style={{ width: "1.1rem", height: "1.1rem" }} />
              <label htmlFor="isVisible" style={{ fontSize: "0.9rem" }}>Visible in navbar</label>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input type="checkbox" id="openNewTab" name="openNewTab" value="true" defaultChecked={item.openNewTab} style={{ width: "1.1rem", height: "1.1rem" }} />
              <label htmlFor="openNewTab" style={{ fontSize: "0.9rem" }}>Open in new tab</label>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", paddingTop: "1rem", borderTop: "1px solid #eee" }}>
            <Link href="/dashboard/nav-menu" style={{ padding: "0.7rem 1.5rem", border: "1px solid #ddd", borderRadius: "var(--border-radius-sm)", color: "#555", textDecoration: "none", fontSize: "0.9rem" }}>Cancel</Link>
            <button type="submit" style={{ padding: "0.7rem 1.8rem", background: "var(--color-primary)", color: "white", border: "none", borderRadius: "var(--border-radius-sm)", fontWeight: "600", cursor: "pointer", fontSize: "0.9rem" }}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
