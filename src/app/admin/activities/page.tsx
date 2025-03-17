import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import supabaseAdmin from '@/lib/supabaseAdmin';
import ActivitiesClient from '@/app/admin/activities/activities-client';

export default async function ActivitiesManagementPage() {
  // Check admin authentication
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get('admin_auth');
  if (!adminCookie || adminCookie.value !== 'true') {
    redirect('/admin/login');
  }

  // Fetch activities joined with workstreams for display
  const { data: activities, error: actError } = await supabaseAdmin
    .from('activities')
    .select('*, workstreams(name)');

  // Fetch workstreams for the dropdown in the add form
  const { data: workstreams, error: wsError } = await supabaseAdmin
    .from('workstreams')
    .select('*');

  return (
    <ActivitiesClient
      activities={activities || []}
      workstreams={workstreams || []}
      error={actError?.message || wsError?.message || ''}
    />
  );
}
