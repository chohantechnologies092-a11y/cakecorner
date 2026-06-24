import { prisma } from "@/lib/db";
import Link from "next/link";
import Image from "next/image";
import styles from "./Shop.module.css";
import ProductCardActions from "@/components/shop/ProductCardActions";
import CategorySidebar from "@/components/shop/CategorySidebar";
import { stripHtml } from "@/lib/utils";

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string; page?: string; search?: string }> }) {
  const { category: categorySlug, page: pageStr, search: searchQuery } = await searchParams;
  const currentPage = pageStr ? parseInt(pageStr, 10) : 1;
  const pageSize = 12;

  const baseWhere = {
    isVisible: true,
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
    ...(searchQuery ? {
      OR: [
        { name: { contains: searchQuery, mode: "insensitive" } },
        { description: { contains: searchQuery, mode: "insensitive" } }
      ]
    } : {})
  };

  const [products, totalProducts, categories, selectedCategory] = await Promise.all([
    prisma.product.findMany({
      where: baseWhere as any,
      orderBy: { createdAt: "desc" },
      include: { category: true, sizes: true, flavors: true },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    }),
    prisma.product.count({
      where: baseWhere as any
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
        <div className={styles.headerBg}>
          <Image 
            src="https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=2000&auto=format&fit=crop" 
            alt="Our Bakery Menu" 
            fill 
            style={{ objectFit: 'cover' }} 
            unoptimized 
            priority
          />
          <div className={styles.headerOverlay}></div>
        </div>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>
            {searchQuery ? `Search Results for "${searchQuery}"` : selectedCategory ? selectedCategory.name : "Our Menu"}
          </h1>
          <p className={styles.pageSubtitle}>
            {selectedCategory?.description || "Handcrafted with love, baked to perfection using only the finest ingredients."}
          </p>
        </div>
      </div>

      <main className={styles.container}>
        <div className={styles.shopLayout}>
          
          {/* Sidebar Area */}
          <aside className={styles.sidebar}>
            {/* Search Widget */}
            <div className={styles.sidebarWidget}>
               <h3 className={styles.sidebarTitle}>Search</h3>
               <form action="/shop" method="GET" className={styles.searchForm}>
                 {categorySlug && <input type="hidden" name="category" value={categorySlug} />}
                 <div className={styles.searchInputWrapper}>
                   <input 
                     type="text" 
                     name="search" 
                     placeholder="Search treats..." 
                     defaultValue={searchQuery || ''}
                     className={styles.searchInput}
                   />
                   <button type="submit" className={styles.searchBtn}>
                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                   </button>
                 </div>
               </form>
            </div>

            {/* Categories Widget */}
            <CategorySidebar categories={categories} currentSlug={categorySlug} styles={styles} />
          </aside>

          {/* Main Products Area */}
          <div className={styles.mainContent}>
            {/* Products Grid */}
            {products.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>🔍</div>
                <h2 className={styles.emptyTitle}>No treats found!</h2>
                <p className={styles.emptyDesc}>We couldn't find any products matching your search. Try adjusting your filters.</p>
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
                        {stripHtml(product.description).slice(0, 80)}...
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
                  <Link href={`/shop?${categorySlug ? `category=${categorySlug}&` : ''}${searchQuery ? `search=${searchQuery}&` : ''}page=${currentPage - 1}`} style={{ padding: "0.5rem 1rem", border: "1px solid #ddd", borderRadius: "6px", textDecoration: "none", color: "#333", fontWeight: "500", background: "#fff" }}>
                    ← Previous
                  </Link>
                )}
                <span style={{ display: "flex", alignItems: "center", fontWeight: "500", color: "#666" }}>
                  Page {currentPage} of {totalPages}
                </span>
                {currentPage < totalPages && (
                  <Link href={`/shop?${categorySlug ? `category=${categorySlug}&` : ''}${searchQuery ? `search=${searchQuery}&` : ''}page=${currentPage + 1}`} style={{ padding: "0.5rem 1rem", border: "1px solid #ddd", borderRadius: "6px", textDecoration: "none", color: "#333", fontWeight: "500", background: "#fff" }}>
                    Next →
                  </Link>
                )}
              </div>
            )}
          </div>
          
        </div>
      </main>
    </>
  );
}
