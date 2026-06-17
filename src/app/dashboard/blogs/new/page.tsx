import BlogForm from './BlogForm';
import Link from 'next/link';

export default function NewBlogPage() {
  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/dashboard/blogs" style={{ color: '#555', textDecoration: 'none' }}>&larr; Back to Blogs</Link>
        <h1 style={{ marginTop: '1rem' }}>Create New Blog Post</h1>
      </div>
      
      <BlogForm />
    </div>
  );
}
