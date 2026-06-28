import { prisma } from "@/lib/db";
import { deleteProduct, toggleProductVisibility } from "@/lib/actions";
import Link from "next/link";
import Image from "next/image";
import styles from "../page.module.css";
import CsvImportModal from "@/components/admin/CsvImportModal";
import DashboardSearch from "@/components/admin/DashboardSearch";
import DashboardCategoryFilter from "@/components/admin/DashboardCategoryFilter";
import DashboardSortFilter from "@/components/admin/DashboardSortFilter";
import { stripHtml } from "@/lib/utils";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ page?: string, q?: string, category?: string, sort?: string }> }) {
  const { page: pageStr, q, category: categoryId, sort } = await searchParams;
  const currentPage = pageStr ? parseInt(pageStr, 10) : 1;
  const pageSize = 20;

  const whereClause: any = {};
  
  if (q) {
    whereClause.OR = [
      { name: { contains: q, mode: 'insensitive' as const } },
      { categories: { some: { name: { contains: q, mode: 'insensitive' as const } } } }
    ];
  }

  if (categoryId) {
    whereClause.categories = { some: { id: categoryId } };
  }

  let orderByClause: any = { createdAt: "desc" };
  if (sort === "name_asc") orderByClause = { name: "asc" };
  else if (sort === "name_desc") orderByClause = { name: "desc" };
  else if (sort === "price_asc") orderByClause = { price: "asc" };
  else if (sort === "price_desc") orderByClause = { price: "desc" };
  else if (sort === "recent") orderByClause = { updatedAt: "desc" };

  const [products, totalProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      orderBy: orderByClause,
      include: { categories: true },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({ where: whereClause }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(totalProducts / pageSize);

  const searchParamsString = new URLSearchParams({
    ...(q && { q }),
    ...(categoryId && { category: categoryId }),
    ...(sort && { sort }),
  }).toString();
  
  const createPageUrl = (page: number) => {
    return `/dashboard/products?page=${page}${searchParamsString ? `&${searchParamsString}` : ''}`;
  };

  return (
    <div>
      <header className={styles.header} style={{ flexWrap: "wrap", gap: "1rem" }}>
        <div style={{ flex: "1 1 200px" }}>
          <h1 className={styles.title}>Products</h1>
          <p style={{ color: "#888", fontSize: "0.9rem", marginTop: "0.25rem" }}>{totalProducts} products</p>
        </div>
        <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap", flex: "2 1 auto", justifyContent: "flex-end" }}>
          <div style={{ flex: "0 1 200px" }}>
            <DashboardCategoryFilter categories={categories} />
          </div>
          <div style={{ flex: "0 1 180px" }}>
            <DashboardSortFilter 
              options={[
                { label: "Newest First", value: "" },
                { label: "Recent Edits", value: "recent" },
                { label: "Name: A to Z", value: "name_asc" },
                { label: "Name: Z to A", value: "name_desc" },
                { label: "Price: Low to High", value: "price_asc" },
                { label: "Price: High to Low", value: "price_desc" }
              ]} 
            />
          </div>
          <div style={{ flex: "1 1 250px", maxWidth: "400px" }}>
            <DashboardSearch placeholder="Search products..." />
          </div>
          <div style={{ display: "flex", gap: "0.8rem" }}>
            <CsvImportModal />
            <Link href="/dashboard/products/new" style={{ padding: "0.6rem 1.2rem", background: "var(--color-primary)", color: "white", borderRadius: "8px", textDecoration: "none", fontWeight: "600", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "0.5rem", whiteSpace: "nowrap", boxShadow: "0 4px 12px rgba(0, 145, 147, 0.25)", transition: "transform 0.2s" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              Add Product
            </Link>
          </div>
        </div>
      </header>

      {categories.length === 0 && (
        <div style={{ background: "#fff8e1", border: "1px solid #f57f17", borderRadius: "var(--border-radius-sm)", padding: "1rem 1.5rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ fontSize: "1.5rem" }}>⚠️</span>
          <div>
            <p style={{ fontWeight: "600", color: "#e65100" }}>No categories found!</p>
            <p style={{ fontSize: "0.85rem", color: "#888" }}>You must create a category before adding products. <Link href="/dashboard/categories/new" style={{ color: "var(--color-primary)" }}>Create one now →</Link></p>
          </div>
        </div>
      )}

      <div style={{ background: "var(--color-background-glass, white)", borderRadius: "var(--border-radius-sm)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        {products.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center" }}>
            <p style={{ fontSize: "3rem" }}>🎂</p>
            <h3 style={{ margin: "1rem 0 0.5rem" }}>No Products Yet</h3>
            <p style={{ color: "var(--color-text-light, #888)", marginBottom: "1.5rem" }}>Add your first cake to the menu.</p>
            <Link href="/dashboard/products/new" style={{ padding: "0.75rem 1.5rem", background: "var(--color-primary)", color: "white", borderRadius: "var(--border-radius-sm)", textDecoration: "none" }}>Add First Product</Link>
          </div>
        ) : (
          <div className="table-responsive">
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "800px" }}>
              <thead>
                <tr style={{ background: "var(--color-background-alt, #f9f9f9)", borderBottom: "2px solid var(--color-border-glass, #eee)" }}>
                  <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", color: "#888" }}>Product</th>
                  <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", color: "#888" }}>Category</th>
                  <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", color: "#888" }}>Price</th>
                  <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", color: "#888" }}>Featured</th>
                  <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", color: "#888" }}>Visible</th>
                  <th style={{ padding: "1rem 1.5rem", fontSize: "0.8rem", textTransform: "uppercase", color: "#888", textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className={styles.tableRow} style={{ borderBottom: "1px solid var(--color-border-glass, #f0f0f0)" }}>
                    <td style={{ padding: "1.2rem 1.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        {product.imageUrl ? (
                          <div style={{ position: "relative", width: "56px", height: "56px", borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.08)", flexShrink: 0 }}>
                            <Image src={product.imageUrl} alt={product.name} fill sizes="56px" style={{ objectFit: "cover" }} />
                          </div>
                        ) : (
                          <div style={{ width: "56px", height: "56px", flexShrink: 0, background: "linear-gradient(135deg, #f0faf9, #e0f2f1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>🎂</div>
                        )}
                        <div>
                          <p style={{ fontWeight: "700", fontSize: "1.05rem", color: "var(--color-text-main, #1e293b)", marginBottom: "0.2rem" }}>{product.name}</p>
                          <p style={{ fontSize: "0.8rem", color: "var(--color-text-light, #64748b)" }}>{stripHtml(product.description).slice(0, 50)}...</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "1.2rem 1.5rem" }}>
                      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                        {product.categories.map((cat: any) => (
                          <span key={cat.id} style={{ background: "var(--color-background-alt, #f1f5f9)", color: "var(--color-text-main, #475569)", padding: "0.3rem 0.7rem", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "600", whiteSpace: "nowrap", border: "1px solid var(--color-border-glass, #e2e8f0)" }}>
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: "1.2rem 1.5rem", fontWeight: "700", color: "var(--color-text-main, #0f172a)", fontSize: "1.05rem" }}>£{product.price.toFixed(2)}</td>
                    <td style={{ padding: "1.2rem 1.5rem" }}>
                      {product.isFeatured ? (
                        <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", background: "#fffbeb", color: "#d97706", width: "28px", height: "28px", borderRadius: "50%", fontSize: "0.9rem", border: "1px solid #fde68a" }}>⭐</span>
                      ) : (
                        <span style={{ color: "#cbd5e1" }}>—</span>
                      )}
                    </td>
                    <td style={{ padding: "1.2rem 1.5rem" }}>
                      <form action={toggleProductVisibility.bind(null, product.id, !product.isVisible)} style={{ margin: 0 }}>
                        <button type="submit" style={{ background: "none", border: "none", cursor: "pointer", padding: 0, outline: "none", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <div style={{ width: "40px", height: "22px", background: product.isVisible ? "var(--color-primary)" : "var(--color-border, #cbd5e1)", borderRadius: "20px", position: "relative", transition: "all 0.3s ease", boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)" }}>
                            <div style={{ width: "18px", height: "18px", background: "white", borderRadius: "50%", position: "absolute", top: "2px", left: product.isVisible ? "20px" : "2px", transition: "all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}></div>
                          </div>
                          <span style={{ fontSize: "0.85rem", fontWeight: "600", color: product.isVisible ? "var(--color-primary)" : "var(--color-text-light, #64748b)" }}>
                            {product.isVisible ? "Active" : "Inactive"}
                          </span>
                        </button>
                      </form>
                    </td>
                    <td style={{ padding: "1.2rem 1.5rem", textAlign: "right" }}>
                      <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                        <Link href={`/shop/${product.slug}`} target="_blank" style={{ padding: "0.4rem 1rem", background: "var(--color-background-glass, #f0fdfa)", border: "1px solid var(--color-border-glass, #ccfbf1)", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "600", textDecoration: "none", color: "var(--color-primary, #0f766e)" }}>View</Link>
                        <Link href={`/dashboard/products/${product.id}/edit`} style={{ padding: "0.4rem 1rem", background: "var(--color-background-glass, #f8fafc)", border: "1px solid var(--color-border-glass, #e2e8f0)", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "600", textDecoration: "none", color: "var(--color-text-main, #334155)" }}>Edit</Link>
                        <form action={deleteProduct.bind(null, product.id)}>
                          <button type="submit" style={{ padding: "0.4rem 1rem", background: "rgba(239, 68, 68, 0.1)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#ef4444", borderRadius: "8px", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>Delete</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem", borderTop: "1px solid var(--color-border-glass, #eee)", background: "var(--color-background-glass, #fafafa)" }}>
            <div style={{ fontSize: "0.85rem", color: "var(--color-text-light, #666)" }}>
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalProducts)} of {totalProducts} products
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {currentPage > 1 && (
                <Link href={createPageUrl(currentPage - 1)} style={{ padding: "0.4rem 0.8rem", border: "1px solid var(--color-border-glass, #ddd)", borderRadius: "6px", textDecoration: "none", color: "var(--color-text-main, #333)", fontSize: "0.85rem", background: "var(--color-background-glass, #fff)" }}>
                  Previous
                </Link>
              )}
              {currentPage < totalPages && (
                <Link href={createPageUrl(currentPage + 1)} style={{ padding: "0.4rem 0.8rem", border: "1px solid var(--color-border-glass, #ddd)", borderRadius: "6px", textDecoration: "none", color: "var(--color-text-main, #333)", fontSize: "0.85rem", background: "var(--color-background-glass, #fff)" }}>
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
