'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AlertCircle, CheckCircle, Upload, X } from 'lucide-react';
import AdminHeader from '@/app/admin/components/AdminHeader';

interface ArticleForm {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  image: string;
  tags: string;
  featured: boolean;
}

interface ArticleMetadata {
  views: number;
  publishedAt: string;
}

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;
  
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState<ArticleForm>({
    title: '',
    excerpt: '',
    content: '',
    category: 'technology',
    author: '',
    image: '',
    tags: '',
    featured: false,
  });

  const [metadata, setMetadata] = useState<ArticleMetadata>({
    views: 0,
    publishedAt: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadedImage, setUploadedImage] = useState<{ name: string; url: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  const [categories, setCategories] = useState<Array<{ id: number; slug: string; name: string }>>([]);

  useEffect(() => {
    const isAdminAuth = localStorage.getItem('adminAuth');
    if (!isAdminAuth) {
      router.push('/admin/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesRes = await fetch('/api/admin/categories');
        const categoriesData = await categoriesRes.json();
        if (categoriesData.success) {
          setCategories(categoriesData.data);
        }

        // Fetch article
        const articleRes = await fetch(`/api/articles/${articleId}`);
        const articleData = await articleRes.json();
        
        if (articleData.success) {
          const article = articleData.data;
          setForm({
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            category: article.category,
            author: article.author,
            image: article.image,
            tags: Array.isArray(article.tags) ? article.tags.join(', ') : (article.tags || ''),
            featured: article.featured || false,
          });
          setMetadata({
            views: 0,
            publishedAt: article.publishedAt || new Date().toISOString(),
          });
          setUploadedImage(null);
        } else {
          setMessage({ type: 'error', text: 'Article not found' });
        }
      } catch (error) {
        console.error('Failed to fetch article:', error);
        setMessage({ type: 'error', text: 'Failed to load article' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router, articleId]);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please upload an image file' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image size must be less than 10MB' });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setUploadedImage({ name: file.name, url: data.url });
        setForm((prev) => ({ ...prev, image: data.url }));
        setMessage({ type: 'success', text: 'Image uploaded successfully!' });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to upload image' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload image' });
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const tagArray = form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag !== '');

      // Find category ID from slug
      const selectedCategory = categories.find((cat) => cat.slug === form.category);
      const categoryId = selectedCategory?.id;

      if (!categoryId) {
        setMessage({ type: 'error', text: 'Please select a valid category' });
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/articles/${articleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          excerpt: form.excerpt,
          content: form.content,
          categoryId: categoryId,
          author: form.author,
          image: form.image || 'https://images.unsplash.com/photo-1585776245865-b0d71db86b00?w=800&q=80',
          tags: tagArray,
          featured: form.featured,
          status: 'published',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Article updated successfully!' });
        setTimeout(() => {
          router.push('/admin/articles');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to update article' });
      }
    } catch (error) {
      console.error('Submit error:', error);
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <AdminHeader />
      <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-serif font-bold text-neutral-900 dark:text-white mb-2">
              Edit Article
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Update the article details
            </p>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                message.type === 'success'
                  ? 'bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              )}
              <p
                className={`${
                  message.type === 'success'
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-red-800 dark:text-red-200'
                }`}
              >
                {message.text}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 rounded-lg shadow-sm p-8">
            <div className="mb-6">
              <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                Article Title *
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter article headline"
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-amber-700 focus:border-transparent outline-none"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                Author Name *
              </label>
              <input
                type="text"
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Enter author name"
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-amber-700 focus:border-transparent outline-none"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                Excerpt / Summary *
              </label>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                placeholder="Brief summary of the article (appears in listings)"
                rows={3}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-amber-700 focus:border-transparent outline-none"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                Article Content *
              </label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Full article content"
                rows={10}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-amber-700 focus:border-transparent outline-none font-mono text-sm"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                Category *
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-amber-700 focus:border-transparent outline-none"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                Featured Image
              </label>

              {uploadedImage && (
                <div className="mb-4 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        {uploadedImage.name}
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300">Uploaded successfully</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedImage(null);
                    }}
                    className="p-1 hover:bg-green-100 dark:hover:bg-green-900 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg hover:border-amber-500 dark:hover:border-amber-500 transition-colors cursor-pointer bg-neutral-50 dark:bg-neutral-800/50">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-neutral-400 dark:text-neutral-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Click to upload
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-900 dark:text-white mb-2">
                    Or paste image URL
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://images.unsplash.com/photo-xxx?w=800"
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-amber-700 focus:border-transparent outline-none"
                  />
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Unsplash URLs: https://images.unsplash.com/photo-xxx?w=800
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="e.g., Rwanda, Technology, Innovation"
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-amber-700 focus:border-transparent outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                  Total Views
                </label>
                <div className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white">
                  {metadata.views}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-900 dark:text-white mb-2">
                  Published Date
                </label>
                <div className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white text-sm">
                  {metadata.publishedAt ? new Date(metadata.publishedAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'Not published'}
                </div>
              </div>
            </div>

            <div className="mb-8 flex items-center gap-3">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700"
              />
              <label htmlFor="featured" className="text-sm font-medium text-neutral-900 dark:text-white">
                Feature this article on homepage
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-amber-700 hover:bg-amber-800 disabled:bg-amber-700/50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              {loading ? 'Updating...' : 'Update Article'}
            </button>
          </form>
        </div>
      </main>
    </>
  );
}
