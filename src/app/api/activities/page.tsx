// src/app/admin/activities/page.tsx

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import supabaseAdmin from '@/lib/supabaseAdmin';
import Link from 'next/link';

export default async function ActivitiesManagementPage() {
  // 1. Admin authentication check
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get('admin_auth');
  if (!adminCookie || adminCookie.value !== 'true') {
    redirect('/admin/login');
  }

  // 2. Fetch activities (optionally joined with workstreams to display their name)
  const { data: activities, error: actError } = await supabaseAdmin
    .from('activities')
    .select('*, workstreams(name)'); // Requires a foreign key to 'workstreams' table

  // 3. Fetch workstreams to populate the dropdown in the add-activity form
  const { data: workstreams, error: wsError } = await supabaseAdmin
    .from('workstreams')
    .select('*');

  // 4. Handle any errors
  if (actError || wsError) {
    return (
      <div className="p-8">
        <p>Error fetching data: {actError?.message || wsError?.message}</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Manage Activities</h1>
      <Link href="/admin" className="text-blue-500 underline">
        Back to Dashboard
      </Link>

      {/* List existing activities */}
      <div className="mt-6">
        {activities && activities.length > 0 ? (
          <ul className="list-disc ml-4">
            {activities.map((act: any) => (
              <li key={act.id}>
                {/* If 'workstreams' relationship is present, show its name; else show the ID */}
                {act.name} (Workstream: {act.workstreams?.name ?? act.workstream_id}, 
                Weight: {act.weight}, Actual Points: {act.actual_points})
              </li>
            ))}
          </ul>
        ) : (
          <p>No activities found.</p>
        )}
      </div>

      {/* Form to add a new activity */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Add New Activity</h2>
        <form method="POST" action="/api/activities/create" className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Activity Name"
            className="border p-2 w-full"
            required
          />
          {/* Dropdown for selecting the associated workstream */}
          <select name="workstream_id" className="border p-2 w-full" required>
            <option value="">Select Workstream</option>
            {workstreams?.map((ws: any) => (
              <option key={ws.id} value={ws.id}>
                {ws.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            name="weight"
            placeholder="Weight (%)"
            className="border p-2 w-full"
            required
          />
          <input
            type="number"
            name="actual_points"
            placeholder="Actual Points"
            className="border p-2 w-full"
            required
          />
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            Add Activity
          </button>
        </form>
      </div>
    </div>
  );
}
