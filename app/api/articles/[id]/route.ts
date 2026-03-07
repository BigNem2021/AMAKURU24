import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  category: { slug: string };
  author: string;
  publishedAt?: Date;
  readTime?: number;
  featured?: boolean;
  tags?: string;
  updatedAt?: Date;
  [key: string]: any;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid article ID' },
        { status: 400 }
      );
    }

    const body = await request.json();

    // Find the article first
    const article = await prisma.article.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Parse tags if provided as array
    const tagsToStore = body.tags 
      ? typeof body.tags === 'string' 
        ? body.tags 
        : JSON.stringify(body.tags)
      : article.tags;

    // Update the article
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        title: body.title || article.title,
        excerpt: body.excerpt || article.excerpt,
        content: body.content || article.content,
        image: body.image || article.image,
        categoryId: body.categoryId || article.categoryId,
        author: body.author || article.author,
        featured: body.featured !== undefined ? body.featured : article.featured,
        readTime: body.readTime || article.readTime,
        tags: tagsToStore,
        status: body.status || article.status,
        publishedAt: body.publishedAt || article.publishedAt,
      },
      include: { category: true },
    });

    // Format response
    const formattedArticle = {
      id: updatedArticle.id,
      title: updatedArticle.title,
      slug: updatedArticle.slug,
      excerpt: updatedArticle.excerpt,
      content: updatedArticle.content,
      image: updatedArticle.image,
      category: updatedArticle.category.slug,
      author: updatedArticle.author,
      publishedAt: updatedArticle.publishedAt?.toISOString(),
      readTime: updatedArticle.readTime,
      featured: updatedArticle.featured,
      tags: updatedArticle.tags ? JSON.parse(updatedArticle.tags) : [],
      status: updatedArticle.status,
      updatedAt: updatedArticle.updatedAt?.toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Article updated successfully',
        data: formattedArticle,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to update article:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid article ID' },
        { status: 400 }
      );
    }

    // Check if article exists
    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Delete the article
    await prisma.article.delete({ where: { id } });

    return NextResponse.json(
      { success: true, message: 'Article deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to delete article:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, error: 'Invalid article ID' },
        { status: 400 }
      );
    }

    const article = await prisma.article.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Format response
    const formattedArticle = {
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      image: article.image,
      category: article.category.slug,
      author: article.author,
      publishedAt: article.publishedAt?.toISOString(),
      readTime: article.readTime,
      featured: article.featured,
      tags: article.tags ? JSON.parse(article.tags) : [],
      status: article.status,
    };

    return NextResponse.json(
      { success: true, data: formattedArticle },
      { status: 200 }
    );
  } catch (error) {
    console.error('Failed to fetch article:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
}
