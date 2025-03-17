import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabaseAdmin';
import { isAdmin } from '@/app/api/_helpers';

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const targetThresholdStr = formData.get('target_threshold');

    if (!name || typeof targetThresholdStr !== 'string') {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    const target_threshold = parseFloat(targetThresholdStr);
    if (isNaN(target_threshold)) {
      return NextResponse.json({ error: 'Invalid numeric value' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('workstreams')
      .insert([{ name, target_threshold }])
      .select();

    if (error) {
      return NextResponse.redirect(new URL('/admin/workstreams?error=1', request.url));
    }

    return NextResponse.redirect(new URL('/admin/workstreams?success=1', request.url));
  } catch {
    return NextResponse.redirect(new URL('/admin/workstreams?error=1', request.url));
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
