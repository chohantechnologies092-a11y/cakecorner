import { prisma } from "@/lib/db";
import Link from "next/link";
import AutoSlider from "@/components/ui/AutoSlider";
import styles from "./FeaturedCategories.module.css";

export default async function FeaturedCategories() {
  const categories = await prisma.category.findMany({
    where: { isVisible: true, isFeaturedOnHome: true },
    orderBy: { sortOrder: "asc" },
  });

  if (categories.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.subtitle}>Discover</span>
          <h2 className={styles.title}>What Are You Looking For?</h2>
        </div>

        <AutoSlider className={styles.grid} speed={4000}>
          {categories.map((category) => (
            <Link key={category.id} href={`/shop?category=${category.slug}`} className={styles.itemCard}>
              <div className={styles.imageWrapper}>
                <div className={styles.imageInner}>
                  {category.imageUrl ? (
                    <img src={category.imageUrl} alt={category.name} className={styles.image} />
                  ) : (
                    <div className={styles.placeholder}>🎂</div>
                  )}
                </div>
              </div>
              <h3 className={styles.itemTitle}>{category.name}</h3>
            </Link>
          ))}
        </AutoSlider>
        
        <div className={styles.buttonWrapper}>
          <Link href="/shop" className={styles.viewAllBtn}>
            View all categories
          </Link>
        </div>
      </div>
    </section>
  );
}
