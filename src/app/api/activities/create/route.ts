import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabaseAdmin';
import { isAdmin } from '@/app/api/_helpers';

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse form data
    const formData = await request.formData();
    const nameValue = formData.get('name');
    const workstream_id = formData.get('workstream_id');
    const weight = formData.get('weight');
    const actual_points = formData.get('actual_points');

    // Insert data, handle errors
    const { error: dbError } = await supabaseAdmin
      .from('activities')
      .insert([{ 
        workstream_id,
        name: nameValue,
        weight,
        possible_points: 100,
        actual_points
      }])
      .select();

    if (dbError) {
      // On DB error, redirect with ?error=1
      console.error('DB Insert Error:', dbError);
      return NextResponse.redirect(
        new URL('/admin/activities?error=1', request.url)
      );
    }

    // On success, redirect with ?success=1
    return NextResponse.redirect(
      new URL('/admin/activities?success=1', request.url)
    );
  } catch (err) {
    // On any other error, redirect with ?error=1
    return NextResponse.redirect(
      new URL('/admin/activities?error=1', request.url)
    );
  }
}

// Optional: If you want to block GET requests, you can do:
export async function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
