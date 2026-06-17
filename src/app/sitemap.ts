import { MetadataRoute } from 'next';
import { prisma } from '@/lib/db';

const baseUrl = 'http://localhost:3000'; // Replace with actual domain later

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Static routes
  const staticRoutes = ['', '/shop', '/blog'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.8,
  }));
  sitemapEntries.push(...staticRoutes);

  // Dynamic routes - Products
  const products = await prisma.product.findMany({
    where: { isVisible: true },
    select: { id: true, updatedAt: true },
  });

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  sitemapEntries.push(...productRoutes);

  // Dynamic routes - Categories
  const categories = await prisma.category.findMany({
    where: { isVisible: true },
    select: { slug: true, updatedAt: true },
  });

  const categoryRoutes = categories.map((cat) => ({
    url: `${baseUrl}/shop?category=${cat.slug}`,
    lastModified: cat.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));
  sitemapEntries.push(...categoryRoutes);

  // Dynamic routes - Blog Posts
  const blogs = await prisma.blogPost.findMany({
    where: { isPublished: true },
    select: { slug: true, updatedAt: true },
  });

  const blogRoutes = blogs.map((blog) => ({
    url: `${baseUrl}/blog/${blog.slug}`,
    lastModified: blog.updatedAt,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  sitemapEntries.push(...blogRoutes);

  return sitemapEntries;
}
