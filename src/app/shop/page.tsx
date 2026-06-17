import { prisma } from "@/lib/db";
import Link from "next/link";
import styles from "./Shop.module.css";
import ProductCardActions from "@/components/shop/ProductCardActions";

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category: categorySlug } = await searchParams;

  const [products, categories, selectedCategory] = await Promise.all([
    prisma.product.findMany({
      where: { 
        isVisible: true,
        ...(categorySlug ? { category: { slug: categorySlug } } : {})
      },
      orderBy: { createdAt: "desc" },
      include: { category: true, sizes: true, flavors: true },
    }),
    prisma.category.findMany({
      where: { isVisible: true },
      orderBy: { sortOrder: "asc" },
    }),
    categorySlug ? prisma.category.findUnique({ where: { slug: categorySlug } }) : null
  ]);

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
                    <img src={product.imageUrl} alt={product.name} className={styles.image} />
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
      </main>
    </>
  );
}
