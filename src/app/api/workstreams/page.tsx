// src/app/admin/workstreams/page.tsx
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import supabaseAdmin from '@/lib/supabaseAdmin';
import Link from 'next/link';

export default async function WorkstreamsManagementPage() {
  // Get cookies and check admin authentication
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get('admin_auth');
  if (!adminCookie || adminCookie.value !== 'true') {
    redirect('/admin/login');
  }

  // Fetch all workstreams from Supabase using the service client
  const { data: workstreams, error } = await supabaseAdmin
    .from('workstreams')
    .select('*');

  if (error) {
    return <div>Error fetching workstreams: {error.message}</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Workstreams</h1>
      <Link href="/admin" className="text-white bg-blue-600 px-3 py-2 rounded inline-block">
        Back to Dashboard
      </Link>



      <div className="mt-6">
        {workstreams && workstreams.length > 0 ? (
          <ul className="list-disc ml-4">
            {workstreams.map((ws: any) => (
              <li key={ws.id}>
                {ws.name} (Target: {ws.target_threshold}%)
              </li>
            ))}
          </ul>
        ) : (
          <p>No workstreams found.</p>
        )}
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Add New Workstream</h2>
        {/* Form to add a new workstream */}
        <form
          method="POST"
          action="/api/workstreams/create"
          className="space-y-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Workstream Name"
            className="border p-2 w-full"
            required
          />
          <input
            type="number"
            name="target_threshold"
            placeholder="Target Threshold (e.g., 80)"
            className="border p-2 w-full"
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded"
          >
            Add Workstream
          </button>
        </form>
      </div>
    </div>
  );
}
