import { prisma } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';
import styles from './Blog.module.css';

export const metadata: Metadata = {
  title: 'Blog | Cake Shop',
  description: 'Read the latest updates, recipes, and news from our Cake Shop.',
};

export default async function BlogListingPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' },
  });

  return (
    <>
      <div className={styles.headerImageContainer}>
        <Image 
          src="/hero-bg.png" 
          alt="Cake Corner Blog" 
          fill 
          style={{ objectFit: "cover" }}
          priority
        />
        <div className={styles.headerImageOverlay}></div>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Our Blog</h1>
          <p className={styles.heroText}>
            Read the latest updates, baking tips, recipes, and news from Cake Corner.
          </p>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.grid}>
            {posts.map((post: any) => (
              <article key={post.id} className={styles.card}>
                <div className={styles.cardImageWrapper}>
                  {post.coverImage ? (
                    <img src={post.coverImage} alt={post.title} className={styles.cardImage} />
                  ) : (
                    <div className={styles.noImage}>No Image</div>
                  )}
                </div>
                <div className={styles.cardContent}>
                  <h2 className={styles.cardTitle}>
                    <Link href={`/blog/${post.slug}`} className={styles.cardLink}>
                      {post.title}
                    </Link>
                  </h2>
                  <p className={styles.cardExcerpt}>
                    {post.metaDescription || post.excerpt || "Click to read more..."}
                  </p>
                  <div className={styles.cardFooter}>
                    <span className={styles.cardDate}>
                      {post.publishedAt?.toLocaleDateString()}
                    </span>
                    <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                      Read More &rarr;
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
