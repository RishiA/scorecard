// src/app/api/workstreams/create/route.ts

import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabaseAdmin';
import { isAdmin } from '@/app/api/_helpers';

export async function POST(request: Request) {
  // 1. Check admin auth
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 2. Parse the form data
    const formData = await request.formData();
    const name = formData.get('name');
    const targetThresholdStr = formData.get('target_threshold');

    // Basic validation
    if (!name || typeof targetThresholdStr !== 'string') {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    const target_threshold = parseFloat(targetThresholdStr);
    if (isNaN(target_threshold)) {
      return NextResponse.json({ error: 'Invalid numeric value' }, { status: 400 });
    }

    // 3. Insert into the DB
    const { error } = await supabaseAdmin
      .from('workstreams')
      .insert([{ name, target_threshold }])
      .select(); // to return inserted row(s)

    if (error) {
      // On DB error, redirect to admin with ?error=1
      return NextResponse.redirect(
        new URL('/admin/workstreams?error=1', request.url)
      );
    }

    // 4. On success, redirect with ?success=1
    return NextResponse.redirect(
      new URL('/admin/workstreams?success=1', request.url)
    );
  } catch (err) {
    console.error('Error creating workstream:', err);
    // On any other error, redirect with ?error=1
    return NextResponse.redirect(
      new URL('/admin/workstreams?error=1', request.url)
    );
  }
}

// Optional: block GET requests
export async function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
