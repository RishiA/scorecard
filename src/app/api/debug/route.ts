import { NextResponse } from 'next/server';

export async function GET() {
  // Just to confirm environment variables (log them, don't return them in production)
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  console.log('Service Key:', process.env.SUPABASE_SERVICE_KEY);
  console.log('Admin Email:', process.env.ADMIN_EMAIL);

  return NextResponse.json({ message: "Debug route - check server logs!" });
}
