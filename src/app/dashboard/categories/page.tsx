import { prisma } from "@/lib/db";
import { deleteCategory, toggleCategoryVisibility } from "@/lib/actions";
import Link from "next/link";
import styles from "../page.module.css";
import DashboardSearch from "@/components/admin/DashboardSearch";
import DashboardSortFilter from "@/components/admin/DashboardSortFilter";
import SortableCategoryList from "@/components/admin/SortableCategoryList";

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
        <SortableCategoryList 
          initialCategories={categories as any} 
          isSortable={!sort || sort === ""} 
        />
      )}
    </div>
  );
}
