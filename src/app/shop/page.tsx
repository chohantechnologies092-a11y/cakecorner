import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import styles from "./Shop.module.css";
import ProductCardActions from "@/components/shop/ProductCardActions";

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string; page?: string }> }) {
  const { category: categorySlug, page: pageStr } = await searchParams;
  const currentPage = pageStr ? parseInt(pageStr, 10) : 1;
  const pageSize = 12;

  const [products, totalProducts, categories, selectedCategory] = await Promise.all([
    prisma.product.findMany({
      where: { 
        isVisible: true,
        ...(categorySlug ? { category: { slug: categorySlug } } : {})
      },
      orderBy: { createdAt: "desc" },
      include: { category: true, sizes: true, flavors: true },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({
      where: { 
        isVisible: true,
        ...(categorySlug ? { category: { slug: categorySlug } } : {})
      }
    }),
    prisma.category.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
    }),
    categorySlug ? prisma.category.findUnique({ where: { slug: categorySlug } }) : null
  ]);

  const totalPages = Math.ceil(totalProducts / pageSize);

  return (
    <>
      
      {/* Premium Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          {selectedCategory ? selectedCategory.name : "Our Menu"}
        </h1>
        <p className={styles.pageSubtitle}>
          {selectedCategory?.description || "Handcrafted with love, baked to perfection using only the finest ingredients."}
        </p>
      </div>

      <main className={styles.container}>
        {/* Category Filters */}
        <div className={styles.filters}>
          <a href="/shop" className={`${styles.filterBtn} ${!categorySlug ? styles.filterBtnActive : ''}`}>
            All Treats
          </a>
          {categories.map((cat) => {
            const isActive = categorySlug === cat.slug;
            return (
              <a key={cat.id} href={`/shop?category=${cat.slug}`} className={`${styles.filterBtn} ${isActive ? styles.filterBtnActive : ''}`}>
                {cat.name}
              </a>
            );
          })}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>🎂</div>
            <h2 className={styles.emptyTitle}>Coming Soon!</h2>
            <p className={styles.emptyDesc}>Our menu is being prepared. Please check back soon for delicious new treats!</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.imageWrapper}>
                  {product.imageUrl ? (
                    <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className={styles.image} style={{ objectFit: "cover" }} />
                  ) : (
                    <div className={styles.placeholder}>🎂</div>
                  )}
                </div>
                <div className={styles.info}>
                  <span className={styles.categoryTag}>
                    {product.category.name}
                  </span>
                  <h3 className={styles.productTitle}>{product.name}</h3>
                  <p className={styles.productDesc}>
                    {product.description.replace(/<[^>]*>?/gm, '').slice(0, 80)}...
                  </p>
                  <div className={styles.priceRow}>
                    <span className={styles.price}>£{product.price.toFixed(2)}</span>
                    {product.isFeatured && <span className={styles.featuredTag}>⭐ Featured</span>}
                  </div>
                  <ProductCardActions product={product} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "3rem" }}>
            {currentPage > 1 && (
              <Link href={`/shop?${categorySlug ? `category=${categorySlug}&` : ''}page=${currentPage - 1}`} style={{ padding: "0.5rem 1rem", border: "1px solid #ddd", borderRadius: "6px", textDecoration: "none", color: "#333", fontWeight: "500", background: "#fff" }}>
                ← Previous
              </Link>
            )}
            <span style={{ display: "flex", alignItems: "center", fontWeight: "500", color: "#666" }}>
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages && (
              <Link href={`/shop?${categorySlug ? `category=${categorySlug}&` : ''}page=${currentPage + 1}`} style={{ padding: "0.5rem 1rem", border: "1px solid #ddd", borderRadius: "6px", textDecoration: "none", color: "#333", fontWeight: "500", background: "#fff" }}>
                Next →
              </Link>
            )}
          </div>
        )}
      </main>
    </>
  );
}
