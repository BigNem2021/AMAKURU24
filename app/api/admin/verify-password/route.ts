import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');

    // Validate inputs
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await prisma.adminUser.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
        name: true,
      },
    });

    if (user) {
      const passwordMatch = await verifyPassword(password, user.password);

      if (!passwordMatch) {
        return NextResponse.json(
          { success: false, message: 'Invalid email or password' },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          user: {
            id: user.id,
            email: user.email,
            role: user.role,
            name: user.name,
          },
        },
        { status: 200 }
      );
    }

    // Legacy env fallback to avoid lockout if DB user not seeded yet.
    const correctEmail = process.env.ADMIN_EMAIL || '';
    const correctPassword = process.env.ADMIN_PASSWORD || '';

    if (email === correctEmail && password === correctPassword) {
      return NextResponse.json(
        {
          success: true,
          user: {
            email: correctEmail,
            role: 'admin',
            name: 'Admin',
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, message: 'Invalid email or password' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Verify password error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
