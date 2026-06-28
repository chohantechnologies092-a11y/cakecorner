import { prisma } from "@/lib/db";
import { deleteCategory } from "@/lib/actions";
import Link from "next/link";
import styles from "../page.module.css";
import DashboardSearch from "@/components/admin/DashboardSearch";
import DashboardSortFilter from "@/components/admin/DashboardSortFilter";

export default async function CategoriesPage({ searchParams }: { searchParams: Promise<{ q?: string, sort?: string }> }) {
  const { q, sort } = await searchParams;

  const whereClause = q ? {
    OR: [
      { name: { contains: q, mode: 'insensitive' as const } },
      { description: { contains: q, mode: 'insensitive' as const } }
    ]
  } : {};

  let orderByClause: any = { sortOrder: "asc" };
  if (sort === "name_asc") orderByClause = { name: "asc" };
  else if (sort === "name_desc") orderByClause = { name: "desc" };
  else if (sort === "recent") orderByClause = { updatedAt: "desc" };

  const categories = await prisma.category.findMany({
    where: whereClause,
    orderBy: orderByClause,
    include: { _count: { select: { products: true } } },
  });

  return (
    <div>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Categories</h1>
          <p style={{ color: "#888", fontSize: "0.9rem", marginTop: "0.25rem" }}>
            {categories.length} categories
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
          <DashboardSortFilter 
            options={[
              { label: "Manual Order", value: "" },
              { label: "Recent Edits", value: "recent" },
              { label: "Name: A to Z", value: "name_asc" },
              { label: "Name: Z to A", value: "name_desc" }
            ]} 
          />
          <DashboardSearch placeholder="Search categories..." />
          <Link
            href="/dashboard/categories/new"
            style={{ padding: "0.6rem 1.4rem", background: "var(--color-primary)", color: "white", borderRadius: "var(--border-radius-sm)", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem", whiteSpace: "nowrap" }}
          >
            + Add Category
          </Link>
        </div>
      </header>

      {categories.length === 0 ? (
        <div style={{ background: "white", borderRadius: "var(--border-radius-sm)", padding: "4rem", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
          <p style={{ fontSize: "3rem", marginBottom: "1rem" }}>🏷️</p>
          <h3 style={{ marginBottom: "0.5rem" }}>No Categories Yet</h3>
          <p style={{ color: "#888", marginBottom: "1.5rem" }}>Create your first category to start organizing your products.</p>
          <Link href="/dashboard/categories/new" style={{ padding: "0.75rem 1.5rem", background: "var(--color-primary)", color: "white", borderRadius: "var(--border-radius-sm)", textDecoration: "none" }}>
            Create First Category
          </Link>
        </div>
      ) : (
        <div style={{ background: "white", borderRadius: "var(--border-radius-sm)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f9f9f9", borderBottom: "2px solid #eee" }}>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#888" }}>Category</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#888" }}>Slug</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "#888" }}>Products</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", color: "#888" }}>Status</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", color: "#888" }}>Home Featured</th>
                <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", color: "#888", textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      {cat.imageUrl ? (
                        <img src={cat.imageUrl} alt={cat.name} style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "8px" }} />
                      ) : (
                        <div style={{ width: "40px", height: "40px", background: "#f0faf9", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🎂</div>
                      )}
                      <span style={{ fontWeight: "600" }}>{cat.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", color: "#888", fontSize: "0.9rem" }}>/{cat.slug}</td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span style={{ background: "#f0faf9", color: "var(--color-primary)", padding: "0.2rem 0.6rem", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "600" }}>
                      {cat._count.products} products
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span style={{ background: cat.isVisible ? "#e6f7f5" : "#f5f5f5", color: cat.isVisible ? "var(--color-primary)" : "#888", padding: "0.2rem 0.7rem", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "600" }}>
                      {cat.isVisible ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    {cat.isFeaturedOnHome ? (
                      <span style={{ fontSize: "1.2rem" }}>⭐</span>
                    ) : (
                      <span style={{ color: "#ccc" }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                      <Link href={`/dashboard/categories/${cat.id}/edit`} style={{ padding: "0.35rem 0.9rem", background: "#f0f0f0", borderRadius: "6px", fontSize: "0.85rem", textDecoration: "none", color: "#333" }}>
                        Edit
                      </Link>
                      <form action={async () => { "use server"; await deleteCategory(cat.id); }}>
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
      )}
    </div>
  );
}
