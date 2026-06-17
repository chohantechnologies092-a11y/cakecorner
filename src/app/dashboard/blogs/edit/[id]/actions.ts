'use server';

import { prisma } from '@/lib/db';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';

export async function updateBlogPost(formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error('Unauthorized');
  }

  const id = formData.get('id') as string;
  const title = formData.get('title') as string;
  const slug = formData.get('slug') as string;
  const content = formData.get('content') as string;
  const metaTitle = formData.get('metaTitle') as string;
  const metaDescription = formData.get('metaDescription') as string;
  const coverImage = formData.get('coverImage') as string;

  await prisma.blogPost.update({
    where: { id },
    data: {
      title,
      slug,
      content,
      coverImage,
      metaTitle,
      metaDescription,
    }
  });

  redirect('/dashboard/blogs');
}
