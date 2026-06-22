import { prisma } from "@/lib/db";
import { deleteProduct } from "@/lib/actions";
import Link from "next/link";
import Image from "next/image";
import styles from "../page.module.css";
import CsvImportModal from "@/components/admin/CsvImportModal";

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: pageStr } = await searchParams;
  const currentPage = pageStr ? parseInt(pageStr, 10) : 1;
  const pageSize = 20;

  const [products, totalProducts, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count(),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const totalPages = Math.ceil(totalProducts / pageSize);

  return (
    <div>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Products</h1>
          <p style={{ color: "#888", fontSize: "0.9rem", marginTop: "0.25rem" }}>{products.length} products</p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <CsvImportModal />
          <Link href="/dashboard/products/new" style={{ padding: "0.6rem 1.4rem", background: "var(--color-primary)", color: "white", borderRadius: "var(--border-radius-sm)", textDecoration: "none", fontWeight: "500", fontSize: "0.9rem" }}>
            + Add Product
          </Link>
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

      <div style={{ background: "white", borderRadius: "var(--border-radius-sm)", boxShadow: "var(--shadow-sm)", overflow: "hidden" }}>
        {products.length === 0 ? (
          <div style={{ padding: "4rem", textAlign: "center" }}>
            <p style={{ fontSize: "3rem" }}>🎂</p>
            <h3 style={{ margin: "1rem 0 0.5rem" }}>No Products Yet</h3>
            <p style={{ color: "#888", marginBottom: "1.5rem" }}>Add your first cake to the menu.</p>
            <Link href="/dashboard/products/new" style={{ padding: "0.75rem 1.5rem", background: "var(--color-primary)", color: "white", borderRadius: "var(--border-radius-sm)", textDecoration: "none" }}>Add First Product</Link>
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: "#f9f9f9", borderBottom: "2px solid #eee" }}>
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
                <tr key={product.id} style={{ borderBottom: "1px solid #f0f0f0" }}>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      {product.imageUrl ? (
                        <div style={{ position: "relative", width: "48px", height: "48px", borderRadius: "8px", overflow: "hidden" }}>
                          <Image src={product.imageUrl} alt={product.name} fill sizes="48px" style={{ objectFit: "cover" }} />
                        </div>
                      ) : (
                        <div style={{ width: "48px", height: "48px", background: "#f0faf9", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>🎂</div>
                      )}
                      <div>
                        <p style={{ fontWeight: "600" }}>{product.name}</p>
                        <p style={{ fontSize: "0.75rem", color: "#888", marginTop: "0.1rem" }}>{product.description.replace(/<[^>]*>?/gm, '').slice(0, 50)}...</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span style={{ background: "#f0faf9", color: "var(--color-primary)", padding: "0.2rem 0.6rem", borderRadius: "12px", fontSize: "0.8rem", fontWeight: "500" }}>
                      {product.category.name}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", fontWeight: "700" }}>£{product.price.toFixed(2)}</td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span style={{ fontSize: "1.2rem" }}>{product.isFeatured ? "⭐" : "—"}</span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span style={{ background: product.isVisible ? "#e6f7f5" : "#f5f5f5", color: product.isVisible ? "var(--color-primary)" : "#888", padding: "0.2rem 0.6rem", borderRadius: "12px", fontSize: "0.8rem" }}>
                      {product.isVisible ? "Visible" : "Hidden"}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem", textAlign: "right" }}>
                    <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
                      <Link href={`/dashboard/products/${product.id}/edit`} style={{ padding: "0.35rem 0.9rem", background: "#f0f0f0", borderRadius: "6px", fontSize: "0.85rem", textDecoration: "none", color: "#333" }}>Edit</Link>
                      <form action={async () => { "use server"; await deleteProduct(product.id); }}>
                        <button type="submit" style={{ padding: "0.35rem 0.9rem", background: "#fff0f0", color: "#d32f2f", borderRadius: "6px", fontSize: "0.85rem", cursor: "pointer" }}>Delete</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem", borderTop: "1px solid #eee", background: "#fafafa" }}>
            <div style={{ fontSize: "0.85rem", color: "#666" }}>
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalProducts)} of {totalProducts} products
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {currentPage > 1 && (
                <Link href={`/dashboard/products?page=${currentPage - 1}`} style={{ padding: "0.4rem 0.8rem", border: "1px solid #ddd", borderRadius: "6px", textDecoration: "none", color: "#333", fontSize: "0.85rem", background: "#fff" }}>
                  Previous
                </Link>
              )}
              {currentPage < totalPages && (
                <Link href={`/dashboard/products?page=${currentPage + 1}`} style={{ padding: "0.4rem 0.8rem", border: "1px solid #ddd", borderRadius: "6px", textDecoration: "none", color: "#333", fontSize: "0.85rem", background: "#fff" }}>
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
