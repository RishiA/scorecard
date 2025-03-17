// src/app/api/logout/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  // Remove admin_auth cookie by setting it to empty with maxAge: 0
  const cookieStore = await cookies();
  cookieStore.set({
    name: 'admin_auth',
    value: '',
    httpOnly: true,
    path: '/',
    expires: new Date(0), // or maxAge: 0
  });

  return NextResponse.json({ success: true });
}