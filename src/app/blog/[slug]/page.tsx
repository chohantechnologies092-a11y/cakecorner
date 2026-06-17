import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next';
import Link from 'next/link';
import 'react-quill-new/dist/quill.snow.css'; // For basic styling of the HTML

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
    <article style={{ padding: '4rem 1.5rem' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Link href="/blog" style={{ color: '#4abeb3', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
          &larr; Back to all posts
        </Link>

        <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3.5rem', fontFamily: 'var(--font-heading)', color: '#2c2c2c', marginBottom: '1rem', lineHeight: '1.2' }}>
            {post.title}
          </h1>
          <div style={{ color: '#666', fontSize: '1rem' }}>
            By {post.author.name} &bull; {post.publishedAt?.toLocaleDateString()}
          </div>
        </header>
      </div>

      {post.coverImage && (
        <div style={{ maxWidth: '1200px', margin: '0 auto 3rem auto', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <img src={post.coverImage} alt={post.title} style={{ width: '100%', height: '600px', objectFit: 'cover', display: 'block' }} />
        </div>
      )}

      {/* Render the Rich Text HTML securely */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div 
          className="ql-editor" // Apply Quill's default styling class
          style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#333' }}
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </div>
    </article>
  );
}
