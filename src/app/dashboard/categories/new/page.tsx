import { createCategory } from "@/lib/actions";
import Link from "next/link";
import styles from "../../page.module.css";
import ImageUploadInput from "@/components/admin/ImageUploadInput";

import { prisma } from "@/lib/db";
import CategoryProductSelector from "@/components/admin/CategoryProductSelector";

export default async function NewCategoryPage() {
  const products = await prisma.product.findMany({
    select: { id: true, name: true, imageUrl: true },
    orderBy: { name: "asc" }
  });
  return (
    <div>
      <header className={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/dashboard/categories" style={{ color: "#888", textDecoration: "none" }}>← Back</Link>
          <h1 className={styles.title} style={{ margin: 0 }}>Add New Category</h1>
        </div>
      </header>

      <div style={{ background: "white", borderRadius: "var(--border-radius-sm)", padding: "2rem", boxShadow: "var(--shadow-sm)", maxWidth: "600px" }}>
        <form action={createCategory} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label htmlFor="name" style={{ fontWeight: "600", fontSize: "0.9rem" }}>Category Name *</label>
            <input type="text" id="name" name="name" required
              style={{ padding: "0.75rem", borderRadius: "var(--border-radius-sm)", border: "1px solid #ddd", width: "100%" }}
              placeholder="e.g. Wedding Cakes"
            />

          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label htmlFor="description" style={{ fontWeight: "600", fontSize: "0.9rem" }}>Description (Optional)</label>
            <textarea id="description" name="description" rows={3}
              style={{ padding: "0.75rem", borderRadius: "var(--border-radius-sm)", border: "1px solid #ddd", width: "100%", resize: "vertical" }}
              placeholder="A brief overview of this category..."
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label htmlFor="imageUrl" style={{ fontWeight: "600", fontSize: "0.9rem" }}>Image URL</label>
            <ImageUploadInput name="imageUrl" />
            <p style={{ fontSize: "0.8rem", color: "#888", marginTop: "-0.25rem" }}>Shown in the mega menu on hover.</p>
          </div>

          <CategoryProductSelector products={products} />

          <div style={{ display: "flex", gap: "2rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input type="checkbox" name="isVisible" value="true" defaultChecked style={{ width: "1.1rem", height: "1.1rem" }} />
              <span style={{ fontSize: "0.9rem" }}>👁️ Visible in shop</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input type="checkbox" name="isFeaturedOnHome" value="true" style={{ width: "1.1rem", height: "1.1rem" }} />
              <span style={{ fontSize: "0.9rem" }}>🏠 Show on Home Page</span>
            </label>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", paddingTop: "1rem", borderTop: "1px solid #eee" }}>
            <Link href="/dashboard/categories" style={{ padding: "0.7rem 1.5rem", border: "1px solid #ddd", borderRadius: "var(--border-radius-sm)", color: "#555", textDecoration: "none", fontSize: "0.9rem" }}>
              Cancel
            </Link>
            <button type="submit" style={{ padding: "0.7rem 1.8rem", background: "var(--color-primary)", color: "white", border: "none", borderRadius: "var(--border-radius-sm)", fontWeight: "600", cursor: "pointer", fontSize: "0.9rem" }}>
              Create Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
