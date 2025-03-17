import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  // Parse request body
  const { email, password } = await request.json()

  // Compare with admin .env credentials (example):
  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (email === adminEmail && password === adminPassword) {
    // Set the cookie - await the cookies() function
    const cookieStore = await cookies()
    cookieStore.set('admin_auth', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } else {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }
}