import { updateCategory } from "@/lib/actions";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "../../../page.module.css";
import ImageUploadInput from "@/components/admin/ImageUploadInput";
import CategoryProductSelector from "@/components/admin/CategoryProductSelector";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await prisma.category.findUnique({ 
    where: { id },
    include: { products: { select: { id: true } } }
  });
  if (!category) notFound();

  const allProducts = await prisma.product.findMany({
    select: { id: true, name: true, imageUrl: true },
    orderBy: { name: "asc" }
  });

  const selectedProductIds = category.products.map(p => p.id);

  const updateWithId = updateCategory.bind(null, id);

  return (
    <div>
      <header className={styles.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <Link href="/dashboard/categories" style={{ color: "#888", textDecoration: "none" }}>← Back</Link>
          <h1 className={styles.title} style={{ margin: 0 }}>Edit Category</h1>
        </div>
      </header>

      <div style={{ background: "white", borderRadius: "var(--border-radius-sm)", padding: "2rem", boxShadow: "var(--shadow-sm)", maxWidth: "600px" }}>
        <form action={updateWithId} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label htmlFor="name" style={{ fontWeight: "600", fontSize: "0.9rem" }}>Category Name *</label>
            <input type="text" id="name" name="name" required defaultValue={category.name}
              style={{ padding: "0.75rem", borderRadius: "var(--border-radius-sm)", border: "1px solid #ddd", width: "100%" }}
            />

          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label htmlFor="description" style={{ fontWeight: "600", fontSize: "0.9rem" }}>Description (Optional)</label>
            <textarea id="description" name="description" rows={3} defaultValue={category.description || ""}
              style={{ padding: "0.75rem", borderRadius: "var(--border-radius-sm)", border: "1px solid #ddd", width: "100%", resize: "vertical" }}
              placeholder="A brief overview of this category..."
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <label htmlFor="imageUrl" style={{ fontWeight: "600", fontSize: "0.9rem" }}>Image URL</label>
            <ImageUploadInput name="imageUrl" defaultValue={category.imageUrl || ""} />
          </div>

          <CategoryProductSelector products={allProducts} initialSelectedIds={selectedProductIds} />

          <div style={{ display: "flex", gap: "2rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input type="checkbox" name="isVisible" value="true" defaultChecked={category.isVisible} style={{ width: "1.1rem", height: "1.1rem" }} />
              <span style={{ fontSize: "0.9rem" }}>👁️ Visible in shop</span>
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
              <input type="checkbox" name="isFeaturedOnHome" value="true" defaultChecked={category.isFeaturedOnHome} style={{ width: "1.1rem", height: "1.1rem" }} />
              <span style={{ fontSize: "0.9rem" }}>🏠 Show on Home Page</span>
            </label>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", paddingTop: "1rem", borderTop: "1px solid #eee" }}>
            <Link href="/dashboard/categories" style={{ padding: "0.7rem 1.5rem", border: "1px solid #ddd", borderRadius: "var(--border-radius-sm)", color: "#555", textDecoration: "none", fontSize: "0.9rem" }}>
              Cancel
            </Link>
            <button type="submit" style={{ padding: "0.7rem 1.8rem", background: "var(--color-primary)", color: "white", border: "none", borderRadius: "var(--border-radius-sm)", fontWeight: "600", cursor: "pointer", fontSize: "0.9rem" }}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
