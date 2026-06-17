import BlogEditForm from './BlogEditForm';
import Link from 'next/link';
import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const post = await prisma.blogPost.findUnique({
    where: { id }
  });

  if (!post) {
    notFound();
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard/blogs" style={{ color: '#555', textDecoration: 'none' }}>&larr; Back to Blogs</Link>
        <h1 style={{ marginTop: '1rem' }}>Edit Blog Post</h1>
      </div>
      
      <BlogEditForm post={post} />
    </div>
  );
}
