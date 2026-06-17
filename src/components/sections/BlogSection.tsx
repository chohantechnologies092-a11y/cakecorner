import Link from "next/link";
import { prisma } from "@/lib/db";
import styles from "./BlogSection.module.css";

export default async function BlogSection() {
  // Fetch up to 3 published blog posts
  let posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { createdAt: "desc" },
    take: 3,
  });

  // Fallback dummy posts for UI preview if DB is empty
  if (posts.length === 0) {
    posts = [
      {
        id: "1",
        title: "10 Reasons Why Chocolate Cake is the Best",
        slug: "chocolate-cake-best",
        excerpt: "Discover the secret behind why our double chocolate fudge cake is an all-time favorite.",
        coverImage: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&q=80",
        publishedAt: new Date(),
        createdAt: new Date(),
        content: "",
        isPublished: true,
        authorId: "dummy",
        categoryId: null,
        metaTitle: null,
        metaDescription: null,
        canonicalUrl: null,
        updatedAt: new Date()
      },
      {
        id: "2",
        title: "How to Keep Your Cakes Fresh for Longer",
        slug: "keep-cakes-fresh",
        excerpt: "Learn our top bakery secrets for storing cakes so they taste like they just came out of the oven.",
        coverImage: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=500&q=80",
        publishedAt: new Date(),
        createdAt: new Date(),
        content: "",
        isPublished: true,
        authorId: "dummy",
        categoryId: null,
        metaTitle: null,
        metaDescription: null,
        canonicalUrl: null,
        updatedAt: new Date()
      },
      {
        id: "3",
        title: "Behind the Scenes: Our Decorating Process",
        slug: "decorating-process",
        excerpt: "Take an exclusive look into how our expert bakers craft and decorate your dream cakes.",
        coverImage: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=500&q=80",
        publishedAt: new Date(),
        createdAt: new Date(),
        content: "",
        isPublished: true,
        authorId: "dummy",
        categoryId: null,
        metaTitle: null,
        metaDescription: null,
        canonicalUrl: null,
        updatedAt: new Date()
      }
    ];
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <span className={styles.subtitle}>Sweet Stories</span>
            <h2 className={styles.title}>From Our Blog</h2>
          </div>
          <Link href="/blog" className={styles.viewAll}>
            View More <span className={styles.arrow}>→</span>
          </Link>
        </div>

        <div className={styles.grid}>
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className={styles.card}>
              <div className={styles.imageWrapper}>
                {post.coverImage ? (
                  <img src={post.coverImage} alt={post.title} className={styles.image} />
                ) : (
                  <div className={styles.placeholder}>📝</div>
                )}
                <div className={styles.imageOverlay}></div>
                <span className={styles.dateBadge}>
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <div className={styles.content}>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <p className={styles.excerpt}>{post.excerpt || post.content.replace(/<[^>]*>?/gm, '').substring(0, 100)}...</p>
                <span className={styles.readMore}>Read More</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
