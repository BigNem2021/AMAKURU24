'use server';

import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://amakuru.news';
  
  try {
    // Fetch all articles for the sitemap
    const articlesResponse = await fetch(`${baseUrl}/api/articles?limit=1000`, {
      cache: 'revalidate',
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    
    const articlesData = await articlesResponse.json();
    const articles = articlesData.data || [];

    const sitemapUrls = [
      {
        url: baseUrl,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: '1.0',
      },
      {
        url: `${baseUrl}/breaking`,
        lastmod: new Date().toISOString(),
        changefreq: 'hourly',
        priority: '0.9',
      },
      {
        url: `${baseUrl}/search`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.7',
      },
      {
        url: `${baseUrl}/investigations`,
        lastmod: new Date().toISOString(),
        changefreq: 'weekly',
        priority: '0.8',
      },
      {
        url: `${baseUrl}/privacy`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: '0.5',
      },
      {
        url: `${baseUrl}/terms`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: '0.5',
      },
      {
        url: `${baseUrl}/ethics`,
        lastmod: new Date().toISOString(),
        changefreq: 'monthly',
        priority: '0.5',
      },
      // Add article URLs
      ...articles.map((article: any) => ({
        url: `${baseUrl}/article/${article.slug}`,
        lastmod: article.publishedAt ? new Date(article.publishedAt).toISOString() : new Date().toISOString(),
        changefreq: 'monthly' as const,
        priority: '0.7',
      })),
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0">
  ${sitemapUrls
    .map(
      (item) => `
  <url>
    <loc>${item.url}</loc>
    <lastmod>${item.lastmod}</lastmod>
    <changefreq>${item.changefreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>
`
    )
    .join('')}
</urlset>`;

    return new NextResponse(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return new NextResponse('Error generating sitemap', { status: 500 });
  }
}
