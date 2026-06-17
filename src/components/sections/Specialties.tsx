import Image from 'next/image';
import styles from './Specialties.module.css';
import { prisma } from '@/lib/db';

export default async function Specialties() {
  const products = await prisma.product.findMany({
    where: { isFeatured: true },
    take: 4,
  });
  return (
    <section className={styles.section}>
      <div className={styles.headingWrapper}>
        <svg className={styles.headingIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
        <h2 className={styles.title}>Our Specialties</h2>
      </div>

      <div className={styles.grid}>
        {products.length === 0 ? (
          <p className={styles.itemDesc} style={{ textAlign: "center", gridColumn: "1 / -1" }}>No featured products right now. Check back soon!</p>
        ) : (
          products.map((item) => (
            <div key={item.id} className={styles.item}>
              <div className={styles.imageWrapper}>
                <div className={styles.imageInner}>
                  <Image src={item.imageUrl || "/specialty-pink.png"} alt={item.name} fill className={styles.image} />
                </div>
              </div>
              <h3 className={styles.itemTitle}>{item.name}</h3>
              <p className={styles.itemDesc}>{item.description}</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
