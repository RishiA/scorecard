import { NextResponse } from 'next/server';
import supabaseAdmin from '@/lib/supabaseAdmin';
import { isAdmin } from '@/app/api/_helpers';

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const formData = await request.formData();
    const workstream_idValue = formData.get('workstream_id');
    const nameValue = formData.get('name');
    const weightValue = formData.get('weight');
    const actualPointsValue = formData.get('actual_points');

    if (
      typeof workstream_idValue !== 'string' ||
      typeof nameValue !== 'string' ||
      typeof weightValue !== 'string' ||
      typeof actualPointsValue !== 'string'
    ) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    const workstream_id = parseInt(workstream_idValue);
    const weight = parseFloat(weightValue);
    const actual_points = parseFloat(actualPointsValue);

    if (isNaN(workstream_id) || isNaN(weight) || isNaN(actual_points)) {
      return NextResponse.json({ error: 'Invalid numeric values' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('activities')
      .insert([
        {
          workstream_id,
          name: nameValue,
          weight,
          possible_points: 100,
          actual_points,
        },
      ])
      .select();

    if (error) {
      return NextResponse.redirect(new URL('/admin/activities?error=1', request.url));
    }

    return NextResponse.redirect(new URL('/admin/activities?success=1', request.url));
  } catch {
    return NextResponse.redirect(new URL('/admin/activities?error=1', request.url));
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
