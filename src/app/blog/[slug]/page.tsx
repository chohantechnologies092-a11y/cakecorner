import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import 'react-quill-new/dist/quill.snow.css';
import styles from '../Blog.module.css';

type Props = {
  params: Promise<{ slug: string }>;
};

// Dynamically generate SEO metadata based on the blog post
export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const decodedSlug = decodeURIComponent(params.slug);
  const post = await prisma.blogPost.findUnique({
    where: { slug: decodedSlug },
  });

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: post.metaTitle || `${post.title} | Cake Shop Blog`,
    description: post.metaDescription || post.excerpt,
    alternates: {
      canonical: post.canonicalUrl || `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || undefined,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: ['Cake Shop'],
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogPostPage(props: Props) {
  const params = await props.params;
  const decodedSlug = decodeURIComponent(params.slug);
  const post = await prisma.blogPost.findUnique({
    where: { slug: decodedSlug },
    include: { author: true }
  });

  if (!post || !post.isPublished) {
    notFound();
  }

  // Generate structured data for AEO / SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.metaDescription,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    image: post.coverImage ? [post.coverImage] : undefined,
  };

  return (
    <article className={styles.postContainer}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className={styles.postHeader}>
        <Link href="/blog" className={styles.postBackLink}>
          &larr; Back to all posts
        </Link>

        <h1 className={styles.postTitle}>
          {post.title}
        </h1>
        <div className={styles.postMeta}>
          By {post.author.name} &bull; {post.publishedAt?.toLocaleDateString()}
        </div>
      </div>

      {post.coverImage && (
        <div className={styles.postImageContainer}>
          <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        </div>
      )}

      {/* Render the Rich Text HTML securely */}
      <div className={styles.postContent}>
        <div 
          className="ql-editor" // Apply Quill's default styling class
          style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#333', padding: 0 }}
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </div>
    </article>
  );
}
