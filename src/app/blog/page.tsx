import { prisma } from '@/lib/db';
import Link from 'next/link';
import type { Metadata } from 'next';

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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem' }}>
      <h1 style={{ textAlign: 'center', fontSize: '3rem', marginBottom: '3rem', fontFamily: 'var(--font-heading)' }}>Our Blog</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {posts.map((post: any) => (
          <article key={post.id} style={{ border: '1px solid #eaeaea', borderRadius: '12px', overflow: 'hidden', transition: 'transform 0.3s', display: 'flex', flexDirection: 'column' }}>
            {post.coverImage ? (
              <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '200px', backgroundColor: '#f4f4f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>No Image</div>
            )}
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
              <Link href={`/blog/${post.slug}`} style={{ color: '#2c2c2c', textDecoration: 'none' }}>
                {post.title}
              </Link>
            </h2>
            <p style={{ color: '#666', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              {post.metaDescription || post.excerpt || "Click to read more..."}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#999' }}>
                {post.publishedAt?.toLocaleDateString()}
              </span>
              <Link href={`/blog/${post.slug}`} style={{ color: '#4abeb3', fontWeight: 'bold', textDecoration: 'none' }}>
                Read More &rarr;
              </Link>
            </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
