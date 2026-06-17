'use client';

import { useState, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill-new/dist/quill.snow.css';

import { updateBlogPost } from './actions';
import ImageUploadInput from '@/components/admin/ImageUploadInput';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function BlogEditForm({ post }: { post: any }) {
  const [content, setContent] = useState(post.content || '');
  const [coverImage, setCoverImage] = useState(post.coverImage || '');
  const quillRef = useRef<any>(null);

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        if (!res.ok) throw new Error('Upload failed');
        const data = await res.json();
        
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'image', data.url);
      } catch (err) {
        console.error(err);
        alert('Failed to upload image.');
      }
    };
  };

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), []);

  return (
    <form action={updateBlogPost} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
      <input type="hidden" name="id" value={post.id} />
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="title" style={{ fontWeight: 'bold' }}>Post Title</label>
        <input 
          id="title" 
          name="title" 
          type="text" 
          defaultValue={post.title}
          required 
          style={{ padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label htmlFor="slug" style={{ fontWeight: 'bold' }}>URL Slug</label>
        <input 
          id="slug" 
          name="slug" 
          type="text" 
          defaultValue={post.slug}
          required 
          placeholder="my-awesome-post"
          style={{ padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontWeight: 'bold' }}>Featured Image (Cover)</label>
        <ImageUploadInput 
          name="coverImage" 
          value={coverImage} 
          onChange={setCoverImage} 
          placeholder="https://..." 
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ fontWeight: 'bold' }}>Content (Rich Text)</label>
        <div style={{ background: 'white' }}>
          <ReactQuill 
            ref={quillRef}
            theme="snow" 
            value={content} 
            onChange={setContent} 
            modules={modules}
            style={{ height: '300px', marginBottom: '50px' }}
          />
        </div>
        <input type="hidden" name="content" value={content} />
      </div>

      <fieldset style={{ border: '1px solid #ccc', padding: '1.5rem', borderRadius: '8px' }}>
        <legend style={{ fontWeight: 'bold', padding: '0 0.5rem' }}>SEO & AEO Optimization</legend>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
          <label htmlFor="metaTitle">Meta Title (Max 60 chars)</label>
          <input 
            id="metaTitle" 
            name="metaTitle" 
            type="text" 
            defaultValue={post.metaTitle || ''}
            style={{ padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <label htmlFor="metaDescription">Meta Description (Max 160 chars)</label>
          <textarea 
            id="metaDescription" 
            name="metaDescription" 
            rows={3}
            defaultValue={post.metaDescription || ''}
            style={{ padding: '0.8rem', border: '1px solid #ccc', borderRadius: '4px' }}
          />
        </div>
      </fieldset>

      <button 
        type="submit" 
        style={{ padding: '1rem', background: '#4abeb3', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}
      >
        Update Blog Post
      </button>

    </form>
  );
}
