import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface Advert {
  id: string;
  title: string;
  url: string;
  imageUrl: string;
  position: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdvertsData {
  adverts: Advert[];
}

const ADVERTS_FILE = path.join(process.cwd(), 'data', 'adverts.json');

async function readAdverts(): Promise<Advert[]> {
  try {
    const data = await fs.readFile(ADVERTS_FILE, 'utf-8');
    const parsed = JSON.parse(data) as AdvertsData;
    return parsed.adverts || [];
  } catch (error) {
    return [];
  }
}

async function writeAdverts(adverts: Advert[]): Promise<void> {
  const data: AdvertsData = { adverts };
  await fs.writeFile(ADVERTS_FILE, JSON.stringify(data, null, 2));
}

export async function GET(request: NextRequest) {
  try {
    const adverts = await readAdverts();
    return NextResponse.json({
      success: true,
      data: adverts,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch adverts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, url, imageUrl, position } = body;

    if (!title || !imageUrl || !position) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: title, image, and position' },
        { status: 400 }
      );
    }

    const adverts = await readAdverts();

    const newAdvert: Advert = {
      id: Date.now().toString(),
      title,
      url: url || '',
      imageUrl,
      position,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    adverts.push(newAdvert);
    await writeAdverts(adverts);

    return NextResponse.json({
      success: true,
      message: 'Advert created successfully',
      data: newAdvert,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create advert' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, url, imageUrl, position, isActive } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Advert ID is required' },
        { status: 400 }
      );
    }

    const adverts = await readAdverts();
    const advertIndex = adverts.findIndex((a) => a.id === id);
    if (advertIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Advert not found' },
        { status: 404 }
      );
    }

    const updatedAdvert: Advert = {
      ...adverts[advertIndex],
      title: title || adverts[advertIndex].title,
      url: url || adverts[advertIndex].url,
      imageUrl: imageUrl || adverts[advertIndex].imageUrl,
      position: position || adverts[advertIndex].position,
      isActive: isActive !== undefined ? isActive : adverts[advertIndex].isActive,
      updatedAt: new Date().toISOString(),
    };

    adverts[advertIndex] = updatedAdvert;
    await writeAdverts(adverts);

    return NextResponse.json({
      success: true,
      message: 'Advert updated successfully',
      data: updatedAdvert,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update advert' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Advert ID is required' },
        { status: 400 }
      );
    }

    const adverts = await readAdverts();
    const advertIndex = adverts.findIndex((a) => a.id === id);
    if (advertIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Advert not found' },
        { status: 404 }
      );
    }

    adverts.splice(advertIndex, 1);
    await writeAdverts(adverts);

    return NextResponse.json({
      success: true,
      message: 'Advert deleted successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete advert' },
      { status: 500 }
    );
  }
}
