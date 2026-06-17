import { prisma } from '@/lib/db';
import Link from 'next/link';

export default async function AdminBlogsPage() {
  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Manage Blogs</h1>
        <Link 
          href="/dashboard/blogs/new" 
          style={{ padding: '0.5rem 1rem', background: '#4abeb3', color: 'white', textDecoration: 'none', borderRadius: '5px' }}
        >
          Create New Post
        </Link>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #eee', textAlign: 'left' }}>
            <th style={{ padding: '1rem' }}>Title</th>
            <th style={{ padding: '1rem' }}>Status</th>
            <th style={{ padding: '1rem' }}>Date</th>
            <th style={{ padding: '1rem' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ padding: '2rem', textAlign: 'center' }}>No blog posts found.</td>
            </tr>
          ) : (
            posts.map((post: any) => (
              <tr key={post.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '1rem' }}>{post.title}</td>
                <td style={{ padding: '1rem' }}>{post.isPublished ? 'Published' : 'Draft'}</td>
                <td style={{ padding: '1rem' }}>{post.createdAt.toLocaleDateString()}</td>
                <td style={{ padding: '1rem' }}>
                  <Link href={`/dashboard/blogs/edit/${post.id}`} style={{ color: 'blue', marginRight: '1rem' }}>Edit</Link>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
