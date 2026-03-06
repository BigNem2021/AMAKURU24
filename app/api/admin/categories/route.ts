import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.category.findMany({
      where: { status: 'active' },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, slug, description, parentId } = await request.json();

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug required' },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        parentId: parentId || null,
        status: 'active',
      },
    });

    return NextResponse.json(
      { success: true, data: category },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, error: 'Category name or slug already exists' },
        { status: 409 }
      );
    }

    console.error('Failed to create category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    );
  }
}
