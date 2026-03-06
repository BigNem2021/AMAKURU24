import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const correctEmail = process.env.ADMIN_EMAIL;
    const correctPassword = process.env.ADMIN_PASSWORD;

    if (!correctEmail || !correctPassword) {
      return NextResponse.json(
        { success: false, message: 'Admin credentials not configured' },
        { status: 500 }
      );
    }

    if (email === correctEmail && password === correctPassword) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
