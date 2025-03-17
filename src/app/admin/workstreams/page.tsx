// src/app/admin/workstreams/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import supabaseAdmin from '@/lib/supabaseAdmin';
import WorkstreamsClient from './workstreams-client';

export default async function WorkstreamsManagementPage() {
  // 1. Check admin authentication on the server
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get('admin_auth');
  if (!adminCookie || adminCookie.value !== 'true') {
    redirect('/admin/login');
  }

  // 2. Fetch all workstreams from Supabase
  const { data: workstreams, error } = await supabaseAdmin
    .from('workstreams')
    .select('*');

  // 3. Pass data (and any error) to the client component
  return (
    <WorkstreamsClient workstreams={workstreams || []} error={error?.message} />
  );
}
