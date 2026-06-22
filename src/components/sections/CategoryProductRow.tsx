import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import AutoSlider from "@/components/ui/AutoSlider";
import styles from "./CategoryProductRow.module.css";

interface CategoryProductRowProps {
  title: string;
  categorySlug: string;
  isAlternate?: boolean;
}

export default async function CategoryProductRow({ title, categorySlug, isAlternate = false }: CategoryProductRowProps) {
  const category = await prisma.category.findUnique({
    where: { slug: categorySlug },
    include: {
      products: {
        where: { isVisible: true },
        take: 12,
      },
    },
  });

  if (!category || category.products.length === 0) {
    return null; // Don't render the row if no products
  }

  return (
    <section className={`${styles.section} ${isAlternate ? styles.alternateBg : ''}`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <h2 className={styles.title}>{title}</h2>
          </div>
          <Link href={`/shop?category=${categorySlug}`} className={styles.viewAll}>
            See Full Menu <span className={styles.arrow}>→</span>
          </Link>
        </div>

        <AutoSlider className={styles.grid} speed={3000}>
          {category.products.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`} className={styles.productCard}>
              <div className={styles.imageWrapper}>
                {product.imageUrl ? (
                  <Image src={product.imageUrl} alt={product.name} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className={styles.image} style={{ objectFit: "cover" }} />
                ) : (
                  <div className={styles.placeholder}>🎂</div>
                )}
                <div className={styles.hoverOverlay}>
                  <span className={styles.quickViewBtn}>Quick View</span>
                </div>
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productTitle}>{product.name}</h3>
                <div className={styles.priceRow}>
                  <p className={styles.productPrice}>£{product.price.toFixed(2)}</p>
                  <button className={styles.addToCartBtn}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </AutoSlider>
      </div>
    </section>
  );
}
