import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    const featured = searchParams.get('featured');
    const page = parseInt(searchParams.get('page') || '1');

    const now = new Date();

    let where: any = {
      status: 'published',
      publishedAt: {
        lte: now, // Only published articles with publishedAt <= now
      },
    };

    // Filter by category slug
    if (category && category !== 'all') {
      where.category = {
        slug: category,
      };
    }

    if (featured === 'true') {
      where.featured = true;
    }

    const take = limit ? parseInt(limit) : 10;
    const skip = (page - 1) * take;

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: { category: true },
        orderBy: { publishedAt: 'desc' },
        take,
        skip,
      }),
      prisma.article.count({ where }),
    ]);

    // Format response to match frontend expectations
    const formattedArticles = articles.map((article) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      image: article.image,
      category: article.category.slug,
      author: article.author,
      publishedAt: article.publishedAt?.toLocaleDateString(),
      readTime: article.readTime,
      featured: article.featured,
      tags: article.tags ? JSON.parse(article.tags) : [],
    }));

    return NextResponse.json({
      success: true,
      data: formattedArticles,
      pagination: {
        total,
        page,
        limit: take,
        pages: Math.ceil(total / take),
      },
    });
  } catch (error) {
    console.error('Failed to fetch articles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      excerpt,
      content,
      category_id,
      author,
      image,
      tags,
      gallery,
      readTime,
      featured,
      status = 'draft',
      published_at,
      scheduled_for,
    } = body;

    if (!title || !excerpt || !category_id || !author) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, excerpt, category_id, author' },
        { status: 400 }
      );
    }

    // Verify category exists (source of truth)
    const category = await prisma.category.findUnique({
      where: { id: parseInt(category_id) },
    });

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Generate slug
    const slug = (title).toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]/g, '');

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        categoryId: parseInt(category_id),
        author,
        image,
        tags: tags && Array.isArray(tags) ? JSON.stringify(tags) : null,
        gallery: gallery && Array.isArray(gallery) ? JSON.stringify(gallery) : null,
        readTime: readTime || 5,
        featured: featured || false,
        status,
        publishedAt: status === 'published' ? published_at ? new Date(published_at) : new Date() : null,
        scheduledFor: status === 'scheduled' ? new Date(scheduled_for) : null,
      },
      include: { category: true },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: article.id,
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt,
          image: article.image,
          category: article.category.slug,
          author: article.author,
          publishedAt: article.publishedAt?.toLocaleDateString(),
          readTime: article.readTime,
          featured: article.featured,
          status: article.status,
          message: 'Article created successfully',
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Failed to create article:', error);

    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Article slug already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create article' },
      { status: 500 }
    );
  }
}
